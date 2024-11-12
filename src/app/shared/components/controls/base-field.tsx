import type { ReactElement } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { get, type ControllerRenderProps, type FieldValues, type Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "../form";
import { ErrorField } from "./error-field";
import type { UncontrolledControlProps } from "~/shared/types/form";
import { cn } from "~/shared/utils";

export interface Props<T extends FieldValues> extends UncontrolledControlProps<T> {
  disabled?: boolean;
  renderInput: (
    field: ControllerRenderProps<T, Path<T>>,
    rest?: Record<string, unknown>,
  ) => ReactElement;
}

export function BaseField<T extends FieldValues = FieldValues>({
  form,
  fieldName,
  className,
  label,
  labelClassName,
  inputClassName,
  renderInput,
  disabled,
  ...rest
}: Props<T>) {
  const hasError = !!get(form.formState.errors, fieldName);

  return (
    <FormField
      control={form.control}
      disabled={disabled}
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
            <div
              className={cn(
                inputClassName,
                'relative',
                hasError && "[&>*:first-child]:border-red-500",
                hasError && "[&>*:first-child]:border-2",
                hasError && "[&>*:first-child]:rounded-md"
              )}
            >
              {renderInput(field, rest)}
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
