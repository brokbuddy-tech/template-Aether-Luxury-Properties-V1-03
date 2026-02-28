
"use client";

import { getOffPlanProjectById, offPlanProjects } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Calendar, Building } from "lucide-react";
import Link from 'next/link';
import { OffPlanCard } from "@/components/off-plan-card";

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
  const project = getOffPlanProjectById(params.id as string);

  if (!project) {
    notFound();
  }

  const galleryImages = project.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as typeof PlaceHolderImages[0][];

  const relatedProjects = offPlanProjects.filter(p => p.id !== project.id).slice(0, 3);

  return (
    <div className="container py-12">
      {/* Gallery */}
      <div className="relative mb-8 group">
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[60vh]">
          <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden">
            {galleryImages[0] && <Image src={galleryImages[0].imageUrl} alt={project.projectName} fill className="object-cover" />}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <span className="text-white/50 text-3xl font-bold font-headline select-none">
                Aether Luxury Properties
              </span>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            {galleryImages[1] && <Image src={galleryImages[1].imageUrl} alt={project.projectName} fill className="object-cover" />}
             <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <span className="text-white/50 text-xl font-bold font-headline select-none">
                Aether Luxury Properties
              </span>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden">
             {galleryImages[1] && <Image src={galleryImages[1].imageUrl} alt={project.projectName} fill className="object-cover" />}
             <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <span className="text-white/50 text-xl font-bold font-headline select-none">
                Aether Luxury Properties
              </span>
            </div>
          </div>
        </div>
        <Button variant="secondary" className="absolute bottom-4 right-4">
          View All Photos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <div className="mb-8">
              <p className="text-sm font-semibold text-primary">OFF-PLAN PROJECT</p>
              <h1 className="font-headline text-4xl font-bold mt-1">{project.projectName}</h1>
            </div>

            <Separator />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8">
              <div className="flex items-center gap-3"><Building className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">Developer</p><p>{project.developer}</p></div></div>
              <div className="flex items-center gap-3"><Calendar className="h-8 w-8 text-accent" /><div className=''><p className="font-bold">Handover</p><p>{project.handover}</p></div></div>
            </div>

            <Separator />

            <div className="py-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>
            
            <Separator />

            <div className="py-8">
                <h2 className="text-xl font-bold font-headline mb-4">PAYMENT PLAN</h2>
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
            <h2 className="text-3xl font-bold font-headline mb-8">Other Off-Plan Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map(p => (
                <OffPlanCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
