
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Briefcase,
  Clock,
  Mic,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  services,
  stats,
  communities,
  socialLinks,
  newsArticles,
} from '@/lib/data';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PropertyTypeDropdown } from '@/components/property-type-dropdown';
import { BedsAndBathsDropdown } from '@/components/beds-baths-dropdown';
import { PriceDropdown } from '@/components/price-dropdown';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AmenityIcon } from '@/components/amenity-icon';
import { useAiSearchModal } from '@/hooks/use-ai-search-modal';
import { Progress } from '@/components/ui/progress';
import { getSiteConfig } from '@/lib/api';
import { getAgencyDisplayName } from '@/lib/live-mappers';
import type { SiteConfig } from '@/lib/live-types';
import { LatestListingsSection } from '@/components/latest-listings-section';
import { cleanQueryForCategory, normalizeCategory } from '@/lib/search-utils';

const HERO_AMENITIES = [
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
  amenities?: string;
};

function getSearchDestination(filters: AiSearchFilters, fallbackMode: 'buy' | 'rent') {
  if (filters.propertyType === 'COMMERCIAL' || filters.type === 'commercial') return '/commercial';
  if (filters.readiness === 'OFFPLAN' || filters.type === 'new-homes') return '/off-plan';
  if (filters.transactionType === 'RENT' || filters.type === 'rent') return '/rent';
  if (filters.readiness === 'READY') return fallbackMode === 'rent' ? '/rent' : '/buy';
  return fallbackMode === 'rent' ? '/rent' : '/buy';
}

function buildSearchHref(filters: AiSearchFilters, fallbackMode: 'buy' | 'rent') {
  const params = new URLSearchParams();
  const category = normalizeCategory(filters.category);
  const normalizedFilters = {
    ...filters,
    category,
    q: cleanQueryForCategory(filters.q, category),
  };

  Object.entries(normalizedFilters).forEach(([key, value]) => {
    if (!value || value === 'any') return;
    if (key === 'type' || key === 'transactionType' || key === 'propertyType') return;
    params.set(key, value);
  });

  const query = params.toString();
  return `${getSearchDestination(filters, fallbackMode)}${query ? `?${query}` : ''}`;
}

async function parseAiSearch(query: string, filters: AiSearchFilters) {
  const response = await fetch('/api/ai-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, filters }),
  });

  if (!response.ok) throw new Error('AI search failed');
  const data = await response.json() as { filters?: AiSearchFilters };
  return data.filters || {};
}


