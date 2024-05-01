"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Combobox } from "~/shared/components/combobox";

interface InvoiceForm {
  clientId: string;
  userId: string;
}

export function InvoiceForm() {
  const { handleSubmit } = useForm<InvoiceForm>();

  const onSubmit = useCallback((values: InvoiceForm) => {
    console.log(values, "values");
  }, []);

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Combobox />
      </div>
      <div>
        <p>Bill To</p>
      </div>
    </form>
  );
}
