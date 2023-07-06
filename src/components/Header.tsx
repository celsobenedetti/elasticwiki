import { useTheme } from "@/store/theme";
import { Button } from "./ui/button";
import { HeroIcon, type SVGShape } from "./HeroIcon";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { useSearchBar } from "@/store/search";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isHome = router.pathname === "/";

  return (
    <header
      className={`fixed top-0 z-40 flex h-header w-full  items-center justify-between gap-12
        bg-background px-6 ${!isHome ? "drop-shadow-sm" : ""}`}
    >
      <Logo />

      <div className="relative flex h-header w-full items-center">
        <div className="relative flex h-12 w-full sm:w-4/5">
          {!isHome && <Search />}
        </div>
      </div>

      <ThemeToggle />
    </header>
  );

  function Logo() {
    /* Runtime conditional rendering to prevent Next.js hydration mismatch. Needed for complying to user system theme preference */
    const [filter, setFilter] = useState("");
    useEffect(() => setFilter(theme == "dark" ? "invert" : ""), []);

    if (isHome) return <> </>;

    return (
      <button
        onClick={() => {
          router.push("/").catch(console.error);
        }}
        className="transition-all duration-200 ease-in-out hover:scale-105 hover:transform hover:opacity-80"
      >
        <Image
          alt="T3 Logo"
          src="/t3-dark.svg"
          className={`${filter}`}
          width={50}
          height={50}
          priority={false}
        />
      </button>
    );
  }
  function ThemeToggle() {
    /* Runtime conditional rendering to prevent Next.js hydration mismatch. Needed for complying to user system theme preference */
    const [icon, setIcon] = useState<SVGShape>("sun");
    useEffect(() => setIcon(theme == "dark" ? "moon" : "sun"), []);

    return (
      <Button
        onClick={toggleTheme}
        variant="ghost"
        className="h-8 w-8 transition-all duration-200 ease-in-out hover:scale-105 hover:transform hover:opacity-80"
      >
        <HeroIcon
          className="absolute mx-auto my-auto h-8 w-8"
          shape={`${icon}`}
        />
      </Button>
    );
  }
}

function Search() {
  const router = useRouter();

  const { searchQuery: storeSearchQuery, setSearchQuery } = useSearchBar();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery((query) =>
      query !== storeSearchQuery ? storeSearchQuery : query
    );
  }, [storeSearchQuery]);

  const searchCallback = () => {
    if (!query) return;

    setSearchQuery(query);
    router
      .push({
        pathname: "/search",
        query: { query },
      })
      .catch(console.error);
  };

  return (
    <SearchBar
      searchCallback={searchCallback}
      query={query}
      setQuery={setQuery}
      showIcons={true}
    />
  );
}
