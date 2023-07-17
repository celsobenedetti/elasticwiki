import { type ReadTimeType } from "@/lib/search";

import { SheetDescription } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

import { useAdvancedSearch } from "./state";

export default function ReadTimeSlider({
  TIME_TYPE,
}: {
  TIME_TYPE: ReadTimeType;
}) {
  const { readTime, setReadTime } = useAdvancedSearch();
  const time = readTime[TIME_TYPE];

  return (
    <>
      <SheetDescription>
        Read time <span className="font-bold">{TIME_TYPE}</span> than or equal
        to: <span className="text-lg font-bold">{time}</span>
      </SheetDescription>
      <Slider
        min={1}
        max={15}
        step={1}
        value={!!time ? [time] : undefined}
        onValueChange={(values) => {
          if (!!values[0]) {
            setReadTime(TIME_TYPE, values[0]);
          }
        }}
      />
    </>
  );
}
