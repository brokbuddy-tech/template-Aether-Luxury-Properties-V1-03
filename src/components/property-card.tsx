import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square } from 'lucide-react';

export function PropertyCard({ property }: { property: Property }) {
  const image = PlaceHolderImages.find(p => p.id === property.image);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative h-56 w-full">
          {image && (
            <Image
              src={image.imageUrl}
              alt={property.title}
              data-ai-hint={image.imageHint}
              fill
              className="object-cover"
            />
          )}
          <Badge 
            className="absolute top-2 right-2" 
            variant={property.type === 'BUY' ? 'default' : 'secondary'}
          >
            FOR {property.type}
          </Badge>
        </div>
        <CardContent className="p-4">
          <p className="text-lg font-bold font-headline text-primary">
            ${property.price.toLocaleString()}
          </p>
          <h3 className="mt-1 font-semibold truncate">{property.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{property.address}</p>
          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
