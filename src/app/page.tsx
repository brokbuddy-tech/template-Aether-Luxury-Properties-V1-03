
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { properties } from '@/lib/data';
import { PropertyCard } from '@/components/property-card';
import { ParallaxImage } from '@/components/parallax-image';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex flex-col">
      <section className="relative h-[80vh] w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll>
            <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
              Discover Your Celestial Home
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-200">
              Aether Luxury Properties offers an exclusive portfolio of the world's most prestigious homes.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/buy">Explore Properties</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Link href="/sell">List with Us</Link>
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-7xl">
          <FadeInOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Featured Properties</h2>
            <p className="text-center text-muted-foreground mb-12">Handpicked for the discerning eye.</p>
          </FadeInOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.slice(0, 4).map((property, index) => (
              <FadeInOnScroll key={property.id} delay={index * 100}>
                <PropertyCard property={property} />
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
