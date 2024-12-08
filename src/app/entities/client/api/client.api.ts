import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher, getCacheTime } from "~/shared/utils/fetcher";
import type { ClientModel } from "../model/client.model";
import { sleep } from '~/shared/utils/http';
import { toast } from '~/shared/components/toast/use-toast';

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
    staleTime: getCacheTime(3),
  })

  return {
    clients: data ?? [],
    error,
    isLoading,
  };
}

export function useClientDeleteMutation(query?: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => fetcher(`/api/client/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      await queryClient.invalidateQueries({ queryKey: ['client', query] });
    },
    onError: (error) => {
      console.error('Failed to delete invoice:', error);

      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  });
}
