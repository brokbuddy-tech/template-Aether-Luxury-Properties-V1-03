import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { getAgents, getSiteConfig } from '@/lib/api';
import { getAgencyDisplayName } from '@/lib/live-mappers';
import { resolveTemplateImage } from '@/lib/media';

export default async function AgentsPage() {
  const [siteConfig, agentsResponse] = await Promise.all([
    getSiteConfig(),
    getAgents(),
  ]);

  const agencyName = getAgencyDisplayName(siteConfig);
  const agents = agentsResponse.agents;

  return (
    <div className="bg-background">
      <section className="border-b border-border/60 bg-muted/40 py-20">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Agents</p>
          <h1 className="mt-4 text-4xl font-bold font-headline md:text-6xl">
            Meet the people behind {agencyName}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            Every profile below is pulled from the live public agency workspace, including headshots,
            contact details, and active listing context.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {agents.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => {
              const avatar = resolveTemplateImage(agent.avatarUrl || agent.avatar, 'agent-1', agent.name);

              return (
                <article key={agent.slug || agent.id || agent.name} className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="relative aspect-[4/3] bg-muted">
                    {avatar && (
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        data-ai-hint={avatar.hint}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex min-h-[276px] flex-1 flex-col space-y-4 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                        {agent.title || 'Property Consultant'}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold font-headline">{agent.name}</h2>
                      {agent.tagline && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{agent.tagline}</p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
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
                    </div>

                    <Link
                      href={`/agents/${agent.slug || agent.id}`}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary"
                    >
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border bg-card px-6 py-16 text-center text-muted-foreground">
            No live agent profiles are available yet for this agency.
          </div>
        )}
      </section>
    </div>
  );
}
