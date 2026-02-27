
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ParallaxImage } from '@/components/parallax-image';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';

export default function AboutPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-2');
  return (
    <div>
      <section className="relative h-[50vh] w-full bg-black overflow-hidden">
        {heroImage && (
          <ParallaxImage
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">About Aether</h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-200">
              Redefining luxury real estate through innovation, integrity, and unparalleled service.
            </p>
          </FadeInOnScroll>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <FadeInOnScroll>
            <div className="prose lg:prose-lg max-w-none text-foreground">
              <h2 className="font-headline text-3xl font-bold">Our Mission</h2>
              <p>
                At Aether Luxury Properties, our mission is to provide a celestial real estate experience that transcends the ordinary. We are committed to offering our clients an exclusive portfolio of the world's most exceptional properties, guided by principles of integrity, discretion, and a profound understanding of the luxury market.
              </p>
              <h2 className="font-headline text-3xl font-bold mt-12">The Aether Difference</h2>
              <p>
                Founded on the idea that a home is more than just a place—it's a realm of possibility—Aether combines cutting-edge technology with deeply personal, white-glove service. Our name reflects our ambition: to operate on a higher plane, connecting discerning individuals with properties that are not just luxurious, but truly ethereal. 
              </p>
              <p>
                Our team of elite agents brings decades of collective experience, market intelligence, and a global network to every transaction. Whether you are buying, selling, or investing, we are your trusted partners in navigating the complexities of high-end real estate, ensuring a seamless journey from initial consultation to final closing. Welcome to the new standard of luxury. Welcome to Aether.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}
