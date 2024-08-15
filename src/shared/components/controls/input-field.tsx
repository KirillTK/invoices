import { type FieldValues } from "react-hook-form";
import { Input } from "../input";
import type { UncontrolledControlProps } from "~/shared/types/form";
import { BaseField } from "./base-field";

type Props<T extends FieldValues> = UncontrolledControlProps<T> & {
  disabled?: boolean;
  type?: "text" | "number";
};

export function InputField<T extends FieldValues = FieldValues>(
  props: Props<T>,
) {
  return (
    <BaseField
      {...props}
      renderInput={(field, props) => <Input {...props} {...field} />}
    />
  );
}
