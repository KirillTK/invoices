import { useState } from 'react';
import useSWR from "swr";
import { fetcher } from "~/shared/utils/fetcher";
import type { InvoiceModel } from "./invoice.model";
import FileSaver from 'file-saver';

export function useInvoiceQuery(id: string) {
  const { data, error, isLoading } = useSWR<InvoiceModel, Error>(
    `/api/invoice/?invoiceId=${encodeURIComponent(id)}`,
    fetcher,
  );

  return {
    invoice: data!,
    error,
    isLoading,
  };
}

export function useInvoicePdfDownload(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const downloadPdf = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `/api/invoice/pdf?invoiceId=${encodeURIComponent(id)}`;
      const response = await fetch(url, { method: 'POST' });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      FileSaver.saveAs(blob, `invoice-${id}.pdf`);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadPdf,
    isLoading,
    error,
  };
}