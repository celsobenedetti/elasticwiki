import { useState } from "react";
import { HeroIcon, SVGShapes } from "./HeroIcon";
import { Input } from "./ui/input";

export default function SearchBar({
  query,
  setQuery,
  searchCallback,
  showButton,
}: {
  query: string;
  setQuery: (query: string) => void;
  searchCallback: () => void;
  showButton?: boolean;
}) {
  const [isFocused, setFocus] = useState(Boolean(showButton));

  return (
    <div className="relative w-full">
      <HeroIcon
        shape={SVGShapes.magnifyingGlass}
        className="absolute bottom-0 left-2 top-0 my-auto h-5 w-5 text-slate-400"
      />
      <Input
        value={query}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(showButton || false), 100)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchCallback();
          }
        }}
        type="text"
        className="rounded-full pl-10 hover:shadow"
      />

      {isFocused && (
        <button
          onClick={searchCallback}
          className="absolute bottom-0 right-1 top-0 my-auto h-6 w-7 cursor-pointer border-l border-l-slate-200 pl-10"
        >
          <HeroIcon
            shape={SVGShapes.magnifyingGlass}
            className="absolute bottom-0 left-0 right-0 top-0 mx-auto my-auto h-5 w-5 cursor-pointer text-indigo-500"
          />
        </button>
      )}
    </div>
  );
}
