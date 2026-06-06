import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { getAgentProfile, getSiteConfig, toSocialUrl } from '@/lib/api';
import { getAgencyDisplayName, toAetherProperty } from '@/lib/live-mappers';
import { resolveTemplateImage } from '@/lib/media';
import { PropertyCard } from '@/components/property-card';
import { ReviewCarousel } from '@/components/review-carousel';
import { normalizeBrokerReviewCards } from '@/lib/reviews';
import type { Property } from '@/lib/types';

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ agentSlug: string }>;
}) {
  const { agentSlug } = await params;
  const [siteConfig, profileResponse] = await Promise.all([
    getSiteConfig(),
    getAgentProfile(agentSlug),
  ]);

  if (!profileResponse?.agent) {
    notFound();
  }

  const agencyName = getAgencyDisplayName(siteConfig);
  const agent = profileResponse.agent;
  const heroImage = resolveTemplateImage(
    agent.coverImageUrl || agent.coverImage || siteConfig.branding?.coverImage,
    'hero-2',
    agent.name,
  );
  const avatar = resolveTemplateImage(agent.avatarUrl || agent.avatar, 'agent-1', agent.name);
  const activeListings: Property[] = profileResponse.activeListings.map(toAetherProperty);
  const whatsappUrl = toSocialUrl('whatsapp', agent.whatsapp || agent.phone);
  const brokerRegistrationNumber = agent.brn || agent.licenseNumber;
  const brokerReviews = normalizeBrokerReviewCards(agent.reviewSources);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/20">
        {heroImage && (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            data-ai-hint={heroImage.hint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 mx-auto grid min-h-[60vh] max-w-[1600px] grid-cols-1 items-end gap-12 px-6 py-16 text-white md:px-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="relative aspect-square w-full max-w-[280px] overflow-hidden border border-white/20 bg-white/10 shadow-2xl rounded-xl">
            {avatar && (
              <Image src={avatar.src} alt={avatar.alt} data-ai-hint={avatar.hint} fill className="object-cover" />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{agencyName}</p>
              <h1 className="mt-3 text-4xl font-bold font-headline md:text-6xl">{agent.name}</h1>
              <p className="mt-3 max-w-3xl text-lg text-white/85">
                {agent.tagline || agent.title || 'Property Consultant'}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-white/80">
              {brokerRegistrationNumber && (
                <span className="flex items-center gap-2">
                  <span className="">BRN:</span>
                  {brokerRegistrationNumber}
                </span>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {agent.email}
                </a>
              )}
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {agent.phone}
                </a>
              )}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-10">
          <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Profile</h2>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>{agent.bio || agent.tagline || `Connect with ${agent.name} for tailored guidance on buying, renting, and investing in Dubai.`}</p>
              <div className="space-y-3">
                {agent.languages && agent.languages.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">Languages</p>
                    <p>{agent.languages.join(', ')}</p>
                  </div>
                )}
                {agent.specializations && agent.specializations.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">Specializations</p>
                    <p>{agent.specializations.join(', ')}</p>
                  </div>
                )}
                {agent.yearsExperience && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">Experience</p>
                    <p>{agent.yearsExperience}+ years</p>
                  </div>
                )}
                {brokerRegistrationNumber && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">BRN</p>
                    <p>{brokerRegistrationNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Live Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{profileResponse.stats.activeListings}</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{profileResponse.stats.soldListings}</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Sold</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{profileResponse.stats.rentedListings}</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Rented</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-10">
          <ReviewCarousel
            title="What My Clients Say"
            description={`Verified feedback from clients who worked directly with ${agent.name}.`}
            items={brokerReviews}
            variant="light"
            className="rounded-2xl"
          />

          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Listings</p>
                <h2 className="mt-2 text-3xl font-bold font-headline">Live properties represented by {agent.name}</h2>
              </div>
              <Link href="/buy" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Browse More
              </Link>
            </div>

            {activeListings.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {activeListings.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border bg-card px-6 py-16 text-center text-muted-foreground">
                No active live listings are currently assigned to this agent.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
