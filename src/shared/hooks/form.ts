import { useCallback, useState, useEffect } from "react";
import type { UncontrolledInputProps } from "../types/form";

interface Options<TValue> {
  initialValue?: TValue;
}

export const useField = <TValue>(
  field: UncontrolledInputProps,
  config: Options<TValue>,
) => {
  const [value, setValue] = useState(config.initialValue);

  useEffect(() => {
    void field.onChange({
      target: {
        value: config.initialValue,
        name: field.name,
      },
    });
    
    setValue(config.initialValue);
  }, []);

  const onChange = useCallback((value: TValue) => {
    void field.onChange({
      target: {
        value,
        name: field.name,
      },
    });

    setValue(value);
  }, []);

  return {
    value,
    onChange,
  };
};
