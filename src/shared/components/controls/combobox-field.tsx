import type { UncontrolledControlProps } from "../../types/form";
import { Combobox, type Props as ComboboxProps } from "../combobox";
import type { FieldValues } from "react-hook-form";
import { BaseField } from './base-field';

interface Props<T extends FieldValues>
  extends UncontrolledControlProps<T>,
    Omit<ComboboxProps, "onChange" | "value" | "name"> {}

export const ComboboxField = <T extends FieldValues>(props: Props<T>) => {
  return (
    <BaseField
      {...props}
      renderInput={(field, newProps) => (
        <Combobox {...newProps} {...field} options={props.options} />
      )}
    />
  );
};
