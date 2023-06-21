import { type RouterOutputs, api } from "@/lib/api";
import { useEffect } from "react";
import { create } from "zustand";

type SearchOutput = RouterOutputs["elastic"]["search"] | undefined;

interface SearchStore {
  results: SearchOutput;
  setResults: (results: SearchOutput) => void;
  query: string;
  doSearch: (query: string) => void;
}

export const useSearch = create<SearchStore>((set) => ({
  results: undefined,
  setResults: (results: SearchOutput) => set({ results }),
  query: "",
  doSearch: (query: string) => {
    if (query) set({ query });
  },
}));

export const SearchProvider = () => {
  const { setResults, query } = useSearch();

  const { data } = api.elastic.search.useQuery(
    { query },
    { enabled: Boolean(query) }
  );

  useEffect(() => {
    setResults(data);
  }, [data, setResults]);

  return <></>;
};
