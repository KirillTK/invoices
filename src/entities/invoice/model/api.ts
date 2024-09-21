'use client';
import { useState } from 'react';
import useSWR from "swr";
import type { z } from 'zod';
import { fetcher } from "~/shared/utils/fetcher";
import type { InvoiceModel } from "./invoice.model";
import FileSaver from 'file-saver';
import type { invoiceDocumentSchema } from '~/shared/schemas/invoice.schema';

export function useInvoiceQuery(id: string) {
  const { data, error, isLoading } = useSWR<InvoiceModel, Error>(
    `/api/invoice/?invoiceId=${encodeURIComponent(id)}`,
    fetcher,
  );

  return {
    invoice: data ?? null,
    error,
    isLoading,
  };
}

export function useInvoiceMutations(id?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);


  const invoiceIdRequired = () => {
    if (!id) {
      throw new Error('Invoice ID is required');
    }
  };

  const downloadPdf = async () => {
    invoiceIdRequired();
    setIsLoading(true);
    setError(null);
    try {
      const url = `/api/invoice/pdf?invoiceId=${encodeURIComponent(id!)}`;
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
    invoiceIdRequired();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/invoice/${id}`, { method: 'POST', body: JSON.stringify({ invoiceId: id }) });

      const data = await response.json() as { invoiceId: string };
      return data.invoiceId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoice = async () => {
    invoiceIdRequired();
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

  const createInvoice = async <T>(invoice: T) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/invoice', { method: 'POST', body: JSON.stringify(invoice) });
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoice = async (invoiceId: string, invoiceDataToUpdate: z.infer<typeof invoiceDocumentSchema>) => {
    invoiceIdRequired();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/invoice/${invoiceId}`, { method: 'PATCH', body: JSON.stringify(invoiceDataToUpdate)});
      return response;
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
    createInvoice,
    updateInvoice,
  };
}
