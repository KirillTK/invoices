"use client";

import type { z } from "zod";
import { MinusCircleIcon, PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
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
import { UNIT_OPTIONS } from '~/shared/constants/unit.const';

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
  form: UseFormReturn<{ details: InvoiceTableForm[] }>;
}

export function InvoiceTable({ form }: Props) {
  const [showAddLineBtn, setShowAddLineBtn] = useState(false);

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
      remove(index);
    },
    [remove],
  );

  return (
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
          <TableHead>VAT rate</TableHead>
          <TableHead>VAT amount</TableHead>
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
                />
              </TableCell>
              <TableCell>
                <InputField
                  form={form}
                  fieldName={`details.${index}.unitPrice`}
                />
              </TableCell>
              <TableCell>
                <span>{item.totalNetPrice}</span>
              </TableCell>
              <TableCell>
                <InputField
                  form={form}
                  fieldName={`details.${index}.vat`}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <span>{item.vatAmount}</span>
              </TableCell>
              <TableCell>
                <span>{item.totalGrossPrice}</span>

                {removeLineBtn[item.id] && fields.length > 1 && (
                  <MinusCircleIcon onClick={removeLine(index)} />
                )}
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell colSpan={9}>
            <animated.div style={addRowButtonStyles}>
              <Button variant="destructive" className="w-full" onClick={addRow}>
                <PlusIcon />
                Add More
              </Button>
            </animated.div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
