import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SheetDescription } from "@/components/ui/sheet";
import { useSearch } from "@/store/search";

import { type DateType, CREATED_BEFORE } from "./types";

export function DatePicker({ DATE_TYPE }: { DATE_TYPE: DateType }) {
  const title =
    DATE_TYPE == CREATED_BEFORE ? "Created Before" : "Created After";

  const { dates, setDate } = useSearch();
  const date = dates[DATE_TYPE];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <SheetDescription>{title}</SheetDescription>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (!!d) {
              setDate(DATE_TYPE, d);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
