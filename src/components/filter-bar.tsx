"use client";

import { useCallback, useEffect, useState } from "react";
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
import { BedsAndBathsDropdown } from "@/components/beds-baths-dropdown";
import { PriceDropdown } from "@/components/price-dropdown";
import { cleanQueryForCategory, normalizeCategory } from "@/lib/search-utils";

// --- Data by variant ---

const residentialAmenities = [
  { id: 'swimming-pool', label: 'Swimming Pool' },
  { id: 'gym', label: 'Gymnasium' },
  { id: 'ocean-view', label: 'Ocean View' },
  { id: 'home-theater', label: 'Home Theater' },
  { id: 'private-garden', label: 'Private Garden' },
  { id: 'smart-home', label: 'Smart Home System' },
  { id: 'balcony', label: 'Balcony or Terrace' },
  { id: 'concierge-service', label: 'Concierge Service' },
  { id: 'covered-parking', label: 'Covered Parking' },
  { id: 'security-24-7', label: '24/7 Security' },
  { id: 'built-in-wardrobes', label: 'Built-in Wardrobes' },
  { id: 'maids-room', label: 'Maids Room' },
  { id: 'sea-view', label: 'Sea View' },
  { id: 'pets-allowed', label: 'Pets Allowed' },
  { id: 'spa', label: 'Spa' },
  { id: 'private-pool', label: 'Private Pool' },
];

const commercialAmenities = [
  { id: 'covered-parking', label: 'Covered Parking' },
  { id: '24-7-security', label: '24/7 Security' },
  { id: 'shell-core', label: 'Shell & Core' },
  { id: 'fitted', label: 'Fitted' },
  { id: 'meeting-rooms', label: 'Meeting Rooms' },
  { id: 'high-floor', label: 'High Floor' },
  { id: 'low-floor', label: 'Low Floor' },
  { id: 'retail-frontage', label: 'Retail Frontage' },
];

