import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { api } from "@/lib/api";
import { useCallback, useMemo, useState } from "react";
import { HeroIcon } from "./HeroIcon";
import LoadingSpinner from "./LoadingSpinner";
import { Button } from "./ui/button";

interface Props {
  query: string;
  setQuery: (query: string) => void;
  searchCallback: (query: string) => void;
  showIcons?: boolean;
}

export default function SearchBar(props: Props) {
  const { query, setQuery, searchCallback, showIcons } = props;
  const [isFocused, setFocus] = useState(false);

  const { data, isFetching: isFetchingSuggestions } =
    api.elastic.autocomplete.useQuery(
      { query: query },
      { enabled: query.length > 1 }
    );

  const acceptSuggestion = useCallback(
    (suggestion: string) => {
      if (suggestion.length == 0) return;
      setFocus(false);
      searchCallback(suggestion);
    },
    [searchCallback]
  );

  const suggestions = useMemo(() => data?.hits?.hits, [data]);
  const showSuggestions = !!suggestions && isFocused;

  return (
    <div
      className={`absolute w-full overflow-visible border ${
        showSuggestions
          ? "rounded-b-3xl rounded-t-3xl shadow"
          : "rounded-full hover:shadow"
      }`}
    >
      <Command className="rounded-3xl">
        <div className="relative border-b shadow">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 300)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !showSuggestions) {
                searchCallback(query);
              }
            }}
          />
          {showIcons && (
            <div className="absolute bottom-0 right-7 top-0 my-auto flex gap-3">
              {Boolean(query) && <ClearX />}
              <SearchIcon />
            </div>
          )}
        </div>

        <CommandSuggestions />
      </Command>
    </div>
  );

  function CommandSuggestions() {
    if (isFetchingSuggestions) {
      return (
        <>
          <div className="flex w-full items-center justify-center p-1">
            <LoadingSpinner className="h-5 w-5" />
          </div>
        </>
      );
    }
    if (!showSuggestions) return;

    return (
      <>
        <CommandGroup className="w-full overflow-visible  border-x border-b bg-background pt-2">
          {suggestions.map((hit) => (
            <CommandItem
              onSelect={searchCallback}
              onClick={() => acceptSuggestion(hit._source?.title ?? "")}
              className="cursor-pointer"
              key={hit._id}
            >
              {hit?._source?.title}
            </CommandItem>
          ))}
        </CommandGroup>
        {suggestions.length > 0 && (
          <Button
            onClick={() => searchCallback(query)}
            variant="secondary"
            className="m-2 mx-auto h-8 w-1/2"
          >
            Search
          </Button>
        )}
      </>
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
