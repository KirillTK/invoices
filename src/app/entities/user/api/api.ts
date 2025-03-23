import { useMutation, useQuery } from '@tanstack/react-query';
import { type User } from '../model/user.model';
import { toast } from '~/shared/components/toast/use-toast';
import { useAuth } from '@clerk/nextjs';
import { fetcher } from '~/shared/utils/fetcher';

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const response = await fetch(`/api/user`, { method: 'PATCH', body: JSON.stringify(user) });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    },
    onSuccess: () => {
      toast({ title: "User updated successfully!", variant: "success" });
    },
    onError: () => {
      toast({ title: "Failed to update user!", variant: "destructive" });
    },
  });
};


export const useGetUserQuery = () => {
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => fetcher<User>(`/api/user`),
    enabled: !!userId,
  });

  return { user: data, isLoading, error };
};
