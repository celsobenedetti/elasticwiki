import { type RouterOutputs, api } from "@/lib/api";
import { useEffect } from "react";
import { create } from "zustand";

type SearchOutput = RouterOutputs["elastic"]["search"] | undefined;

interface SearchStore {
  results: SearchOutput;
  setResults: (results: SearchOutput) => void;
  searchQuery: string;
  doSearch: (query: string) => void;
}

export const useSearch = create<SearchStore>((set) => ({
  results: undefined,
  setResults: (results: SearchOutput) => set({ results }),
  searchQuery: "",
  doSearch: (query: string) => {
    if (query) set({ searchQuery: query });
  },
}));

export const SearchProvider = () => {
  const { setResults, searchQuery } = useSearch();

  const { data } = api.elastic.search.useQuery(
    { query: searchQuery },
    { enabled: Boolean(searchQuery) }
  );

  useEffect(() => {
    setResults(data);
  }, [data, setResults]);

  return <></>;
};
