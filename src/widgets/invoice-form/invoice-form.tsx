"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ClientCombobox } from "~/features/client-combobox";
import { DatePickerField } from "~/shared/components/controls/date-picker-field";
import { InputField } from "~/shared/components/controls/input-field";
import { Label } from "~/shared/components/label";

interface InvoiceForm {
  // invoice
  title: string;
  description: string;
  vatInvoice: boolean;
  dueDate: Date;
  realizationDate: Date;
  dateOfIssue: Date;

  //client info
  clientId: string;
  clientAddress: string;
  clientName: string;
  clientTaxIndex: string;

  // user info
  userId: string;
  userAddress: string;
  userName: string;
  userTaxIndex: string;
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
      <div></div>

      <div className="grid gap-y-2">
        <DatePickerField
          field={register("dateOfIssue")}
          label="Realization date of the order"
        />
        <DatePickerField
          field={register("realizationDate")}
          label="Realization date of the order"
        />
      </div>

      <div className="col-span-2">
        <InputField field={register("title")} label="NIP/VAT ID:" className="max-w-56" />
      </div>

      <div className="grid gap-y-2">
        <Label className="text-lg font-medium">From:</Label>
        <InputField field={register("userName")} />
        <InputField field={register("userTaxIndex")} label="NIP/VAT ID:" />
        <InputField field={register("userAddress")} label="Address:" />
      </div>

      <div className="grid gap-y-2">
        <Label className="text-lg font-medium">To:</Label>
        <ClientCombobox field={register("clientId")} />
        <InputField field={register("clientTaxIndex")} label="NIP/VAT ID:" />
        <InputField field={register("clientAddress")} label="Address:" />
      </div>
    </form>
  );
}
