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
import { Input } from "@/components/ui/input";

interface PriceDropdownProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  variant?: "hero" | "page";
  className?: string;
}

export function PriceDropdown({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  variant = "hero",
  className,
}: PriceDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pendingMin, setPendingMin] = useState(minPrice);
  const [pendingMax, setPendingMax] = useState(maxPrice);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setPendingMin(minPrice);
        setPendingMax(maxPrice);
      }
      setOpen(nextOpen);
    },
    [minPrice, maxPrice],
  );

  const handleDone = () => {
    onMinPriceChange(pendingMin);
    onMaxPriceChange(pendingMax);
    setOpen(false);
  };

  const handleReset = () => {
    setPendingMin("");
    setPendingMax("");
    onMinPriceChange("");
    onMaxPriceChange("");
    setOpen(false);
  };

  // Display label
  const formatDisplay = (val: string) => {
    const num = Number(val);
    if (!num) return "";
    if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    return val;
  };

  let displayLabel = "Price (AED)";
  if (minPrice && maxPrice) {
    displayLabel = `${formatDisplay(minPrice)} - ${formatDisplay(maxPrice)} AED`;
  } else if (minPrice) {
    displayLabel = `From ${formatDisplay(minPrice)} AED`;
  } else if (maxPrice) {
    displayLabel = `Up to ${formatDisplay(maxPrice)} AED`;
  }

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
          "w-[340px] p-0 rounded-xl shadow-2xl overflow-hidden",
          isHero
            ? "bg-black/70 backdrop-blur-2xl border border-white/20 text-white"
            : "bg-background border text-foreground",
        )}
        align="start"
        sideOffset={8}
      >
        {/* ── Price Inputs ──────────────────────────────────────────── */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className={cn(
                  "text-sm font-semibold",
                  isHero ? "text-accent" : "text-accent",
                )}
              >
                Minimum
              </label>
              <Input
                type="number"
                placeholder="0"
                value={pendingMin}
                onChange={(e) => setPendingMin(e.target.value)}
                className={cn(
                  "h-10",
                  isHero
                    ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-accent"
                    : "",
                )}
              />
            </div>
            <div className="space-y-2">
              <label
                className={cn(
                  "text-sm font-semibold",
                  isHero ? "text-accent" : "text-accent",
                )}
              >
                Maximum
              </label>
              <Input
                type="number"
                placeholder="Any"
                value={pendingMax}
                onChange={(e) => setPendingMax(e.target.value)}
                className={cn(
                  "h-10",
                  isHero
                    ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-accent"
                    : "",
                )}
              />
            </div>
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
