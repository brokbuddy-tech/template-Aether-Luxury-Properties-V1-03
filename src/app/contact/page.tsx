
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';

import { ParallaxImage } from '@/components/parallax-image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    setIsSubmitting(false);
    toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We will get back to you shortly.",
    });
    form.reset();
  };

  return (
    <div>
      <section className="relative h-[50vh] w-full overflow-hidden">
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
            <h1 className="text-4xl md:text-6xl font-bold tracking-widest font-headline">
              Contact Us
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-white/90">
              We're here to help. Reach out to us for any inquiries or to start your property journey.
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <FadeInOnScroll>
                <h2 className="text-3xl font-bold font-headline text-primary">Get In Touch</h2>
                <p className="mt-4 text-muted-foreground">
                  Whether you're looking to buy, sell, or simply have a question, our team of experts is ready to assist you.
                </p>
                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted rounded-full p-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Our Office</h3>
                      <p className="text-muted-foreground">7th, 8th & 20th Floor, Control Tower, Motor City, Dubai, UAE.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="bg-muted rounded-full p-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-muted-foreground">+971 4 876 2333</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                     <div className="bg-muted rounded-full p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">info@aether-properties.com</p>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            </div>
            <div className="lg:col-span-2">
              <FadeInOnScroll delay={200}>
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>Fill out the form and we'll respond as soon as possible.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="+971..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Inquiry about Property #123" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Your message here..." className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
