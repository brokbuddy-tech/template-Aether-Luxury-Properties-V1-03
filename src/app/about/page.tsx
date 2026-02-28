"use client";

import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, ArrowRight, Star, Award, Users, Handshake } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeInOnScroll } from '@/components/fade-in-on-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { teamMembers } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ParallaxImage } from '@/components/parallax-image';

const coreValues = [
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'People First',
    description: 'We believe that real estate is about building lasting relationships before closing deals.',
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: 'Honesty Always',
    description: 'We provide transparent, pressure-free advice you can trust to make the right decisions.',
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Results Matter',
    description: 'We are relentlessly driven to deliver on our promises and achieve exceptional outcomes for you.',
  },
    {
    icon: <Handshake className="h-10 w-10 text-primary" />,
    title: 'Always Improving',
    description: 'We are constantly learning and evolving our strategies to serve you better in a dynamic market.',
  },
];

const testimonials = [
  {
    quote: "Aether's team provided unparalleled service and market insight. They made a complex process feel seamless and secured a fantastic deal for our family home.",
    author: "The Al Futtaim Family",
    location: "Palm Jumeirah",
  },
  {
    quote: "As an international investor, I rely on transparency and expertise. Aether delivered on both fronts, guiding me to a high-yield off-plan investment with confidence.",
    author: "Chen Wei",
    location: "Investor from Singapore",
  },
  {
    quote: "Selling our villa was an emotional decision, but our agent was a true partner. The marketing was exceptional, and the result exceeded our expectations. Highly recommended.",
    author: "Mr. & Mrs. Harrison",
    location: "Emirates Hills",
  },
];

