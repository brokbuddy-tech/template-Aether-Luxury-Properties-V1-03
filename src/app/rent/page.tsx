
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/data";
import { FilterBar } from "@/components/filter-bar";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { ParallaxImage } from '@/components/parallax-image';

export default function RentPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const community = searchParams?.community as string | undefined;

  let rentProperties = properties.filter(p => p.type === 'RENT');

  if (community) {
    rentProperties = rentProperties.filter(p => p.address.toLowerCase().includes(community.toLowerCase()));
  }

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-2');

  return (
    <div className="flex flex-col">
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
                {community ? `Properties for Rent in ${community}` : 'Properties for Rent'}
                </h1>
                <p className="mt-6 max-w-3xl text-lg text-white/90">
                Explore our curated selection of luxury rentals for your next home in Dubai.
                </p>
            </FadeInOnScroll>
            </div>
        </section>

        <div className="bg-background">
            <div className="container py-12">
                <FilterBar />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                    {rentProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
                 {rentProperties.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">No properties for rent found in this community.</p>
                  </div>
                )}
                {/* Pagination */}
                <div className="flex justify-center mt-12">
                    <nav aria-label="Pagination">
                    <ul className="inline-flex items-center -space-x-px">
                        <li>
                        <span className="cursor-pointer px-3 py-2 ml-0 leading-tight text-primary bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">1</span>
                        </li>
                        <li>
                        <span className="cursor-pointer px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">...</span>
                        </li>
                    </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
  );
}
