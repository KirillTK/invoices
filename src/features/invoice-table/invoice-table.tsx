"use client";

import { MinusCircleIcon, PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "~/shared/components/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "~/shared/components/table/table";

interface InvoiceTableForm {
  description: string;
  unit: string;
  quantity: number;
  uniqNetPrice: number;
  vat: number;
}

const defaultRow: InvoiceTableForm = {
  description: "",
  unit: "",
  quantity: 0,
  uniqNetPrice: 0,
  vat: 0,
};

export function InvoiceTable() {
  const [showAddLineBtn, setShowAddLineBtn] = useState(false);

  const [showRemoveLineBtn, setShowRemoveLineBtn] = useState(false);

  const { control } = useForm<{ invoice: InvoiceTableForm[] }>({
    defaultValues: { invoice: [defaultRow] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoice",
  });

  const handleMouseEnterTable = useCallback(() => {
    setShowAddLineBtn(true);
  }, [setShowAddLineBtn]);

  const handleMouseLeaveTable = useCallback(() => {
    setShowAddLineBtn(false);
  }, [setShowAddLineBtn]);

  const handleMouseEnterTableRow = useCallback(() => {
    setShowRemoveLineBtn(true);
  }, [setShowRemoveLineBtn]);

  const handleMouseLeaveTableRow = useCallback(() => {
    setShowRemoveLineBtn(false);
  }, [setShowRemoveLineBtn]);

  const addRow = useCallback(() => {
    append(defaultRow);
  }, [append]);

  return (
    <Table
      onMouseEnter={handleMouseEnterTable}
      onMouseLeave={handleMouseLeaveTable}
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
              onMouseEnter={handleMouseEnterTableRow}
              onMouseLeave={handleMouseLeaveTableRow}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>111</TableCell>
              <TableCell>1111</TableCell>
              <TableCell className="flex space-x-1 align-center">
                <p>111</p>
                {showRemoveLineBtn && <MinusCircleIcon />}
              </TableCell>
            </TableRow>
          );
        })}

        {showAddLineBtn && (
          <TableRow>
            <TableCell colSpan={9}>
              <Button variant="destructive" className="w-full" onClick={addRow}>
                <PlusIcon />
                Add More
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
