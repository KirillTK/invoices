"use client";

import { MinusCircleIcon, PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "~/shared/components/button";
import { InputField } from "~/shared/components/controls/input-field";
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
  totalNetPrice: number;
  vat: number;
  vatAmount: number;
  totalGrossPrice: number;
}

const defaultRow: InvoiceTableForm = {
  description: "",
  unit: "",
  quantity: 0,
  uniqNetPrice: 0,
  totalNetPrice: 0,
  vat: 0,
  vatAmount: 0,
  totalGrossPrice: 0,
};

export function InvoiceTable() {
  const [showAddLineBtn, setShowAddLineBtn] = useState(false);

  const [removeLineBtn, setShowRemoveLineBtn] = useState<
    Record<string, boolean>
  >({});

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
    append(defaultRow);
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
                  field={control.register(`invoice.${index}.description`)}
                />
              </TableCell>
              <TableCell>
                <InputField
                  field={control.register(`invoice.${index}.unit`)}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <InputField
                  field={control.register(`invoice.${index}.quantity`)}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <InputField
                  field={control.register(`invoice.${index}.uniqNetPrice`)}
                />
              </TableCell>
              <TableCell>
                <span>{item.totalNetPrice}</span>
              </TableCell>
              <TableCell>
                <InputField
                  field={control.register(`invoice.${index}.vat`)}
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
