import { getOffPlanProjectById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function OffPlanDetailPage({ params }: { params: { id: string } }) {
  const project = getOffPlanProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container max-w-6xl py-12">
      <Carousel className="w-full mb-8">
        <CarouselContent>
          {project.images.map((imgId, index) => {
            const image = PlaceHolderImages.find(p => p.id === imgId);
            return (
              <CarouselItem key={index}>
                <div className="relative h-[60vh] w-full rounded-lg overflow-hidden">
                  {image && (
                     <Image
                      src={image.imageUrl}
                      alt={`${project.projectName} - image ${index + 1}`}
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

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-primary">OFF-PLAN PROJECT</p>
            <h1 className="font-headline text-4xl font-bold mt-1">{project.projectName}</h1>
            <p className="text-lg text-muted-foreground mt-1">By {project.developer}</p>

            <div className="my-6 border-y py-4">
                <p><span className="font-semibold">Estimated Handover:</span> {project.handover}</p>
            </div>

            <div className="prose max-w-none text-foreground">
                <h2 className="font-headline text-2xl font-bold">Project Overview</h2>
                <p>{project.description}</p>
            </div>

            <div className="mt-8">
                <h2 className="font-headline text-2xl font-bold mb-4">Payment Plan</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[50%]">Milestone</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead className="text-right">Amount (USD)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {project.paymentPlan.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.milestone}</TableCell>
                            <TableCell className="text-right">{item.percentage}%</TableCell>
                            <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        <div className="lg:col-span-1">
             <div className="sticky top-24 p-6 rounded-lg border bg-card shadow-sm">
                <h3 className="font-headline text-2xl font-bold mb-4">Register Your Interest</h3>
                <p className="text-muted-foreground mb-6">Be the first to receive exclusive updates, floor plans, and pricing information for {project.projectName}.</p>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Register Now</Button>
            </div>
        </div>
       </div>

    </div>
  );
}
