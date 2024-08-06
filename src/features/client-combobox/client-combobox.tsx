"use client";
import { useCallback, useMemo } from "react";
import { Button } from "~/shared/components/button";
import { ComboboxField } from "~/shared/components/controls/combobox-field";
import type { Option, UncontrolledInputProps } from "~/shared/types/form";
import { useClientQuery } from "~/entities/client/api";

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

  const createNewClient = useCallback(() => {
    console.log("click");
  }, []);

  const emptyOption = useMemo(
    () => <Button onClick={createNewClient}>Create New Client</Button>,
    [createNewClient],
  );

  return (
    <ComboboxField options={options} field={field} emptyOption={emptyOption} />
  );
};
