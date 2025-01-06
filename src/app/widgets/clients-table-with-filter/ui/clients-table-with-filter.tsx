"use client";
import { useState } from "react";
import { useDeferredValue } from "react";
import { ClientsTable } from "~/features/clients-table/ui/clients-table";
import { SearchInput } from "~/features/search-input/ui/search-input";

export const ClientsTableWithFilter = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <SearchInput
        value={query}
        placeholder="Search clients..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <ClientsTable query={deferredQuery} setGlobalFilter={setQuery} />
    </>
  );
};
