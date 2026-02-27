"use client";

import { useAiSearchModal } from '@/hooks/use-ai-search-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

export function AiSearchModal() {
  const { isOpen, closeModal } = useAiSearchModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="bg-background/80 backdrop-blur-lg border-border/20 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI-Powered Property Search
          </DialogTitle>
          <DialogDescription>
            Describe your ideal property in your own words, and our AI will find the perfect match for you.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ai-search-message">What are you looking for?</Label>
            <Textarea 
              id="ai-search-message" 
              placeholder="e.g., 'A 3-bedroom villa in Dubai Hills with a private pool and a modern kitchen, close to a park. My budget is around $2M.'"
              className="min-h-[120px]"
            />
          </div>
          <Button type="submit" className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            Search with AI
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
