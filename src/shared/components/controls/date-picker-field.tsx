import { cn } from "~/shared/utils";
import type { UncontrolledControlProps } from "../../types/form";
import { DatePicker } from "../date-picker";
import type { FieldValues } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FormField, FormItem, FormLabel, FormControl } from "../form";
import { ErrorField } from "./error-field";
import { BaseField } from "./base-field";

type Props<T extends FieldValues> = UncontrolledControlProps<T>;

export const DatePickerField = <T extends FieldValues = FieldValues>(
  props: Props<T>,
) => {
  return (
    <BaseField
      {...props}
      renderInput={(field, props) => <DatePicker {...props} {...field} />}
    />
  );
};
