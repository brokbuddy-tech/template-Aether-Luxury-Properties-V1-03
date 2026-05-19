"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ResolvedTemplateImage } from "@/lib/media";

interface ListingHeroGalleryProps {
  images: ResolvedTemplateImage[];
  title: string;
  watermark?: string;
  virtualTourUrl?: string | null;
}

export function ListingHeroGallery({
  images,
  title,
  watermark,
  virtualTourUrl,
}: ListingHeroGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const activeImage = images[activeIndex] || images[0];

  const openGallery = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const showPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handleVirtualTourClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (virtualTourUrl) {
      window.open(virtualTourUrl, "_blank", "noopener,noreferrer");
      return;
    }

    openGallery(0);
  };

  return (
    <>
      <div className="relative mb-8 group">
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => {
                if (index === 0) {
                  return (
                    <CarouselItem key={`${image.src}-${index}`}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg text-left">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          data-ai-hint={image.hint}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => openGallery(index)}
                          className="absolute inset-0 z-10"
                          aria-label={`Open gallery image ${index + 1} of ${images.length}`}
                        >
                          <span className="sr-only">Open gallery image {index + 1}</span>
                        </button>
                        <div className="pointer-events-none absolute inset-0 z-20 bg-black/10 flex items-center justify-center">
                          <span className="text-white/50 text-xl font-bold font-headline select-none">
                            {watermark}
                          </span>
                        </div>
                        {virtualTourUrl ? (
                          <button
                            type="button"
                            onClick={handleVirtualTourClick}
                            className="absolute bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white"
                          >
                            <Video className="h-4 w-4" />
                            Virtual Tour
                          </button>
                        ) : null}
                      </div>
                    </CarouselItem>
                  );
                }

                return (
                  <CarouselItem key={`${image.src}-${index}`}>
                    <button
                      type="button"
                      onClick={() => openGallery(index)}
                      className="relative aspect-video w-full rounded-lg overflow-hidden text-left"
                      aria-label={`Open gallery image ${index + 1} of ${images.length}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        data-ai-hint={image.hint}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                        <span className="text-white/50 text-xl font-bold font-headline select-none">
                          {watermark}
                        </span>
                      </div>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary" />
              </>
            )}
          </Carousel>
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:grid-rows-2 gap-2 h-auto md:h-[60vh]">
          {images[0] && (
            <div className="col-span-1 md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden aspect-video md:aspect-auto text-left">
              <Image
                src={images[0].src}
                alt={images[0].alt}
                data-ai-hint={images[0].hint}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => openGallery(0)}
                className="absolute inset-0 z-10"
                aria-label={`Open gallery image 1 of ${images.length}`}
              >
                <span className="sr-only">Open gallery image 1</span>
              </button>
              <div className="absolute inset-0 z-20 bg-black/10 flex items-center justify-center pointer-events-none">
                <span className="text-white/50 text-3xl font-bold font-headline select-none">
                  {watermark}
                </span>
              </div>
              {virtualTourUrl ? (
                <button
                  type="button"
                  onClick={handleVirtualTourClick}
                  className="absolute bottom-6 left-6 z-30 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white"
                >
                  <Video className="h-4 w-4" />
                  Virtual Tour
                </button>
              ) : null}
            </div>
          )}
          {images[1] && (
            <button
              type="button"
              onClick={() => openGallery(1)}
              className="relative rounded-lg overflow-hidden aspect-video md:aspect-auto text-left"
              aria-label={`Open gallery image 2 of ${images.length}`}
            >
              <Image
                src={images[1].src}
                alt={images[1].alt}
                data-ai-hint={images[1].hint}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                <span className="text-white/50 text-xl font-bold font-headline select-none">
                  {watermark}
                </span>
              </div>
            </button>
          )}
          {images[2] && (
            <button
              type="button"
              onClick={() => openGallery(2)}
              className="relative rounded-lg overflow-hidden aspect-video md:aspect-auto text-left"
              aria-label={`Open gallery image 3 of ${images.length}`}
            >
              <Image
                src={images[2].src}
                alt={images[2].alt}
                data-ai-hint={images[2].hint}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                <span className="text-white/50 text-xl font-bold font-headline select-none">
                  {watermark}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/95 z-[9999]" />
          <DialogContent className="fixed inset-0 z-[10000] flex flex-col items-center justify-center w-screen h-screen max-w-none m-0 p-0 border-none bg-transparent shadow-none !translate-x-0 !translate-y-0 !top-0 !left-0 [&>button:last-child]:hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>{title} gallery</DialogTitle>
              <DialogDescription>
                Fullscreen gallery view for {title}.
              </DialogDescription>
            </DialogHeader>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-6 text-white bg-black/50 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/70 transition-colors z-[101]"
            >
              <ChevronLeft size={20} /> Back to gallery
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
              <div className="relative w-full h-full">
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  data-ai-hint={activeImage.hint}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority={isOpen}
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Show previous image"
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-colors backdrop-blur-sm z-[101]"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Show next image"
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-colors backdrop-blur-sm z-[101]"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            <div className="absolute bottom-6 right-6 text-white bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md text-sm font-medium z-[101]">
              {activeIndex + 1} / {images.length}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
