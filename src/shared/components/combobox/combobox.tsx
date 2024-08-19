"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn, isFalsyValueButNotZero } from "~/shared/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command/command";
import type { Option } from "~/shared/types/form";
import { Label } from "../label";

export interface Props {
  options: Option<unknown>[];
  placeholder?: string;
  label?: string;
  className?: string;
  value?: string;
  name: string;
  onChange: (value?: string) => void;
  emptyOption?: string | React.ReactNode;
  topElement?: string | React.ReactNode;
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
  topElement,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleChange = React.useCallback(
    (selectedLabel: string) => {
      const value = options.find(({ label }) => label === selectedLabel)?.value;

      const safeValue = value ? String(value) : undefined;

      onChange(safeValue);
      setOpen(false);
    },
    [setOpen, onChange, options],
  );

  return (
    <div className={cn("flex flex-col justify-center space-y-4", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {isFalsyValueButNotZero(value) && value !== undefined
              ? options.find((option) => option.value == value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              {topElement}
              <CommandEmpty>{emptyOption}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id ?? option.label}
                    value={option.label} // https://github.com/shadcn-ui/ui/issues/458
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
