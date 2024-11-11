import type { Option } from "../types/form";
import { unitEnum } from "~/server/db/schema";

export const UNIT_OPTIONS: Option<(typeof unitEnum.enumValues)[0]>[] = [
  {
    id: unitEnum.enumValues[0],
    label: "Per/hours",
    value: "PER_HOURS",
  },
];
