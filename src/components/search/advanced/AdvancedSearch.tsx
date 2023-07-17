import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { CREATED_BEFORE, CREATED_AFTER, LESSER, GREATER } from "@/lib/search";
import { useSearch } from "@/store/search";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeroIcon } from "@/components/HeroIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { DatePicker } from "./Date";
import SearchForm from "./Form";
import {
  buildQueryFromState,
  parseQueryToTextFieldsState,
  useAdvancedSearch,
} from "./state";
import ReadTimeSlider from "./Slider";

export function AdvancedSearch({
  searchQuery,
  className,
}: {
  searchQuery: string;
  className?: string;
}) {
  const { setSearchQuery, setAdvancedSearchOptions } = useSearch();
  const { textFields, setInitialTextFields, getAdvancedSearchState } =
    useAdvancedSearch();

  useEffect(
    () => setInitialTextFields(parseQueryToTextFieldsState(searchQuery)),
    [searchQuery, setInitialTextFields]
  );

  const router = useRouter();
  const searchCallback = useCallback(
    (searchQuery: string) => {
      // setIsOpen(false);
      if (!searchQuery) return;

      setAdvancedSearchOptions(getAdvancedSearchState());
      setSearchQuery(searchQuery);
      router
        .push({
          pathname: "/search",
          query: { query: searchQuery },
        })
        .catch(console.error);
    },
    [router, setSearchQuery, getAdvancedSearchState, setAdvancedSearchOptions]
  );

  return (
    <Sheet>
      <SheetTrigger onClick={() => true}>
        <TriggerButton className={className} />
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
        </SheetHeader>

        <Separator />

        <SheetDescription>Resulting documents:</SheetDescription>
        <SearchForm />

        <Separator />

        <DatePicker DATE_TYPE={CREATED_BEFORE} />
        <DatePicker DATE_TYPE={CREATED_AFTER} />

        <Separator />

        <ReadTimeSlider TIME_TYPE={GREATER} />
        <ReadTimeSlider TIME_TYPE={LESSER} />

        <SheetClose
          onClick={() => searchCallback(buildQueryFromState(textFields))}
          className="mx-auto h-10 w-1/2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          Search
        </SheetClose>
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
