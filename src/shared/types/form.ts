import type { FieldValues, Path, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";

// TODO: need to be removed
export type UncontrolledInputProps = UseFormRegisterReturn<string>;

export type Option = { id?: string; label: string; value: string };

export interface UncontrolledControlProps<T extends FieldValues> {
  label?: string;
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}
