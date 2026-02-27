
"use client";

import { Award, Handshake, Target } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';
import { ParallaxImage } from '@/components/parallax-image';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';

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

export default function SellPage() {
  const { openModal } = useContactModal();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-sell');

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
        <div className="container max-w-7xl">
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
        <div className="container max-w-3xl text-center">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Selling Journey?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Contact one of our expert agents today for a complimentary property valuation and consultation.
            </p>
            <Button onClick={openModal} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Contact an Agent
            </Button>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}
