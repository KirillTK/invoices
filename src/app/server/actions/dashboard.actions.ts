'use server';

import { subDays } from 'date-fns';
import { db } from '../db';
import { invoice, InvoiceModel } from '../db/schema/schemas/invoices';
import { invoiceDetails, InvoiceDetailsModel } from '../db/schema/schemas/invoiceDetails';
import { DashboardTimePeriod } from '../enums/dashboard-filters';
import { InvoiceCalculationService } from '../services/invoice-calculation.service';
import { eq, sql, and, gte, lte } from 'drizzle-orm';
import { ClientModel } from '../db/schema/schemas/clients';

type InvoiceFull = InvoiceModel & {
  details: InvoiceDetailsModel[];
  client: ClientModel;
}

type DashboardData = {
  invoices: InvoiceFull[];
  totalRevenue: number;
  invoicesCount: number;
  averageInvoiceValue: number;
  outstandingAmount: number;
  clientDistribution: Record<string, number>;
  monthlyRevenue: { monthYear: string; totalRevenue: number }[];

};

export async function getDashboardInvoices(
  userId: string, 
  clientId?: string, 
  timePeriod?: DashboardTimePeriod,
): Promise<DashboardData> {
  // Get date range based on time period
  const { startDate, endDate } = getDateRange(timePeriod);

  // Get monthly revenue data
  const monthlyRevenue = await getMonthlyRevenue(userId, startDate, endDate, clientId);

  // Get current period invoices
  const invoices = await getInvoices(userId, startDate, endDate, clientId);

  // Calculate aggregated data
  const aggregatedData = calculateAggregatedData(invoices);


  return {
    ...aggregatedData,
    monthlyRevenue
  };
}

// Helper functions
function getDateRange(timePeriod?: DashboardTimePeriod) {
  if(!timePeriod || timePeriod === DashboardTimePeriod.ALL) {
    return {
      startDate: new Date('2000-01-01'),
      endDate: new Date(),
    }
  }

  const now = new Date();
  const timePeriodMap = new Map<DashboardTimePeriod, { days: number }>([
    [DashboardTimePeriod.LAST_3_MONTHS, { days: 90 }],
    [DashboardTimePeriod.LAST_6_MONTHS, { days: 180 }],
    [DashboardTimePeriod.LAST_YEAR, { days: 365 }],
    [DashboardTimePeriod.LAST_MONTH, { days: 30 }],
  ]);

  const period = timePeriodMap.get(timePeriod);

  const endDate = now;
  const startDate = subDays(now, period?.days ?? 365);

  return { startDate, endDate };
}

async function getMonthlyRevenue(
  userId: string, 
  startDate: Date, 
  endDate: Date,
  clientId?: string
) {
  const conditions = [
    eq(invoice.userId, userId),
    gte(invoice.dueDate, startDate.toISOString()),
    lte(invoice.dueDate, endDate.toISOString())
  ];

  if (clientId && clientId !== 'all') {
    conditions.push(eq(invoice.clientId, clientId));
  }

  return db
    .select({
      monthYear: sql`TO_CHAR(${invoice.dueDate}, 'YYYY-MM')`,
      totalRevenue: sql`SUM(${invoiceDetails.totalGrossPrice})`,
    })
    .from(invoice)
    .innerJoin(invoiceDetails, eq(invoice.id, invoiceDetails.invoiceId))
    .where(and(...conditions))
    .groupBy(sql`TO_CHAR(${invoice.dueDate}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${invoice.dueDate}, 'YYYY-MM')`) as Promise<Array<{ monthYear: string; totalRevenue: number }>>;
}

async function getInvoices(
  userId: string, 
  startDate: Date, 
  endDate: Date,
  clientId?: string
) {
  return db.query.invoice.findMany({
    where: (invoice, { eq, and, gte, lte }) => {
      const conditions = [
        eq(invoice.userId, userId),
        gte(invoice.dueDate, startDate.toISOString()),
        lte(invoice.dueDate, endDate.toISOString())
      ];
      
      if (clientId && clientId !== 'all') {
        conditions.push(eq(invoice.clientId, clientId));
      }
      
      return and(...conditions);
    },
    orderBy: (invoice, { desc }) => desc(invoice.dueDate),
    with: {
      client: true,
      details: true,
    }
  });
}

function calculateAggregatedData(invoices: InvoiceFull[]): Omit<DashboardData, 'monthlyRevenue' | 'historicalData'> {
  return {
    invoices,
    totalRevenue: InvoiceCalculationService.calculateTotalsByInvoices(invoices),
    invoicesCount: invoices.length,
    averageInvoiceValue: InvoiceCalculationService.calculateAverageInvoiceValue(invoices),
    outstandingAmount: InvoiceCalculationService.calculateOutstandingAmount(invoices),
    clientDistribution: invoices.reduce((acc, invoice) => {
      const clientName = invoice.client.name;
      if (!acc[clientName]) acc[clientName] = 0;
      acc[clientName] += invoice.details.reduce((sum, detail) => 
        sum + (detail.quantity * detail.unitPrice), 0);
      return acc;
    }, {} as Record<string, number>)
  };
}
