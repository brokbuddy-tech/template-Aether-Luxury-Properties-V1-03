"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAiSearchModal } from "@/hooks/use-ai-search-modal";

const amenitiesList = [
  { id: 'swimming-pool', label: 'Swimming Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'ocean-view', label: 'Ocean View' },
  { id: 'home-theater', label: 'Home Theater' },
  { id: 'private-garden', label: 'Private Garden' },
  { id: 'smart-home', label: 'Smart Home' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'concierge-service', label: 'Concierge Service' },
];


export function FilterBar() {
  const { openModal: openAiSearchModal } = useAiSearchModal();

  return (
    <div className="mb-8">
      <div className="p-4 rounded-lg border bg-background shadow-lg">
        <div className="flex flex-col gap-4">
          
          {/* First Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* AI Search Button */}
            <div className="flex-auto lg:flex-1">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground font-normal"
                onClick={openAiSearchModal}
              >
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                AI Search: Describe your ideal property...
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-10 hidden lg:flex" />

            {/* Property Type */}
            <div className="flex-auto min-w-[180px]">
              <Label className="sr-only">Property Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Property Type (Any)</SelectItem>
                  <SelectItem value="apartments">Apartments</SelectItem>
                  <SelectItem value="villas">Villas</SelectItem>
                  <SelectItem value="penthouses">Penthouses</SelectItem>
                  <SelectItem value="townhouses">Townhouses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator orientation="vertical" className="h-10 hidden xl:flex" />
            
            {/* Price Range */}
            <div className="flex-auto min-w-[180px]">
              <Label className="sr-only">Min Price</Label>
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="Min Price" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="0">Min Price (Any)</SelectItem>
                      <SelectItem value="500000">AED 500k</SelectItem>
                      <SelectItem value="1000000">AED 1M</SelectItem>
                      <SelectItem value="5000000">AED 5M</SelectItem>
                      <SelectItem value="10000000">AED 10M</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="flex-auto min-w-[180px]">
              <Label className="sr-only">Max Price</Label>
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="Max Price" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="9999999999">Max Price (Any)</SelectItem>
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
                <Input placeholder="Min Sq. Ft." type="number" />
                </div>
                <div className="flex-auto min-w-[180px]">
                <Label className="sr-only">Max Sq. Ft.</Label>
                <Input placeholder="Max Sq. Ft." type="number" />
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
                            <h4 className="font-medium leading-none">Amenities</h4>
                            <p className="text-sm text-muted-foreground">Select desired features.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {amenitiesList.map((amenity) => (
                                <div key={amenity.id} className="flex items-center space-x-2">
                                    <Checkbox id={amenity.id} />
                                    <Label htmlFor={amenity.id} className="font-normal cursor-pointer">{amenity.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
                </Popover>
            </div>

            <Button className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300">
              Find
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
