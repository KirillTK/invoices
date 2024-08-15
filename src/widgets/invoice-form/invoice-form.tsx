"use client";

import { useCallback, useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { ClientCombobox } from "~/widgets/client-combobox";
import {
  EMPTY_INVOICE_ROW_TABLE,
  InvoiceTable,
} from "~/features/invoice-table";
import type { InvoiceTableForm } from "~/features/invoice-table";
import { DatePickerField } from "~/shared/components/controls/date-picker-field";
import { useClientQuery } from "~/entities/client/api";
import { InputField } from "~/shared/components/controls/input-field";
import { Form } from "~/shared/components/form";

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

  // table
  invoice: InvoiceTableForm[];
}

export function InvoiceForm() {
  const form = useForm<InvoiceForm>({
    defaultValues: { invoice: [EMPTY_INVOICE_ROW_TABLE] },
  });

  const { handleSubmit, watch, setValue } = form;

  const { clients } = useClientQuery();

  const selectedClientId = watch("clientId");

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(({ id }) => id === selectedClientId);

      if (client) {
        setValue("clientTaxIndex", client.taxIndex);
        setValue("clientAddress", client.address);
      }
    }
  }, [JSON.stringify(clients), selectedClientId, setValue]);

  console.log(selectedClientId, "formValues");

  const onSubmit = useCallback((values: InvoiceForm) => {
    console.log(values, "values");
  }, []);

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-4 p-4 shadow-[0_0.5em_1.5em_-0.5em_rgba(0,0,0,0.5)]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div></div>

        <div className="grid gap-y-2">
          <DatePickerField
            form={form}
            fieldName="dateOfIssue"
            label="Realization date of the order"
          />
          <DatePickerField
            form={form}
            fieldName="realizationDate"
            label="Realization date of the order"
          />
        </div>

        <div className="col-span-2">
          <InputField
            form={form}
            fieldName="title"
            label="Invoice #"
            className="max-w-56"
          />
        </div>

        <div className="grid gap-y-2">
          <InputField
            form={form}
            fieldName="userName"
            label="From:"
            labelClassName="text-lg font-medium text-black"
          />

          <InputField
            form={form}
            fieldName="userTaxIndex"
            label="NIP/VAT ID:"
          />

          <InputField form={form} fieldName="userAddress" label="Address:" />
        </div>

        <div className="grid gap-y-2">
          <ClientCombobox
            form={form}
            fieldName="clientId"
            label="To:"
            labelClassName="text-lg font-medium text-black"
          />

          <InputField
            form={form}
            fieldName="clientTaxIndex"
            label="NIP/VAT ID:"
          />

          <InputField form={form} fieldName="clientAddress" label="Address:" />
        </div>

        <div className="col-span-2">
          <InvoiceTable
            form={
              form as unknown as UseFormReturn<{ invoice: InvoiceTableForm[] }>
            }
          />
        </div>
      </form>
    </Form>
  );
}
