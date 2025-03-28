"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { ClientCombobox } from "~/features/client-combobox";
import {
  EMPTY_INVOICE_ROW_TABLE,
  InvoiceTable,
} from "./components/invoice-table";
import type { InvoiceTableForm } from "./components/invoice-table";
import { DatePickerField } from "~/shared/components/controls/date-picker-field";
import { useClientQuery } from "~/entities/client/api/client.api";
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
import { useToast } from "~/shared/components/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/components/card/card';
import { CheckboxField } from '~/shared/components/controls/checkbox-field';

export type InvoiceFormValues = z.infer<typeof invoiceDocumentSchema>;

type Props = {
  defaultValues?: InvoiceFormValues;
  disableFormByDefault?: boolean;
  submit: (values: InvoiceFormValues) => Promise<Response | undefined>;
  shouldUnregister?: boolean;
};

export function InvoiceForm({
  defaultValues,
  submit,
  disableFormByDefault = false,
  shouldUnregister = true,
}: Props) {
  const { toast } = useToast();

  const router = useRouter();

  const [isFormDisabled] = useState(disableFormByDefault);

  const form = useForm<InvoiceFormValues>({
    defaultValues: defaultValues ?? { details: [EMPTY_INVOICE_ROW_TABLE] },
    resolver: zodResolver(invoiceDocumentSchema),
    mode: "onBlur",
    shouldUnregister,
  });

  const { handleSubmit, watch, setValue, setError, getValues } = form;

  console.log(watch());

  const { clients } = useClientQuery();

  const selectedClientId = watch("invoice.clientId");  

  const isVatInvoice = watch("invoice.vatInvoice");
  
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(({ id }) => id === selectedClientId);

      if (client) {
        setValue("invoice.clientNip", client.taxIndex);
        setValue("invoice.clientAddress", client.address);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(clients), selectedClientId, setValue]);

  const onSubmit = useCallback(
    async () => {
      try {        
        const response = await submit(getValues());

        if(!response) throw new Error("Failed to process request");

        if (!response.ok) throw await response.json();

        const { invoiceId } = (await response.json()) as { invoiceId: string };

        if(invoiceId) {
          router.push(`/invoices/${invoiceId}`);
        }
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

          toast({ title: error.message, variant: "destructive" });
        }
      }
    },
    [setError, toast, router, submit, getValues],
  );

  return (
    <Form {...form}>
      <fieldset disabled={isFormDisabled}>
        <form
          className="grid grid-cols-2 gap-4 p-4"
          onSubmit={handleSubmit(onSubmit)}
          id="invoice-form"
        >
          <div>
            <Button
              type="submit"
              className="hidden"
              disabled={false}
              id={DOM_ID.SAVE_NEW_INVOICE}
            />
          </div>


          <div className="col-span-2 flex space-x-4">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Invoice Details</CardTitle>
              <CheckboxField form={form} id="vatInvoice" fieldName="invoice.vatInvoice">
                VAT invoice
              </CheckboxField>
            </CardHeader>
            <CardContent>
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
                <InputField
                  form={form}
                  fieldName="invoice.invoiceNo"
                  label="Invoice #"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>From (Your Information)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-y-2">
                <InputField
                  form={form}
                  fieldName="invoice.userName"
                  label="Name:"
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
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>To (Client Information)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-y-2">
                <ClientCombobox
                  form={form}
                  fieldName="invoice.clientId"
                  label="Name:"
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
            </CardContent>
          </Card>
          </div>
          <div className="col-span-2">
            <InvoiceTable
              form={
                form as unknown as UseFormReturn<{
                  details: InvoiceTableForm[];
                }>
              }
              disabled={isFormDisabled}
              vatInvoice={isVatInvoice}
            />
          </div>

          <div className="col-span-2 flex space-x-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Bank Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-y-2">
                  <InputField
                    form={form}
                    fieldName="invoice.bankAccount"
                    label="Bank Account:"
                  />
                  <DatePickerField
                    form={form}
                    fieldName="invoice.paymentDate"
                    label="Payment Date"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex-1"></div>
            <div className="flex-1"></div>
          </div>
        </form>
      </fieldset>
    </Form>
  );
}
