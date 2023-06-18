import { useSearch } from "@/store/search";
import { HeroIcon, SVGShapes } from "./HeroIcon";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { doSearch } = useSearch();

  return (
    <>
      <div className="relative w-full">
        <HeroIcon
          shape={SVGShapes.magnifyingGlass}
          className="absolute bottom-0 left-2 top-0 my-auto h-5 w-5 text-slate-400"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          className="rounded-full pl-10 hover:shadow"
        />
      </div>
      <Button onClick={() => doSearch(query)} className="w-40">
        Search
      </Button>
    </>
  );
}
