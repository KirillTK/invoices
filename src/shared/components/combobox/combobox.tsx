"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "~/shared/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../command/command";
import type { Option, UncontrolledInputProps } from "~/shared/types/form";
import { Label } from '../label';

interface Props {
  options: Option[];
  field: UncontrolledInputProps;
  initialValue?: string;
  placeholder?: string;
  label?: string;
}

export function Combobox({ options, field, placeholder, initialValue, label }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    void field.onChange({
      target: {
        value: initialValue,
        name: field.name,
      },
    });
    setValue(initialValue);
  }, []);

  return (
    <div className="flex flex-col space-y-4 justify-center">
      {label && <Label>Accept terms and conditions</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id ?? option.value}
                  value={option.value}
                  onSelect={async (currentValue) => {
                    await field.onChange({
                      target: {
                        value: currentValue,
                        name: field.name,
                      },
                    });

                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
