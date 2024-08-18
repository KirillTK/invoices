import { type FieldValues } from "react-hook-form";
import { Input } from "../input";
import type { UncontrolledControlProps } from "~/shared/types/form";
import { BaseField } from "./base-field";
import type { ChangeEvent } from "react";

type Props<T extends FieldValues> = UncontrolledControlProps<T> & {
  disabled?: boolean;
  type?: "text" | "number";
  manualChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function InputField<T extends FieldValues = FieldValues>({
  manualChange,
  ...restProps
}: Props<T>) {
  return (
    <BaseField
      {...restProps}
      renderInput={(field, renderProps) => (
        <Input
          {...renderProps}
          {...field}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            field.onChange(event);
            if (manualChange) {
              manualChange(event);
            }
          }}
        />
      )}
    />
  );
}
