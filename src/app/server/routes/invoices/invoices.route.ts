import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { authRequired } from "../../decorators/auth.decorator";
import type { z } from "zod";
import {
  clients,
  invoice,
  invoiceDetails,
} from "~/server/db/schema";
import type { invoiceDocumentSchema, invoiceDocumentSchemaWithDetailsId } from "~/shared/schemas/invoice.schema";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { CacheTags } from "../../enums/cache";
import { cache } from '~/server/decorators/cache.decorator';
import { revalidateCache } from '~/server/utils/cache.utils';

export class InvoicesService {
  @authRequired()
  @cache(CacheTags.INVOICES)
  static async getInvoiceList(userId: string) {
    return db
      .select({
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        clientName: clients.name,
        totalNetPrice: sql<number>`SUM(${invoiceDetails.totalNetPrice})`,
        createdAt: invoice.createdAt,
        dueDate: invoice.dueDate,
      })
      .from(invoice)
      .innerJoin(clients, eq(invoice.clientId, clients.id))
      .innerJoin(invoiceDetails, eq(invoice.id, invoiceDetails.invoiceId))
      .groupBy(invoice.invoiceNo, clients.name, invoice.createdAt, invoice.id)
      .where(eq(invoice.userId, userId))
      .orderBy(desc(invoice.createdAt));
  }

  @authRequired()
  @cache(CacheTags.INVOICES)
  static async getInvoiceListFull(userId: string) {
    return db.query.invoice.findMany({
      where: and(eq(invoice.userId, userId)),
      orderBy: desc(invoice.createdAt),
      with: {
        details: true,
      },
    });
  }

  @authRequired()
  static async getInvoiceNameById(invoiceId: string, userId: string) {
    try {
      const [invoiceNo] = await db
        .select({
          invoiceNo: invoice.invoiceNo,
        })
        .from(invoice)
        .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)))
        .limit(1);
      return invoiceNo ?? null;
    } catch (error) {
      return null;
    }
  }

  @authRequired()
  @cache(CacheTags.INVOICE)
  static async getInvoice(invoiceId: string, userId: string) {
    const invoiceRes = await db.query.invoice.findFirst({
      where: and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)),
      with: {
        details: true,
      },
    });

    if (!invoiceRes) return null;

    return invoiceRes;
  }

  @authRequired()
  static async saveInvoice(
    userId: string,
    invoiceData: z.infer<typeof invoiceDocumentSchema>,
  ) {
    return await db.transaction(async (tx) => {
      try {
        const { details, invoice: invoiceInfo } = invoiceData;

        const [savedInvoice] = await tx
          .insert(invoice)
          .values({
            ...invoiceInfo,
            userId,
            dueDate: invoiceInfo.dueDate as unknown as string,
            invoiceDate: invoiceInfo.invoiceDate as unknown as string,
            vatInvoice: invoiceInfo.vatInvoice,
          })
          .returning({ invoiceId: invoice.id });

        if (!savedInvoice?.invoiceId) {
          tx.rollback();
          return;
        }

        await tx.insert(invoiceDetails).values(
          details.map((detail) => {
            return {
              invoiceId: savedInvoice.invoiceId,
              description: detail.description,
              unitId: detail.unitId ?? 0,
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
              totalNetPrice: detail.totalNetPrice,
              vat: detail.vat,
              vatAmount: detail.vatAmount,
              totalGrossPrice: detail.totalGrossPrice,
            };
          }),
        );

        revalidateCache(CacheTags.INVOICES, userId);
        return savedInvoice.invoiceId;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }


  @authRequired()
  static async copyInvoice(invoiceId: string, userId: string) {
    const invoiceToCopy = await db.query.invoice.findFirst({
      where: and(eq(invoice.userId, userId), eq(invoice.id, invoiceId)),
      with: {
        details: true,
      },
    });

    if (!invoiceToCopy) {
      throw new Error("Invoice not found");
    }

    return db.transaction(async (tx) => {
      try {
          // Generate a unique invoice number
      const baseInvoiceNo = invoiceToCopy.invoiceNo;
      const baseInvoiceNoWithoutCopy = baseInvoiceNo.replace(/ \(Copy( \d+)?\)$/, '').trim();
      const countResult = await tx
        .select({ count: sql<number>`count(*)` })
        .from(invoice)
        .where(
          and(
            eq(invoice.userId, userId),
            like(invoice.invoiceNo, `${baseInvoiceNoWithoutCopy} (Copy%)`)
          )
        );

      const count = countResult[0]?.count ?? 0;

      const newInvoiceNo = count === 0 
        ? `${baseInvoiceNoWithoutCopy} (Copy)`
        : `${baseInvoiceNoWithoutCopy} (Copy ${+count + 1})`;

        const [savedInvoice] = await tx.insert(invoice).values({
          ...invoiceToCopy,
          id: undefined,
          createdAt: new Date(),
          updatedAt: null,
          invoiceNo: newInvoiceNo,
        }).returning({ invoiceId: invoice.id });
  
        if (!savedInvoice?.invoiceId) {
          throw new Error("Failed to copy new invoice");
        }
        
        await tx.insert(invoiceDetails).values(
          invoiceToCopy.details.map(detail => ({
            ...detail,
            id: undefined, // Remove the id to create new detail entries
            invoiceId: savedInvoice.invoiceId // Link to the new invoice
          }))
        );


        revalidateCache(CacheTags.INVOICES, userId);

        return savedInvoice.invoiceId;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }

  @authRequired()
  static async deleteInvoice(invoiceId: string) {
    const user = await auth();;

    return db.transaction(async (tx) => {
      try {
        await tx.delete(invoice).where(and(eq(invoice.id, invoiceId), eq(invoice.userId, user.userId!)));
        revalidateCache(CacheTags.INVOICES, user.userId!);
        return true;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }

  @authRequired()
  static async updateInvoice(invoiceId: string, invoiceData: z.infer<typeof invoiceDocumentSchemaWithDetailsId>, userId: string) {
    return db.transaction(async (tx) => {
      try {
        const updatedInvoiceData = {
          ...invoiceData.invoice,
          dueDate: new Date(invoiceData.invoice.dueDate).toISOString(),
          invoiceDate: new Date(invoiceData.invoice.invoiceDate).toISOString(),
          updatedAt: sql`NOW()`,
        };

        await tx.update(invoice)
          .set(updatedInvoiceData)
          .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)));

        await Promise.all(invoiceData.details.map(detail =>
          tx.update(invoiceDetails)
            .set({
              ...detail,
              updatedAt: sql`NOW()`,
            })
            .where(and(eq(invoiceDetails.invoiceId, invoiceId), eq(invoiceDetails.id, detail.id)))
        ));

        revalidateCache(CacheTags.INVOICE, invoiceId);
        return true; // Indicate successful update
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }
}