const residentialPropertyTypes = [
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

const commercialPropertyTypes = [
  { value: "Office", label: "Office" },
  { value: "Retail", label: "Retail" },
  { value: "Warehouse", label: "Warehouse" },
  { value: "Shop", label: "Shop" },
  { value: "Showroom", label: "Showroom" },
  { value: "Labour Camp", label: "Labour Camp" },
  { value: "Staff Accommodation", label: "Staff Accommodation" },
  { value: "Commercial Building", label: "Commercial Building" },
  { value: "Commercial Floor", label: "Commercial Floor" },
  { value: "Commercial Land", label: "Commercial Land" },
  { value: "Industrial Land", label: "Industrial Land" },
  { value: "Mixed Use Land", label: "Mixed Use Land" },
  { value: "Clinic", label: "Clinic" },
];

// --- Helpers ---

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (value && value !== "any" && value !== "0" && value !== "9999999999") {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

// --- Component ---

export type FilterBarVariant = "residential" | "commercial" | "off-plan";

interface FilterBarProps {
  variant?: FilterBarVariant;
}

export function FilterBar({ variant = "residential" }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const { openModal: openAiSearchModal } = useAiSearchModal();

  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("SALE");
  const [category, setCategory] = useState("any");
  const [readiness, setReadiness] = useState<'all' | 'ready' | 'offplan'>('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Show readiness toggle only on /buy page
  const isBuyPage = pathname === '/buy';

  // Derived config based on variant
  const propertyTypeOptions = variant === "commercial" ? commercialPropertyTypes : residentialPropertyTypes;
  const amenitiesList = variant === "commercial" ? commercialAmenities : residentialAmenities;
  const showAmenities = variant !== "off-plan";
  const showAreaRange = variant !== "off-plan";
  const showOffPlanFields = variant === "off-plan";
  const showTransactionToggle = variant !== "residential";
  const searchPlaceholder = variant === "off-plan"
    ? "Search by project, area, or keyword..."
    : "Search by area, building, or keyword...";
  const amenitiesTitle = variant === "commercial" ? "Commercial Amenities" : "Amenities";

  useEffect(() => {
    const nextCategory = normalizeCategory(searchParams.get("category")) || "any";
    setSearchQuery(cleanQueryForCategory(searchParams.get("q"), nextCategory) || "");
    setTransactionType(searchParams.get("transactionType") === "RENT" ? "RENT" : "SALE");
    setCategory(nextCategory);
    setBedrooms(searchParams.get("bedrooms") || 'any');
    setBathrooms(searchParams.get("bathrooms") || 'any');
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMinArea(searchParams.get("minArea") || "");
    setMaxArea(searchParams.get("maxArea") || "");
    const amenitiesParam = searchParams.get("amenities");
    setSelectedAmenities(amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : []);
    const readinessParam = searchParams.get("readiness");
    setReadiness(readinessParam === 'READY' ? 'ready' : readinessParam === 'OFFPLAN' ? 'offplan' : 'all');
  }, [searchKey, searchParams]);

  const toggleAmenity = useCallback((amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  }, []);

  const handleReadinessChange = (value: string) => {
    const nextReadiness = value as 'all' | 'ready' | 'offplan';
    setReadiness(nextReadiness);
    if (nextReadiness === 'offplan') {
      // Navigate to off-plan page, carrying over filters
      const params = new URLSearchParams(searchParams.toString());
      params.delete('readiness');
      const query = params.toString();
      router.push(`/off-plan${query ? `?${query}` : ''}`);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedCategory = normalizeCategory(category);

    setParam(params, "q", cleanQueryForCategory(searchQuery, normalizedCategory));
    setParam(params, "transactionType", transactionType);
    setParam(params, "category", normalizedCategory);
    setParam(params, "bedrooms", bedrooms !== 'any' ? bedrooms : '');
    setParam(params, "bathrooms", bathrooms !== 'any' ? bathrooms : '');
    setParam(params, "minPrice", minPrice);
    setParam(params, "maxPrice", maxPrice);
    setParam(params, "minArea", minArea);
    setParam(params, "maxArea", maxArea);
    setParam(params, "amenities", selectedAmenities.length > 0 ? selectedAmenities.join(',') : '');
    if (isBuyPage && readiness !== 'all') {
      setParam(params, "readiness", readiness === 'ready' ? 'READY' : 'OFFPLAN');
    } else {
      params.delete('readiness');
    }

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mb-8 -mx-4 sm:mx-0">
      <div className="p-3 sm:p-4 rounded-none sm:rounded-lg border-y sm:border bg-background shadow-lg">
        <div className="flex flex-col gap-3">

          {/* Row 1: Toggle + Search + AI Search */}
          <div className="flex gap-2 items-stretch">
            {/* Buy / Rent Toggle (only on commercial & off-plan) */}
            {showTransactionToggle && (
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
            )}

            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
                placeholder={searchPlaceholder}
                className="pl-10 h-10"
              />
            </div>

            {/* AI Search */}
            <Button
              variant="outline"
              className="flex-none h-10 text-muted-foreground font-normal"
              onClick={openAiSearchModal}
            >
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
              AI Search
            </Button>
          </div>

          {/* Row 2: Filters + Find */}
          <div className="flex gap-2 items-stretch flex-wrap">
            {/* Readiness toggle (buy page only) */}
            {isBuyPage && (
              <>
                <div className="flex-none">
                  <div className="inline-flex rounded-md border overflow-hidden h-10">
                    {(['all', 'ready', 'offplan'] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleReadinessChange(value)}
                        className={`px-3 text-sm font-medium transition-colors duration-200 ${
                          value !== 'all' ? 'border-l' : ''
                        } ${
                          readiness === value
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-background text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {value === 'all' ? 'All' : value === 'ready' ? 'Ready' : 'Off-plan'}
                      </button>
                    ))}
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-10 self-center" />
              </>
            )}

            {/* Amenities (residential & commercial only) */}
            {showAmenities && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-none h-10">
                    <Plus className="mr-2 h-4 w-4" />
                    AMENITIES
                    {selectedAmenities.length > 0 && (
                      <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold w-5 h-5">
                        {selectedAmenities.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 rounded-xl shadow-2xl overflow-hidden" align="start" sideOffset={8} collisionPadding={16} style={{ maxHeight: 'var(--radix-popover-content-available-height, 450px)' }}>
                  <div className="flex flex-col" style={{ maxHeight: 'inherit' }}>
                    <div className="p-4 pb-2 shrink-0">
                      <h4 className="font-medium leading-none">{amenitiesTitle}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Select desired features.</p>
                    </div>
                    <div className="px-4 pb-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                      <div className="grid grid-cols-2 gap-3">
                        {amenitiesList.map((amenity) => (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`filter-${amenity.id}`}
                              checked={selectedAmenities.includes(amenity.id)}
                              onCheckedChange={() => toggleAmenity(amenity.id)}
                            />
                            <Label htmlFor={`filter-${amenity.id}`} className="flex cursor-pointer items-center gap-2 font-normal">
                              <AmenityIcon name={amenity.label} className="h-4 w-4" />
                              {amenity.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <Separator orientation="vertical" className="hidden sm:block h-10 self-center" />

            {/* Property Type */}
            <div className="flex-1 min-w-0 w-full sm:w-auto sm:min-w-[140px]">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10">
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

            <Separator orientation="vertical" className="hidden sm:block h-10 self-center" />

            {/* Beds & Baths */}
            <BedsAndBathsDropdown
              bedrooms={bedrooms}
              bathrooms={bathrooms}
              onBedroomsChange={setBedrooms}
              onBathroomsChange={setBathrooms}
              variant="page"
            />

            <Separator orientation="vertical" className="hidden sm:block h-10 self-center" />

            {/* Price Range */}
            <PriceDropdown
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              variant="page"
            />

            {/* Size Range (residential & commercial only) */}
            {showAreaRange && (
              <>
                <Separator orientation="vertical" className="hidden sm:block h-10 self-center" />
                <div className="flex-1 min-w-0 w-full sm:w-auto sm:min-w-[100px]">
                  <Input placeholder="Min Sq. Ft." type="number" value={minArea} onChange={(event) => setMinArea(event.target.value)} className="h-10" />
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto sm:min-w-[100px]">
                  <Input placeholder="Max Sq. Ft." type="number" value={maxArea} onChange={(event) => setMaxArea(event.target.value)} className="h-10" />
                </div>
              </>
            )}

            {/* Off-plan specific fields */}
            {showOffPlanFields && (
              <>
                <Separator orientation="vertical" className="hidden sm:block h-10 self-center" />
                <div className="flex-1 min-w-0 w-full sm:w-auto sm:min-w-[140px]">
                  <Select>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Developer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Developer (Any)</SelectItem>
                      <SelectItem value="Celestial Developments">Celestial Developments</SelectItem>
                      <SelectItem value="GreenScape Properties">GreenScape Properties</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto sm:min-w-[140px]">
                  <Select>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Handover" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Handover (Any)</SelectItem>
                      <SelectItem value="Q1 2026">Q1 2026</SelectItem>
                      <SelectItem value="Q3 2026">Q3 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Separator orientation="vertical" className="hidden sm:block h-10 self-center" />

            {/* Find Button */}
            <Button className="flex-1 min-w-[80px] h-10 bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300" onClick={applyFilters}>
              Find
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
