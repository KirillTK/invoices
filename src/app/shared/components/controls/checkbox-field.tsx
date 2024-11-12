import type { UncontrolledControlProps } from "../../types/form";
import type { FieldValues } from "react-hook-form";
import { BaseField } from "./base-field";
import { Checkbox } from '../checkbox';
import { type ReactNode } from 'react';
import { Label } from '../label';

type Props<T extends FieldValues> = UncontrolledControlProps<T> & { id: string, children: ReactNode };

export const CheckboxField = <T extends FieldValues = FieldValues>(
  props: Props<T>,
) => {
  return (
    <BaseField
      {...props}
      renderInput={(field, inputProps) => {
        return (
          <div className="flex items-center space-x-2">
            <Checkbox {...inputProps} {...field} onCheckedChange={field.onChange} defaultChecked={field.value} />
            <Label htmlFor={props.id}>{props.children}</Label>
          </div>
        )
      }}
    />
  );
};
