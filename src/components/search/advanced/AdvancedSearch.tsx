import { useCallback, useReducer } from "react";
import { useRouter } from "next/router";

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
  searchStateReducer,
  buildInitialState,
  DateField,
} from "./state";
import SearchForm from "./form";
import { useSearch } from "@/store/search";
import { DatePicker } from "./DatePicker";

export function AdvancedSearch({
  searchQuery: query,
  className,
}: {
  searchQuery: string;
  className?: string;
}) {
  const router = useRouter();
  const { setSearchQuery } = useSearch();

  const [searchState, dispatch] = useReducer(
    searchStateReducer,
    buildInitialState(query)
  );
  console.log({ dates: searchState.dates });

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
        <SearchForm inputFields={searchState.textFields} dispatch={dispatch} />

        <Separator />

        <DatePicker
          dateField={DateField.Before}
          date={searchState.dates.before}
          dispatch={dispatch}
        />
        <DatePicker
          dateField={DateField.After}
          date={searchState.dates.after}
          dispatch={dispatch}
        />

        <Button
          onClick={() => searchCallback(buildQuery(searchState.textFields))}
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
