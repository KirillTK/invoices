'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';
import { fetcher } from "~/shared/utils/fetcher";
import type { InvoiceModel } from "./invoice.model";
import FileSaver from 'file-saver';
import type { invoiceDocumentSchema } from '~/shared/schemas/invoice.schema';

export function useInvoiceQuery(id: string) {
  const { data, error, isLoading } = useQuery<InvoiceModel, Error>(
    {
      queryKey: ['invoice', id],
      queryFn: () => fetcher(`/api/invoice/?invoiceId=${encodeURIComponent(id)}`),
      enabled: !!id, // The query
    }
  );

  return {
    invoice: data ?? null,
    error,
    isLoading,
  };
}

export function useInvoiceMutations(id?: string) {
  const queryClient = useQueryClient();

  const invoiceIdRequired = () => {
    if (!id) {
      throw new Error('Invoice ID is required');
    }
  };

  const downloadPdf = useMutation({
    mutationFn: async () => {
      invoiceIdRequired();
      const url = `/api/invoice/pdf?invoiceId=${encodeURIComponent(id!)}`;
      const response = await fetch(url, { method: 'POST' });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const blob = await response.blob();
      FileSaver.saveAs(blob, `invoice-${id}.pdf`);
    }
  });

  const copyInvoice = useMutation({
    mutationFn: async () => {
      invoiceIdRequired();
      const response = await fetch(`/api/invoice/${id}`, { method: 'POST', body: JSON.stringify({ invoiceId: id }) });
      const data = await response.json() as { invoiceId: string };
      return data.invoiceId;
    }
  });

  const deleteInvoice = useMutation({
    mutationFn: async () => {
      invoiceIdRequired();
      const response = await fetch('/api/invoice', { method: 'DELETE', body: JSON.stringify({ invoiceId: id }) });
      const data = await response.json() as { deletedInvoice: boolean };
      return data.deletedInvoice;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      await queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    }
  },);

  const createInvoice = useMutation({
    mutationFn: async <T>(invoice: T) => {
      const response = await fetch('/api/invoice', { method: 'POST', body: JSON.stringify(invoice) });
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  const updateInvoice = useMutation({
    mutationFn: async (invoiceDataToUpdate: z.infer<typeof invoiceDocumentSchema>) => {
      invoiceIdRequired();
      const response = await fetch(`/api/invoice/${id}`, { method: 'PATCH', body: JSON.stringify(invoiceDataToUpdate)});
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    }
  });

  return {
    downloadPdf,
    copyInvoice,
    deleteInvoice,
    createInvoice,
    updateInvoice,
  };
}
