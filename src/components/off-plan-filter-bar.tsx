
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAiSearchModal } from "@/hooks/use-ai-search-modal";
import { cleanQueryForCategory, normalizeCategory } from "@/lib/search-utils";

const propertyTypeOptions = [
  { value: "Apartment", label: "Apartments" },
  { value: "Villa", label: "Villas" },
  { value: "Penthouse", label: "Penthouses" },
  { value: "Townhouse", label: "Townhouses" },
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
  const [category, setCategory] = useState("any");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setCategory(normalizeCategory(searchParams.get("category")) || "any");
  }, [searchKey, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedCategory = normalizeCategory(category);

    setParam(params, "q", cleanQueryForCategory(searchQuery, normalizedCategory));
    setParam(params, "category", normalizedCategory);

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mb-8">
      <div className="p-4 rounded-lg border bg-background shadow-lg">
        <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-auto lg:flex-1 min-w-[240px]">
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
            
            <div className="flex-auto min-w-[180px]">
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

            <div className="flex-auto min-w-[180px]">
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

            <div className="flex-auto min-w-[180px]">
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
