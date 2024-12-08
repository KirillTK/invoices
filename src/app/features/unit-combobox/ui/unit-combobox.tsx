"use client";
import { ComboboxField } from "~/shared/components/controls/combobox-field";
import type { Option, UncontrolledControlProps } from "~/shared/types/form";
import { type FieldValues } from 'react-hook-form';
import { useUnitQuery } from '~/entities/unit/api/unit.api';

type Props<T extends FieldValues> = UncontrolledControlProps<T>

export const UnitCombobox = <T extends FieldValues>({ form, fieldName, ...rest }: Props<T>) => {
  const { units } = useUnitQuery();

  const options: Option<number>[] = (units || []).map((unit) => ({
    id: unit.id.toString(),
    label: unit.name,
    value: unit.id,
  }));

  return (
    <ComboboxField
      options={options}
      form={form}
      fieldName={fieldName}
      placeholder="Select unit"
      {...rest}
    />
  );
};