export default function Home() {
  const router = useRouter();
  const [transactionMode, setTransactionMode] = useState<'buy' | 'rent'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyCategory, setPropertyCategory] = useState('any');
  const [readiness, setReadiness] = useState<'all' | 'ready' | 'offplan'>('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const { openModal: openAiSearchModal } = useAiSearchModal();
  const [expertiseIndex, setExpertiseIndex] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0);

  const teamImage = PlaceHolderImages.find(p => p.id === 'team-group');
  const awardsImage = PlaceHolderImages.find(p => p.id === 'awards-1');
  const ctaImage = PlaceHolderImages.find(p => p.id === 'hero-dubai');
  const agencyName = getAgencyDisplayName(siteConfig);

  const expertiseSlides = [
    {
      tagline: `WHY ${agencyName.toUpperCase()}`,
      headline: 'Property Expertise, Backed by Structure',
      body: 'Our agents have deep expertise in Dubai and the systems to back it up – so your move is informed and smooth.',
    },
    {
      tagline: 'DATA-DRIVEN INSIGHTS',
      headline: 'Smarter Decisions, Better Outcomes',
      body: 'We leverage market-leading data and analytics to provide you with a competitive edge, ensuring every decision is backed by real-time intelligence.',
    },
    {
      tagline: 'UNMATCHED SUPPORT',
      headline: 'A Seamless Journey, From Start to Finish',
      body: 'Our dedicated client managers and advanced digital platform provide white-glove support, delivering a smoother transaction and a superior outcome.',
    },
  ];

  const [serviceCarouselApi, setServiceCarouselApi] = useState<CarouselApi>()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let active = true;

    async function loadSiteConfig() {
      try {
        const nextSiteConfig = await getSiteConfig();
        if (active) {
          setSiteConfig(nextSiteConfig);
        }
      } catch {
        if (active) {
          setSiteConfig(null);
        }
      }
    }

    void loadSiteConfig();

    return () => {
      active = false;
    };
  }, [])

  useEffect(() => {
    if (!serviceCarouselApi) {
      return
    }

    const onScroll = () => {
      setScrollProgress(serviceCarouselApi.scrollProgress() * 100)
    }

    serviceCarouselApi.on('scroll', onScroll)
    serviceCarouselApi.on('reInit', onScroll)
    onScroll()

    return () => {
      if (serviceCarouselApi) {
        serviceCarouselApi.off('scroll', onScroll)
        serviceCarouselApi.off('reInit', onScroll)
      }
    }
  }, [serviceCarouselApi])

  useEffect(() => {
    const expertiseTimer = setInterval(() => {
      setExpertiseIndex(prevIndex => (prevIndex + 1) % expertiseSlides.length);
    }, 3000);

    const newsTimer = setInterval(() => {
      setNewsIndex(prevIndex => (prevIndex + 1) % newsArticles.length);
    }, 3000);

    return () => {
      clearInterval(expertiseTimer);
      clearInterval(newsTimer);
    };
  }, [expertiseSlides.length, newsArticles.length]);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const getCurrentFilters = (): AiSearchFilters => ({
    q: cleanQueryForCategory(searchQuery, propertyCategory),
    transactionType: transactionMode === 'rent' ? 'RENT' : 'SALE',
    category: normalizeCategory(propertyCategory),
    readiness: readiness === 'ready' ? 'READY' : readiness === 'offplan' ? 'OFFPLAN' : undefined,
    bedrooms: bedrooms !== 'any' ? bedrooms : undefined,
    bathrooms: bathrooms !== 'any' ? bathrooms : undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    minArea: minArea || undefined,
    maxArea: maxArea || undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities.join(',') : undefined,
  });

  const handleSearch = () => {
    router.push(buildSearchHref(getCurrentFilters(), transactionMode));
  };

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      openAiSearchModal();
      return;
    }

    setIsAiSearching(true);
    try {
      const filters = await parseAiSearch(searchQuery, getCurrentFilters());
      router.push(buildSearchHref({ ...getCurrentFilters(), ...filters }, transactionMode));
    } catch {
      router.push(buildSearchHref(getCurrentFilters(), transactionMode));
    } finally {
      setIsAiSearching(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Section 2: Hero & Search */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/home.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll className="w-full">
            <h1>
              Dubai Real Estate. Built Better.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-light tracking-widest text-white/90">
              Buying, selling, renting or investing in Dubai should feel clear, seamless and well handled. At <strong>{agencyName}</strong>, we&apos;ve built our business to remove friction, raise standards and deliver better outcomes for clients and brokers alike.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <div className="mt-12 w-full max-w-5xl">
              <div className="p-2 rounded-lg bg-white/20 md:bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <Tabs value={transactionMode} onValueChange={(value) => { setTransactionMode(value as 'buy' | 'rent'); if (value === 'rent') setReadiness('all'); }} className="shrink-0">
                    <TabsList className="bg-transparent h-10">
                      <TabsTrigger value="buy" className="text-white data-[state=active]:bg-copper-gold data-[state=active]:text-white px-4">BUY</TabsTrigger>
                      <TabsTrigger value="rent" className="text-white data-[state=active]:bg-copper-gold data-[state=active]:text-white px-4">RENT</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Input
                    type="text"
                    placeholder="Search for community, building or location"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSearch();
                    }}
                    className="bg-white/20 border-0 text-white placeholder:text-gray-300 focus-visible:ring-accent flex-1 min-w-0 h-10 w-full"
                  />
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 h-10 px-6 w-full md:w-auto" onClick={handleSearch}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
                <div className="mt-2 flex flex-col md:flex-row gap-2 items-center">
                  {transactionMode === 'buy' && (
                    <Tabs value={readiness} onValueChange={(value) => setReadiness(value as 'all' | 'ready' | 'offplan')} className="shrink-0">
                      <TabsList className="bg-transparent h-10">
                        <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/25 data-[state=active]:text-white px-3 text-xs">All</TabsTrigger>
                        <TabsTrigger value="ready" className="text-white data-[state=active]:bg-white/25 data-[state=active]:text-white px-3 text-xs">Ready</TabsTrigger>
                        <TabsTrigger value="offplan" className="text-white data-[state=active]:bg-white/25 data-[state=active]:text-white px-3 text-xs">Off-plan</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}
                  <PropertyTypeDropdown
                    value={propertyCategory}
                    onValueChange={setPropertyCategory}
                    variant="hero"
                  />
                  <BedsAndBathsDropdown
                    bedrooms={bedrooms}
                    bathrooms={bathrooms}
                    onBedroomsChange={setBedrooms}
                    onBathroomsChange={setBathrooms}
                    variant="hero"
                  />
                  <PriceDropdown
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                    variant="hero"
                  />

                  {/* AI Search – icon only, tooltip on hover */}
                  <Button
                    variant="ghost"
                    className="group relative text-white hover:bg-white/20 hover:text-white w-auto shrink-0 px-3"
                    onClick={handleAiSearch}
                    disabled={isAiSearching}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-white text-xs whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 border border-white/15">
                      {isAiSearching ? 'Searching...' : 'AI Search'}
                    </span>
                  </Button>

                  {/* Advanced Filters */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white w-full md:w-auto">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 rounded-xl shadow-2xl overflow-hidden border border-white/20 bg-black/70 backdrop-blur-2xl text-white flex flex-col"
                      align="end"
                      sideOffset={8}
                      collisionPadding={16}
                      style={{ maxHeight: 'var(--radix-popover-content-available-height, 500px)' }}
                    >
                      <div className="p-4 border-b border-white/15 shrink-0">
                        <h4 className="font-semibold leading-none">Filters</h4>
                        <p className="text-sm text-white/60 mt-1">
                          Refine your search criteria.
                        </p>
                      </div>
                      <div className="p-4 space-y-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                        {/* Area (Sq. Ft.) */}
                        <div className="space-y-3">
                          <Label className='text-sm font-semibold text-white'>Area (Sq. Ft.)</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs text-accent font-semibold">Minimum</label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={minArea}
                                onChange={(e) => setMinArea(e.target.value)}
                                className="h-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-accent"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-accent font-semibold">Maximum</label>
                              <Input
                                type="number"
                                placeholder="Any"
                                value={maxArea}
                                onChange={(e) => setMaxArea(e.target.value)}
                                className="h-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-accent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-3">
                          <Label className='text-sm font-semibold text-white'>Amenities</Label>
                          <p className="text-xs text-white/50">Select desired features.</p>
                          <div className="grid grid-cols-2 gap-3">
                            {HERO_AMENITIES.map((amenity) => (
                              <div key={amenity.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`hero-${amenity.id}`}
                                  checked={selectedAmenities.includes(amenity.id)}
                                  onCheckedChange={() => toggleAmenity(amenity.id)}
                                  className="border-white/40 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                                />
                                <Label htmlFor={`hero-${amenity.id}`} className="flex cursor-pointer items-center gap-2 text-sm font-normal text-white/80">
                                  <AmenityIcon name={amenity.label} className="h-4 w-4" />
                                  {amenity.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="flex gap-3 p-4 border-t border-white/15">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-full font-semibold border-white/30 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                          onClick={() => { setMinArea(''); setMaxArea(''); setSelectedAmenities([]); }}
                        >
                          Reset
                        </Button>
                        <Button
                          className="flex-1 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                          onClick={handleSearch}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 3: Service Discovery Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-left max-w-3xl mb-12 ml-[10px]">
            <FadeInOnScroll>
              <h2>Explore Property in Dubai</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                <strong>{agencyName}</strong> helps buyers, sellers, and investors navigate the Dubai real estate market with absolute clarity and confidence. Our teams combine deep local expertise with advanced digital systems and white-glove support, all built to deliver smoother transactions and superior outcomes every step of the way.
              </p>
            </FadeInOnScroll>
          </div>
          <Carousel
            setApi={setServiceCarouselApi}
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {services.map((service, index) => {
                const serviceImage = PlaceHolderImages.find(p => p.id === service.image);
                return (
                  <CarouselItem key={service.title} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <FadeInOnScroll delay={index * 100}>
                      <Link href={service.href}>
                        <Card className="group relative h-[400px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                          {serviceImage && (
                            <Image
                              src={serviceImage.imageUrl}
                              alt={service.title}
                              data-ai-hint={serviceImage.imageHint}
                              fill
                              className="object-cover transition-transform group-hover:scale-110 duration-500"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="p-4 rounded-lg md:bg-transparent md:backdrop-blur-none md:border-transparent group-hover:bg-white/10 group-hover:backdrop-blur-md group-hover:border group-hover:border-white/20 transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20">
                              <h3 className="text-2xl font-bold text-white">
                                {service.title}
                              </h3>
                              <p className="text-white/80 mt-2 line-clamp-2 md:max-h-0 md:opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 delay-100 ease-in-out overflow-hidden">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </FadeInOnScroll>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="ml-2 sm:ml-14" />
            <CarouselNext className="mr-2 sm:mr-14" />
          </Carousel>
          <Progress value={scrollProgress} className="mt-4 w-1/3 mx-auto" />
        </div>
      </section>

      {/* Section 4: Data-Driven Performance Bar */}
      <section className="py-8 bg-muted">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center items-start">
            {stats.map((stat) => (
              <FadeInOnScroll key={stat.label}>
                <stat.icon className="h-6 w-6 mx-auto mb-1 text-primary" />
                <p className="text-lg md:text-xl font-bold text-primary">{stat.value}</p>
                <p className="text-[10px] leading-tight md:text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <LatestListingsSection />

      {/* Section 5: Professional Expertise Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-24">
            <div className="w-full md:w-1/2 lg:w-3/5">
              <FadeInOnScroll>
                {teamImage && (
                  <Image
                    src={teamImage.imageUrl}
                    alt={teamImage.description}
                    data-ai-hint={teamImage.imageHint}
                    width={800}
                    height={600}
                    className="rounded-lg object-cover"
                  />
                )}
              </FadeInOnScroll>
            </div>
            <div className="w-full md:w-1/2 lg:w-2/5">
              <div key={expertiseIndex}>
                <FadeInOnScroll>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">
                    {expertiseSlides[expertiseIndex].tagline}
                  </p>
                  <h2 className="mt-2 text-2xl md:text-4xl font-extrabold leading-tight font-headline text-primary">
                    {expertiseSlides[expertiseIndex].headline}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {expertiseSlides[expertiseIndex].body}
                  </p>
                </FadeInOnScroll>
              </div>
              <div className="flex gap-3 mt-8">
                {expertiseSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setExpertiseIndex(index)}
                    className={cn(
                      'h-3 w-3 rounded-full transition-colors',
                      expertiseIndex === index ? 'bg-accent' : 'bg-gray-300 hover:bg-gray-400'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5.5: Insights & Achievements */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column: News Carousel */}
            <div className="flex flex-col justify-center">
              <div key={newsIndex}>
                <FadeInOnScroll>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">
                    NEWS & UPDATES
                  </p>
                  <h2 className="mt-4 mb-4 text-2xl md:text-4xl font-extrabold text-primary font-headline">
                    {newsArticles[newsIndex].title}
                  </h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {newsArticles[newsIndex].description}
                  </p>
                  <Link href={newsArticles[newsIndex].href} className="mt-6 inline-block font-bold text-primary hover:underline">
                    READ MORE »
                  </Link>
                </FadeInOnScroll>
              </div>

              <div className="flex gap-3 mt-8">
                {newsArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setNewsIndex(index)}
                    className={cn(
                      'h-3 w-3 rounded-full transition-colors',
                      newsIndex === index ? 'bg-accent' : 'bg-gray-300 hover:bg-gray-400'
                    )}
                    aria-label={`Go to news slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Awards Image */}
            <div>
              <FadeInOnScroll delay={200}>
                {awardsImage && (
                  <Image
                    src={awardsImage.imageUrl}
                    alt={awardsImage.description}
                    data-ai-hint={awardsImage.imageHint}
                    width={800}
                    height={600}
                    className="rounded-lg object-cover aspect-video"
                  />
                )}
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* As Seen On Section */}
      <section className="py-8 bg-muted">
        <div className="container flex justify-center">
          <FadeInOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center text-muted-foreground/80 grayscale">
              <span className="text-center text-sm sm:text-lg font-headline font-semibold">Arabian Business</span>
              <span className="text-center text-base sm:text-xl font-headline font-bold tracking-wider">INSIDER</span>
              <span className="text-center text-sm sm:text-lg font-headline font-bold">GULF NEWS</span>
              <span className="text-center text-sm sm:text-lg font-headline font-bold">The National</span>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 6: Community Guide Scroller */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <FadeInOnScroll>
            <div className="text-left max-w-[900px] mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 font-headline">Explore Communities in Dubai</h2>
              <p className="text-lg text-muted-foreground">
                Choosing the right community is as fundamental as choosing the property itself. At <strong>{agencyName}</strong>, our specialized area experts provide you with deep, data-driven insights into localized pricing, market demand, and long-term investment value. We empower you to make confident, informed decisions rather than rushed ones, ensuring your future home or investment perfectly aligns with your lifestyle goals.
              </p>
            </div>
          </FadeInOnScroll>
          <Carousel opts={{ align: 'start' }}>
            <CarouselContent className="-ml-4">
              {communities.map((community, index) => {
                const communityImage = PlaceHolderImages.find(p => p.id === community.image);
                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <FadeInOnScroll delay={index * 100}>
                      <Link href={community.href}>
                        <Card className="group relative h-[450px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                          {communityImage && (
                            <Image
                              src={communityImage.imageUrl}
                              alt={community.name}
                              data-ai-hint={communityImage.imageHint}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="p-4 rounded-lg md:bg-transparent md:backdrop-blur-none md:border-transparent group-hover:bg-white/10 group-hover:backdrop-blur-md group-hover:border group-hover:border-white/20 transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20">
                              <h3 className="text-3xl font-bold text-white font-headline">{community.name}</h3>
                              <p className="text-white/80 mt-2 line-clamp-2 md:max-h-0 md:opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 delay-100 ease-in-out overflow-hidden">
                                {community.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </FadeInOnScroll>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="ml-2 sm:ml-14" />
            <CarouselNext className="mr-2 sm:mr-14" />
          </Carousel>
        </div>
      </section>

      {/* Section 7: Find Your Next Home CTA */}
      <section
        className="relative h-[500px] w-full bg-cover bg-center bg-scroll lg:bg-fixed"
        style={{
          backgroundImage: ctaImage ? `url(${ctaImage.imageUrl})` : 'none',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Find Your Next Home With {agencyName}.
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/90">
              Looking to buy, rent, or invest in Dubai? Our team is here to guide you every step of the way. Let&apos;s make your property journey simple, smooth, and successful.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="font-headline border-white border-2 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 h-auto">
                <Link href="/buy">SEARCH PROPERTIES</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-headline border-white border-2 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 h-auto">
                <Link href="/contact">CONTACT US</Link>
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}














