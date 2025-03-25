'use client'

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/shared/components/card/card';
import { Combobox } from '~/shared/components/combobox';
import type { Option } from '~/shared/types/form';
import { TIME_PERIOD_OPTIONS } from '../constants/time-period-options.const';
import { DashboardFilters as DashboardFiltersEnum, type DashboardTimePeriod } from '~/server/enums/dashboard-filters';
interface DashboardFiltersProps {
  clientsOptions: Option<string>[]
}

export interface DashboardFilters {
  clientId: string;
  timePeriod: DashboardTimePeriod;
} 

export function DashboardFilters({ clientsOptions }: DashboardFiltersProps) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (newFilters: Record<string, string>) => {
    startTransition(() => {
      // Create new URL with updated filters
      const params = new URLSearchParams(searchParams)
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter your invoice statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Combobox 
              options={clientsOptions} 
              value={searchParams.get(DashboardFiltersEnum.CLIENT_ID) ?? clientsOptions[0]?.value}
              name={DashboardFiltersEnum.CLIENT_ID}
              onChange={(value) => {
                if(value) {
                  handleFilterChange({
                    clientId: value
                  })
                }
              }}
            />
            <Combobox 
              options={TIME_PERIOD_OPTIONS} 
              value={searchParams.get(DashboardFiltersEnum.TIME_PERIOD) ?? TIME_PERIOD_OPTIONS[0]?.value}
              name={DashboardFiltersEnum.TIME_PERIOD}
              onChange={(value) => {
                if(value) {
                  handleFilterChange({
                    timePeriod: value
                  })
                }
              }}
            />
        </div>
      </CardContent>
    </Card>
  )
}
