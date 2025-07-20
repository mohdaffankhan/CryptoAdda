import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
  value: string;
  label: string;
  symbol: string;
  image: string;
};

interface MultiSelectComboboxProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelected?: number;
}

export function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = "Select coins",
  maxSelected = 5,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleSelect = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      if (value.length < maxSelected) {
        onChange([...value, val]);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[300px] justify-between rounded-lg bg-muted/60 backdrop-blur border border-border text-sm font-normal transition-all"
        >
          {value.length > 0 ? (
            <div className="flex items-center gap-2 overflow-hidden">
              {selectedOptions.slice(0, 3).map((opt) => (
                <img
                  key={opt.value}
                  src={opt.image}
                  alt={opt.label}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ))}
              {value.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{value.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground truncate">{placeholder}</span>
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="w-full sm:w-[300px] p-0 rounded-lg border border-border bg-popover shadow-xl"
      >
        <Command>
          <CommandInput
            placeholder="Search coins..."
            className="placeholder:text-muted-foreground"
          />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No coin found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled = !isSelected && value.length >= maxSelected;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={isDisabled}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer",
                      isDisabled && "opacity-50 pointer-events-none"
                    )}
                  >
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 text-primary transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <img
                      src={option.image}
                      alt={`${option.label} logo`}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
