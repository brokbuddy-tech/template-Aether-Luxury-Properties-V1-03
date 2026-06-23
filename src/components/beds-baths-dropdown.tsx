"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const BED_OPTIONS = ["Studio", "1", "2", "3", "4", "5", "6", "7", "8+"];
const BATH_OPTIONS = ["1", "2", "3", "4", "5", "6+"];

interface BedsAndBathsDropdownProps {
  bedrooms: string;
  bathrooms: string;
  onBedroomsChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
  variant?: "hero" | "page";
  className?: string;
}

export function BedsAndBathsDropdown({
  bedrooms,
  bathrooms,
  onBedroomsChange,
  onBathroomsChange,
  variant = "hero",
  className,
}: BedsAndBathsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pendingBedrooms, setPendingBedrooms] = useState(bedrooms);
  const [pendingBathrooms, setPendingBathrooms] = useState(bathrooms);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setPendingBedrooms(bedrooms);
        setPendingBathrooms(bathrooms);
      }
      setOpen(nextOpen);
    },
    [bedrooms, bathrooms],
  );

  const handleDone = () => {
    onBedroomsChange(pendingBedrooms);
    onBathroomsChange(pendingBathrooms);
    setOpen(false);
  };

  const handleReset = () => {
    setPendingBedrooms("any");
    setPendingBathrooms("any");
    onBedroomsChange("any");
    onBathroomsChange("any");
    setOpen(false);
  };

  // Display label
  const parts: string[] = [];
  if (bedrooms && bedrooms !== "any") parts.push(`${bedrooms} Bed${bedrooms !== "1" && bedrooms !== "Studio" ? "s" : ""}`);
  if (bathrooms && bathrooms !== "any") parts.push(`${bathrooms} Bath${bathrooms !== "1" ? "s" : ""}`);
  const displayLabel = parts.length > 0 ? parts.join(", ") : "Beds & Baths";

  const isHero = variant === "hero";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-between gap-2 rounded-md px-3 text-sm font-medium transition-colors",
            "h-10 w-full md:w-[200px]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            isHero
              ? "bg-white/20 text-white placeholder:text-gray-300 hover:bg-white/30 border-0"
              : "bg-background border border-input text-foreground hover:bg-muted",
            className,
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-[380px] p-0 rounded-xl shadow-2xl overflow-hidden",
          isHero
            ? "bg-black/70 backdrop-blur-2xl border border-white/20 text-white"
            : "bg-background border text-foreground",
        )}
        align="start"
        sideOffset={8}
      >
        {/* ── Beds Section ──────────────────────────────────────────── */}
        <div className="p-4 pb-2">
          <h4
            className={cn(
              "text-sm font-semibold mb-3",
              isHero ? "text-white" : "text-foreground",
            )}
          >
            Beds
          </h4>
          <div className="flex flex-wrap gap-2">
            {BED_OPTIONS.map((option) => {
              const isSelected = pendingBedrooms === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPendingBedrooms(isSelected ? "any" : option)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-all duration-200 min-w-[48px]",
                    isHero
                      ? isSelected
                        ? "bg-accent/20 border border-accent text-white"
                        : "bg-white/8 border border-white/15 text-white/80 hover:bg-white/15 hover:text-white"
                      : isSelected
                        ? "bg-accent/10 border border-accent text-accent"
                        : "bg-muted/50 border border-border text-foreground hover:bg-muted",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────────── */}
        <div
          className={cn(
            "mx-4 border-t",
            isHero ? "border-white/15" : "border-border",
          )}
        />

        {/* ── Baths Section ─────────────────────────────────────────── */}
        <div className="p-4 pt-3">
          <h4
            className={cn(
              "text-sm font-semibold mb-3",
              isHero ? "text-white" : "text-foreground",
            )}
          >
            Baths
          </h4>
          <div className="flex flex-wrap gap-2">
            {BATH_OPTIONS.map((option) => {
              const isSelected = pendingBathrooms === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPendingBathrooms(isSelected ? "any" : option)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-all duration-200 min-w-[48px]",
                    isHero
                      ? isSelected
                        ? "bg-accent/20 border border-accent text-white"
                        : "bg-white/8 border border-white/15 text-white/80 hover:bg-white/15 hover:text-white"
                      : isSelected
                        ? "bg-accent/10 border border-accent text-accent"
                        : "bg-muted/50 border border-border text-foreground hover:bg-muted",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex gap-3 p-4 border-t",
            isHero ? "border-white/15" : "border-border",
          )}
        >
          <Button
            variant="outline"
            className={cn(
              "flex-1 rounded-full font-semibold",
              isHero
                ? "border-white/30 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                : "",
            )}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            className="flex-1 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
