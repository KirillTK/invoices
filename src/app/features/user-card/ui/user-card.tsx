'use client';
import { Button } from '~/shared/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '~/shared/components/card/card';
import { useUpdateUserMutation } from '~/entities/user/api/api';
import { type User } from '~/entities/user/model/user.model';
import { Form } from '~/shared/components/form/form';
import { InputField } from '~/shared/components/controls/input-field';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '~/shared/schemas/user.schema';
import { isEqualObject } from '~/shared/utils/utils';

export type UserCardConfig = {
  label: string;
  name: keyof Omit<User, 'id'>;
}

export interface UserCardProps {
  config: UserCardConfig[];
  initialData: Partial<User>;
}

export const UserCard = ({ config, initialData }: UserCardProps) => {
  const form = useForm<User>({
    defaultValues: initialData,
    resolver: zodResolver(userSchema),
  });
  const updateUserMutation = useUpdateUserMutation();

  const onSubmit: SubmitHandler<Partial<User>> = (data) => {
    if (isEqualObject(data, initialData)) {
      return;
    };

    void updateUserMutation.mutateAsync(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your tax and banking details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.map(({ label, name }) => {
            return (
              <InputField
                form={form}
                fieldName={name}
                key={name}
                label={label}
              />
            );
          })}
        </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateUserMutation.isPending}
            loading={updateUserMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      </form>
    </Form>
  );
};
