
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAiSearchModal } from "@/hooks/use-ai-search-modal";
import { cleanQueryForCategory, normalizeCategory } from "@/lib/search-utils";

const propertyTypeOptions = [
  { value: "Apartment", label: "Apartment" },
  { value: "Studio", label: "Studio" },
  { value: "Penthouse", label: "Penthouse" },
  { value: "Duplex", label: "Duplex" },
  { value: "Duplex Apartment", label: "Duplex Apartment" },
  { value: "Hotel Apartment", label: "Hotel Apartment" },
  { value: "Flat", label: "Flat" },
  { value: "Villa", label: "Villa" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Mansion", label: "Mansion" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Villa Compound", label: "Villa Compound" },
  { value: "Compound", label: "Compound" },
  { value: "House", label: "House" },
  { value: "Residential Floor", label: "Residential Floor" },
  { value: "Full Floor", label: "Full Floor" },
  { value: "Half Floor", label: "Half Floor" },
  { value: "Floor", label: "Floor" },
  { value: "Bulk Rent unit", label: "Bulk Rent Unit" },
  { value: "Building", label: "Building" },
  { value: "Residential Building", label: "Residential Building" },
  { value: "Whole building", label: "Whole Building" },
  { value: "Land", label: "Land" },
  { value: "Residential Land", label: "Residential Land" },
];

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (value && value !== "any") {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function OffPlanFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const { openModal: openAiSearchModal } = useAiSearchModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("SALE");
  const [category, setCategory] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const nextCategory = normalizeCategory(searchParams.get("category")) || "any";
    setSearchQuery(cleanQueryForCategory(searchParams.get("q"), nextCategory) || "");
    setTransactionType(searchParams.get("transactionType") === "RENT" ? "RENT" : "SALE");
    setCategory(nextCategory);
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchKey, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedCategory = normalizeCategory(category);

    setParam(params, "q", cleanQueryForCategory(searchQuery, normalizedCategory));
    setParam(params, "transactionType", transactionType);
    setParam(params, "category", normalizedCategory);
    setParam(params, "minPrice", minPrice);
    setParam(params, "maxPrice", maxPrice);

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mb-8 -mx-4 sm:mx-0">
      <div className="p-4 rounded-none sm:rounded-lg border-y sm:border bg-background shadow-lg">
        <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-auto lg:flex-1 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
                placeholder="Search by project, area, or keyword..."
                className="pl-10"
              />
            </div>
            <div className="flex-auto sm:flex-none">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground font-normal"
                onClick={openAiSearchModal}
              >
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                AI Search
              </Button>
            </div>

            <Separator orientation="vertical" className="h-10 hidden lg:flex" />

            {/* Buy / Rent Toggle */}
            <div className="flex-none">
              <div className="inline-flex rounded-md border overflow-hidden h-10">
                <button
                  type="button"
                  onClick={() => setTransactionType("SALE")}
                  className={`px-4 text-sm font-medium transition-colors duration-200 ${
                    transactionType === "SALE"
                      ? "bg-accent text-accent-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("RENT")}
                  className={`px-4 text-sm font-medium transition-colors duration-200 border-l ${
                    transactionType === "RENT"
                      ? "bg-accent text-accent-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            <div className="flex-auto min-w-0 w-full sm:w-auto sm:min-w-[180px]">
              <Label className="sr-only">Property Type</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Property Type (Any)</SelectItem>
                  {propertyTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-10 hidden xl:flex" />

            {/* Price Range - Custom Inputs */}
            <div className="flex-auto min-w-0 w-full sm:w-auto sm:min-w-[150px]">
              <Label className="sr-only">Min Price</Label>
              <Input
                placeholder="Min Price (AED)"
                type="number"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
              />
            </div>
            <div className="flex-auto min-w-0 w-full sm:w-auto sm:min-w-[150px]">
              <Label className="sr-only">Max Price</Label>
              <Input
                placeholder="Max Price (AED)"
                type="number"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
              />
            </div>

            <div className="flex-auto min-w-0 w-full sm:w-auto sm:min-w-[180px]">
              <Label className="sr-only">Developer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Developer"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Developer (Any)</SelectItem>
                  <SelectItem value="Celestial Developments">Celestial Developments</SelectItem>
                  <SelectItem value="GreenScape Properties">GreenScape Properties</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-auto min-w-0 w-full sm:w-auto sm:min-w-[180px]">
              <Label className="sr-only">Handover</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Handover" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Handover (Any)</SelectItem>
                  <SelectItem value="Q1 2026">Q1 2026</SelectItem>
                  <SelectItem value="Q3 2026">Q3 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full sm:w-auto sm:flex-initial bg-accent hover:bg-accent/90 text-accent-foreground px-8" onClick={applyFilters}>
              Find
            </Button>
        </div>
      </div>
    </div>
  );
}
