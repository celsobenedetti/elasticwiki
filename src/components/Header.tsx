import { useTheme } from "@/store/theme";
import { Button } from "./ui/button";
import { HeroIcon, SVGShapes } from "./HeroIcon";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { useSearch } from "@/store/search";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const isHome = router.pathname === "/";

  return (
    <header
      className={`fixed top-0 z-40 flex h-header w-full items-center justify-between gap-12
        bg-background px-6 ${!isHome ? "drop-shadow-sm" : ""}`}
    >
      {!isHome && (
        <button
          onClick={() => {
            router.push("/").catch(console.error);
          }}
        >
          <HeroIcon shape={SVGShapes.home} className="h-10 w-10" />
        </button>
      )}
      <div className="w-full">
        <div className="flex w-full sm:w-3/5">{!isHome && <Search />}</div>
      </div>
      <Button onClick={toggleTheme} variant="ghost" className="h-10 w-10">
        <HeroIcon
          className="absolute h-8 w-8"
          shape={theme == "light" ? SVGShapes.sun : SVGShapes.moon}
        />
      </Button>
    </header>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  const { doSearch } = useSearch();

  const router = useRouter();

  const searchCallback = () => {
    if (!query) return;
    doSearch(query);

    router
      .push({
        pathname: "/search",
        query: query,
      })
      .catch(console.error);
  };

  return (
    <>
      <SearchBar
        searchCallback={searchCallback}
        query={query}
        setQuery={setQuery}
        showButton={true}
      />
    </>
  );
}
