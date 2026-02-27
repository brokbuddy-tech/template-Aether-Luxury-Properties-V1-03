
"use client";

import { useState } from 'react';
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

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  services,
  stats,
  teamMembers,
  newsArticles,
  communities,
  socialLinks,
} from '@/lib/data';
import { ParallaxImage } from '@/components/parallax-image';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAiSearchModal } from '@/hooks/use-ai-search-modal';


export default function Home() {
  const [priceRange, setPriceRange] = useState([0]);
  const [currency, setCurrency] = useState('AED');
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-2');
  const awardsImage = PlaceHolderImages.find(p => p.id === 'awards-1');
  const { openModal: openAiSearchModal } = useAiSearchModal();

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
          <Carousel
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
                              className="object-cover transition-transform group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                              <h3 className="text-2xl font-bold text-white">
                                {service.title}
                              </h3>
                              <p className="text-white/80 mt-2 line-clamp-2">{service.description}</p>
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

      {/* Section 5: Team, Awards, & Content Hub */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FadeInOnScroll>
              <h2 className="text-4xl font-bold mb-8">
                Property Expertise,
                <br />
                Backed by Structure.
              </h2>
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-bold">Meet The Team</h3>
                  </CardHeader>
                  <CardContent>
                    <Carousel opts={{ loop: true }}>
                      <CarouselContent>
                        {teamMembers.map((member) => {
                          const memberImage = PlaceHolderImages.find(
                            p => p.id === member.image
                          );
                          return (
                            <CarouselItem key={member.name} className="md:basis-1/2">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                  {memberImage && <AvatarImage src={memberImage.imageUrl} />}
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">{member.role}</p>
                                </div>
                              </div>
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>
                       <CarouselPrevious className="-left-4"/>
                       <CarouselNext className="-right-4"/>
                    </Carousel>
                  </CardContent>
                </Card>
                <Card>
                  <Carousel opts={{ loop: true }}>
                    <CarouselContent>
                      {newsArticles.map((article, i) => (
                        <CarouselItem key={i}>
                          <CardHeader>
                            <h3 className="text-2xl font-bold">{article.title}</h3>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{article.description}</p>
                            <Button variant="link" asChild className="p-0 h-auto text-accent">
                              <Link href={article.href}>Read More <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                          </CardContent>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                     <CarouselPrevious className="top-8 right-16"/>
                     <CarouselNext className="top-8 right-4"/>
                  </Carousel>
                </Card>
              </div>
            </FadeInOnScroll>

            <div className="space-y-8">
               <FadeInOnScroll delay={100}>
                {awardsImage && (
                  <Card className="overflow-hidden">
                    <div className="relative h-64 w-full">
                       <Image src={awardsImage.imageUrl} alt="Awards" data-ai-hint={awardsImage.imageHint} fill className="object-cover"/>
                       <div className="absolute inset-0 bg-black/40"/>
                       <div className="absolute bottom-6 left-6">
                          <h3 className="text-2xl font-bold text-white">Aether recognised with four awards.</h3>
                       </div>
                    </div>
                  </Card>
                )}
               </FadeInOnScroll>
               <FadeInOnScroll delay={200}>
                <div className="grid grid-cols-2 gap-8">
                  {socialLinks.map(link => (
                    <Link href={link.href} key={link.title}>
                      <Card className="text-center p-8 hover:bg-muted transition-colors">
                        <link.icon className="h-10 w-10 mx-auto text-accent mb-4"/>
                        <h4 className="font-bold text-lg">{link.title}</h4>
                      </Card>
                    </Link>
                  ))}
                </div>
               </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Community Guide Scroller */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <FadeInOnScroll>
             <h2 className="text-4xl font-bold text-center mb-12">Community Guides</h2>
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
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                           <h3 className="absolute bottom-6 left-6 text-3xl font-bold text-white">{community.name}</h3>
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

    

    

    