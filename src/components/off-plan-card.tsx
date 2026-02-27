import Image from 'next/image';
import Link from 'next/link';
import type { OffPlanProject } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function OffPlanCard({ project }: { project: OffPlanProject }) {
  const image = PlaceHolderImages.find(p => p.id === project.image);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
      <div className="relative h-56 w-full">
        {image && (
          <Image
            src={image.imageUrl}
            alt={project.projectName}
            data-ai-hint={image.imageHint}
            fill
            className="object-cover"
          />
        )}
        <Badge className="absolute top-2 left-2" variant="destructive">
          Exclusive
        </Badge>
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-headline text-xl font-bold text-primary">{project.projectName}</h3>
        <p className="text-sm text-muted-foreground">by {project.developer}</p>
        <p className="mt-2 text-sm line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/off-plan/${project.id}`}>EXPLORE</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
