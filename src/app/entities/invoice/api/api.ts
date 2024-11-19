'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';
import type { InvoiceModel } from "../model/invoice.model";
import FileSaver from 'file-saver';
import type { invoiceDocumentSchema } from '~/shared/schemas/invoice.schema';
import { toast } from '~/shared/components/toast/use-toast';
import { useRouter } from 'next/navigation';

export function useInvoiceQuery(id: string) {
  const { data, error, isLoading } = useQuery<InvoiceModel, Error>(
    {
      queryKey: ['invoice', id],
      queryFn: async () => {
        const response = await fetch(`/api/invoice/?invoiceId=${encodeURIComponent(id)}`);

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json();
      },
      enabled: !!id,
    }
  );

  return {
    invoice: data ?? null,
    error,
    isLoading,
  };
}

export function useInvoiceDeleteMutation(invoiceId: string, redirectPath?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/invoice', { method: 'DELETE', body: JSON.stringify({ invoiceId }) });
      const data = await response.json() as { deletedInvoice: boolean };
      return data.deletedInvoice;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      await queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });

      if(redirectPath) {
        router.push(redirectPath);
      } else {
        router.refresh();
      }
    },
    onError: (error) => {
      console.error('Failed to delete invoice:', error);

      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  });
}

export function useInvoiceUpdateMutation(invoiceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceDataToUpdate: z.infer<typeof invoiceDocumentSchema>) => {
      const response = await fetch(`/api/invoice/${invoiceId}`, { method: 'PATCH', body: JSON.stringify(invoiceDataToUpdate)});
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
      toast({ title: "Invoice successfully updated!", variant: "success" });
    }
  });
}

export function useDownloadInvoiceMutation(invoiceId: string) {
  return useMutation({
    mutationFn: async () => {
      const url = `/api/invoice/pdf?invoiceId=${encodeURIComponent(invoiceId)}`;
      const response = await fetch(url, { method: 'POST' });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const blob = await response.blob();
      FileSaver.saveAs(blob, `invoice-${invoiceId}.pdf`);
    }
  });
}

export function useInvoiceCopyMutation(invoiceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/invoice/${invoiceId}`, { method: 'POST', body: JSON.stringify({ invoiceId }) });
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error('Failed to copy invoice:', error);
      toast({
        title: "Error",
        description: "Failed to copy invoice. Please try again.",
        variant: "destructive",
      });
    }
  });
}

export function useCreateInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: unknown) => {
      const response = await fetch('/api/invoice', { method: 'POST', body: JSON.stringify(invoice) });
      return response;
    },
    onSuccess: async () => {
      toast({ title: "Invoice successfully saved!", variant: "success" });
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });
}
