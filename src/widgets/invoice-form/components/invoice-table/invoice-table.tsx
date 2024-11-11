"use client";

import type { z } from "zod";
import { MinusCircleIcon, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { animated, useSpring } from "@react-spring/web";
import { Button } from "~/shared/components/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "~/shared/components/table/table";
import { InputField } from "~/shared/components/controls/input-field";
import type { invoiceDetailsSchema } from "~/shared/schemas/invoice.schema";
import { ComboboxField } from "~/shared/components/controls/combobox-field";
import { UNIT_OPTIONS, VAT_OPTIONS } from "~/shared/constants/option.const";
import { InvoiceUtils } from "~/entities/invoice/lib/invoice";
import { cn } from "~/shared/utils";
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/components/card/card';
import { CurrencyPicker } from '~/features/currency-picker';

export interface InvoiceTableForm
  extends Omit<z.infer<typeof invoiceDetailsSchema>, "invoiceId"> {
  totalNetPrice: number;
  vat: number;
  vatAmount: number;
  totalGrossPrice: number;
}

export const EMPTY_INVOICE_ROW_TABLE: InvoiceTableForm = {
  description: "",
  unit: UNIT_OPTIONS[0]!.value,
  unitPrice: 0,
  quantity: 0,
  totalNetPrice: 0,
  vat: 0,
  vatAmount: 0,
  totalGrossPrice: 0,
};

interface Props {
  form: UseFormReturn<{ details: InvoiceTableForm[]; invoice: { currencyId: string[] } }>;
  disabled: boolean;
  vatInvoice?: boolean;
}

export function InvoiceTable({ form, disabled, vatInvoice = false }: Props) {
  const [showAddLineBtn, setShowAddLineBtn] = useState(false);
  const { setValue, getValues, watch } = form;

  const [removeLineBtn, setShowRemoveLineBtn] = useState<
    Record<string, boolean>
  >({});

  const addRowButtonStyles = useSpring({
    opacity: showAddLineBtn ? 1 : 0,
    y: showAddLineBtn ? 0 : 20,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  useEffect(() => {
    fields.forEach((_, index) => {
      calculateTotals(index);
    });
  }, [vatInvoice, fields])

  const handleMouseEnterTable = useCallback(() => {
    setShowAddLineBtn(true);
  }, [setShowAddLineBtn]);

  const handleMouseLeaveTable = useCallback(() => {
    setShowAddLineBtn(false);
  }, [setShowAddLineBtn]);

  const handleMouseEnterTableRow = useCallback(
    (rowId: string) => () => {
      setShowRemoveLineBtn((prevState) => ({
        ...prevState,
        [rowId]: true,
      }));
    },
    [setShowRemoveLineBtn],
  );

  const handleMouseLeaveTableRow = useCallback(
    (rowId: string) => () => {
      setShowRemoveLineBtn((prevState) => ({
        ...prevState,
        [rowId]: false,
      }));
    },
    [setShowRemoveLineBtn],
  );

  const addRow = useCallback(() => {
    append(EMPTY_INVOICE_ROW_TABLE);
  }, [append]);

  const removeLine = useCallback(
    (index: number) => () => {
      if (disabled) return;

      remove(index);
    },
    [remove, disabled],
  );

  function calculateTotals(index: number) {
    const { quantity, unitPrice, vat } = getValues(`details.${index}`);

    const gross = InvoiceUtils.getTotalGrossPrice(+quantity, +unitPrice);

    const numberVat = +vat;
    let vatAmount = 0;

    vatAmount = numberVat && vatInvoice ? InvoiceUtils.getVatAmount(+gross, numberVat) : 0;
    

    const totalNetAmount = InvoiceUtils.getTotalNetPrice(gross, vatAmount);    

    setValue(`details.${index}.totalGrossPrice`, gross);
    setValue(`details.${index}.vatAmount`, vatAmount);
    setValue(`details.${index}.totalNetPrice`, totalNetAmount);
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>Invoice Items</CardTitle>
        <CurrencyPicker fieldName="invoice.currencyId" form={form} />
      </CardHeader>
      <CardContent>
        <Table
          onMouseEnter={handleMouseEnterTable}
          onMouseLeave={handleMouseLeaveTable}
          className="overflow-hidden"
        >
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit net price</TableHead>
              <TableHead>Total net price</TableHead>
              {vatInvoice && (
                <>
                  <TableHead>VAT rate</TableHead>
                  <TableHead>VAT amount</TableHead>
                </>
              )}
              <TableHead>Total gross price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((item, index) => {
              return (
                <TableRow
                  key={item.id}
                  onMouseEnter={handleMouseEnterTableRow(item.id)}
                  onMouseLeave={handleMouseLeaveTableRow(item.id)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <InputField
                      form={form}
                      fieldName={`details.${index}.description`}
                    />
                  </TableCell>
                  <TableCell>
                    <ComboboxField
                      options={UNIT_OPTIONS}
                      form={form}
                      fieldName={`details.${index}.unit`}
                      placeholder="Select Unit"
                    />
                  </TableCell>
                  <TableCell>
                    <InputField
                      form={form}
                      fieldName={`details.${index}.quantity`}
                      type="number"
                      manualChange={() => calculateTotals(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <InputField
                      form={form}
                      type="number"
                      fieldName={`details.${index}.unitPrice`}
                      manualChange={() => calculateTotals(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <span>{watch(`details.${index}.totalNetPrice`)}</span>
                  </TableCell>
                  {vatInvoice && (
                    <>
                      <TableCell>
                        <ComboboxField
                          options={VAT_OPTIONS}
                          form={form}
                          fieldName={`details.${index}.vat`}
                          placeholder="Select vat"
                          manualChange={() => calculateTotals(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <span>{watch(`details.${index}.vatAmount`)}</span>
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                    <span>{watch(`details.${index}.totalGrossPrice`)}</span>
                    <MinusCircleIcon
                      onClick={removeLine(index)}
                      className={cn("text-red-400", {
                        hidden: !removeLineBtn[item.id] || fields.length === 1,
                      })}
                    />
                    </div>
                    
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={9}>
                <animated.div style={addRowButtonStyles}>
                  <Button variant="destructive" className="w-full" type="button" onClick={addRow}>
                    <PlusIcon />
                    Add More
                  </Button>
                </animated.div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    
  );
}
