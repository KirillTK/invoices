"use client";

import type { z } from "zod";
import { MinusCircleIcon, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/shared/components/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "~/shared/components/table/ui/table";
import { InputField } from "~/shared/components/controls/input-field";
import type { invoiceDetailsSchema } from "~/shared/schemas/invoice.schema";
import { InvoiceUtils } from "~/entities/invoice/lib/invoice";
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/components/card/card';
import { FormatterUtils } from '~/shared/utils/formatter';
import { MathUtils } from '~/shared/utils/math';
import { UnitCombobox } from '~/features/unit-combobox/ui/unit-combobox';

export interface InvoiceTableForm
  extends Omit<z.infer<typeof invoiceDetailsSchema>, "invoiceId"> {
  totalNetPrice: number;
  vat: number;
  vatAmount: number;
  totalGrossPrice: number;
}

export const EMPTY_INVOICE_ROW_TABLE: InvoiceTableForm = {
  description: "",
  unitId: 0,
  unitPrice: 0,
  quantity: 0,
  totalNetPrice: 0,
  vat: 0,
  vatAmount: 0,
  totalGrossPrice: 0,
};

interface Props {
  form: UseFormReturn<{ details: InvoiceTableForm[] }>;
  disabled: boolean;
  vatInvoice?: boolean;
}

export function InvoiceTable({ form, disabled, vatInvoice = false }: Props) {
  const [showAddLineBtn, setShowAddLineBtn] = useState(false);
  const { setValue, getValues, watch } = form;

  const [removeLineBtn, setShowRemoveLineBtn] = useState<
    Record<string, boolean>
  >({});

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  useEffect(() => {
    fields.forEach((_, index) => {
      calculateTotals(index);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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


    const vatPercent = MathUtils.divide(vat ?? 0, 100);

    const gross = InvoiceUtils.getTotalGrossPrice(+quantity, +unitPrice);

    let vatAmount = 0;

    vatAmount = vatPercent && vatInvoice ? InvoiceUtils.getVatAmount(+gross, vatPercent) : 0;
    

    const totalNetAmount = InvoiceUtils.getTotalNetPrice(gross, vatAmount);    

    setValue(`details.${index}.totalGrossPrice`, gross);
    setValue(`details.${index}.vatAmount`, vatAmount);
    setValue(`details.${index}.totalNetPrice`, totalNetAmount);
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>Invoice Items</CardTitle>
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
            <AnimatePresence>
              {fields.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={handleMouseEnterTableRow(item.id)}
                  onMouseLeave={handleMouseLeaveTableRow(item.id)}
                  className="tr"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <InputField
                      form={form}
                      fieldName={`details.${index}.description`}
                    />
                  </TableCell>
                  <TableCell>
                    <UnitCombobox
                      form={form}
                      fieldName={`details.${index}.unitId`}
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
                    <span>{FormatterUtils.fromNumberToMoney(watch(`details.${index}.totalNetPrice`))}</span>
                  </TableCell>
                  {vatInvoice && (
                    <>
                      <TableCell>
                        <InputField
                          form={form}
                          type="number"
                          fieldName={`details.${index}.vat`}
                          manualChange={() => calculateTotals(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <span>{FormatterUtils.fromNumberToMoney(watch(`details.${index}.vatAmount`))}</span>
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{FormatterUtils.fromNumberToMoney(watch(`details.${index}.totalGrossPrice`))}</span>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: removeLineBtn[item.id] && fields.length > 1 ? 1 : 0 }}
                      >
                        <MinusCircleIcon
                          onClick={removeLine(index)}
                          className="text-red-400 cursor-pointer"
                        />
                      </motion.div>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            <TableRow>
              <TableCell colSpan={9}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: showAddLineBtn ? 1 : 0,
                    y: showAddLineBtn ? 0 : 20 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    type="button" 
                    onClick={addRow}
                  >
                    <PlusIcon />
                    Add More
                  </Button>
                </motion.div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
