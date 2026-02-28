"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

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


export function CommercialFilterBar() {
  return (
    <div className="sticky top-[64px] z-30 mb-8 -mx-4 sm:mx-0">
      <div className="p-4 rounded-none sm:rounded-lg border-y sm:border bg-background shadow-lg">
        <div className="flex flex-wrap gap-4 items-center">
          
          {/* Keyword Search */}
          <div className="flex-auto lg:flex-1">
            <Label className="sr-only">Keyword Search</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="City, community or building" className="pl-10" />
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-10 hidden lg:flex" />

          {/* Transaction Type */}
          <div className="flex-auto min-w-[180px]">
            <Label className="sr-only">Transaction Type</Label>
            <Select defaultValue="BUY">
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="RENT">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="flex-auto min-w-[180px]">
            <Label className="sr-only">Property Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Property Type (Any)</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
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

          <Separator orientation="vertical" className="h-10 hidden xl:flex" />

          {/* Size Range */}
          <div className="flex-auto min-w-[180px]">
            <Label className="sr-only">Min Sq. Ft.</Label>
            <Input placeholder="Min Sq. Ft." type="number" />
          </div>
           <div className="flex-auto min-w-[180px]">
             <Label className="sr-only">Max Sq. Ft.</Label>
            <Input placeholder="Max Sq. Ft." type="number" />
          </div>

          <Separator orientation="vertical" className="h-10 hidden lg:flex" />

          {/* Amenities & Find */}
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
                                <Label htmlFor={amenity.id} className="font-normal cursor-pointer">{amenity.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
          </Popover>
          
          <Button className="flex-auto bg-[#005555] hover:bg-[#003333] text-white transition-colors duration-300">
            Find
          </Button>
        </div>
      </div>
    </div>
  );
}
