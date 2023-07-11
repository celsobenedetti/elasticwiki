import { HeroIcon } from "@/components/HeroIcon";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

export function AdvancedSearch() {
  return (
    <Sheet>
      <SheetTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HeroIcon
                shape="adjustments-horizontal"
                className="text-active dark:text-active-dark"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Advanced Search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
          <SheetDescription>
            Search 1
            <Input />
            Search 2
            <Input />
            Search 2
            <Input />
            Search 3
            <Input />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
