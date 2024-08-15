import {
  type Path,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FormField, FormItem, FormLabel, FormControl } from "../form";
import { Input } from "../input";
import { ErrorField } from "./error-field";

interface Props<T extends FieldValues> {
  label?: string;
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function InputFieldNew<T extends FieldValues = FieldValues>({
  label,
  form,
  fieldName,
  className,
  labelClassName,
  inputClassName,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <div className={inputClassName}>
              <Input {...field} />
              <ErrorMessage
                name={fieldName as never}
                errors={form.formState.errors ?? {}}
                as={ErrorField}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
