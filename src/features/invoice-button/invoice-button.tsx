"use client";

import { useCallback } from "react";
import { type VariantProps } from "class-variance-authority";
import { Button } from "~/shared/components/button";
import type { buttonVariants } from "~/shared/components/button/button";


interface Props {
  action: string;
  title: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export function InvoiceButton({ action, title, variant = "default" }: Props) {
  const handleClick = useCallback(() => {
    const saveFormBtn = document.getElementById(action) as
      | HTMLButtonElement
      | undefined;

    if (saveFormBtn) {
      saveFormBtn.click();
    }
  }, [action]);

  return (
    <Button variant={variant} onClick={handleClick}>
      {title}
    </Button>
  );
}
