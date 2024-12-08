import { useQuery } from '@tanstack/react-query';
import { fetcher } from '~/shared/utils/fetcher';
import type { CurrencyModel } from '../model/currency.model';

export function useCurrencyQuery() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => fetcher<CurrencyModel[]>("/api/currencies"),
  })

  return {
    currencies: data ?? [],
    error,
    isLoading,
  };
}