import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { HeroIcon } from "@/components/HeroIcon";

export default function InfoPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <HeroIcon shape="info" className="text-slate-400 dark:text-active" />
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-2 px-8 text-sm">
        <p>Search around 36k Wikipedia pages</p>
        <p>Topics mainly include math and computer science</p>
        <Separator />
        <p>
          Regular <span className="text-success">terms</span> will be matched
          unordered, and{" "}
          <span className="text-success">&quot;quoted phrases&quot;</span>{" "}
          matched in the specified order{" "}
        </p>

        <p>
          You can <span className="font-bold">negate</span>{" "}
          <span className="text-danger"> !terms </span> or
          <span className="text-danger"> !&quot;quoted phrases&quot; </span>
          to <span className="font-bold">exclude</span> from the search
        </p>
      </PopoverContent>
    </Popover>
  );
}
