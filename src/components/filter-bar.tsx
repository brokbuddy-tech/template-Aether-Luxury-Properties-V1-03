
"use client";

import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

export function FilterBar() {
  return (
    <div className="sticky top-[70px] z-30 mb-8 -mx-4 sm:mx-0">
      <div className="p-6 rounded-none sm:rounded-lg border-y sm:border bg-background/80 backdrop-blur-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-end">
          <div className="space-y-3">
            <Label htmlFor="price-range">Price Range (USD)</Label>
            <Slider
              id="price-range"
              defaultValue={[500000, 5000000]}
              min={0}
              max={10000000}
              step={100000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$500k</span>
              <span>$10M+</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+ Baths</SelectItem>
                <SelectItem value="2">2+ Baths</SelectItem>
                <SelectItem value="3">3+ Baths</SelectItem>
                <SelectItem value="4">4+ Baths</SelectItem>
                <SelectItem value="5">5+ Baths</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="area-range">Area (sqft)</Label>
            <Slider
              id="area-range"
              defaultValue={[1000, 8000]}
              min={500}
              max={15000}
              step={100}
            />
             <div className="flex justify-between text-sm text-muted-foreground">
              <span>500</span>
              <span>15k+</span>
            </div>
          </div>
          <Button className="w-full xl:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Search className="mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
