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

export function useInvoiceMutations(id: string) {
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

  const copyInvoice = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/invoice', { method: 'PATCH', body: JSON.stringify({ invoiceId: id }) });

      const data = await response.json() as { invoiceId: string };
      return data.invoiceId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoice = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/invoice', { method: 'DELETE', body: JSON.stringify({ invoiceId: id }) });
      const data = await response.json() as { deletedInvoice: boolean };
      return data.deletedInvoice;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadPdf,
    copyInvoice,
    deleteInvoice,
    isLoading,
    error,
  };
}
