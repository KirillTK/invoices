import { type FieldValues } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FormField, FormItem, FormLabel, FormControl } from "../form";
import { Input } from "../input";
import { ErrorField } from "./error-field";
import { cn } from "~/shared/utils";
import type { UncontrolledControlProps } from "~/shared/types/form";

type Props<T extends FieldValues> = UncontrolledControlProps<T>

export function InputField<T extends FieldValues = FieldValues>({
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
          {label && (
            <FormLabel
              className={cn(
                "text-sm font-normal text-gray-500",
                labelClassName,
              )}
            >
              {label}
            </FormLabel>
          )}
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
