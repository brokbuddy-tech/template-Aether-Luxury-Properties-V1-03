import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { getAgentProfile, getSiteConfig, toSocialUrl } from '@/lib/api';
import { getAgencyDisplayName, toAetherProperty } from '@/lib/live-mappers';
import { resolveTemplateImage } from '@/lib/media';
import { PropertyCard } from '@/components/property-card';
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

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60" />
        {heroImage && (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            data-ai-hint={heroImage.hint}
            fill
            className="object-cover"
          />
        )}
        <div className="relative container flex min-h-[60vh] flex-col justify-end py-16 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            {avatar && (
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white/30 bg-white/10">
                <Image src={avatar.src} alt={avatar.alt} data-ai-hint={avatar.hint} fill className="object-cover" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">{agencyName}</p>
              <h1 className="mt-3 text-4xl font-bold font-headline md:text-6xl">{agent.name}</h1>
              <p className="mt-3 max-w-3xl text-lg text-white/85">
                {agent.bio || agent.tagline || agent.title || 'Property Consultant'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-12 py-12 md:grid-cols-[1.2fr_2fr] md:py-16">
        <aside className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Profile</p>
            <h2 className="mt-3 text-2xl font-bold font-headline">{agent.title || 'Property Consultant'}</h2>
            {brokerRegistrationNumber && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                BRN {brokerRegistrationNumber}
              </p>
            )}
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            {agent.email && (
              <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" />
                {agent.email}
              </a>
            )}
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4" />
                {agent.phone}
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold text-primary">{profileResponse.stats.activeListings}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Active</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold text-primary">{agent.totalDeals || 0}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Deals</p>
            </div>
          </div>
        </aside>

        <div className="space-y-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">About</p>
            <p className="mt-4 leading-8 text-muted-foreground">
              {agent.bio || agent.tagline || `Connect with ${agent.name} for tailored guidance on buying, renting, and investing in Dubai.`}
            </p>
          </div>

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
              <div className="mt-8 grid gap-8 md:grid-cols-2">
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
