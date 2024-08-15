/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { cloneElement } from "react";
import { ErrorMessage } from "@hookform/error-message";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import type { UncontrolledControlProps } from "~/shared/types/form";
import { cn } from "~/shared/utils";
import { FormField, FormItem, FormLabel, FormControl } from "../form";
import { ErrorField } from "./error-field";
import { ReactElement, ReactNode } from "react";

// type Props<T extends FieldValues> = UncontrolledControlProps<T>;

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
            <div className={inputClassName}>
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
