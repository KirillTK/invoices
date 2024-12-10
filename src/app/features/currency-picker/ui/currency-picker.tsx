'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, Plus } from "lucide-react"
import { cn } from '~/shared/utils'
import { Button } from '~/shared/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/shared/components/dropdown-menu'
import { useCurrencyQuery } from '~/entities/currency/api/currency.api'
import type { Path, FieldValues } from 'react-hook-form'
import { type UncontrolledControlProps } from '~/shared/types/form'
import { BaseField } from '~/shared/components/controls/base-field'

type Props<T extends FieldValues> = UncontrolledControlProps<T>;

const MAX_CURRENCIES_TO_SHOW = 3;

const DEFAULT_CURRENCY = 'USD';

export function CurrencyPicker<T extends FieldValues>(props: Props<T>) {
  const [selectedCurrencies, setSelectedCurrencies] = useState([DEFAULT_CURRENCY]);
  const selectedCurrencyIds = useRef<string[]>([]);
  const { currencies, isLoading } = useCurrencyQuery();

  const handleSelect = (currentValue: string) => {
    setSelectedCurrencies((prev) => {
      const newSelection = prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue]
      
      return newSelection;
    });
  }

  useEffect(() => {
    const currencyId = currencies.find(({ code }) => code === DEFAULT_CURRENCY)?.id;

    if(currencyId) {
      props.form.setValue(props.fieldName, [currencyId] as unknown as T[Path<T>]);
      selectedCurrencyIds.current = [currencyId];
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(currencies)]);


  return (
    <BaseField
      {...props}
      renderInput={(field) => (
        <div className="flex items-center space-x-1">
          {selectedCurrencies.map((currency) => (
            <Button
              key={currency}
              variant="outline"
              className={cn(
                "px-2 py-1 h-8 text-sm",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                const currencyId = currencies.find(({ symbol }) => symbol === currency)?.id;
                // handleSelect(currency);
                field.onChange(currencyId);
              }}
              disabled={isLoading}
            >
              {currencies.find(c => c.code === currency)?.symbol}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {selectedCurrencies.length < MAX_CURRENCIES_TO_SHOW && (
                <Button 
                  variant="outline" 
                  className={cn(
                    "px-2 py-1 h-8",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currencies.filter(c => !selectedCurrencies.includes(c.code)).map((currency) => (
                <DropdownMenuItem
                  key={currency.id}
                  onSelect={() => {
                    console.log(currency);
                    
                    handleSelect(currency.code);
                    field.onChange(selectedCurrencies);
                  }}
                  disabled={isLoading}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCurrencies.includes(currency.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {currency.name} - {currency.symbol}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    />
  )
}