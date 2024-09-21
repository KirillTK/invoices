'use client';
import React, { lazy, Suspense } from 'react';
import { BarChartSkeleton } from '~/shared/components/skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/card/card';
import { type InvoiceListModel } from '~/entities/invoice/model/invoice.model';


const LazyYearlyChart = lazy(() => import('./yearly-chart').then(module => ({ default: module.YearlyChart })));

export const YearlyIncomeChart: React.FC<{ invoices: InvoiceListModel[] }> = ({ invoices }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Income Overview</CardTitle>
      </CardHeader>
      <CardContent>
      <Suspense fallback={<BarChartSkeleton/>}>
          <LazyYearlyChart invoices={invoices} />
        </Suspense>
      </CardContent>
    </Card>
  );
};