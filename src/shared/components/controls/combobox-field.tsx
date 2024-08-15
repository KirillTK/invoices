import { cn } from "~/shared/utils";
import type { UncontrolledControlProps } from "../../types/form";
import { Combobox, type Props as ComboboxProps } from "../combobox";
import type { FieldValues } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FormField, FormItem, FormLabel, FormControl } from "../form";
import { ErrorField } from "./error-field";

interface Props<T extends FieldValues>
  extends UncontrolledControlProps<T>,
    Omit<ComboboxProps, "onChange" | "value" | "name"> {}

export const ComboboxField = <T extends FieldValues>({
  form,
  fieldName,
  label,
  className,
  labelClassName,
  inputClassName,
  options,
  ...rest
}: Props<T>) => {
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
              <Combobox options={options} {...field} {...rest} />
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
};
