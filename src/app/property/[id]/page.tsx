
"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  BedDouble, 
  Bath, 
  Square,
  CheckCircle,
  MapPin, 
  Phone, 
  Link2,
  Facebook,
  Twitter,
  Linkedin,
  Info,
} from "lucide-react";
import Link from 'next/link';
import { PropertyCard } from '@/components/property-card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LocationMap } from '@/components/shared/location-map';
import { getProperties, getPropertyById as getLivePropertyById } from '@/lib/api';
import { resolveTemplateGallery, resolveTemplateImage } from '@/lib/media';
import { toAetherProperty } from '@/lib/live-mappers';
import type { Property } from '@/lib/types';

function MortgageCalculator({ price }: { price: number }) {
  const [purchasePrice, setPurchasePrice] = useState(price);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanPeriod, setLoanPeriod] = useState(25);
  const [interestRate, setInterestRate] = useState(4.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const principal = purchasePrice * (1 - downPaymentPercent / 100);
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanPeriod * 12;

    if (monthlyInterestRate > 0) {
      const M = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      setMonthlyPayment(M);
    } else if (numberOfPayments > 0) {
      setMonthlyPayment(principal / numberOfPayments);
    } else {
      setMonthlyPayment(0);
    }
  }, [purchasePrice, downPaymentPercent, loanPeriod, interestRate]);

  const downPaymentValue = purchasePrice * (downPaymentPercent / 100);

  return (
    <Card className="bg-muted/50 mt-12">
        <CardHeader>
            <CardTitle className="font-thin tracking-[0.2em]">EXPLORE YOUR MORTGAGE POSSIBILITIES</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="purchasePrice">Purchase Price (AED)</Label>
                            <span className="font-bold">{purchasePrice.toLocaleString()}</span>
                        </div>
                        <Slider id="purchasePrice" value={[purchasePrice]} onValueChange={(v) => setPurchasePrice(v[0])} min={price * 0.5} max={price * 1.5} step={10000} />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="downPayment">Down Payment ({downPaymentPercent}%)</Label>
                            <span className="font-bold">{downPaymentValue.toLocaleString()}</span>
                        </div>
                        <Slider id="downPayment" value={[downPaymentPercent]} onValueChange={(v) => setDownPaymentPercent(v[0])} min={10} max={80} step={1} />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="loanPeriod">Loan Period (Years)</Label>
                            <span className="font-bold">{loanPeriod}</span>
                        </div>
                        <Slider id="loanPeriod" value={[loanPeriod]} onValueChange={(v) => setLoanPeriod(v[0])} min={5} max={30} step={1} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="interestRate">Interest Rate (%)</Label>
                            <span className="font-bold">{interestRate.toFixed(2)}</span>
                        </div>
                        <Slider id="interestRate" value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={1} max={10} step={0.01} />
                    </div>
                </div>
                <div className="flex items-center justify-center bg-background rounded-lg p-6">
                    <div className="text-center">
                        <p className="text-muted-foreground">Monthly Payment</p>
                        <p className="text-4xl font-bold text-primary mt-2">AED {monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}

const WhatsAppIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.425 5.215 5.233-1.383z" />
    </svg>
);

function getCommunityFromAddress(address: string) {
  const parts = address.split(', ');
  if (parts.length > 2) {
    return parts[parts.length - 2];
  }
  return parts.length > 1 ? parts[0] : null;
}


