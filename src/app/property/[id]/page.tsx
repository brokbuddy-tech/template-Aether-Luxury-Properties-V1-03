
import { getPropertyById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FadeInOnScroll } from "@/components/fade-in-on-scroll";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  const agentImage = PlaceHolderImages.find(p => p.id === property.agent.image);

  return (
    <div className="container max-w-6xl py-12">
      <FadeInOnScroll threshold={0.01}>
        <Carousel className="w-full mb-8">
          <CarouselContent>
            {property.images.map((imgId, index) => {
              const image = PlaceHolderImages.find(p => p.id === imgId);
              return (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] w-full rounded-lg overflow-hidden">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={`${property.title} - image ${index + 1}`}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <FadeInOnScroll>
            <Badge variant={property.type === 'BUY' ? 'default' : 'secondary'}>FOR {property.type}</Badge>
            <h1 className="font-headline text-4xl font-bold mt-2">{property.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">{property.address}</p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg my-6 border-y py-4">
                <div className="flex items-center gap-2 font-semibold">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Bath className="h-5 w-5 text-primary" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Square className="h-5 w-5 text-primary" />
                  <span>{property.area.toLocaleString()} sqft</span>
                </div>
            </div>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={100}>
            <div className="prose max-w-none text-foreground">
              <h2 className="font-headline text-2xl font-bold">Property Description</h2>
              <p>{property.description}</p>
            </div>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={200}>
            <div className="mt-8">
              <h2 className="font-headline text-2xl font-bold mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {property.keyFeatures.map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInOnScroll>

        </div>
        <div className="lg:col-span-1">
          <FadeInOnScroll delay={300}>
            <div className="sticky top-24 p-6 rounded-lg border bg-card shadow-sm">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="font-headline text-4xl font-bold text-primary">${property.price.toLocaleString()}</p>
              
              <div className="mt-8 border-t pt-6">
                  <h3 className="font-semibold mb-4">Contact Agent</h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {agentImage && <AvatarImage src={agentImage.imageUrl} alt={property.agent.name} />}
                      <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{property.agent.name}</p>
                      <p className="text-sm text-muted-foreground">Luxury Property Specialist</p>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">Request Information</Button>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </div>
  );
}
