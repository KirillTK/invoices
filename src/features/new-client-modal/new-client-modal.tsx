"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSWRConfig } from "swr";
import type { z } from "zod";
import type { ClientModel } from "~/entities/client/client.model";
import { Button } from "~/shared/components/button";
import { InputField } from "~/shared/components/controls/input-field";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/components/dialog";
import { Label } from "~/shared/components/label";
import { getFormErrorArray, isHttpValidationError } from "~/shared/utils/http";
import { clientSchema } from "~/shared/schemas/client.schema";

type NewClientForm = z.infer<typeof clientSchema>;

const defaultValues: NewClientForm = {
  name: "",
  taxIndex: "",
  country: "",
  city: "",
  address: "",
  zip: "",
  userId: "",
};

export function NewClientModal() {
  const title = "Create new client";

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof clientSchema>>({
    defaultValues,
    resolver: zodResolver(clientSchema),
  });

  console.log(errors, "ERRORS");

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
      }
    } finally {
      console.log("Finally");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(saveClient)}>
          <div className="grid gap-4 py-4">
            {Object.keys(defaultValues).map((fieldName) => {
              return (
                <div
                  className="grid grid-cols-4 items-center gap-4"
                  key={fieldName}
                >
                  <Label htmlFor="name" className="text-right capitalize">
                    {fieldName}
                  </Label>
                  <InputField
                    field={register(fieldName as keyof NewClientForm)}
                    containerClassName="col-span-3"
                    errors={errors}
                  />
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
