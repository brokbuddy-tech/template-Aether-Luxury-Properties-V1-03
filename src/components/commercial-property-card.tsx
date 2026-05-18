
"use client";

import Image from 'next/image';
import type { CommercialProperty } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Square, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Link from 'next/link';
import { resolveTemplateGallery } from '@/lib/media';

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


export function CommercialPropertyCard({ property }: { property: CommercialProperty }) {
  const images = resolveTemplateGallery(
    property.images.length > 0 ? property.images : [property.image],
    'commercial-1',
    property.title,
  );

  return (
    <div className="relative group">
      <Card className="flex flex-col w-full max-w-[350px] mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white group-hover:shadow-xl transition-shadow duration-300">
        <Link href={`/commercial/${property.id}`} className="block">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        data-ai-hint={image.hint}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </Carousel>
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-grow text-[#111827]">
          <p className="text-2xl font-extrabold">
            AED {property.price.toLocaleString()}
            {property.transactionType === 'RENT' && ' / year'}
          </p>
          <Link href={`/commercial/${property.id}`} className="block">
            <h3 className="mt-2 text-sm font-bold tracking-wide text-[#374151] uppercase hover:underline">
              {property.title}
            </h3>
          </Link>
          <div className="mt-4 space-y-2 text-base text-[#4B5563] flex-grow">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2 text-base text-[#4B5563]">
              <Square className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <span>{property.area.toLocaleString()} sq ft</span>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/?text=I'm interested in ${property.title} (ID: ${property.id})`, '_blank');
              }}
              className="rounded-md bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 flex items-center gap-2 px-4 py-2 h-auto"
            >
              <WhatsAppIcon />
              <span className="uppercase font-bold text-sm">Whatsapp</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

