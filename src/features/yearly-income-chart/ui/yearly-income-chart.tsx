'use client';
import React, { lazy, Suspense } from 'react';
import { BarChartSkeleton } from '~/shared/components/bar-chart-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/card/card';


const LazyYearlyChart = lazy(() => import('./yearly-chart'));


export const YearlyIncomeChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Income Overview</CardTitle>
      </CardHeader>
      <CardContent>
      <Suspense fallback={<BarChartSkeleton/>}>
          <LazyYearlyChart />
        </Suspense>
      </CardContent>
    </Card>
  );
};