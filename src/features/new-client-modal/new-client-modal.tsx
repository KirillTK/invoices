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
import { getFormErrorArray, isCommonHttpError, isHttpValidationError } from "~/shared/utils/http";
import { clientSchema } from "~/shared/schemas/client.schema";
import { Form } from "~/shared/components/form";
import { InputFieldNew } from "~/shared/components/controls/input-field-new";

interface Props {
  buttonClassName?: string;
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

export function NewClientModal({ buttonClassName }: Props) {
  const title = "Create new client";

  const form = useForm<z.infer<typeof clientSchema>>({
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
      } else if(isCommonHttpError(error)) {
        setError("name", { type: "manual", message: error.message });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>{title}</Button>
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
                  <InputFieldNew
                    key={fieldName}
                    form={form}
                    fieldName={fieldName as keyof NewClientForm}
                    className="grid grid-cols-4 items-center gap-4"
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

// <FormField
// key={fieldName}
// control={form.control}
// name={fieldName as keyof NewClientForm}
// render={({ field }) => (
//   <FormItem className="grid grid-cols-4 items-center gap-4">
//     <FormLabel className="capitalize">
//       {fieldName}
//     </FormLabel>
//     <FormControl className="col-span-3">
//       <Input {...field} />
//     </FormControl>
//   </FormItem>
// )}
// />

{
  /* <InputFieldNew
key={fieldName}
form={form}
fieldName={fieldName as keyof NewClientForm}
className="grid grid-cols-4 items-center gap-4"
labelClassName="capitalize"
inputClassName="col-span-3"
/> */
}
