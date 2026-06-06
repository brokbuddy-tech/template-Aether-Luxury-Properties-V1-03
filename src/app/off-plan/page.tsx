

import { OffPlanCard } from "@/components/off-plan-card";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { OffPlanFilterBar } from '@/components/off-plan-filter-bar';
import { getProperties } from '@/lib/api';
import { toAetherOffPlanProject } from '@/lib/live-mappers';
import { cleanQueryForCategory, matchesTemplateCategory, normalizeCategory } from '@/lib/search-utils';

type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined } | undefined>;

function getParam(params: Awaited<PageSearchParams>, key: string) {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function OffPlanPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = normalizeCategory(getParam(resolvedSearchParams, 'category'));
  const searchQuery = cleanQueryForCategory(getParam(resolvedSearchParams, 'q'), category);
  const headingLabel = searchQuery || category;
  const liveResponse = await getProperties({
    readiness: 'OFFPLAN',
    q: searchQuery,
    minPrice: getParam(resolvedSearchParams, 'minPrice'),
    maxPrice: getParam(resolvedSearchParams, 'maxPrice'),
    bedrooms: getParam(resolvedSearchParams, 'bedrooms'),
    bathrooms: getParam(resolvedSearchParams, 'bathrooms'),
    minArea: getParam(resolvedSearchParams, 'minArea'),
    maxArea: getParam(resolvedSearchParams, 'maxArea'),
    limit: category ? 96 : 48,
  });
  const offPlanProjects = liveResponse.properties
    .filter((property) => matchesTemplateCategory(property, category))
    .map(toAetherOffPlanProject);
  const heroImage = PlaceHolderImages.find(p => p.id === 'offplan-1');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] w-full bg-cover bg-center bg-scroll lg:bg-fixed"
        style={{ backgroundImage: heroImage ? `url(${heroImage.imageUrl})` : 'none' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll>
            <h1 className="text-4xl md:text-6xl font-bold tracking-widest font-headline">
              {headingLabel ? `${headingLabel} Off-Plan Projects` : 'Off-Plan Projects'}
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-white/90">
              Invest in the future of Dubai with exclusive access to premier off-plan properties.
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-background">
        <div className="container py-8">
            <OffPlanFilterBar />
            
            <div className="flex justify-start items-center mb-4">
                <p className="text-sm text-muted-foreground">Showing 1–{offPlanProjects.length} of {offPlanProjects.length} results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {offPlanProjects.map(project => (
                <OffPlanCard key={project.id} project={project} />
                ))}
            </div>

            {offPlanProjects.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                No live off-plan projects are available right now.
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
