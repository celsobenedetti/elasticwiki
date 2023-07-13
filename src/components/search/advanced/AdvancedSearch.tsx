import { useCallback, useReducer } from "react";

import { useSearch } from "@/store/search";
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
  inputReducer as formStateReducer,
  parseQueryToInputstate,
} from "./reducer";
import SearchForm from "./form";

export function AdvancedSearch({ className }: { className?: string }) {
  const { searchQuery } = useSearch();

  const createInitialInputStateCb = useCallback(
    () => parseQueryToInputstate(searchQuery),
    [searchQuery]
  );

  //TODO: dispatch form input events
  const [inputs, dispatch] = useReducer(
    formStateReducer,
    createInitialInputStateCb()
  );

  console.log({ inputs });

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

        <Button variant="secondary" className="mx-auto w-1/2">
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
