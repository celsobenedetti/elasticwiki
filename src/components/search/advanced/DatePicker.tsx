import * as React from "react";
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

import { DateField, type InputAction } from "./state";

export function DatePicker({
  dateField,
  dispatch,
}: {
  dateField: DateField;
  date: Date | undefined;
  dispatch: React.Dispatch<InputAction>;
}) {
  const [date, setDate] = React.useState<Date>();
  const title =
    dateField == DateField.After ? "Created After" : "Created Before";

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
            setDate(d);
            if (d != undefined) {
              dispatch({ type: dateField, content: d });
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
