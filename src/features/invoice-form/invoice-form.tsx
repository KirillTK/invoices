"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Combobox } from "~/shared/components/combobox";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
    id: "222313123123aa",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    id: "222313123123a23232",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    id: "222313123123a23232123131",
  },
];

interface InvoiceForm {
  clientId: string;
  userId: string;
}

export function InvoiceForm() {
  const { handleSubmit, watch, register } = useForm<InvoiceForm>();

  const formValues = watch();

  console.log(formValues, 'formValues');
  

  const onSubmit = useCallback((values: InvoiceForm) => {
    console.log(values, "values");
  }, []);

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Combobox options={frameworks} field={register('userId')} label="From:" />
      </div>
      <div>
      <Combobox options={frameworks} field={register('clientId')} label="Bill To:" />
      </div>
    </form>
  );
}