export default function AboutPage() {
  const aboutHeroImage = PlaceHolderImages.find(p => p.id === 'hero-dubai');
  const videoPlaceholder = PlaceHolderImages.find(p => p.id === 'property-1-int');
  const teamPortrait = PlaceHolderImages.find(p => p.id === 'team-group');
  const ceoPortrait = PlaceHolderImages.find(p => p.id === 'agent-1'); // Isabella Rossi - Founder & CEO
  const corporateImpactImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const newsletterBgImage = PlaceHolderImages.find(p => p.id === 'newsletter-bg');

  return (
    <div className="flex flex-col">
      <section className="relative h-[50vh] w-full overflow-hidden">
        {aboutHeroImage && (
          <ParallaxImage
            src={aboutHeroImage.imageUrl}
            alt={aboutHeroImage.description}
            data-ai-hint={aboutHeroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative flex h-full flex-col items-center justify-center text-center text-white p-4">
          <FadeInOnScroll>
            <h1 className="text-4xl md:text-6xl font-bold tracking-widest font-headline">
              About Us
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-white/90">
              Redefining Dubai's real estate landscape through clarity, accountability, and data-driven insights.
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* 1. Hero: "Who We Are" */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInOnScroll>
              <div className="relative aspect-video rounded-lg overflow-hidden group">
                {videoPlaceholder && (
                  <Image
                    src={videoPlaceholder.imageUrl}
                    alt="Aether Properties Introduction Video"
                    data-ai-hint="luxury interior"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="h-24 w-24 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                </div>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Who We Are</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                At Aether Luxury Properties, we believe that clarity, accountability, and data-driven insights are the cornerstones of a successful property journey. We've built our company to deliver a fundamentally better real estate experience, for clients and brokers alike.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="#">
                  DOWNLOAD OUR 2026 COMPANY PROFILE <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* 2. How We Work */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInOnScroll>
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">How We Work</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Our collaborative model combines deep localized expertise with the operational power of a fully integrated brokerage. From in-house marketing and data analytics to dedicated support for mortgages and property management, we provide a seamless, end-to-end service designed to achieve superior results.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="#team">
                  MEET OUR TEAM <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
              {teamPortrait && (
                 <Image
                    src={teamPortrait.imageUrl}
                    alt={teamPortrait.description}
                    data-ai-hint={teamPortrait.imageHint}
                    width={800}
                    height={600}
                    className="rounded-lg object-cover"
                  />
              )}
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* 3. Our Mission */}
      <section className="bg-background py-16 md:py-24">
        <div className="container text-center">
          <FadeInOnScroll>
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Our Mission</h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed">
              To raise industry standards by empowering our clients and agents with the data, technology, and support they need to succeed in Dubai's dynamic real estate market.
            </p>
          </FadeInOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
            {coreValues.map((value, index) => (
              <FadeInOnScroll key={value.title} delay={index * 100}>
                <div className="flex flex-col items-center text-center">
                  {value.icon}
                  <h3 className="mt-4 text-2xl font-bold font-headline">{value.title}</h3>
                  <p className="mt-2 text-muted-foreground">{value.description}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">What Our Clients Say</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Our success is measured by the satisfaction of our clients. Here’s what they have to say about their experience with Aether Luxury Properties.
              </p>
            </div>
          </FadeInOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInOnScroll key={index} delay={index * 100}>
                <Card className="flex flex-col h-full">
                  <CardContent className="p-6 flex-grow">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <div>
                        <p className="font-bold font-headline">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </CardFooter>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Team Members Card Section */}
      <section id="team" className="bg-background py-16 md:py-24">
        <div className="container mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Meet Our Leadership</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                The driving force behind Aether's commitment to excellence, combining decades of experience with a passion for innovation.
              </p>
            </div>
          </FadeInOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => {
              const memberImage = PlaceHolderImages.find(p => p.id === member.image);
              return (
                <FadeInOnScroll key={member.name} delay={index * 100}>
                  <Card className="text-center overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <div className="relative h-80 w-full">
                      {memberImage && (
                        <Image
                          src={memberImage.imageUrl}
                          alt={member.name}
                          data-ai-hint={memberImage.imageHint}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-headline text-xl font-bold">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                    </CardContent>
                  </Card>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Message from CEO */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <FadeInOnScroll>
              {ceoPortrait && (
                 <Image
                    src={ceoPortrait.imageUrl}
                    alt={ceoPortrait.description}
                    data-ai-hint={ceoPortrait.imageHint}
                    width={800}
                    height={900}
                    className="rounded-lg object-cover object-top aspect-[4/5]"
                  />
              )}
            </FadeInOnScroll>
             <FadeInOnScroll delay={200}>
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Message from our CEO</h2>
              <div className="prose lg:prose-lg max-w-none text-muted-foreground mt-6">
                <p>
                  "When we founded Aether Luxury Properties, we started with a simple question: What if we built a real estate company that truly put its clients and agents first? For us, that meant replacing the outdated, transactional model with one built on partnership, transparency, and shared success.
                </p>
                <p>
                  Dubai is one of the most exciting and fast-paced property markets in the world. Navigating it requires more than just access to listings—it demands real-time data, deep local knowledge, and a team that is as invested in your goals as you are. That is the company we have built.
                </p>
                <p>
                  Whether you are finding your next home, selling a cherished property, or making a strategic investment, our promise is to provide you with the clarity and support you deserve. We are not just facilitating transactions; we are building the future of real estate, together."
                </p>
              </div>
              <div className="mt-8">
                <p className="font-headline font-bold text-2xl tracking-wider text-primary">Isabella Rossi</p>
                <p className="text-muted-foreground">Founder & CEO, Aether Luxury Properties</p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>
      
      {/* 6. Corporate Impact & Scale */}
      <section 
        className="relative py-24 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: corporateImpactImage ? `url(${corporateImpactImage.imageUrl})` : 'none' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container flex items-center justify-center">
          <FadeInOnScroll>
            <div className="max-w-6xl mx-auto p-12 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                <div>
                  <p className="text-5xl font-bold text-copper-gold">AED 120B+</p>
                  <p className="mt-2 uppercase tracking-widest text-sm">Total Lifetime Transaction Value</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-copper-gold">300+</p>
                  <p className="mt-2 uppercase tracking-widest text-sm">Specialized Community Brokers</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-copper-gold">15+</p>
                  <p className="mt-2 uppercase tracking-widest text-sm">International Real Estate Awards</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-copper-gold">24/7</p>
                  <p className="mt-2 uppercase tracking-widest text-sm">Client Advisory & Support</p>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* 7. Newsletter Subscription */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <FadeInOnScroll>
            <div className="mx-auto max-w-4xl rounded-lg border bg-muted p-12 text-center">
              <h2 className="text-base font-thin uppercase tracking-[0.3em] font-headline text-muted-foreground">STAY AHEAD OF THE MARKET</h2>
              <p className="mx-auto mt-4 max-w-2xl text-3xl font-headline text-primary">
                  Subscribe to The Aether Insider for exclusive 2026 market reports, off-plan launches, and luxury lifestyle insights.
              </p>
              <div className="mt-8 flex justify-center">
                  <form className="flex w-full max-w-lg gap-4">
                      <Input
                          type="email"
                          placeholder="Enter your email address..."
                          className="h-12 flex-grow"
                      />
                      <Button type="submit" size="lg" className="h-12 bg-copper-gold text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all px-8">
                          Subscribe
                      </Button>
                  </form>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}
