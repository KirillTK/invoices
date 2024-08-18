import type { Option } from "../types/form";
import { unitEnum } from "~/server/db/schema";

export const UNIT_OPTIONS: Option<(typeof unitEnum.enumValues)[0]>[] = [
  {
    id: unitEnum.enumValues[0],
    label: "Per/hours",
    value: "PER_HOURS",
  },
];

export const VAT_OPTIONS: Option<number>[] = [
  {
    label: "23%",
    value: 0.23,
  },
  {
    label: "8%",
    value: 0.08,
  },
  {
    label: "7%",
    value: 0.07,
  },
  {
    label: "5%",
    value: 0.05,
  },
  {
    label: "0%",
    value: 0,
  },
];
