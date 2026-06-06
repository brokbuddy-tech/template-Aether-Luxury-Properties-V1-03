"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PlayCircle,
  ArrowRight,
  Star,
  Award,
  Users,
  Handshake,
} from "lucide-react";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { FadeInOnScroll } from "@/components/fade-in-on-scroll";
import { ReviewCarousel } from "@/components/review-carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ParallaxImage } from "@/components/parallax-image";
import { getAgents, getSiteConfig, getTestimonials } from "@/lib/api";
import {
  getAgencyDisplayName,
  replaceTemplateBranding,
} from "@/lib/live-mappers";
import { resolveTemplateImage } from "@/lib/media";
import {
  normalizePublicTestimonials,
  type ReviewCarouselItem,
} from "@/lib/reviews";
import type { SiteConfig } from "@/lib/live-types";
import { resolveAgencySlugFromPathname } from "@/lib/agency-routing";

const coreValues = [
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "People First",
    description:
      "We believe that real estate is about building lasting relationships before closing deals.",
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: "Honesty Always",
    description:
      "We provide transparent, pressure-free advice you can trust to make the right decisions.",
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Results Matter",
    description:
      "We are relentlessly driven to deliver on our promises and achieve exceptional outcomes for you.",
  },
  {
    icon: <Handshake className="h-10 w-10 text-primary" />,
    title: "Always Improving",
    description:
      "We are constantly learning and evolving our strategies to serve you better in a dynamic market.",
  },
] as const;

type LeadershipMember = {
  name: string;
  role: string;
  imageUrl: string;
  imageHint?: string;
};

