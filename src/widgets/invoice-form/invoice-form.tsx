"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ClientCombobox } from "~/features/client-combobox";
import { ComboboxField } from "~/shared/components/controls/combobox-field";
import { DatePickerField } from "~/shared/components/controls/date-picker-field";
import { InputField } from "~/shared/components/controls/input-field";
import { Label } from "~/shared/components/label";

interface InvoiceForm {
  // invoice
  title: string;
  description: string;
  vatInvoice: boolean;
  dueDate: Date,
  realizationDate: Date,
  dateOfIssue: Date,

  //client info
  clientId: string;
  clientAddress: string;
  clientName: string;

  // user info
  userId: string;
  userAddress: string;
  userName: string;
}

export function InvoiceForm() {
  const { handleSubmit, watch, register } = useForm<InvoiceForm>();

  const formValues = watch();

  console.log(formValues, "formValues");

  const onSubmit = useCallback((values: InvoiceForm) => {
    console.log(values, "values");
  }, []);

  return (
    <form
      className="grid grid-cols-2 gap-4 p-4 shadow-[0_0.5em_1.5em_-0.5em_rgba(0,0,0,0.5)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col space-y-8">
        <div>
          <Label className="mb-4 text-lg font-medium">From:</Label>
          <ComboboxField
            options={[]}
            field={register("userId")}
            className="mt-4"
          />
        </div>
        <div>
          <Label className="mb-4 text-lg font-medium">To:</Label>
          <ClientCombobox field={register("clientId")} />
        </div>
      </div>
      <div>
        <Label className="mb-4 block text-lg font-medium">
          Invoice Details
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <DatePickerField field={register("test")} label="Date of issue" />
          <DatePickerField
            field={register("test")}
            label="Realization date of the order"
          />
          <InputField field={register("test2")} label="Invoice number" />
        </div>
      </div>
    </form>
  );
}
