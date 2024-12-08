

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "~/shared/utils/fetcher";
import type { UnitModel } from "../model/unit.model";

export function useUnitQuery() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['units'],
    queryFn: () => fetcher<UnitModel[]>("/api/unit"),
  })

  return {
    units: data ?? [],
    error,
    isLoading,
  };
}
