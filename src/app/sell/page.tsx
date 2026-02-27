
"use client";

import { Award, Handshake, Target, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';
import { ParallaxImage } from '@/components/parallax-image';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const workPrinciples = [
  {
    icon: <Target className="h-10 w-10 text-primary" />,
    title: 'Precision Marketing',
    description: 'We use data-driven strategies to target the right buyers for your property, ensuring maximum exposure and optimal pricing.',
  },
  {
    icon: <Handshake className="h-10 w-10 text-primary" />,
    title: 'Expert Negotiation',
    description: 'Our seasoned agents are masters of negotiation, dedicated to securing the best possible terms and price for your sale.',
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Unrivaled Service',
    description: 'From staging to closing, we provide a seamless, white-glove experience, handling every detail with professionalism and care.',
  },
];

const valuationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z.enum(['villa', 'apartment', 'townhouse', 'penthouse', 'land']),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms are required'),
});

type ValuationFormValues = z.infer<typeof valuationSchema>;


export default function SellPage() {
  const { openModal } = useContactModal();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-sell');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
        propertyType: 'villa',
        bedrooms: 1,
    },
  });

  const onSubmit: SubmitHandler<ValuationFormValues> = async (data) => {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(data);
      setIsSubmitting(false);
      toast({
          title: "Valuation Request Sent",
          description: "Thank you! An agent will be in touch with your property valuation shortly.",
      });
      form.reset();
  };

  return (
    <div>
      <section className="relative h-[60vh] w-full bg-black overflow-hidden">
        {heroImage && (
          <ParallaxImage
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">
              Achieve the True Value of Your Property
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-200">
              Partner with Aether to navigate the market with confidence and secure an exceptional result.
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <FadeInOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Commitment to You</h2>
          </FadeInOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {workPrinciples.map((principle, index) => (
              <FadeInOnScroll key={principle.title} delay={index * 100}>
                <div className="text-center">
                  <div className="flex justify-center mb-4">{principle.icon}</div>
                  <h3 className="text-2xl font-bold font-headline mb-2">{principle.title}</h3>
                  <p className="text-muted-foreground">{principle.description}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
              <FadeInOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Ready to Begin Your Selling Journey?</h2>
                  <p className="text-muted-foreground mb-8 text-lg">
                      Receive a complimentary, data-driven valuation of your property from one of our expert agents. Simply fill out the form, and we'll be in touch to provide you with an accurate market assessment and a tailored selling strategy.
                  </p>
                  <div className="space-y-4 text-muted-foreground">
                      <p className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600" /> No-obligation valuation</p>
                      <p className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600" /> Expert market insights</p>
                      <p className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600" /> Confidential consultation</p>
                  </div>
                   <Button onClick={openModal} size="lg" variant="outline" className="mt-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Or, Contact an Agent Directly
                    </Button>
              </FadeInOnScroll>
          </div>
          <div>
              <FadeInOnScroll delay={200}>
                  <Card>
                      <CardHeader>
                          <CardTitle>Get a Free Property Valuation</CardTitle>
                          <CardDescription>Fill in the details below to get started.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                  <FormField control={form.control} name="name" render={({ field }) => (
                                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                  )} />
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="+971..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                  </div>
                                  <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                                      <FormItem><FormLabel>Property Address</FormLabel><FormControl><Input placeholder="e.g., Apt 101, Downtown Views, Dubai" {...field} /></FormControl><FormMessage /></FormItem>
                                  )} />
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="propertyType" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {['villa', 'apartment', 'townhouse', 'penthouse', 'land'].map(type => (
                                                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={form.control} name="bedrooms" render={({ field }) => (
                                      <FormItem><FormLabel>Bedrooms</FormLabel>
                                       <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                                          <FormControl><SelectTrigger><SelectValue placeholder="Select bedrooms" /></SelectTrigger></FormControl>
                                          <SelectContent>
                                            {[0, 1, 2, 3, 4, 5, 6].map(num => (
                                              <SelectItem key={num} value={String(num)}>{num === 0 ? 'Studio' : `${num} Bedroom${num > 1 ? 's' : ''}`}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      <FormMessage /></FormItem>
                                    )} />
                                  </div>
                                  <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Get My Valuation'}
                                  </Button>
                              </form>
                          </Form>
                      </CardContent>
                  </Card>
              </FadeInOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}
