'use server';

import { startOfMonth, startOfYear } from 'date-fns';
import { subYears } from 'date-fns';
import { subDays } from 'date-fns';
import { db } from '../db';
import { DashboardTimePeriod } from '../enums/dashboard-filters';


export async function getDashboardData(userId: string, clientId?: string, timePeriod?: DashboardTimePeriod) {

  return db.query.invoice.findMany({
    where: (invoice, { eq, and, gte, lte }) => {
      const conditions = [eq(invoice.userId, userId)];
      
      // Filter by client if dateRange is not 'all'
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
    orderBy: (invoice, { desc }) => desc(invoice.createdAt)
  })
  
}