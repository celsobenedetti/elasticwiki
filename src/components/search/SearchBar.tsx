import { useCallback, useEffect, useMemo, useState } from "react";
import { type SearchHit } from "@elastic/elasticsearch/lib/api/types";

import { HIGHLIGHT_TAG, type WikiDocument } from "@/lib/search";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { HeroIcon } from "@/components/HeroIcon";
import { HighlightedText } from "@/components/ParsedHighlightedText";
import InfoPopover from "@/components/InfoPopover";
import { AdvancedSearch } from "./advanced";

interface Props {
  query: string;
  setQuery: (query: string) => void;
  searchCallback: (query: string) => void;
  showIcons?: boolean;
  isHome?: boolean;
}

export default function SearchBar(props: Props) {
  const { query, setQuery, searchCallback, showIcons, isHome } = props;
  const [isFocused, setFocus] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const { data } = api.elastic.autocomplete.useQuery({ query: debouncedQuery });

  const acceptSuggestion = useCallback(
    (suggestion: string) => {
      if (suggestion.length == 0) return;
      setFocus(false);
      searchCallback(suggestion);
    },
    [searchCallback]
  );

  const suggestions = useMemo(() => data?.hits?.hits, [data]);
  const showSuggestions = !!suggestions && suggestions.length && isFocused;

  return (
    <div className="flex h-11 w-[calc(100%+1rem)] items-center justify-end">
      <div
        className={`absolute left-[-5px] top-0
            ${isHome ? "w-[calc(100%-1rem)]" : "w-[calc(100%-2rem)]"}
            overflow-visible border dark:border-slate-700 ${
              showSuggestions
                ? "rounded-b-3xl rounded-t-3xl shadow"
                : "rounded-full "
            }`}
      >
        <Command
          className="rounded-3xl hover:shadow"
          shouldFilter={false}
          loop={true}
        >
          <div className="relative border-b shadow">
            <CommandInput
              value={query}
              className="pr-14"
              onValueChange={setQuery}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 300)}
              onKeyDown={(e) => {
                setFocus(true);
                if (e.key === "Enter" && !showSuggestions) {
                  searchCallback(query);
                }
              }}
            />
            {showIcons && (
              <div className="absolute bottom-0 right-7 top-0 my-auto flex sm:gap-3">
                {Boolean(query) && <ClearX />}
                <SearchIcon />
              </div>
            )}
          </div>

          <CommandSuggestions />
        </Command>
      </div>
      <div className="ml-12 flex h-full items-center">
        {isHome ? <InfoPopover /> : <AdvancedSearch searchQuery={query} />}
      </div>
    </div>
  );

  function CommandSuggestions() {
    if (!showSuggestions) return;

    return (
      <CommandGroup className="w-full overflow-visible  border-x border-b bg-background pt-2">
        {suggestions.map(SuggestionItem)}

        <div className="flex w-full items-center">
          <Button
            onClick={() => searchCallback(query)}
            variant="secondary"
            className="z-10 m-2 mx-auto h-7 w-1/2"
          >
            Search
          </Button>
        </div>
      </CommandGroup>
    );
  }
  function SuggestionItem(doc: SearchHit<WikiDocument>) {
    const highlight = doc?.highlight?.title?.at(0) || "";
    const content = highlight.includes(HIGHLIGHT_TAG)
      ? highlight
      : doc._source?.title;

    return (
      <CommandItem
        onSelect={(suggestion: string) => {
          setFocus(false);
          searchCallback(suggestion);
        }}
        onClick={() => acceptSuggestion(doc._source?.title ?? "")}
        className="cursor-pointer"
        key={doc._id}
      >
        <HeroIcon
          shape="magnifyingGlass"
          className="mr-2 h-4 w-4 cursor-pointer text-slate-500"
        />
        <HighlightedText
          className="suggestion-highlight not-italic"
          text={content || ""}
        />
      </CommandItem>
    );
  }

  function SearchIcon() {
    return (
      <button
        className="my-auto h-5 w-5 min-w-fit cursor-pointer border-l border-l-slate-200 pl-3 dark:border-l-slate-700"
        onClick={() => searchCallback(query)}
      >
        <HeroIcon
          shape="magnifyingGlass"
          className="h-5 w-5 cursor-pointer text-indigo-500"
        />
      </button>
    );
  }

  function ClearX() {
    return (
      <button onClick={() => setQuery("")}>
        <HeroIcon
          shape="x"
          className=" bottom-0 right-2 top-0 my-auto h-5 w-5 text-slate-400"
        />
      </button>
    );
  }
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
