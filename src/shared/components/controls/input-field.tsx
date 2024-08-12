import { type ChangeEventHandler, useCallback } from "react";
import { ErrorMessage } from '@hookform/error-message';
import { useField } from "~/shared/hooks/form";
import { cn } from "~/shared/utils";
import type { UncontrolledInputProps } from "~/shared/types/form";
import { Label } from "../label";
import { Input } from "../input";
import { ErrorField } from './error-field';

interface Props {
  field: UncontrolledInputProps;
  initialValue?: string;
  className?: string;
  containerClassName?: string;
  label?: string;
  type?: "text" | "number";
  errors?: Record<string, unknown>;
}

export const InputField = ({
  field,
  initialValue,
  label,
  type = "text",
  errors,
  containerClassName,
  ...rest
}: Props) => {
  const { onChange, value } = useField(field, { initialValue });

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div className={cn("flex flex-col justify-center space-y-2", containerClassName)}>
      {label && (
        <Label className="text-sm font-normal text-gray-500">{label}</Label>
      )}
      <Input onChange={handleChange} value={value} type={type} {...rest} />
      <ErrorMessage name={field.name} errors={errors ?? {}} as={ErrorField} />
    </div>
  );
};
