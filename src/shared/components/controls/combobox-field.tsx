import { useField } from "~/shared/hooks/form";
import { cn } from "~/shared/utils";
import type { UncontrolledInputProps } from "../../types/form";
import { Label } from "../label";
import { useCallback } from "react";
import { Combobox } from '../combobox';
import type { Props as ComboboxProps } from '../combobox';

interface Props extends Omit<ComboboxProps, 'onChange' | 'value' | 'name'> {
  field: UncontrolledInputProps;
  initialValue?: string;
}

export const ComboboxField = ({
  field,
  initialValue,
  label,
  ...rest
}: Props) => {
  const { onChange, value } = useField<string | undefined>(field, {
    initialValue,
  });

  const handleChange = useCallback(
    (value?: string) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <div className={cn("flex flex-col justify-center space-y-2")}>
      {label && (
        <Label className="text-sm font-normal text-gray-500">{label}</Label>
      )}
      <Combobox onChange={handleChange} value={value} name={field.name} {...rest} />
    </div>
  );
};
