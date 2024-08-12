"use client";
import { useMemo } from "react";
import { ComboboxField } from "~/shared/components/controls/combobox-field";
import type { Option, UncontrolledInputProps } from "~/shared/types/form";
import { useClientQuery } from "~/entities/client/api";
import { NewClientModal } from "~/features/new-client-modal";

interface Props {
  field: UncontrolledInputProps;
}

export const ClientCombobox = ({ field }: Props) => {
  const { clients } = useClientQuery();
  

  const options: Option[] = (clients || []).map((client) => ({
    id: client.id,
    label: client.name,
    value: client.id,
  }));

  const emptyOption = useMemo(() => <NewClientModal />, []);

  return (
    <ComboboxField
      options={options}
      field={field}
      emptyOption={emptyOption}
      placeholder="Select client"
    />
  );
};
