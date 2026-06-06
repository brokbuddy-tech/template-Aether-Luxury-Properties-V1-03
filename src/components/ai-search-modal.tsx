"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAiSearchModal } from '@/hooks/use-ai-search-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { cleanQueryForCategory, normalizeCategory } from '@/lib/search-utils';

type AiSearchFilters = {
  q?: string;
  type?: string;
  transactionType?: string;
  propertyType?: string;
  category?: string;
  readiness?: string;
  bedrooms?: string;
  bathrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
};

function getSearchDestination(filters: AiSearchFilters) {
  if (filters.propertyType === 'COMMERCIAL' || filters.type === 'commercial') return '/commercial';
  if (filters.readiness === 'OFFPLAN' || filters.type === 'new-homes') return '/off-plan';
  if (filters.transactionType === 'RENT' || filters.type === 'rent') return '/rent';
  return '/buy';
}

function buildSearchHref(filters: AiSearchFilters) {
  const params = new URLSearchParams();
  const category = normalizeCategory(filters.category);
  const normalizedFilters = {
    ...filters,
    category,
    q: cleanQueryForCategory(filters.q, category),
  };

  Object.entries(normalizedFilters).forEach(([key, value]) => {
    if (!value || key === 'type' || key === 'transactionType' || key === 'propertyType') return;
    params.set(key, value);
  });

  const query = params.toString();
  return `${getSearchDestination(filters)}${query ? `?${query}` : ''}`;
}

export function AiSearchModal() {
  const { isOpen, closeModal } = useAiSearchModal();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error('AI search failed');
      const data = await response.json() as { filters?: AiSearchFilters };
      router.push(buildSearchHref(data.filters || { q: query.trim() }));
      closeModal();
      setQuery('');
    } catch {
      router.push(`/buy?q=${encodeURIComponent(query.trim())}`);
      closeModal();
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="bg-black/60 md:bg-black/50 backdrop-blur-lg border-white/20 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI-Powered Property Search
          </DialogTitle>
          <DialogDescription className="text-white/80">
            Describe your ideal property in your own words, and our AI will find the perfect match for you.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="ai-search-message">What are you looking for?</Label>
            <Textarea 
              id="ai-search-message" 
              placeholder="e.g., 'A 3-bedroom villa in Dubai Hills with a private pool and a modern kitchen, close to a park. My budget is around $2M.'"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-[120px] bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent"
            />
          </div>
          <Button type="submit" className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSearching || !query.trim()}>
            {isSearching ? 'Searching...' : 'Search with AI'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
