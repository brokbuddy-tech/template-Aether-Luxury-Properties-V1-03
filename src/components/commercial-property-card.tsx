
import Image from 'next/image';
import Link from 'next/link';
import type { CommercialProperty } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Square, Building, Warehouse, Store } from 'lucide-react';
import { Button } from './ui/button';

const propertyTypeIcons = {
  'Office': <Building className="h-4 w-4" />,
  'Retail': <Store className="h-4 w-4" />,
  'Warehouse': <Warehouse className="h-4 w-4" />,
};

export function CommercialPropertyCard({ property }: { property: CommercialProperty }) {
  const image = PlaceHolderImages.find(p => p.id === property.image);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg rounded-none flex flex-col">
      <Link href={`#`} className="block flex flex-col flex-grow">
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
           <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <span className="text-white/50 text-xl font-bold font-headline">Aether Luxury Properties</span>
           </div>
          <Badge 
            className="absolute top-2 right-2" 
            variant={property.transactionType === 'BUY' ? 'default' : 'secondary'}
          >
            FOR {property.transactionType}
          </Badge>
        </div>
        <CardContent className="p-4 flex-grow">
          <p className="text-lg font-bold font-headline text-primary">
            AED {property.price.toLocaleString()}
            {property.transactionType === 'RENT' && ' / year'}
          </p>
          <h3 className="mt-1 font-semibold truncate">{property.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{property.address}</p>
          <div className="mt-4 flex justify-start items-center gap-4 text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-1.5">
              {propertyTypeIcons[property.propertyType]}
              <span>{property.propertyType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
      </Link>
       <CardFooter className="p-4 pt-0 mt-auto">
          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-sm">
            <Link href="#">VIEW PROPERTY</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
