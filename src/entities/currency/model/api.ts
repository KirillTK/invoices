import useSWR from 'swr';
import { fetcher } from '~/shared/utils/fetcher';
import { type CurrencyModel } from './currency.model';


export function useCurrencyQuery() {
  const { data, error, isLoading } = useSWR<CurrencyModel[], Error>(
    `/api/currencies/`,
    fetcher,
  );

  return {
    currencies: data ?? [],
    error,
    isLoading,
  };
}