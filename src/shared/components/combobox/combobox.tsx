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
import type { Option } from "~/shared/types/form";
import { Label } from "../label";

export interface Props {
  options: Option[];
  placeholder?: string;
  label?: string;
  className?: string;
  value?: string;
  name: string;
  onChange: (value: string) => void;
  emptyOption?: string | React.ReactNode;
}

export function Combobox({
  options,
  placeholder,
  name,
  label,
  className,
  value,
  onChange,
  emptyOption = "No option found.",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleChange = React.useCallback(
    (newValue: string) => {
      onChange(newValue);
      setOpen(false);
    },
    [setOpen, onChange],
  );

  return (
    <div className={cn("flex flex-col justify-center space-y-4", className)}>
      {label && <Label>Accept terms and conditions</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>{emptyOption}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id ?? option.value}
                  value={option.value}
                  onSelect={handleChange}
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
