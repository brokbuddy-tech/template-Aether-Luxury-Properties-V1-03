"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  PROPERTY_TYPES_BY_GROUP,
  getPropertyTypeGroup,
  normalizePropertyTypeValue,
  type PropertyTypeGroup,
} from "@/lib/property-types";

type Tab = PropertyTypeGroup;

type TabItems = Record<Tab, string[]>;

interface PropertyTypeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  availablePropertyTypes?: string[];
  preferredTab?: Tab;
  variant?: "hero" | "page";
  className?: string;
}

function getFirstAvailableTab(preferredTab: Tab, itemsByTab: TabItems): Tab {
  if (itemsByTab[preferredTab].length > 0) return preferredTab;
  return itemsByTab.residential.length > 0 ? "residential" : "commercial";
}

export function PropertyTypeDropdown({
  value,
  onValueChange,
  availablePropertyTypes,
  preferredTab = "residential",
  variant = "hero",
  className,
}: PropertyTypeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(preferredTab);
  const [pendingValue, setPendingValue] = useState(value);

  const availableSet = useMemo(() => {
    if (!availablePropertyTypes) return null;

    const normalizedTypes = availablePropertyTypes
      .map(normalizePropertyTypeValue)
      .filter((type): type is string => Boolean(type));

    return normalizedTypes.length > 0 ? new Set(normalizedTypes) : null;
  }, [availablePropertyTypes]);

  const itemsByTab = useMemo<TabItems>(() => {
    const getItems = (tab: Tab) => PROPERTY_TYPES_BY_GROUP[tab]
      .map((option) => option.value)
      .filter((type) => !availableSet || availableSet.has(type));

    return {
      residential: getItems("residential"),
      commercial: getItems("commercial"),
    };
  }, [availableSet]);

  useEffect(() => {
    if (!open || itemsByTab[activeTab].length > 0) return;
    setActiveTab(getFirstAvailableTab(preferredTab, itemsByTab));
  }, [activeTab, itemsByTab, open, preferredTab]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        const selectedTab = getPropertyTypeGroup(value);
        setPendingValue(value);
        setActiveTab(selectedTab && itemsByTab[selectedTab].length > 0 ? selectedTab : getFirstAvailableTab(preferredTab, itemsByTab));
      }

      setOpen(nextOpen);
    },
    [itemsByTab, preferredTab, value],
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

  const items = itemsByTab[activeTab];
  const displayLabel = value && value !== "any" ? value : "Property Type";
  const isHero = variant === "hero";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-full items-center justify-between gap-2 rounded-md px-3 text-sm font-medium transition-colors md:w-[240px]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            isHero
              ? "border-0 bg-white/20 text-white placeholder:text-gray-300 hover:bg-white/30"
              : "border border-input bg-background text-foreground hover:bg-muted",
            className,
          )}
        >
          <span className="min-w-0 truncate text-left">{displayLabel}</span>
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
          "w-[calc(100vw-2rem)] overflow-hidden rounded-xl p-0 shadow-2xl sm:w-[480px]",
          isHero
            ? "border border-white/20 bg-black/70 text-white backdrop-blur-2xl"
            : "border bg-background text-foreground",
        )}
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        <div className={cn("flex border-b", isHero ? "border-white/15" : "border-border")}>
          {(["residential", "commercial"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              disabled={itemsByTab[tab].length === 0}
              onClick={() => {
                if (itemsByTab[tab].length > 0) {
                  setActiveTab(tab);
                }
              }}
              className={cn(
                "relative flex-1 py-3 text-sm font-semibold capitalize tracking-wide transition-colors",
                activeTab === tab
                  ? "text-accent"
                  : isHero
                    ? "text-white/60 hover:text-white/90"
                    : "text-muted-foreground hover:text-foreground",
                itemsByTab[tab].length === 0 && "cursor-not-allowed opacity-40 hover:text-current",
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="max-h-[320px] overflow-y-auto p-4 custom-scrollbar">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items.map((type) => {
                const isSelected = pendingValue === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPendingValue(type)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition-all duration-200",
                      isHero
                        ? isSelected
                          ? "border-accent bg-accent/20 text-white"
                          : "border-white/15 bg-white/8 text-white/80 hover:bg-white/15 hover:text-white"
                        : isSelected
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-muted/50 text-foreground hover:bg-muted",
                    )}
                  >
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
                    <span className="min-w-0 text-left leading-snug">{type}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={cn("rounded-lg border px-4 py-6 text-center text-sm", isHero ? "border-white/15 text-white/60" : "border-border text-muted-foreground")}>
              No {activeTab} property types available.
            </div>
          )}
        </div>

        <div className={cn("flex gap-3 border-t p-4", isHero ? "border-white/15" : "border-border")}>
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
            className="flex-1 rounded-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}