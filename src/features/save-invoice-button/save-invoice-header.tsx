"use client";

import { useCallback } from "react";
import { Button } from "~/shared/components/button";
import { DOM_ID } from "~/shared/constants/dom-id.const";

export function SaveInvoiceButton() {
  const saveInvoiceBtn = useCallback(() => {
    const saveFormBtn = document.getElementById(DOM_ID.SAVE_NEW_INVOICE) as
      | HTMLButtonElement
      | undefined;

    if (saveFormBtn) {
      saveFormBtn.click();
    }
  }, []);

  return (
    <Button variant="outline" onClick={saveInvoiceBtn}>
      Save Invoice
    </Button>
  );
}
