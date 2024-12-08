import { useQuery } from '@tanstack/react-query';
import { fetcher } from "~/shared/utils/fetcher";
import type { ClientModel } from "../model/client.model";
import { sleep } from '~/shared/utils/http';

export function useClientQuery() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fetcher<ClientModel[]>("/api/client"),
  })

  return {
    clients: data ?? [],
    error,
    isLoading,
  };
}

export function useClientQueryWithFilter(query: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['clients', query],
    queryFn: async ({ signal }) => {
      await sleep();

      if (!signal?.aborted) { 
        return fetcher<ClientModel[]>(`/api/client?query=${query}`, { signal });
      }
    },
  })

  return {
    clients: data ?? [],
    error,
    isLoading,
  };
}
