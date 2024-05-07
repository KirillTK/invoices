import { useField } from "~/shared/hooks/form";
import { cn } from "~/shared/utils";
import type { UncontrolledInputProps } from "../../types/form";
import { DatePicker } from "../date-picker";
import { Label } from "../label";
import { useCallback } from "react";

interface Props {
  field: UncontrolledInputProps;
  initialValue?: Date;
  className?: string;
  label?: string;
}

export const DatePickerField = ({
  field,
  initialValue,
  label,
  ...rest
}: Props) => {
  const { onChange, value } = useField<Date | undefined>(field, {
    initialValue,
  });

  const handleChange = useCallback(
    (value?: Date) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <div className={cn("flex flex-col justify-center space-y-2")}>
      {label && (
        <Label className="text-sm font-normal text-gray-500">{label}</Label>
      )}
      <DatePicker onChange={handleChange} value={value} {...rest} />
    </div>
  );
};
