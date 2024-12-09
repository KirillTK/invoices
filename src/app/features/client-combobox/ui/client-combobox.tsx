"use client";
import { useMemo } from "react";
import { ComboboxField } from "~/shared/components/controls/combobox-field";
import type { Option, UncontrolledControlProps } from "~/shared/types/form";
import { useClientQuery } from "~/entities/client/api/client.api";
import { type FieldValues } from 'react-hook-form';
import { ClientModal } from "../components/client-modal";
import { twMerge } from 'tailwind-merge';

type Props<T extends FieldValues> = UncontrolledControlProps<T>

export const ClientCombobox = <T extends FieldValues>({ form, fieldName, ...rest }: Props<T>) => {
  const { clients } = useClientQuery();

  const options: Option<string>[] = (clients || []).map((client) => ({
    id: client.id,
    label: client.name,
    value: client.id,
  }));

  const topElement = useMemo(() => <ClientModal buttonClassName={twMerge('flex w-[140px] mx-auto my-[10px]')} />, []);

  return (
    <ComboboxField
      options={options}
      form={form}
      fieldName={fieldName}
      topElement={topElement}
      placeholder="Select client"
      {...rest}
    />
  );
};
