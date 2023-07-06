import { useCallback, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { HeroIcon } from "./HeroIcon";

interface Props {
  query: string;
  setQuery: (query: string) => void;
  searchCallback: (query: string) => void;
  showIcons?: boolean;
}

export default function SearchBar(props: Props) {
  const { query, setQuery, searchCallback, showIcons } = props;
  const [isFocused, setFocus] = useState(false);

  const { data } = api.elastic.autocomplete.useQuery(
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
      className={`absolute w-full overflow-visible ${
        showSuggestions
          ? "rounded-b-3xl rounded-t-3xl border-x border-t shadow"
          : "rounded-full border hover:shadow"
      }`}
    >
      <Command className="rounded-3xl">
        <div className="relative">
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

        {showSuggestions && (
          <CommandGroup className="w-full overflow-visible rounded-b-3xl border-x border-b bg-background pt-2 shadow">
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
        )}
      </Command>
    </div>
  );

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
