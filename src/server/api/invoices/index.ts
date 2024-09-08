import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { authRequired } from "../../decorators/auth.decorator";
import type { z } from "zod";
import {
  clients,
  invoice,
  invoiceDetails,
  type InvoiceDetailsModel,
  unitEnum,
} from "~/server/db/schema";
import type { invoiceDocumentSchema } from "~/shared/schemas/invoice.schema";
import { and, desc, eq, like, sql } from "drizzle-orm";

export class InvoicesService {
  @authRequired()
  static async getInvoiceList() {
    const user = auth();

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
      .innerJoin(invoiceDetails, eq(invoice.id, invoiceDetails.invoice))
      .groupBy(invoice.invoiceNo, clients.name, invoice.createdAt, invoice.id)
      .where(eq(invoice.userId, user.userId!))
      .orderBy(desc(invoice.createdAt));
  }

  @authRequired()
  static async getInvoiceNameById(invoiceId: string) {
    const user = auth();

    try {
      const [invoiceNo] = await db
        .select({
          invoiceNo: invoice.invoiceNo,
        })
        .from(invoice)
        .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, user.userId!)))
        .limit(1);
      return invoiceNo ?? null;
    } catch (error) {
      return null;
    }
  }

  @authRequired()
  static async getInvoice(invoiceId: string) {
    const user = auth();

    const invoiceRes = await db
      .select()
      .from(invoice)
      .innerJoin(invoiceDetails, eq(invoice.id, invoiceDetails.invoice))
      .groupBy(invoice.id, invoiceDetails.id)
      .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, user.userId!)));

    if (!invoiceRes.length) return null;

    return {
      invoice: invoiceRes[0]!.invoices,
      details: invoiceRes.reduce<InvoiceDetailsModel[]>((accum, item) => {
        accum.push(item.invoice_details);

        return accum;
      }, []),
    };
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
            vatInvoice: false,
          })
          .returning({ invoiceId: invoice.id });

        if (!savedInvoice?.invoiceId) {
          tx.rollback();
          return;
        }

        await tx.insert(invoiceDetails).values(
          details.map((detail) => {
            return {
              invoice: savedInvoice.invoiceId,
              description: detail.description,
              unit: unitEnum.enumValues[0],
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
              totalNetPrice: detail.totalNetPrice,
              vat: detail.vat,
              vatAmount: detail.vatAmount,
              totalGrossPrice: detail.totalGrossPrice,
            };
          }),
        );

        return savedInvoice.invoiceId;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }


  @authRequired()
  static async copyInvoice(invoiceId: string) {
    const user = auth();
    const [invoiceToCopy] = await db.select().from(invoice).where(eq(invoice.id, invoiceId)).limit(1);

    if (!invoiceToCopy) {
      throw new Error("Invoice not found");
    }

    const details = await db.select().from(invoiceDetails).where(eq(invoiceDetails.invoice, invoiceId));

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
            eq(invoice.userId, user.userId!),
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
          details.map(detail => ({
            ...detail,
            id: undefined, // Remove the id to create new detail entries
            invoice: savedInvoice.invoiceId // Link to the new invoice
          }))
        );
  
        return savedInvoice.invoiceId;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }

  @authRequired()
  static async deleteInvoice(invoiceId: string) {
    const user = auth();

    return db.transaction(async (tx) => {
      try {
        await tx.delete(invoice).where(and(eq(invoice.id, invoiceId), eq(invoice.userId, user.userId!)));
        return true;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }
}
