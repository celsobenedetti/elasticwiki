import { HeroIcon } from "@/components/HeroIcon";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AdvancedSearchButton() {
  return (
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
  );
}
