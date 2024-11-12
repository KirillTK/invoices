import type { UncontrolledControlProps } from "../../types/form";
import { Combobox, type Props as ComboboxProps } from "../combobox";
import type { FieldValues } from "react-hook-form";
import { BaseField } from "./base-field";

interface Props<T extends FieldValues>
  extends UncontrolledControlProps<T>,
    Omit<ComboboxProps, "onChange" | "value" | "name"> {
  manualChange?: (value?: string) => void;
}

export const ComboboxField = <T extends FieldValues>({
  manualChange,
  ...restProps
}: Props<T>) => {
  return (
    <BaseField
      {...restProps}
      renderInput={(field, newProps) => (
        <Combobox
          {...newProps}
          {...field}
          options={restProps.options}
          onChange={(event) => {
            field.onChange(event);

            if (manualChange) {
              manualChange(event);
            }
          }}
        />
      )}
    />
  );
};
