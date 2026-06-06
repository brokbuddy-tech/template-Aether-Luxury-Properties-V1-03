"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeInOnScroll } from "@/components/fade-in-on-scroll";
import { PropertyCard } from "@/components/property-card";
import { getProperties } from "@/lib/api";
import { toAetherProperty } from "@/lib/live-mappers";
import type { Property } from "@/lib/types";

export function LatestListingsSection() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      try {
        const liveResponse = await getProperties({ limit: 4 });
        if (!active) return;

        const liveProperties = liveResponse.properties.map(toAetherProperty);
        setProperties(liveProperties.slice(0, 4));
      } catch {
        if (active) {
          setProperties([]);
        }
      }
    }

    void loadProperties();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mt-8 bg-background px-6 py-20 md:mt-10 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1600px]">
        <FadeInOnScroll>
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="space-y-4">
              <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
                New Arrivals
              </span>
              <h2 className="font-headline text-3xl font-light tracking-wider text-primary md:text-5xl">
                LATEST LISTINGS
              </h2>
            </div>
            <Button
              asChild
              variant="link"
              className="group h-auto p-0 text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-accent hover:no-underline"
            >
              <Link href="/buy">
                View all properties
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </FadeInOnScroll>

        {properties.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-8 md:grid-cols-2 xl:grid-cols-4">
            {properties.map((property, index) => (
              <FadeInOnScroll key={property.id} className="h-full" delay={index * 100}>
                <PropertyCard property={property} />
              </FadeInOnScroll>
            ))}
          </div>
        ) : (
          <div className="border border-border bg-muted/40 px-8 py-16 text-center text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Live listings will appear here once they are available.
          </div>
        )}
      </div>
    </section>
  );
}
