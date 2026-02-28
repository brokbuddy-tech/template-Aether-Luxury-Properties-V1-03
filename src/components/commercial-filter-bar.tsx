
"use client";

import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function CommercialFilterBar() {
  return (
    <div className="mb-8 -mx-4 sm:mx-0">
      <div className="p-6 rounded-none sm:rounded-lg border-y sm:border bg-background shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
          
          <div className="space-y-2 lg:col-span-2">
            <Label>Keyword</Label>
            <Input placeholder="City, community, building or location" />
          </div>
          
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select defaultValue="BUY">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="RENT">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="price-range">Price Range (AED)</Label>
            <Slider
              id="price-range"
              defaultValue={[1000000, 20000000]}
              min={0}
              max={50000000}
              step={500000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0</span>
              <span>50M+</span>
            </div>
          </div>
          
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Search className="mr-2" />
            Find
          </Button>
        </div>
      </div>
    </div>
  );
}
