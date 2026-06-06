
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAiSearchModal } from "@/hooks/use-ai-search-modal";
import { AmenityIcon } from "@/components/amenity-icon";
import { cleanQueryForCategory, normalizeCategory } from "@/lib/search-utils";

const amenitiesList = [
  { id: 'covered-parking', label: 'Covered Parking' },
  { id: '24-7-security', label: '24/7 Security' },
  { id: 'shell-core', label: 'Shell & Core' },
  { id: 'fitted', label: 'Fitted' },
  { id: 'meeting-rooms', label: 'Meeting Rooms' },
  { id: 'high-floor', label: 'High Floor' },
  { id: 'low-floor', label: 'Low Floor' },
  { id: 'retail-frontage', label: 'Retail Frontage' },
];

const commercialTypeOptions = [
  { value: "Office", label: "Office" },
  { value: "Retail", label: "Retail" },
  { value: "Warehouse", label: "Warehouse" },
];

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (value && value !== "any" && value !== "0" && value !== "9999999999") {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function CommercialFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const { openModal: openAiSearchModal } = useAiSearchModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("SALE");
  const [category, setCategory] = useState("any");
  const [minPrice, setMinPrice] = useState("any");
  const [maxPrice, setMaxPrice] = useState("any");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  useEffect(() => {
    const nextCategory = normalizeCategory(searchParams.get("category")) || "any";
    setSearchQuery(cleanQueryForCategory(searchParams.get("q"), nextCategory) || "");
    setTransactionType(searchParams.get("transactionType") === "RENT" ? "RENT" : "SALE");
    setCategory(nextCategory);
    setMinPrice(searchParams.get("minPrice") || "any");
    setMaxPrice(searchParams.get("maxPrice") || "any");
    setMinArea(searchParams.get("minArea") || "");
    setMaxArea(searchParams.get("maxArea") || "");
  }, [searchKey, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedCategory = normalizeCategory(category);

    setParam(params, "q", cleanQueryForCategory(searchQuery, normalizedCategory));
    setParam(params, "transactionType", transactionType);
    setParam(params, "category", normalizedCategory);
    setParam(params, "minPrice", minPrice);
    setParam(params, "maxPrice", maxPrice);
    setParam(params, "minArea", minArea);
    setParam(params, "maxArea", maxArea);

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mb-8 -mx-4 sm:mx-0">
      <div className="p-4 rounded-none sm:rounded-lg border-y sm:border bg-background shadow-lg">
        <div className="flex flex-col gap-4">
          
          {/* First Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* AI Search Button */}
            <div className="relative flex-auto lg:flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
                placeholder="Search by area, building, or keyword..."
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

            {/* Transaction Type */}
            <div className="flex-auto min-w-[180px]">
              <Label className="sr-only">Transaction Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">Buy</SelectItem>
                  <SelectItem value="RENT">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="flex-auto min-w-[180px]">
              <Label className="sr-only">Property Type</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Property Type (Any)</SelectItem>
                  {commercialTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator orientation="vertical" className="h-10 hidden xl:flex" />
            
            {/* Price Range */}
            <div className="flex-auto min-w-[180px]">
              <Label className="sr-only">Min Price</Label>
              <Select value={minPrice} onValueChange={setMinPrice}>
                  <SelectTrigger>
                      <SelectValue placeholder="Min Price" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="any">Min Price (Any)</SelectItem>
                      <SelectItem value="500000">AED 500k</SelectItem>
                      <SelectItem value="1000000">AED 1M</SelectItem>
                      <SelectItem value="5000000">AED 5M</SelectItem>
                      <SelectItem value="10000000">AED 10M</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="flex-auto min-w-[180px]">
              <Label className="sr-only">Max Price</Label>
              <Select value={maxPrice} onValueChange={setMaxPrice}>
                  <SelectTrigger>
                      <SelectValue placeholder="Max Price" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="any">Max Price (Any)</SelectItem>
                      <SelectItem value="1000000">AED 1M</SelectItem>
                      <SelectItem value="5000000">AED 5M</SelectItem>
                      <SelectItem value="10000000">AED 10M</SelectItem>
                      <SelectItem value="20000000">AED 20M</SelectItem>
                      <SelectItem value="50000000">AED 50M+</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
                {/* Size Range */}
                <div className="flex-auto min-w-[180px]">
                <Label className="sr-only">Min Sq. Ft.</Label>
                <Input placeholder="Min Sq. Ft." type="number" value={minArea} onChange={(event) => setMinArea(event.target.value)} />
                </div>
                <div className="flex-auto min-w-[180px]">
                <Label className="sr-only">Max Sq. Ft.</Label>
                <Input placeholder="Max Sq. Ft." type="number" value={maxArea} onChange={(event) => setMaxArea(event.target.value)} />
                </div>

                <Separator orientation="vertical" className="h-10 hidden md:flex" />

                {/* Amenities */}
                <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-auto">
                        <Plus className="mr-2 h-4 w-4"/>
                        AMENITIES
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Commercial Amenities</h4>
                            <p className="text-sm text-muted-foreground">Select desired features.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {amenitiesList.map((amenity) => (
                                <div key={amenity.id} className="flex items-center space-x-2">
                                    <Checkbox id={amenity.id} />
                                    <Label htmlFor={amenity.id} className="flex cursor-pointer items-center gap-2 font-normal">
                                      <AmenityIcon name={amenity.label} className="h-4 w-4" />
                                      {amenity.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
                </Popover>
            </div>

            <Button className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300" onClick={applyFilters}>
              Find
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
