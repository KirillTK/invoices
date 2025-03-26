'use server';

import { startOfMonth, startOfYear, subYears, subDays } from 'date-fns';
import { db } from '../db';
import { DashboardTimePeriod } from '../enums/dashboard-filters';
import { InvoiceCalculationService } from '../services/invoice-calculation.service';

export async function getDashboardInvoices(userId: string, clientId?: string, timePeriod?: DashboardTimePeriod) {
  const invoices = await db.query.invoice.findMany({
    where: (invoice, { eq, and, gte, lte }) => {
      const conditions = [eq(invoice.userId, userId)];
      
      // Filter by client if clientId is not 'all'
      if (clientId && clientId !== 'all') {
        conditions.push(eq(invoice.clientId, clientId));
      }
      
      // Filter by time period
      if (timePeriod && timePeriod !== DashboardTimePeriod.ALL) {
        const now = new Date();
        
        const timePeriodMap = new Map<DashboardTimePeriod, Date>([
          [DashboardTimePeriod.LAST_3_MONTHS, subDays(now, 90)],
          [DashboardTimePeriod.LAST_6_MONTHS, subDays(now, 180)],
          [DashboardTimePeriod.LAST_YEAR, subYears(now, 1)],
          [DashboardTimePeriod.LAST_MONTH, startOfMonth(now)],
        ]);
        
        const startDate = timePeriodMap.get(timePeriod) ?? startOfYear(now);

        
        conditions.push(gte(invoice.dueDate, startDate.toISOString()));
        conditions.push(lte(invoice.dueDate, now.toISOString()));
      }
      
      return and(...conditions);
    },
    orderBy: (invoice, { desc }) => desc(invoice.createdAt),
    with: {
      client: true,
      details: true,
    }
  });
  
  
  const aggregatedData = {
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
  
  return aggregatedData;
}


export async function getDashboardChangesInPastYear(userId: string) {
  const { invoices } = await getDashboardInvoices(userId, undefined, DashboardTimePeriod.LAST_YEAR);

  const totalRevenue = InvoiceCalculationService.calculateTotalsByInvoices(invoices);
  const invoicesCount = invoices.length;
  const averageInvoiceValue = InvoiceCalculationService.calculateAverageInvoiceValue(invoices);
  const outstandingAmount = InvoiceCalculationService.calculateOutstandingAmount(invoices);

  return {
    totalRevenue,
    invoicesCount,
    averageInvoiceValue,
    outstandingAmount,
  };
}