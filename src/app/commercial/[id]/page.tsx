
"use client";

import { useState, useEffect } from 'react';
import { getCommercialPropertyById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  Car, 
  ClipboardCheck, 
  Eye, 
  MapPin, 
  Phone, 
  Mail,
  Share2,
  QrCode
} from "lucide-react";
import Link from 'next/link';

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

export default function CommercialPropertyDetailPage({ params }: { params: { id: string } }) {
  const property = getCommercialPropertyById(params.id);

  if (!property) {
    notFound();
  }

  const agentImage = PlaceHolderImages.find(p => p.id === property.agent.image);
  const galleryImages = property.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as typeof PlaceHolderImages[0][];
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-location');

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[60vh] mb-8">
              <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden">
                {galleryImages[0] && <Image src={galleryImages[0].imageUrl} alt={property.title} fill className="object-cover" />}
              </div>
              <div className="col-start-1 row-start-1 hidden"></div>
              {galleryImages[1] && <div className="relative rounded-lg overflow-hidden"><Image src={galleryImages[1].imageUrl} alt={property.title} fill className="object-cover" /></div>}
              {galleryImages[2] && <div className="relative rounded-lg overflow-hidden"><Image src={galleryImages[2].imageUrl} alt={property.title} fill className="object-cover" /></div>}
          </div>

          <div className="mb-8">
            <p className="text-4xl font-extrabold text-primary">AED {property.price.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">DLD-{property.id}</p>
            <h1 className="text-2xl font-bold font-headline mt-2">{property.title}</h1>
            <p className="text-lg text-muted-foreground">{property.address}</p>
          </div>

          <Separator />

          <div className="py-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">Property Description</h2>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8">
            {property.grade && <div className="flex items-center gap-3"><Building className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">Grade</p><p>{property.grade}</p></div></div>}
            {property.views && <div className="flex items-center gap-3"><Eye className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">Views</p><p>{property.views.join(', ')}</p></div></div>}
            {property.condition && <div className="flex items-center gap-3"><ClipboardCheck className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">Condition</p><p>{property.condition}</p></div></div>}
            {property.parking && <div className="flex items-center gap-3"><Car className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">Parking</p><p>{property.parking} spaces</p></div></div>}
          </div>

          {property.amenities && property.amenities.length > 0 && (
             <>
              <Separator />
              <div className="py-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">Amenities</h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-muted-foreground">
                  {property.amenities.map(amenity => <li key={amenity}>- {amenity}</li>)}
                </ul>
              </div>
            </>
          )}

          <div className="py-8">
            <h2 className="text-xl font-bold font-headline mb-4">LOCATION</h2>
             {mapImage && (
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden border">
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  data-ai-hint={mapImage.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
              )}
            <p className="text-muted-foreground mt-2">{property.address}, Dubai</p>
          </div>

          <MortgageCalculator price={property.price} />

        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
                <CardHeader className="bg-muted">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-4 border-background">
                            {agentImage && <AvatarImage src={agentImage.imageUrl} alt={property.agent.name} />}
                            <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-xl">{property.agent.name}</p>
                            <p className="text-sm text-muted-foreground">Luxury Property Specialist</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <Button className="w-full">
                        <Phone className="mr-2" /> Call Agent
                    </Button>
                     <Button variant="outline" className="w-full">
                        <Mail className="mr-2" /> Send Inquiry
                    </Button>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <p className="text-sm">Share this property:</p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon"><Share2 /></Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg mt-4">
                      <QrCode className="h-24 w-24 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground mt-2 text-center">Scan to verify DLD Permit</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


    