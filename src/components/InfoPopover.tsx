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
          Results will match <span className="font-bold">regular terms</span>,
          unordered, and{" "}
          <span className="font-bold">&quot;quoted phrases&quot;</span> in the
          specified order{" "}
        </p>

        <p>
          To <span className="font-bold">exclude</span> terms or
          &quot;phrases&quot;,
          <span className="text-orange-600"> !negate</span> them with an{" "}
          <span className="font-bold"> exclamation mark prefix</span>
        </p>
      </PopoverContent>
    </Popover>
  );
}
