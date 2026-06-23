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

// ── Property type data from UAE field-visibility ─────────────────────────────

const RESIDENTIAL_TYPES = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Villa Compound",
  "Hotel Apartment",
  "Land",
  "Floor",
  "Building",
  "Duplex",
  "Duplex Apartment",
  "Studio",
  "Flat",
  "Mansion",
  "Bungalow",
  "Compound",
  "House",
  "Residential Floor",
  "Full Floor",
  "Half Floor",
  "Bulk Rent unit",
  "Residential Building",
  "Whole building",
  "Residential Land",
];

const COMMERCIAL_TYPES = [
  "Office",
  "Shop",
  "Showroom",
  "Retail",
  "Business Center",
  "Co-working Space",
  "Warehouse",
  "Factory",
  "Commercial Floor",
  "Bulk Unit",
  "Commercial Building",
  "Commercial Villa",
  "Commercial Land",
  "Mixed Use Land",
  "Industrial Land",
  "Labour Camp",
  "Staff Accommodation",
  "Farm",
];

// ── Component ────────────────────────────────────────────────────────────────

type Tab = "residential" | "commercial";

interface PropertyTypeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Variant to match surrounding theme – hero (glass on dark) or page (solid) */
  variant?: "hero" | "page";
  className?: string;
}

export function PropertyTypeDropdown({
  value,
  onValueChange,
  variant = "hero",
  className,
}: PropertyTypeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("residential");
  const [pendingValue, setPendingValue] = useState(value);

  // When popover opens, sync pending to current value & pick correct tab
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setPendingValue(value);
        // Auto-select tab based on current value
        if (COMMERCIAL_TYPES.includes(value)) {
          setActiveTab("commercial");
        } else {
          setActiveTab("residential");
        }
      }
      setOpen(nextOpen);
    },
    [value],
  );

  const handleDone = () => {
    onValueChange(pendingValue);
    setOpen(false);
  };

  const handleReset = () => {
    setPendingValue("any");
    onValueChange("any");
    setOpen(false);
  };

  const items = activeTab === "residential" ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES;

  // Display label
  const displayLabel =
    value && value !== "any" ? value : "Property Type";

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
          "w-[calc(100vw-2rem)] sm:w-[380px] p-0 rounded-xl shadow-2xl overflow-hidden",
          isHero
            ? "bg-black/70 backdrop-blur-2xl border border-white/20 text-white"
            : "bg-background border text-foreground",
        )}
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex border-b",
            isHero ? "border-white/15" : "border-border",
          )}
        >
          {(["residential", "commercial"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold capitalize tracking-wide transition-colors relative",
                activeTab === tab
                  ? isHero
                    ? "text-accent"
                    : "text-accent"
                  : isHero
                    ? "text-white/60 hover:text-white/90"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* ── Options Grid ─────────────────────────────────────────────── */}
        <div className="p-4 max-h-[320px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-2">
            {items.map((type) => {
              const isSelected = pendingValue === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPendingValue(type)}
                  className={cn(
                    "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-all duration-200",
                    isHero
                      ? isSelected
                        ? "bg-accent/20 border border-accent text-white"
                        : "bg-white/8 border border-white/15 text-white/80 hover:bg-white/15 hover:text-white"
                      : isSelected
                        ? "bg-accent/10 border border-accent text-accent"
                        : "bg-muted/50 border border-border text-foreground hover:bg-muted",
                  )}
                >
                  {/* Radio circle */}
                  <span
                    className={cn(
                      "relative h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-accent"
                        : isHero
                          ? "border-white/40"
                          : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected && (
                      <span className="absolute inset-[3px] rounded-full bg-accent" />
                    )}
                  </span>
                  <span className="truncate text-left">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
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
