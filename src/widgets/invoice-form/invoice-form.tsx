"use client";

import { useCallback, useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { invoiceDocumentSchema } from "~/shared/schemas/invoice.schema";
import { Button } from "~/shared/components/button";
import {
  getFormErrorArray,
  isCommonHttpError,
  isHttpValidationError,
} from "~/shared/utils/http";
import { DOM_ID } from "~/shared/constants/dom-id.const";

type InvoiceFormValues = z.infer<typeof invoiceDocumentSchema>;

export function InvoiceForm() {
  const form = useForm<InvoiceFormValues>({
    defaultValues: { details: [EMPTY_INVOICE_ROW_TABLE] },
    resolver: zodResolver(invoiceDocumentSchema),
    mode: "onBlur",
  });

  const { handleSubmit, watch, setValue, setError } = form;

  const { clients } = useClientQuery();

  const selectedClientId = watch("invoice.clientId");

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(({ id }) => id === selectedClientId);

      if (client) {
        setValue("invoice.clientNip", client.taxIndex);
        setValue("invoice.clientAddress", client.address);
      }
    }
  }, [JSON.stringify(clients), selectedClientId, setValue]);

  const onSubmit = useCallback(
    async (values: InvoiceFormValues) => {
      try {
        const response = await fetch("/api/invoice", {
          method: "POST",
          body: JSON.stringify(values),
        });

        if (!response.ok) throw await response.json();
      } catch (error) {
        if (isHttpValidationError(error)) {
          const formErrors = getFormErrorArray<InvoiceFormValues>(error.errors);

          formErrors.forEach((er) =>
            setError(er.name, { type: er.type, message: er.message }),
          );
        } else if (isCommonHttpError(error)) {
          setError("invoice.invoiceNo", {
            type: "manual",
            message: error.message,
          });
        }
      }
    },
    [setError],
  );

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-4 p-4 shadow-[0_0.5em_1.5em_-0.5em_rgba(0,0,0,0.5)]"
        onSubmit={handleSubmit(onSubmit)}
        id="invoice-form"
      >
        <div>
          <Button
            type="submit"
            className="hidden"
            id={DOM_ID.SAVE_NEW_INVOICE}
          />
        </div>

        <div className="grid gap-y-2">
          <DatePickerField
            form={form}
            fieldName="invoice.invoiceDate"
            label="Invoice Date"
          />
          <DatePickerField
            form={form}
            fieldName="invoice.dueDate"
            label="Due Date"
          />
        </div>

        <div className="col-span-2">
          <InputField
            form={form}
            fieldName="invoice.invoiceNo"
            label="Invoice #"
            className="max-w-56"
          />
        </div>

        <div className="grid gap-y-2">
          <InputField
            form={form}
            fieldName="invoice.userName"
            label="From:"
            labelClassName="text-lg font-medium text-black"
          />

          <InputField
            form={form}
            fieldName="invoice.userNip"
            label="NIP/VAT ID:"
          />

          <InputField
            form={form}
            fieldName="invoice.userAddress"
            label="Address:"
          />
        </div>

        <div className="grid gap-y-2">
          <ClientCombobox
            form={form}
            fieldName="invoice.clientId"
            label="To:"
            labelClassName="text-lg font-medium text-black"
          />

          <InputField
            form={form}
            fieldName="invoice.clientNip"
            label="NIP/VAT ID:"
          />

          <InputField
            form={form}
            fieldName="invoice.clientAddress"
            label="Address:"
          />
        </div>

        <div className="col-span-2">
          <InvoiceTable
            form={
              form as unknown as UseFormReturn<{ details: InvoiceTableForm[] }>
            }
          />
        </div>
      </form>
    </Form>
  );
}
