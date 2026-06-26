
import { PropertyCard } from "@/components/property-card";
import { getAvailablePropertyTypes, getProperties } from "@/lib/api";
import { FilterBar } from "@/components/filter-bar";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { ParallaxImage } from '@/components/parallax-image';
import { toAetherProperty } from '@/lib/live-mappers';
import { cleanQueryForCategory, matchesTemplateCategory, normalizeCategory } from '@/lib/search-utils';

type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined } | undefined>;

function getParam(params: Awaited<PageSearchParams>, key: string) {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function RentPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const resolvedSearchParams = await searchParams;
  const community = getParam(resolvedSearchParams, 'community');
  const category = normalizeCategory(getParam(resolvedSearchParams, 'category'));
  const searchQuery = cleanQueryForCategory(getParam(resolvedSearchParams, 'q') || community, category);
  const headingLabel = searchQuery || category;

  const [liveResponse, availablePropertyTypes] = await Promise.all([
    getProperties({
    transactionType: 'RENT',
    q: searchQuery,
    minPrice: getParam(resolvedSearchParams, 'minPrice'),
    maxPrice: getParam(resolvedSearchParams, 'maxPrice'),
    bedrooms: getParam(resolvedSearchParams, 'bedrooms'),
    bathrooms: getParam(resolvedSearchParams, 'bathrooms'),
    minArea: getParam(resolvedSearchParams, 'minArea'),
    maxArea: getParam(resolvedSearchParams, 'maxArea'),
    amenities: getParam(resolvedSearchParams, 'amenities'),
    limit: category ? 96 : 48,
    }),
    getAvailablePropertyTypes(),
  ]);
  const rentProperties = liveResponse.properties
    .filter((property) => matchesTemplateCategory(property, category))
    .map(toAetherProperty);

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
                {headingLabel ? `Properties for Rent in ${headingLabel}` : 'Properties for Rent'}
                </h1>
                <p className="mt-6 max-w-3xl text-lg text-white/90">
                Explore our curated selection of luxury rentals for your next home in Dubai.
                </p>
            </FadeInOnScroll>
            </div>
        </section>

        <div className="bg-background">
            <div className="container py-12">
                <FilterBar availablePropertyTypes={availablePropertyTypes} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                    {rentProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
                 {rentProperties.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">No rentals found for this search.</p>
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
