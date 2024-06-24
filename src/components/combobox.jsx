import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

export function Combobox({ list, setLocation, location }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [inputValue, setInputValue] = React.useState(location);

    // Filtered items based on input value
    const filteredList = list.filter(country =>
        country.name.toLowerCase().includes(inputValue?.toLowerCase() || "")
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? value
                        : location !== "" ? list.find(country => country.code === location)?.name : "Select country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput

                        placeholder="Search country..."
                    />
                    <CommandList>
                        {filteredList.length === 0 && (
                            <CommandEmpty>No country found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {filteredList.map(country => (
                                <CommandItem
                                    key={country.code}
                                    value={country.name}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue);
                                        setInputValue(""); // Clear input after selection
                                        setLocation(country.code);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === country.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {country.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}