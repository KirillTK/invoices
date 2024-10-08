"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSWRConfig } from "swr";
import type { z } from "zod";
import type { ClientModel } from "~/entities/client/client.model";
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

interface Props {
  buttonClassName?: string;
  children?: React.ReactNode;
}

type NewClientForm = z.infer<typeof clientSchema>;

const defaultValues: NewClientForm = {
  name: "",
  taxIndex: "",
  country: "",
  city: "",
  address: "",
  zip: "",
};

export function NewClientModal({ buttonClassName, children }: Props) {
  const title = "Create new client";

  const form = useForm<NewClientForm>({
    defaultValues,
    resolver: zodResolver(clientSchema),
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting, isValidating },
    setError,
  } = form;

  const { mutate } = useSWRConfig();

  const saveClient = async () => {
    try {
      const response = await fetch("/api/client", {
        method: "POST",
        body: JSON.stringify(getValues()),
      });

      if (!response.ok) throw await response.json();

      const data = (await response.json()) as ClientModel;
      await mutate("/api/client", data);
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
        {children ?? <Button className={buttonClassName}>{title}</Button>}
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
                    className="grid grid-cols-4 items-center text-right gap-4"
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
