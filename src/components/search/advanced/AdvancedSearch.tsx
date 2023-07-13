import { useCallback, useReducer } from "react";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { HeroIcon } from "@/components/HeroIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  buildQuery,
  inputReducer as formStateReducer,
  parseQueryToInputstate,
} from "./reducer";
import SearchForm from "./form";
import { useSearch } from "@/store/search";
import { useRouter } from "next/router";

export function AdvancedSearch({
  searchQuery: query,
  className,
}: {
  searchQuery: string;
  className?: string;
}) {
  const router = useRouter();
  const { setSearchQuery } = useSearch();

  const [inputs, dispatch] = useReducer(
    formStateReducer,
    parseQueryToInputstate(query)
  );

  const searchCallback = useCallback(
    (searchQuery: string) => {
      if (!searchQuery) return;

      setSearchQuery(searchQuery);
      router
        .push({
          pathname: "/search",
          query: { query: searchQuery },
        })
        .catch(console.error);
    },
    [router, setSearchQuery]
  );

  return (
    <Sheet>
      <SheetTrigger>
        <TriggerButton className={className} />
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
        </SheetHeader>

        <Separator />

        <SheetDescription>Resulting documents:</SheetDescription>
        <SearchForm inputs={inputs} dispatch={dispatch} />

        <Button
          onClick={() => searchCallback(buildQuery(inputs))}
          variant="secondary"
          className="mx-auto w-1/2"
        >
          Search
        </Button>
      </SheetContent>
    </Sheet>
  );
}

function TriggerButton({ className }: { className?: string }) {
  return (
    <HeroIcon
      shape="adjustments-horizontal"
      className={cn(className, "text-active dark:text-active-dark")}
    />
  );
}
