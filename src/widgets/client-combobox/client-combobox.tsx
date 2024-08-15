"use client";
import { useMemo } from "react";
import { ComboboxField } from "~/shared/components/controls/combobox-field";
import type { Option, UncontrolledControlProps } from "~/shared/types/form";
import { useClientQuery } from "~/entities/client/api";
import { NewClientModal } from "~/features/new-client-modal";
import { type FieldValues } from 'react-hook-form';

type Props<T extends FieldValues> = UncontrolledControlProps<T>


// TODO: move to feature folder
export const ClientCombobox = <T extends FieldValues>({ form, fieldName, ...rest }: Props<T>) => {
  const { clients } = useClientQuery();

  const options: Option[] = (clients || []).map((client) => ({
    id: client.id,
    label: client.name,
    value: client.id,
  }));

  const topElement = useMemo(() => <NewClientModal buttonClassName="my-2 w-full" />, []);

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
