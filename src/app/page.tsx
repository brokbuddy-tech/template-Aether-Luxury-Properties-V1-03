
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { ParallaxImage } from '@/components/parallax-image';
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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAiSearchModal } from '@/hooks/use-ai-search-modal';
import { Progress } from '@/components/ui/progress';


export default function Home() {
  const [priceRange, setPriceRange] = useState([0]);
  const [currency, setCurrency] = useState('AED');
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-2');
  const { openModal: openAiSearchModal } = useAiSearchModal();
  const [expertiseIndex, setExpertiseIndex] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0);

  const teamImage = PlaceHolderImages.find(p => p.id === 'team-group');
  const awardsImage = PlaceHolderImages.find(p => p.id === 'awards-1');

  const expertiseSlides = [
    {
      tagline: 'WHY AETHER LUXURY',
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

  const formatPrice = (value: number) => {
    const prefix = currency === 'USD' ? '$' : '';
    const suffix = currency !== 'USD' ? ` ${currency}` : '';

    if (value >= 10000000) {
      return `${prefix}10M+${suffix}`;
    }
    if (value >= 1000000) {
      return `${prefix}${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M${suffix}`;
    }
    if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k${suffix}`;
    }
    return `${prefix}${value}${suffix}`;
  };

  return (
    <div className="flex flex-col">
      {/* Section 2: Hero & Search */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {heroImage && (
          <ParallaxImage
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll>
            <h1 className="text-4xl md:text-7xl font-bold tracking-widest">
              Dubai Real Estate. Built Better.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-white/90 font-light tracking-widest">
              Buying, selling, renting or investing in Dubai should feel clear, seamless and well handled. At <strong>Aether Luxury Properties</strong>, we’ve built our business to remove friction, raise standards and deliver better outcomes — for clients and brokers alike.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <div className="mt-12 w-full max-w-4xl">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20">
                <Tabs defaultValue="buy">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="buy" className="text-white data-[state=active]:bg-copper-gold data-[state=active]:text-white">BUY</TabsTrigger>
                    <TabsTrigger value="rent" className="text-white data-[state=active]:bg-copper-gold data-[state=active]:text-white">RENT</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="mt-2 flex flex-col md:flex-row gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Search for community, building or location"
                    className="bg-white/20 border-0 text-white placeholder:text-gray-300 focus-visible:ring-accent flex-grow"
                  />
                  <Select>
                    <SelectTrigger className="bg-white/20 border-0 text-white placeholder:text-gray-300 focus:ring-accent focus:ring-offset-0 w-full md:w-[220px]">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent className='bg-black/50 text-white border-white/20 backdrop-blur-xl'>
                      <SelectItem value="apartments">Apartments</SelectItem>
                      <SelectItem value="villas">Villas</SelectItem>
                      <SelectItem value="penthouses">Penthouses</SelectItem>
                      <SelectItem value="townhouses">Townhouses</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white w-full md:w-auto" onClick={openAiSearchModal}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Search
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white w-full md:w-auto">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Advanced Filters
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 border border-white/20 bg-black/50 text-white backdrop-blur-lg">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Advanced Filters</h4>
                                <p className="text-sm text-white/80">
                                    Refine your search criteria.
                                </p>
                            </div>
                            <div className="grid gap-y-6">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <Label htmlFor="price-range-popover" className='text-white'>Max Price</Label>
                                      <Select value={currency} onValueChange={setCurrency}>
                                          <SelectTrigger className="w-[90px] h-7 text-xs bg-white/20 border-0 text-white focus:ring-accent focus:ring-offset-0">
                                              <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className='border border-white/20 bg-black/50 text-white backdrop-blur-lg'>
                                              <SelectItem value="AED">AED</SelectItem>
                                              <SelectItem value="USD">USD</SelectItem>
                                              <SelectItem value="EUR">EUR</SelectItem>
                                              <SelectItem value="GBP">GBP</SelectItem>
                                          </SelectContent>
                                      </Select>
                                    </div>
                                    <span className='text-sm text-white/90'>
                                      {formatPrice(priceRange[0])}
                                    </span>
                                  </div>
                                  <Slider
                                      id="price-range-popover"
                                      value={priceRange}
                                      onValueChange={setPriceRange}
                                      min={0}
                                      max={10000000}
                                      step={100000}
                                      dir="ltr"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label className='text-white'>Bedrooms</Label>
                                      <Select>
                                          <SelectTrigger className="bg-white/20 border-0 text-white placeholder:text-gray-300 focus:ring-accent focus:ring-offset-0">
                                              <SelectValue placeholder="Any" />
                                          </SelectTrigger>
                                          <SelectContent className='border border-white/20 bg-black/50 text-white backdrop-blur-lg'>
                                              <SelectItem value="any">Any</SelectItem>
                                              <SelectItem value="1">1+ Beds</SelectItem>
                                              <SelectItem value="2">2+ Beds</SelectItem>
                                              <SelectItem value="3">3+ Beds</SelectItem>
                                              <SelectItem value="4">4+ Beds</SelectItem>
                                              <SelectItem value="5">5+ Beds</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  </div>
                                  <div className="space-y-2">
                                      <Label className='text-white'>Bathrooms</Label>
                                      <Select>
                                          <SelectTrigger className="bg-white/20 border-0 text-white placeholder:text-gray-300 focus:ring-accent focus:ring-offset-0">
                                              <SelectValue placeholder="Any" />
                                          </SelectTrigger>
                                          <SelectContent className='border border-white/20 bg-black/50 text-white backdrop-blur-lg'>
                                              <SelectItem value="any">Any</SelectItem>
                                              <SelectItem value="1">1+ Baths</SelectItem>
                                              <SelectItem value="2">2+ Baths</SelectItem>
                                              <SelectItem value="3">3+ Baths</SelectItem>
                                              <SelectItem value="4">4+ Baths</SelectItem>
                                              <SelectItem value="5">5+ Baths</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className='text-white'>Amenities</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white/20 border-0 text-white placeholder:text-gray-300 focus:ring-accent focus:ring-offset-0">
                                            <SelectValue placeholder="Any" />
                                        </SelectTrigger>
                                        <SelectContent className='border border-white/20 bg-black/50 text-white backdrop-blur-lg'>
                                            <SelectItem value="any">Any</SelectItem>
                                            <SelectItem value="pool">Swimming Pool</SelectItem>
                                            <SelectItem value="gym">Gym</SelectItem>
                                            <SelectItem value="view">Ocean View</SelectItem>
                                            <SelectItem value="theater">Home Theater</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                                    Apply Filters
                                  </Button>
                            </div>
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
                <h2 className="text-4xl font-bold font-headline">Explore Property in Dubai</h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  <strong>Aether Luxury Properties</strong> helps buyers, sellers, and investors navigate the Dubai real estate market with absolute clarity and confidence. Our teams combine deep local expertise with advanced digital systems and white-glove support, all built to deliver smoother transactions and superior outcomes—every step of the way.
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
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
          <Progress value={scrollProgress} className="mt-4 w-1/3 mx-auto" />
        </div>
      </section>

      {/* Section 4: Data-Driven Performance Bar */}
      <section className="py-12 bg-[hsl(var(--chart-2))] text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <FadeInOnScroll key={stat.label}>
                <stat.icon className="h-10 w-10 mx-auto mb-2" />
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="text-sm uppercase tracking-wider">{stat.label}</p>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

       {/* Section 5: Professional Expertise Section */}
       <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
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
                  <h2 className="mt-2 text-4xl font-extrabold leading-tight font-headline text-primary">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: News Carousel */}
            <div className="flex flex-col justify-center">
              <div key={newsIndex}>
                <FadeInOnScroll>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">
                    NEWS & UPDATES
                  </p>
                  <h2 className="mt-4 mb-4 text-4xl font-extrabold text-primary font-headline">
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
      <section className="py-12 bg-muted pt-0 mt-0">
        <div className="container">
          <FadeInOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center text-muted-foreground/80 grayscale">
              <span className="text-2xl font-headline font-semibold">Arabian Business</span>
              <span className="text-3xl font-headline font-bold tracking-wider">INSIDER</span>
              <span className="text-2xl font-headline font-bold">GULF NEWS</span>
              <span className="text-2xl font-headline font-bold">The National</span>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 6: Community Guide Scroller */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <FadeInOnScroll>
            <div className="text-left max-w-[900px] mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4 font-headline">Explore Communities in Dubai</h2>
              <p className="text-lg text-muted-foreground">
                Choosing the right community is as fundamental as choosing the property itself. At <strong>Aether Luxury Properties</strong>, our specialized area experts provide you with deep, data-driven insights into localized pricing, market demand, and long-term investment value. We empower you to make confident, informed decisions rather than rushed ones—ensuring your future home or investment perfectly aligns with your lifestyle goals.
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
                         <div className="group relative h-[450px] overflow-hidden rounded-lg">
                           {communityImage && (
                             <Image
                               src={communityImage.imageUrl}
                               alt={community.name}
                               data-ai-hint={communityImage.imageHint}
                               fill
                               className="object-cover transition-transform duration-500 group-hover:scale-110"
                             />
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                           <div className="absolute bottom-0 left-0 right-0 p-4">
                              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-md border border-white/20">
                                <h3 className="text-3xl font-bold text-white font-headline">{community.name}</h3>
                              </div>
                           </div>
                         </div>
                      </Link>
                     </FadeInOnScroll>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </div>
      </section>

       {/* Section 7: Lead Magnet */}
       <section className="bg-muted py-16 md:py-24">
        <div className="container text-center">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Contact one of our expert agents today for a complimentary property valuation and consultation.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/sell">List Your Property</Link>
            </Button>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}
    

    






    