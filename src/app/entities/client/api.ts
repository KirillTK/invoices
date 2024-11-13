import { useQuery } from '@tanstack/react-query';
import { fetcher } from "~/shared/utils/fetcher";
import type { ClientModel } from "./client.model";

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