export default function AboutPage() {
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const [leadershipMembers, setLeadershipMembers] = useState<
    LeadershipMember[]
  >([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [liveTestimonials, setLiveTestimonials] = useState<
    ReviewCarouselItem[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadLeadershipMembers() {
      try {
        const response = await getAgents(agencySlug);
        if (!active) return;

        const nextMembers = response.agents.slice(0, 4).map((agent) => {
          const avatar = resolveTemplateImage(
            agent.avatarUrl || agent.avatar,
            "agent-1",
            agent.name,
          );
          return {
            name: agent.name,
            role: agent.title || "Property Consultant",
            imageUrl: avatar?.src || "",
            imageHint: avatar?.hint,
          } satisfies LeadershipMember;
        });

        setLeadershipMembers(nextMembers);
      } catch {
        if (active) {
          setLeadershipMembers([]);
        }
      }
    }

    void loadLeadershipMembers();

    return () => {
      active = false;
    };
  }, [agencySlug]);

  useEffect(() => {
    let active = true;

    async function loadSiteConfig() {
      try {
        const nextSiteConfig = await getSiteConfig(agencySlug);
        if (active) {
          setSiteConfig(nextSiteConfig);
        }
      } catch {
        if (active) {
          setSiteConfig(null);
        }
      }
    }

    void loadSiteConfig();

    return () => {
      active = false;
    };
  }, [agencySlug]);

  useEffect(() => {
    let active = true;

    async function loadTestimonials() {
      try {
        const nextTestimonials = await getTestimonials(agencySlug);
        if (active) {
          setLiveTestimonials(normalizePublicTestimonials(nextTestimonials));
        }
      } catch {
        if (active) {
          setLiveTestimonials([]);
        }
      }
    }

    void loadTestimonials();

    return () => {
      active = false;
    };
  }, [agencySlug]);

  const aboutHeroImage = PlaceHolderImages.find(
    (image) => image.id === "hero-dubai",
  );
  const videoPlaceholder = PlaceHolderImages.find(
    (image) => image.id === "property-1-int",
  );
  const teamPortrait = PlaceHolderImages.find(
    (image) => image.id === "team-group",
  );
  const ceoPortrait = PlaceHolderImages.find((image) => image.id === "agent-1");
  const corporateImpactImage = PlaceHolderImages.find(
    (image) => image.id === "hero-1",
  );
  const agencyName = getAgencyDisplayName(siteConfig);
  const testimonialsToRender = liveTestimonials;

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
        <div className="relative flex h-full flex-col items-center justify-center p-4 text-center text-white">
          <FadeInOnScroll>
            <h1 className="text-4xl font-bold tracking-widest font-headline md:text-6xl">
              About Us
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-white/90">
              Redefining Dubai&apos;s real estate landscape through clarity,
              accountability, and data-driven insights.
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <FadeInOnScroll>
              <div className="group relative aspect-video overflow-hidden rounded-lg">
                {videoPlaceholder && (
                  <Image
                    src={videoPlaceholder.imageUrl}
                    alt={`${agencyName} introduction video`}
                    data-ai-hint="luxury interior"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <PlayCircle className="h-16 w-16 text-white/80 transition-all group-hover:scale-110 group-hover:text-white md:h-24 md:w-24" />
                </div>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
              <h2 className="text-4xl font-bold font-headline text-primary md:text-5xl">
                Who We Are
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {replaceTemplateBranding(
                  "At Aether Luxury Properties, we believe that clarity, accountability, and data-driven insights are the cornerstones of a successful property journey. We've built our company to deliver a fundamentally better real estate experience, for clients and brokers alike.",
                  agencyName,
                )}
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="#">
                  DOWNLOAD OUR 2026 COMPANY PROFILE{" "}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col-reverse items-center gap-12 lg:flex-row">
            <FadeInOnScroll>
              <h2 className="text-4xl font-bold font-headline text-primary md:text-5xl">
                How We Work
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Our collaborative model combines deep localized expertise with
                the operational power of a fully integrated brokerage. From
                in-house marketing and data analytics to dedicated support for
                mortgages and property management, we provide a seamless,
                end-to-end service designed to achieve superior results.
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

      <section className="bg-background py-16 md:py-24">
        <div className="container text-center">
          <FadeInOnScroll>
            <h2 className="text-4xl font-bold font-headline text-primary md:text-5xl">
              Our Mission
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              To raise industry standards by empowering our clients and agents
              with the data, technology, and support they need to succeed in
              Dubai&apos;s dynamic real estate market.
            </p>
          </FadeInOnScroll>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <FadeInOnScroll key={value.title} delay={index * 100}>
                <div className="flex flex-col items-center text-center">
                  {value.icon}
                  <h3 className="mt-4 text-2xl font-bold font-headline">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <FadeInOnScroll>
              {ceoPortrait && (
                <Image
                  src={ceoPortrait.imageUrl}
                  alt={ceoPortrait.description}
                  data-ai-hint={ceoPortrait.imageHint}
                  width={800}
                  height={900}
                  className="aspect-[4/5] rounded-lg object-cover object-top"
                />
              )}
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
              <h2 className="text-4xl font-bold font-headline text-primary md:text-5xl">
                Message from our CEO
              </h2>
              <div className="prose mt-6 max-w-none text-muted-foreground lg:prose-lg">
                <p>
                  {replaceTemplateBranding(
                    '"When we founded Aether Luxury Properties, we started with a simple question: What if we built a real estate company that truly put its clients and agents first? For us, that meant replacing the outdated, transactional model with one built on partnership, transparency, and shared success.',
                    agencyName,
                  )}
                </p>
                <p>
                  Dubai is one of the most exciting and fast-paced property
                  markets in the world. Navigating it requires more than just
                  access to listings. It demands real-time data, deep local
                  knowledge, and a team that is as invested in your goals as you
                  are. That is the company we have built.
                </p>
                <p>
                  Whether you are finding your next home, selling a cherished
                  property, or making a strategic investment, our promise is to
                  provide you with the clarity and support you deserve. We are
                  not just facilitating transactions; we are building the future
                  of real estate, together."
                </p>
              </div>
              <div className="mt-8">
                <p className="font-headline text-2xl font-bold tracking-wider text-primary">
                  Isabella Rossi
                </p>
                <p className="text-muted-foreground">
                  Founder & CEO, {agencyName}
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      <section id="team" className="bg-background py-16 md:py-24">
        <div className="container mx-auto">
          <FadeInOnScroll>
            <div className="mb-12 text-center">
              <h2 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                Meet Our Leadership
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {replaceTemplateBranding(
                  "The driving force behind Aether's commitment to excellence, combining decades of experience with a passion for innovation.",
                  agencyName,
                )}
              </p>
            </div>
          </FadeInOnScroll>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leadershipMembers.length > 0 ? (
              leadershipMembers.map((member, index) => (
                <FadeInOnScroll key={member.name} delay={index * 100}>
                  <Card className="group overflow-hidden text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div className="relative h-80 w-full">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          data-ai-hint={member.imageHint}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                          Profile photo coming soon
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-headline text-xl font-bold">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground">{member.role}</p>
                    </CardContent>
                  </Card>
                </FadeInOnScroll>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground sm:col-span-2 lg:col-span-4">
                Leadership profiles will appear here when live agent data is
                available.
              </div>
            )}
          </div>
        </div>
      </section>
      <ReviewCarousel
        title="What Our Clients Say"
        description={replaceTemplateBranding(
          "Our success is measured by the satisfaction of our clients. Here's what they have to say about their experience with Aether Luxury Properties.",
          agencyName,
        )}
        items={testimonialsToRender}
        variant="light"
      />

      <section
        className="relative bg-cover bg-center bg-scroll py-24 lg:bg-fixed"
        style={{
          backgroundImage: corporateImpactImage
            ? `url(${corporateImpactImage.imageUrl})`
            : "none",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container flex items-center justify-center">
          <FadeInOnScroll>
            <div className="mx-auto max-w-6xl rounded-lg border border-white/20 bg-white/20 p-12 backdrop-blur-xl md:bg-white/10">
              <div className="grid grid-cols-1 gap-8 text-center text-white md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-5xl font-bold text-copper-gold">
                    AED 120B+
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-widest">
                    Total Lifetime Transaction Value
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-copper-gold">300+</p>
                  <p className="mt-2 text-sm uppercase tracking-widest">
                    Specialized Community Brokers
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-copper-gold">15+</p>
                  <p className="mt-2 text-sm uppercase tracking-widest">
                    International Real Estate Awards
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-copper-gold">24/7</p>
                  <p className="mt-2 text-sm uppercase tracking-widest">
                    Client Advisory & Support
                  </p>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <FadeInOnScroll>
            <div className="mx-auto max-w-4xl rounded-lg border bg-muted p-8 text-center md:p-12">
              <h2 className="font-headline text-base font-thin uppercase tracking-[0.3em] text-muted-foreground">
                STAY AHEAD OF THE MARKET
              </h2>
              <p className="mx-auto mt-4 max-w-2xl font-headline text-3xl text-primary">
                Subscribe to the {agencyName} Insider for exclusive 2026 market
                reports, off-plan launches, and luxury lifestyle insights.
              </p>
              <div className="mt-8 flex justify-center">
                <form className="flex w-full max-w-lg flex-col gap-4 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Enter your email address..."
                    className="h-12 flex-grow"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 bg-copper-gold px-8 uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
                  >
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
