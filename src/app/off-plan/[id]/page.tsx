"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Calendar, Building, FileText } from "lucide-react";
import { ListingHeroGallery } from "@/components/listing-hero-gallery";
import { OffPlanCard } from "@/components/off-plan-card";
import { PropertyBrochureButton } from "@/components/property-brochure-button";
import { getProperties, getPropertyById as getLivePropertyById } from '@/lib/api';
import { toAetherOffPlanProject } from '@/lib/live-mappers';
import { resolveTemplateGallery } from '@/lib/media';
import type { OffPlanProject } from '@/lib/types';

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


export default function OffPlanDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<OffPlanProject | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<OffPlanProject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const liveProperty = await getLivePropertyById(params.id as string);
        if (!active) return;

        if (liveProperty?.status === 'Off-plan') {
          const mappedProject = toAetherOffPlanProject(liveProperty);
          setProject(mappedProject);

          const relatedResponse = await getProperties({ readiness: 'OFFPLAN', limit: 48 });
          if (!active) return;

          const nextRelatedProjects = relatedResponse.properties
            .map(toAetherOffPlanProject)
            .filter((candidate) => candidate.id !== mappedProject.id)
            .slice(0, 3);

          setRelatedProjects(nextRelatedProjects);
        } else {
          setProject(null);
          setRelatedProjects([]);
        }
      } catch {
        if (!active) return;
        setProject(null);
        setRelatedProjects([]);
      } finally {
        if (active) {
          setIsLoaded(true);
        }
      }
    }

    void loadProject();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (!project && isLoaded) {
    notFound();
  }

  if (!project) {
    return <div className="container py-24 text-center text-muted-foreground">Loading project...</div>;
  }

  const galleryImages = resolveTemplateGallery(
    project.images.length > 0 ? project.images : [project.image],
    'offplan-1',
    project.projectName,
  );

  return (
    <div className="container py-12">
      <ListingHeroGallery
        images={galleryImages}
        title={project.projectName}
        virtualTourUrl={project.virtualTourUrl}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <div className="mb-8">
              <p className="text-sm font-semibold text-primary">OFF-PLAN PROJECT</p>
              <h1 className="font-headline text-3xl md:text-4xl font-bold mt-1">{project.projectName}</h1>
            </div>

            <Separator />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8">
              <div className="flex items-center gap-3"><Building className="h-8 w-8 text-accent" /><div><p className="font-bold">Developer</p><p>{project.developer}</p></div></div>
              <div className="flex items-center gap-3"><Calendar className="h-8 w-8 text-accent" /><div><p className="font-bold">Handover</p><p>{project.handover}</p></div></div>
            </div>

            <Separator />

            <div className="py-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>

            <Separator />

            <div className="py-8">
                <h2 className="text-xl font-bold font-headline mb-4">PAYMENT PLAN</h2>
                {project.paymentPlan.length > 0 ? (
                  <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead className="w-[50%]">Milestone</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                          <TableHead className="text-right">Amount (AED)</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {project.paymentPlan.map((item, index) => (
                          <TableRow key={index}>
                              <TableCell className="font-medium">{item.milestone}</TableCell>
                              <TableCell className="text-right">{item.percentage}%</TableCell>
                              <TableCell className="text-right">AED {item.amount.toLocaleString()}</TableCell>
                          </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">Detailed payment plan available on request.</p>
                )}
            </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="rounded-xl bg-muted p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-accent rounded-full p-4 mb-4">
                  <Building className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-bold uppercase tracking-wider">Register Your Interest</h3>
                <p className="text-muted-foreground">Get exclusive access to floor plans, pricing, and launch details.</p>

                <div className="mt-6 grid grid-cols-1 gap-2 w-full">
                  <PropertyBrochureButton
                    brochure={{
                      title: project.projectName,
                      subtitle: project.developer,
                      description: project.description,
                      heroImage: galleryImages[0]?.src || project.image,
                      gallery: galleryImages.map((image) => image.src),
                      stats: [
                        { label: 'Developer', value: project.developer },
                        { label: 'Handover', value: project.handover },
                        {
                          label: 'Plan',
                          value: project.paymentPlan.length > 0 ? `${project.paymentPlan.length} milestones` : 'On request',
                        },
                      ],
                      agentName: project.developer,
                      agentTitle: 'Master Developer',
                      organizationName: 'Off-Plan Project',
                    }}
                  >
                    <Button variant="outline" className="w-full border-primary/30 bg-background text-primary hover:bg-primary/5 hover:text-primary uppercase font-bold px-6 py-3 h-auto">
                      <FileText /> DOWNLOAD BROCHURE
                    </Button>
                  </PropertyBrochureButton>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold px-6 py-3 h-auto">
                    Request Info
                  </Button>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold px-6 py-3 h-auto">
                    <WhatsAppIcon /> WHATSAPP
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {relatedProjects.length > 0 && (
        <div className="mt-24">
          <Separator />
          <div className="py-16">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">Other Off-Plan Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((candidate) => (
                <OffPlanCard key={candidate.id} project={candidate} />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 border-t z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-2 w-full">
             <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold px-6 py-3 h-auto">
                Request Info
              </Button>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase font-bold h-auto py-3">
                <WhatsAppIcon /> WHATSAPP
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
