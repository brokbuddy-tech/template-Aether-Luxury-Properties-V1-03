

import { OffPlanCard } from "@/components/off-plan-card";
import { offPlanProjects } from "@/lib/data";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { OffPlanFilterBar } from '@/components/off-plan-filter-bar';
import Link from 'next/link';

export default function OffPlanPage() {
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
              Off-Plan Projects
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
