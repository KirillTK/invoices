import useSWR from "swr";
import { fetcher } from "~/shared/utils/fetcher";
import type { InvoiceModel } from "./invoice.model";

export function useInvoiceQuery(id: string) {
  const { data, error, isLoading } = useSWR<InvoiceModel, Error>(
    `/api/invoice/${encodeURIComponent(id)}`,
    fetcher,
  );

  return {
    invoice: data!,
    error,
    isLoading,
  };
}
