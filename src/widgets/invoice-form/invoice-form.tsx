"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ClientCombobox } from '~/features/client-combobox';
import { ComboboxField } from '~/shared/components/controls/combobox-field';
import { DatePickerField } from "~/shared/components/controls/date-picker-field";
import { InputField } from '~/shared/components/controls/input-field';
import { Label } from "~/shared/components/label";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
    id: "222313123123aa",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    id: "222313123123a23232",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    id: "222313123123a23232123131",
  },
];

interface InvoiceForm {
  clientId: string;
  userId: string;
  test?: Date;
  test2?: string;
}

export function InvoiceForm() {
  const { handleSubmit, watch, register } = useForm<InvoiceForm>();

  const formValues = watch();

  console.log(formValues, "formValues");

  const onSubmit = useCallback((values: InvoiceForm) => {
    console.log(values, "values");
  }, []);

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-8">
        <div>
          <Label className="mb-4 text-lg font-medium">From:</Label>
          <ComboboxField
            options={frameworks}
            field={register("userId")}
            className="mt-4"
          />
        </div>
        <div>
          <Label className="mb-4 text-lg font-medium">To:</Label>
          <ClientCombobox field={register("clientId")}/>
        </div>
      </div>
      <div>
        <Label className="mb-4 text-lg font-medium block">Invoice Details</Label>
        <div className="grid grid-cols-2 gap-4">
          <DatePickerField field={register("test")} label="Date of issue" />
          <DatePickerField field={register("test")} label="Realization date of the order" />
          <InputField field={register("test2")} label="Invoice number" />
        </div>
      </div>
    </form>
  );
}
