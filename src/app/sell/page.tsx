"use client";

import { Award, Handshake, Target, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ParallaxImage } from '@/components/parallax-image';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const sellPillars = [
    {
      title: "Accurate, Market-Led Valuations",
      description: "Valuations based on real-time data and local insight to help you price your property right."
    },
    {
      title: "Serious Buyers, Ready to Move",
      description: "Access one of Dubai’s largest buyer networks actively searching for homes just like yours."
    },
    {
      title: "Marketing That Makes an Impact",
      description: "Professional photography, premium listings, and paid campaigns designed to attract attention and drive enquiries."
    },
    {
      title: "Personal Service, Start to Sold",
      description: "Your dedicated agent handles everything — from viewings to negotiation — ensuring a seamless sales journey."
    }
];

const faqs = [
  {
    question: "How much does a property valuation cost?",
    answer: "Our property valuations are completely complimentary and come with no obligation. It's the first step in our commitment to providing you with transparent, expert advice."
  },
  {
    question: "How long does it take to get my valuation?",
    answer: "After you submit your request, one of our dedicated market experts will typically be in touch within 24 hours to discuss your property and provide an initial data-driven assessment."
  },
  {
    question: "What factors affect my property's value?",
    answer: "A property's value is determined by a combination of factors, including location, size, condition, unique features, recent comparable sales in the area, and current market trends. Our experts analyze all these data points to provide the most accurate valuation."
  },
  {
    question: "Do I need to prepare anything before the valuation?",
    answer: "While not essential, having a list of any recent upgrades or renovations, and details of service charges or community fees can be helpful. Our agent will guide you through everything else during the consultation."
  },
  {
    question: "How will my property be marketed?",
    answer: "We employ a bespoke marketing strategy for each property, which includes professional photography and videography, premium placements on top property portals, targeted social media campaigns, and exposure to our exclusive network of qualified buyers."
  },
  {
    question: "What happens after I list my property?",
    answer: "Once listed, your dedicated agent will manage all viewings, provide regular feedback, and handle all negotiations on your behalf. We manage the entire process, from listing to closing, ensuring a seamless and successful sale."
  }
];

export default function SellPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-sell');
  const valuationBgImage = PlaceHolderImages.find(p => p.id === 'hero-dubai');
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

      <section 
        className="relative py-16 md:py-24 bg-cover bg-center bg-scroll lg:bg-fixed"
        style={{ backgroundImage: valuationBgImage ? `url(${valuationBgImage.imageUrl})` : 'none' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
              <FadeInOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline text-white">Ready to Begin Your Selling Journey?</h2>
                  <p className="text-white/90 mb-8 text-lg">
                      Receive a complimentary, data-driven valuation of your property from one of our expert agents. Simply fill out the form, and we'll be in touch to provide you with an accurate market assessment and a tailored selling strategy.
                  </p>
                  <div className="space-y-4 text-white/90">
                      <p className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400" /> No-obligation valuation</p>
                      <p className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400" /> Expert market insights</p>
                      <p className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400" /> Confidential consultation</p>
                  </div>
                   <Button asChild size="lg" className="mt-8 border border-white/30 bg-black/20 backdrop-blur-sm text-white hover:bg-white/10">
                      <Link href="/contact">Or, Contact an Agent Directly</Link>
                    </Button>
              </FadeInOnScroll>
          </div>
          <div>
              <FadeInOnScroll delay={200}>
                  <Card className="bg-black/60 md:bg-black/50 backdrop-blur-lg border border-white/20 text-white">
                      <CardHeader>
                          <CardTitle>Get a Free Property Valuation</CardTitle>
                          <CardDescription className="text-white/80">Fill in the details below to get started.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                  <FormField control={form.control} name="name" render={({ field }) => (
                                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
                                  )} />
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="+971..." {...field} className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                  </div>
                                  <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                                      <FormItem><FormLabel>Property Address</FormLabel><FormControl><Input placeholder="e.g., Apt 101, Downtown Views, Dubai" {...field} className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
                                  )} />
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="propertyType" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="bg-black/20 border-white/30 data-[placeholder]:text-gray-400 focus-visible:ring-accent"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                                <SelectContent className="bg-black/50 text-white border-white/20 backdrop-blur-xl">
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
                                          <FormControl><SelectTrigger className="bg-black/20 border-white/30 data-[placeholder]:text-gray-400 focus-visible:ring-accent"><SelectValue placeholder="Select bedrooms" /></SelectTrigger></FormControl>
                                          <SelectContent className="bg-black/50 text-white border-white/20 backdrop-blur-xl">
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container flex flex-col items-center">
            <FadeInOnScroll>
                <div className="text-center max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Why Sell With Us?</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        At Aether Luxury Properties, selling your property is more than a transaction — it’s a partnership built on trust, transparency, and results. Our mission is to deliver the smoothest, most rewarding selling experience in the Dubai property market.
                    </p>
                </div>
            </FadeInOnScroll>
            
            <div className="border-t my-10 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                {sellPillars.map((pillar, index) => (
                    <FadeInOnScroll key={pillar.title} delay={index * 100}>
                        <div>
                            <h3 className="text-xl font-bold text-primary mb-3 font-headline">{pillar.title}</h3>
                            <p className="text-base text-muted-foreground leading-relaxed">{pillar.description}</p>
                        </div>
                    </FadeInOnScroll>
                ))}
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FadeInOnScroll>
                <h2 className="text-4xl font-extrabold text-primary font-headline">
                  Valuation FAQs
                </h2>
              </FadeInOnScroll>
            </div>
          </div>
          <div className="lg:col-span-2">
            <FadeInOnScroll delay={200}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border-b py-6">
                    <AccordionTrigger className="text-lg font-semibold text-left hover:text-accent transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

    </div>
  );
}

    
