
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAiSearchModal } from "@/hooks/use-ai-search-modal";

export function OffPlanFilterBar() {
  const { openModal: openAiSearchModal } = useAiSearchModal();

  return (
    <div className="mb-8">
      <div className="p-4 rounded-lg border bg-background shadow-lg">
        <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-auto lg:flex-1">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground font-normal"
                onClick={openAiSearchModal}
              >
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                AI Search: Describe your ideal off-plan project...
              </Button>
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

            <Button className="w-full sm:w-auto sm:flex-initial bg-accent hover:bg-accent/90 text-accent-foreground px-8">
              Find
            </Button>
        </div>
      </div>
    </div>
  );
}
