import { useState } from "react";

import { HeroIcon } from "./HeroIcon";
import { Input } from "./ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  query: string;
  setQuery: (query: string) => void;
  searchCallback: () => void;
  alwaysShowIcons?: boolean;
}

export default function SearchBar(props: Props) {
  const { query, setQuery, searchCallback, alwaysShowIcons } = props;
  const [isFocused, setFocus] = useState(Boolean(alwaysShowIcons));
  const isActive = Boolean(query);

  return (
    <div className="relative w-full">
      <HeroIcon
        shape="magnifyingGlass"
        className="absolute bottom-0 left-2 top-0 my-auto h-5 w-5 text-slate-400"
      />
      <Input
        value={query}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(alwaysShowIcons || false), 100)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchCallback();
          }
        }}
        type="text"
        className={`rounded-full pl-10 hover:shadow ${
          isActive ? "shadow hover:shadow-md" : ""
        }`}
      />

      {isFocused && (
        <div className="absolute bottom-0 right-7 top-0 my-auto flex gap-3">
          {isActive && <ClearX />}
          <SearchIcon />
        </div>
      )}
    </div>
  );

  function SearchIcon() {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={searchCallback}>
            <div className="my-auto h-5 w-5 min-w-fit cursor-pointer border-l border-l-slate-200 pl-3 dark:border-l-slate-700">
              <HeroIcon
                shape="magnifyingGlass"
                className="h-5 w-5 cursor-pointer text-indigo-500"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
