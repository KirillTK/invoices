import { type ChangeEventHandler, useCallback } from "react";
import { useField } from "~/shared/hooks/form";
import { cn } from "~/shared/utils";
import type { UncontrolledInputProps } from "~/shared/types/form";
import { Label } from "../label";
import { Input } from "../input";

interface Props {
  field: UncontrolledInputProps;
  initialValue?: string;
  className?: string;
  containerClassName?: string;
  label?: string;
  type?: "text" | "number";
}

export const InputField = ({
  field,
  initialValue,
  label,
  type = "text",
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
      <FormMessage/>
      <Input onChange={handleChange} value={value} type={type} {...rest} />
    </div>
  );
};
