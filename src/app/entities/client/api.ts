import useSWR from "swr";
import { fetcher } from "~/shared/utils/fetcher";
import type { ClientModel } from "./client.model";

export function useClientQuery() {
  const { data, error, isLoading } = useSWR<ClientModel[], Error>(
    "/api/client",
    fetcher,
  );

  return {
    clients: data ?? [],
    error,
    isLoading,
  };
}