export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProperty() {
      try {
        const liveProperty = await getLivePropertyById(params.id as string);
        if (!active) return;

        if (liveProperty) {
          const mappedProperty = toAetherProperty(liveProperty);
          setProperty(mappedProperty);

          const relatedResponse = await getProperties({
            transactionType: liveProperty.transactionType === 'Rent' ? 'RENT' : 'SALE',
            limit: 48,
          });
          if (!active) return;

          const currentCommunity = getCommunityFromAddress(mappedProperty.address);
          const nextRelatedProperties = relatedResponse.properties
            .map(toAetherProperty)
            .filter((candidate) => candidate.id !== mappedProperty.id)
            .filter((candidate) => {
              if (!currentCommunity) return true;
              return getCommunityFromAddress(candidate.address) === currentCommunity;
            })
            .slice(0, 4);

          setRelatedProperties(nextRelatedProperties);
        } else {
          setProperty(null);
          setRelatedProperties([]);
        }
      } catch {
        if (!active) return;
        setProperty(null);
        setRelatedProperties([]);
      } finally {
        if (active) {
          setIsLoaded(true);
        }
      }
    }

    void loadProperty();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (!property && isLoaded) {
    notFound();
  }

  if (!property) {
    return <div className="container py-24 text-center text-muted-foreground">Loading property...</div>;
  }

  const agentImage = resolveTemplateImage(property.agent.image, 'agent-1', property.agent.name);
  const galleryImages = resolveTemplateGallery(
    property.images.length > 0 ? property.images : [property.image],
    'hero-1',
    property.title,
  );
  const qrCodeImage = PlaceHolderImages.find(p => p.id === 'qr-code');

  const upfrontCosts = {
    securityDeposit: property.price * 0.05,
    agencyFee: 5000,
    agencyFeeVat: 5000 * 0.05,
    ejariFee: 220,
    ejariFeeVat: 220 * 0.05,
    dewaDeposit: 2130, // Assuming apartment
    chillerDeposit: 2000,
    moveInPermit: 0,
  };
    
  const totalCost = 
    property.price +
    upfrontCosts.securityDeposit +
    upfrontCosts.agencyFee +
    upfrontCosts.agencyFeeVat +
    upfrontCosts.ejariFee +
    upfrontCosts.ejariFeeVat +
    upfrontCosts.dewaDeposit +
    upfrontCosts.chillerDeposit +
    upfrontCosts.moveInPermit;

  return (
    <div className="container py-12">
      {/* Gallery */}
      <div className="relative mb-8 group">
        {/* Mobile Carousel View */}
        <div className="md:hidden">
            <Carousel className="w-full">
                <CarouselContent>
                    {galleryImages.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  data-ai-hint={image.hint}
                                  fill
                                  className="object-cover"
                                />
                                 <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                                    <span className="text-white/50 text-xl font-bold font-headline select-none">
                                        Aether Luxury Properties
                                    </span>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {galleryImages.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary" />
                    </>
                )}
            </Carousel>
        </div>
        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-3 md:grid-rows-2 gap-2 h-auto md:h-[60vh]">
          <div className="col-span-1 md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden aspect-video md:aspect-auto">
            {galleryImages[0] && <Image src={galleryImages[0].src} alt={galleryImages[0].alt} data-ai-hint={galleryImages[0].hint} fill className="object-cover" />}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <span className="text-white/50 text-3xl font-bold font-headline select-none">
                Aether Luxury Properties
              </span>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden aspect-video md:aspect-auto">
            {galleryImages[1] && <Image src={galleryImages[1].src} alt={galleryImages[1].alt} data-ai-hint={galleryImages[1].hint} fill className="object-cover" />}
             <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <span className="text-white/50 text-xl font-bold font-headline select-none">
                Aether Luxury Properties
              </span>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden aspect-video md:aspect-auto">
            {galleryImages[2] && <Image src={galleryImages[2].src} alt={galleryImages[2].alt} data-ai-hint={galleryImages[2].hint} fill className="object-cover" />}
             <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <span className="text-white/50 text-xl font-bold font-headline select-none">
                Aether Luxury Properties
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            {property.type === 'RENT' && (
                <Accordion type="single" collapsible className="w-full bg-muted/50 rounded-lg mb-8">
                    <AccordionItem value="item-1" className="border-0">
                        <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline">
                            <div className="flex items-center gap-3">
                                <Info className="h-5 w-5 text-muted-foreground" />
                                Show upfront costs
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <p>Rental Price (Yearly)</p>
                                    <p className="font-semibold">AED {property.price.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Security Deposit</p>
                                    <p className="font-semibold">AED {upfrontCosts.securityDeposit.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Agency Fee</p>
                                    <p className="font-semibold">AED {upfrontCosts.agencyFee.toLocaleString()} <span className="text-xs text-muted-foreground">+ 5% VAT</span></p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Ejari Fee</p>
                                    <p className="font-semibold">AED {upfrontCosts.ejariFee.toLocaleString()} <span className="text-xs text-muted-foreground">+ 5% VAT</span></p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>DEWA Deposit</p>
                                    <p className="font-semibold">AED {upfrontCosts.dewaDeposit.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Empower/Chiller Deposit</p>
                                    <p className="font-semibold">AED {upfrontCosts.chillerDeposit.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Move-in Permit</p>
                                    <p className="font-semibold">AED {upfrontCosts.moveInPermit.toLocaleString()}</p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="text-center">
                                <p className="text-lg font-bold">TOTAL: AED {totalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}

          <div className="mb-8">
            <p className="text-3xl md:text-4xl font-extrabold text-primary">AED {property.price.toLocaleString()}{property.type === 'RENT' ? ' / year' : ''}</p>
            <p className="text-muted-foreground text-sm">Property ID-{property.id}</p>
            <h1 className="text-xl md:text-2xl font-bold font-headline mt-2">{property.title}</h1>
            <p className="text-base md:text-lg text-muted-foreground">{property.address}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-8">
            <div className="flex items-center gap-3"><BedDouble className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">{property.bedrooms} Beds</p></div></div>
            <div className="flex items-center gap-3"><Bath className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">{property.bathrooms} Baths</p></div></div>
            <div className="flex items-center gap-3"><Square className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">{property.area.toLocaleString()} sqft</p></div></div>
          </div>
          
          <Separator />

          <div className="py-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">Property Description</h2>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>
          
          {property.keyFeatures && property.keyFeatures.length > 0 && (
             <>
              <Separator />
              <div className="py-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">Key Features</h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-muted-foreground">
                  {property.keyFeatures.map(feature => <li key={feature} className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> {feature}</li>)}
                </ul>
              </div>
            </>
          )}

          <div className="py-8">
            <h2 className="text-xl font-bold font-headline mb-4">LOCATION</h2>
            <LocationMap
              latitude={property.latitude}
              longitude={property.longitude}
              addressLabel={property.address}
              locationLabel={getCommunityFromAddress(property.address) || property.address}
            />
            <p className="text-muted-foreground mt-2">{property.address}</p>
          </div>

          {property.dldPermitNo && qrCodeImage && (
            <div className="py-8">
                <div className="p-8 rounded-lg bg-muted/50 flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                    <Image
                        src={qrCodeImage.imageUrl.replace('data=Example', `data=${property.dldPermitNo}`)}
                        alt="DLD Permit QR Code"
                        width={120}
                        height={120}
                        className='rounded-md'
                    />
                    <div>
                        <p className="text-xl font-bold">DLD Permit No:</p>
                        <p className="text-2xl text-muted-foreground mt-1">{property.dldPermitNo}</p>
                        <p className="text-sm text-muted-foreground mt-4 italic">
                            This property listing has been reviewed and verified by Dubai Land Department
                        </p>
                    </div>
                </div>
            </div>
          )}

          <Separator />
          
          {property.type === 'BUY' && <MortgageCalculator price={property.price} />}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="rounded-xl bg-muted p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32">
                  {agentImage && <AvatarImage src={agentImage.src} alt={property.agent.name} />}
                  <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-bold uppercase tracking-wider">{property.agent.name}</h3>
                <p className="text-muted-foreground">Luxury Property Specialist</p>

                <div className="mt-6 hidden md:grid grid-cols-2 gap-2 w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold px-6 py-3 h-auto">
                    <Phone /> PHONE
                  </Button>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold px-6 py-3 h-auto">
                    <WhatsAppIcon /> WHATSAPP
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="w-full">
                  <p className="text-sm font-bold text-muted-foreground mb-3 uppercase">Share this property</p>
                  <div className="flex justify-center gap-2">
                    <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link2 />
                    </Button>
                    <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <WhatsAppIcon />
                    </Button>
                    <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Facebook />
                    </Button>
                    <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Twitter />
                    </Button>
                    <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Linkedin />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {relatedProperties.length > 0 && (
        <div className="mt-24">
          <Separator />
          <div className="py-16">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">Other Properties in {getCommunityFromAddress(property.address)}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedProperties.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 border-t z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold h-auto py-3">
              <Phone /> PHONE
            </Button>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold h-auto py-3">
              <WhatsAppIcon /> WHATSAPP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
