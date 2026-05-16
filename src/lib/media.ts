import type { PropertyImage } from './live-types';
import { PlaceHolderImages } from './placeholder-images';

export type ResolvedTemplateImage = {
  src: string;
  alt: string;
  hint?: string;
};

function getStringSource(source?: string | PropertyImage | null) {
  if (!source) return null;
  if (typeof source === 'string') return source;
  return source.src || null;
}

export function resolveTemplateImage(
  source?: string | PropertyImage | null,
  fallbackId = 'hero-1',
  alt = 'Image',
): ResolvedTemplateImage | null {
  const resolvedSource = getStringSource(source)?.trim();

  if (resolvedSource) {
    const placeholder = PlaceHolderImages.find((image) => image.id === resolvedSource);
    if (placeholder) {
      return {
        src: placeholder.imageUrl,
        alt: placeholder.description || alt,
        hint: placeholder.imageHint,
      };
    }

    return {
      src: resolvedSource,
      alt,
      hint: 'property',
    };
  }

  const fallback = PlaceHolderImages.find((image) => image.id === fallbackId);
  if (!fallback) return null;

  return {
    src: fallback.imageUrl,
    alt: fallback.description || alt,
    hint: fallback.imageHint,
  };
}

export function resolveTemplateGallery(
  sources: Array<string | PropertyImage | null | undefined>,
  fallbackId = 'hero-1',
  alt = 'Image',
) {
  const resolved = sources
    .map((source, index) => resolveTemplateImage(source, fallbackId, `${alt} ${index + 1}`))
    .filter((image): image is ResolvedTemplateImage => Boolean(image));

  if (resolved.length > 0) {
    return resolved;
  }

  const fallback = resolveTemplateImage(undefined, fallbackId, alt);
  return fallback ? [fallback] : [];
}
