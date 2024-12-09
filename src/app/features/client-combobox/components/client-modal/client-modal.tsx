"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "~/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/components/dialog";
import {
  getFormErrorArray,
  isCommonHttpError,
  isHttpValidationError,
} from "~/shared/utils/http";
import { clientSchema } from "~/shared/schemas/client.schema";
import { Form } from "~/shared/components/form";
import { InputField } from "~/shared/components/controls/input-field";
import { useClientCreateMutation, useClientUpdateMutation } from "~/entities/client/api/client.api";
import { useEffect } from 'react';

type NewClientForm = z.infer<typeof clientSchema>;

interface Props {
  buttonClassName?: string;
  children?: React.ReactNode;
  client?: NewClientForm;
}

const defaultValues: NewClientForm = {
  name: "",
  taxIndex: "",
  country: "",
  city: "",
  address: "",
  zip: "",
};

export function ClientModal({ buttonClassName, children, client = defaultValues }: Props) {
  const title = client.id ? "Edit client" : "Create new client";
  
  const clientCreateMutation = useClientCreateMutation();
  const clientUpdateMutation = useClientUpdateMutation();

  const form = useForm<NewClientForm>({
    defaultValues: client,
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    form.reset(client);
  }, [client, form]);

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting, isValidating },
    setError,
  } = form;

  const saveClient = async () => {
    const client = getValues();

    try {
      const { id, ...clientData } = client;

      if (id) {
        await clientUpdateMutation.mutateAsync({ id, ...clientData });
      } else {
        await clientCreateMutation.mutateAsync(clientData);
      }
    } catch (error) {
      if (isHttpValidationError(error)) {
        const formErrors = getFormErrorArray<NewClientForm>(error.errors);

        formErrors.forEach((er) =>
          setError(er.name, { type: er.type, message: er.message }),
        );
      } else if (isCommonHttpError(error)) {
        setError("name", { type: "manual", message: error.message });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <Button className={buttonClassName}>
            {title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(saveClient)} className="grid gap-4 py-4">
            {Object.keys(defaultValues)
              .filter((fieldName) => fieldName !== "userId")
              .map((fieldName) => {
                return (
                  <InputField
                    key={fieldName}
                    form={form}
                    fieldName={fieldName as keyof NewClientForm}
                    className="grid grid-cols-4 items-center gap-4 text-right"
                    label={fieldName}
                    labelClassName="capitalize"
                    inputClassName="col-span-3"
                  />
                );
              })}
            <DialogFooter>
              <Button type="submit" loading={isSubmitting || isValidating}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
