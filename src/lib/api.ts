import type {
  LiveProperty,
  PropertyAgent,
  PropertyImageSource,
  PropertyMedia,
  SiteAgent,
  SiteBranding,
  SiteConfig,
  SiteStats,
} from './live-types';
import {
  PUBLIC_API_BASE_URLS,
  PUBLIC_TEMPLATE_PROXY_BASE_PATH,
  getClientTemplateFetchUrl,
  getConfiguredTemplateHexCode,
  normalizePublicTemplateAssetUrl,
  shouldRetryApiRequest,
} from './api-base';
import { getDefaultAgencySlug, getEffectiveAgencySlug } from './agency-routing';

export type GetPropertiesParams = Record<string, string | number | boolean | undefined | null>;

export type PaginatedProperties = {
  properties: LiveProperty[];
  total: number;
  page: number;
  totalPages: number;
};

type PublicTemplateSiteSnapshot = SiteConfig & {
  profile?: SiteConfig['profile'];
  areaGuides?: any[];
  testimonials?: any[];
  sellerTestimonials?: any[];
  blogs?: any[];
};

type ResolvedAgencyContext = {
  organization: {
    id?: string;
    name?: string;
    slug: string;
    hexCode: string;
    templateUrl?: string | null;
    publicAgencyUrl?: string | null;
    country?: string | null;
  };
};

type TemplateFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

type PublicListingImage = {
  id?: string | null;
  url?: string | null;
  gcsPath?: string | null;
  format?: string | null;
  category?: string | null;
  order?: number | null;
  status?: string | null;
  isHero?: boolean | null;
};

const DEFAULT_SITE_STATS: SiteStats = {
  totalListings: 0,
  readyListings: 0,
  offPlanListings: 0,
  activeAgents: 0,
  awards: 0,
  blogs: 0,
  testimonials: 0,
};

function buildStorageImageUrl(gcsPath?: string | null) {
  if (!gcsPath) return null;
  return `https://storage.googleapis.com/brokbuddy-listing-images/${gcsPath.replace(/^\/+/, '')}`;
}

function normalizeAssetUrl(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) return null;

  const normalizedProxyPath = normalizePublicTemplateAssetUrl(normalized) || normalized;
  if (/^https?:\/\//i.test(normalizedProxyPath)) return normalizedProxyPath;
  if (normalizedProxyPath.startsWith(PUBLIC_TEMPLATE_PROXY_BASE_PATH)) return normalizedProxyPath;

  return normalizedProxyPath.startsWith('/') ? normalizedProxyPath : `/${normalizedProxyPath}`;
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function getOptionalNumber(...values: unknown[]) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;

    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/,/g, ''));
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function normalizeListingDescription(description?: string) {
  const plainText = (description || '')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(div|p|section|article|h[1-6])\s*>/gi, '\n\n')
    .replace(/<\/\s*li\s*>/gi, '\n')
    .replace(/<\s*li\b[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return plainText || 'Property details coming soon.';
}

function getStringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function normalizeLocation(listing: any) {
  const parts = [listing.area, listing.emirate].filter(
    (value) => typeof value === 'string' && value.trim(),
  );
  return parts.length > 0 ? parts.join(', ') : (listing.location || 'Dubai');
}

function collectLocationValues(listing: any) {
  return [
    listing.location,
    listing.area,
    listing.emirate,
    listing.subArea,
    listing.streetAddress,
    listing.address,
  ].filter(Boolean);
}

function dedupeJoinedSearchValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean).map((value) => value.trim())))
    .join(' ')
    .toLowerCase();
}

function isRenderableImage(image?: PublicListingImage | null) {
  if (!image) return false;

  const format = (image.format || '').toLowerCase();
  const category = (image.category || '').toUpperCase();

  if (category === 'TITLE_DEED') return false;
  if (format === 'application/pdf' || format.endsWith('pdf')) return false;

  return true;
}

function getPublicListingMediaUrl(
  image?: PublicListingImage | null,
  variant: 'thumbnail' | 'medium' | 'compressed' = 'medium',
  agencySlug?: string | null,
) {
  if (!image) return null;
  if (image.id) {
    return getClientTemplateFetchUrl(`/images/${image.id}/view?variant=${variant}`, agencySlug);
  }
  return image.url || null;
}

function mapListingAgent(listing: any): PropertyAgent | undefined {
  const publicAgent = listing?.agent;
  const legacyBroker = listing?.broker;
  const agentName = getStringValue(
    publicAgent?.name,
    legacyBroker?.brokerProfile?.displayName,
    [legacyBroker?.firstName, legacyBroker?.lastName].filter(Boolean).join(' '),
  );

  if (!agentName) return undefined;

  return {
    id: publicAgent?.id,
    name: agentName,
    avatarUrl: normalizeAssetUrl(publicAgent?.avatarUrl || publicAgent?.avatar || legacyBroker?.avatar) || '',
    title:
      getStringValue(publicAgent?.title, publicAgent?.tagline, legacyBroker?.brokerProfile?.tagline)
      || 'Property Consultant',
    phone:
      getStringValue(publicAgent?.phone, legacyBroker?.brokerProfile?.publicPhone, legacyBroker?.phone)
      || '',
    email:
      getStringValue(publicAgent?.email, legacyBroker?.brokerProfile?.publicEmail, legacyBroker?.email)
      || '',
    whatsapp:
      getStringValue(
        publicAgent?.whatsapp,
        legacyBroker?.brokerProfile?.whatsapp,
        legacyBroker?.whatsapp,
        legacyBroker?.brokerProfile?.publicPhone,
        legacyBroker?.phone,
      ) || '',
    company: getStringValue(publicAgent?.company, listing?.organizationName, listing?.organization?.name),
    licenseNumber: getStringValue(publicAgent?.licenseNumber, legacyBroker?.licenseNumber) || undefined,
    slug: getStringValue(publicAgent?.slug, legacyBroker?.brokerProfile?.slug) || undefined,
  };
}

export function mapListingToProperty(listing: any, agencySlug?: string | null): LiveProperty {
  const sourceImages: PublicListingImage[] = Array.isArray(listing.images) ? listing.images : [];
  const sortedImages = sourceImages
    .filter(isRenderableImage)
    .sort((left, right) => {
      const heroDelta = Number(Boolean(right.isHero)) - Number(Boolean(left.isHero));
      if (heroDelta !== 0) return heroDelta;
      const orderDelta = (left.order ?? 999) - (right.order ?? 999);
      if (orderDelta !== 0) return orderDelta;
      return String(left.id || '').localeCompare(String(right.id || ''));
    });

  const media: PropertyMedia[] = sortedImages
    .map((image) => {
      const originalUrl = normalizeAssetUrl(image.url) || buildStorageImageUrl(image.gcsPath) || '';
      const thumbnailUrl = getPublicListingMediaUrl(image, 'thumbnail', agencySlug);
      const mediumUrl = getPublicListingMediaUrl(image, 'medium', agencySlug);
      const cdnUrl = getPublicListingMediaUrl(image, 'compressed', agencySlug);

      return {
        url: mediumUrl || cdnUrl || originalUrl,
        thumbnailUrl: thumbnailUrl || mediumUrl || originalUrl,
        mediumUrl: mediumUrl || cdnUrl || originalUrl,
        cdnUrl: cdnUrl || mediumUrl || originalUrl,
      };
    })
    .filter((entry) => entry.url);

  const mappedImages: PropertyImageSource[] = media.map((entry, index) => ({
    id: sortedImages[index]?.id ?? null,
    src: entry.url,
    thumbnailSrc: entry.thumbnailUrl,
    originalSrc: entry.cdnUrl,
    alt: listing.title?.trim() || 'Property image',
    hint: listing.category || listing.propertyType || 'property',
    status: sortedImages[index]?.status ?? null,
    unoptimized: true,
  }));

  const amenities = Array.isArray(listing.amenities)
    ? listing.amenities.filter(Boolean).map(String)
    : Array.isArray(listing.fields?.amenities)
      ? listing.fields.amenities.filter(Boolean).map(String)
      : [];

  return {
    id: String(listing.id),
    title: listing.title?.trim() || 'Untitled Property',
    location: normalizeLocation(listing),
    mapAddress: listing.streetAddress?.trim() || listing.address?.trim() || undefined,
    searchableText: dedupeJoinedSearchValues([
      listing.title,
      normalizeListingDescription(listing.description),
      ...collectLocationValues(listing).map(String),
    ]) || undefined,
    searchableLocation: dedupeJoinedSearchValues(collectLocationValues(listing).map(String)) || undefined,
    price: normalizeNumber(listing.price),
    currency: listing.currency || 'AED',
    bedrooms: normalizeNumber(listing.bedrooms),
    bathrooms: normalizeNumber(listing.bathrooms),
    sqft:
      normalizeNumber(listing.builtUpArea)
      || normalizeNumber(listing.size)
      || normalizeNumber(listing.areaSqFt),
    type: listing.category || listing.type || listing.propertyType || 'Property',
    amenities,
    images: mappedImages,
    media,
    description: normalizeListingDescription(listing.description),
    transactionType: listing.transactionType === 'RENT' ? 'Rent' : 'Sale',
    status: listing.readiness?.toUpperCase() === 'OFFPLAN' ? 'Off-plan' : 'Ready',
    featured: Boolean(listing.featured || listing.isFeatured),
    dldPermitLink: listing.dldPermitLink || listing.fields?.dldPermitLink || undefined,
    handoverDate: listing.handoverDate || listing.fields?.handoverDate || undefined,
    developerName: listing.developer?.name || listing.fields?.developerName || undefined,
    developerLogo: normalizeAssetUrl(listing.developer?.logo || listing.fields?.developerLogo) || undefined,
    latitude: getOptionalNumber(listing.latitude, listing.lat, listing.fields?.latitude, listing.fields?.lat),
    longitude: getOptionalNumber(listing.longitude, listing.lng, listing.fields?.longitude, listing.fields?.lng),
    organizationName: getStringValue(listing.organizationName, listing.organization?.name),
    organizationSlug: getStringValue(listing.organizationSlug, listing.organization?.slug),
    agent: mapListingAgent(listing),
  };
}

function splitTemplatePath(path = '') {
  const [pathname = '', search = ''] = path.split('?');
  return {
    pathname,
    search: search ? `?${search}` : '',
  };
}

function appendHexToSearch(search: string, hexCode: string) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  params.set('hex', hexCode);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function buildBackendPublicUrl(publicApiBaseUrl: string, agencySlug: string, hexCode: string, path = '') {
  const { pathname, search } = splitTemplatePath(path);
  const trimmedPathname = pathname.replace(/^\/+/, '');
  const segments = trimmedPathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `${publicApiBaseUrl}/organization${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'listings') {
    if (segments[1]) {
      return `${publicApiBaseUrl}/listings/${encodeURIComponent(segments[1])}${appendHexToSearch(search, hexCode)}`;
    }
    return `${publicApiBaseUrl}/listings${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'agents') {
    if (segments[1]) {
      return `${publicApiBaseUrl}/agent/${encodeURIComponent(segments[1])}${appendHexToSearch(search, hexCode)}`;
    }
    return `${publicApiBaseUrl}/agents${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'inquiry') {
    return `${publicApiBaseUrl}/inquiries${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'logo' && segments[1] === 'view') {
    return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/logo/view${search}`;
  }

  if (segments[0] === 'images' && segments[1]) {
    const trailing = segments.slice(2).map(encodeURIComponent).join('/');
    return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/images/${encodeURIComponent(segments[1])}/${trailing}${search}`;
  }

  if (segments[0] === 'profile-assets' && segments[1] && segments[2]) {
    const trailing = segments.slice(3).map(encodeURIComponent).join('/');
    return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/profile-assets/${encodeURIComponent(segments[1])}/${encodeURIComponent(segments[2])}/${trailing}${search}`;
  }

  return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}${pathname.startsWith('/') ? pathname : `/${pathname}`}${search}`;
}

function getConfiguredAgencyContext(agencySlug?: string | null): ResolvedAgencyContext | null {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  const defaultAgencySlug = getDefaultAgencySlug();
  const configuredHexCode = getConfiguredTemplateHexCode();

  if (!resolvedAgencySlug || !defaultAgencySlug || !configuredHexCode || resolvedAgencySlug !== defaultAgencySlug) {
    return null;
  }

  return {
    organization: {
      slug: resolvedAgencySlug,
      hexCode: configuredHexCode,
    },
  };
}

async function safeFetch(url: string, options?: TemplateFetchOptions, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch {
    return new Response(null, { status: 503, statusText: 'Service Unavailable' });
  } finally {
    clearTimeout(id);
  }
}

async function resolveAgencyContext(agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) return null;

  const configuredContext = getConfiguredAgencyContext(resolvedAgencySlug);
  if (configuredContext) return configuredContext;

  for (const publicApiBase of PUBLIC_API_BASE_URLS) {
    try {
      const response = await safeFetch(
        `${publicApiBase}/agency/${encodeURIComponent(resolvedAgencySlug)}/resolve`,
        { cache: 'no-store' },
        4000,
      );

      if (!response.ok) continue;

      const data = await response.json() as ResolvedAgencyContext;
      if (data?.organization?.hexCode) {
        return data;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function fetchDirectTemplateResponse(
  resolvedAgencySlug: string,
  path = '',
  options?: TemplateFetchOptions,
  timeout = 10000,
) {
  const resolvedContext = await resolveAgencyContext(resolvedAgencySlug);
  if (!resolvedContext?.organization?.hexCode) {
    return new Response(null, { status: 404, statusText: 'Agency Not Found' });
  }

  let lastResponse: Response | null = null;

  for (const publicApiBase of PUBLIC_API_BASE_URLS) {
    const backendUrl = buildBackendPublicUrl(
      publicApiBase,
      resolvedAgencySlug,
      resolvedContext.organization.hexCode,
      path,
    );
    const response = await safeFetch(backendUrl, options, timeout);
    lastResponse = response;

    if (response.ok || !(await shouldRetryApiRequest(response))) {
      return response;
    }
  }

  return lastResponse || new Response(null, { status: 502, statusText: 'Service Unavailable' });
}

function normalizeOrganization(
  organization: SiteConfig['organization'] | undefined,
  fallbackSlug: string,
): SiteConfig['organization'] {
  return {
    ...organization,
    name: organization?.name || 'Agency Website',
    slug: organization?.slug || fallbackSlug,
  };
}

function normalizeSiteProfile(profile?: SiteConfig['profile'] | null) {
  if (!profile) return null;

  return {
    ...profile,
    logo: normalizeAssetUrl(profile.logo) ?? profile.logo ?? null,
  };
}

function normalizeSiteBranding(branding: SiteBranding | null | undefined, organizationName: string) {
  if (!branding) return null;

  return {
    ...branding,
    displayName: organizationName || branding.displayName || null,
    coverImage: normalizeAssetUrl(branding.coverImage) ?? branding.coverImage ?? null,
  };
}

function normalizeSiteAgent<T extends SiteAgent | null | undefined>(agent: T): T {
  if (!agent) return agent;

  return {
    ...agent,
    avatar: normalizeAssetUrl(agent.avatarUrl ?? agent.avatar) ?? agent.avatarUrl ?? agent.avatar ?? null,
    avatarUrl: normalizeAssetUrl(agent.avatarUrl ?? agent.avatar) ?? agent.avatarUrl ?? agent.avatar ?? null,
    coverImage: normalizeAssetUrl(agent.coverImageUrl ?? agent.coverImage) ?? agent.coverImageUrl ?? agent.coverImage ?? null,
    coverImageUrl: normalizeAssetUrl(agent.coverImageUrl ?? agent.coverImage) ?? agent.coverImageUrl ?? agent.coverImage ?? null,
  } as T;
}

function normalizeSiteAgents(agents: unknown[]) {
  return agents
    .map((agent) => normalizeSiteAgent(agent as SiteAgent | null))
    .filter((agent): agent is SiteAgent => Boolean(agent));
}

function normalizeSiteConfigPayload(
  data: PublicTemplateSiteSnapshot | null | undefined,
  fallbackSlug: string,
): SiteConfig {
  const organization = normalizeOrganization(
    data?.organization as SiteConfig['organization'] | undefined,
    fallbackSlug,
  );

  return {
    organization,
    categories: data?.categories || [],
    amenities: data?.amenities || [],
    featuredAreas: data?.featuredAreas || [],
    leadAgent: normalizeSiteAgent(data?.leadAgent as SiteAgent | null | undefined),
    branding: normalizeSiteBranding(data?.branding || null, organization.name),
    profile: normalizeSiteProfile(data?.profile || null),
    stats: data?.stats || DEFAULT_SITE_STATS,
  };
}

async function fetchTemplateResponse(
  path = '',
  options?: TemplateFetchOptions,
  timeout = 10000,
  agencySlug?: string | null,
) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) {
    return new Response(null, { status: 404, statusText: 'Agency Not Found' });
  }

  if (typeof window !== 'undefined') {
    return safeFetch(getClientTemplateFetchUrl(path, resolvedAgencySlug), options, timeout);
  }

  return fetchDirectTemplateResponse(resolvedAgencySlug, path, options, timeout);
}

async function getTemplateSiteSnapshot(agencySlug?: string | null) {
  const response = await fetchTemplateResponse('', { next: { revalidate: 3600 } }, 10000, agencySlug);
  if (!response.ok) return null;
  return await response.json() as PublicTemplateSiteSnapshot;
}

export async function getSiteConfig(agencySlug?: string | null) {
  const data = await getTemplateSiteSnapshot(agencySlug);
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';
  return normalizeSiteConfigPayload(data, fallbackSlug);
}

export async function getSiteConfigOrNull(agencySlug?: string | null) {
  const data = await getTemplateSiteSnapshot(agencySlug);
  if (!data) return null;
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';
  return normalizeSiteConfigPayload(data, fallbackSlug);
}

export async function getProperties(
  params: GetPropertiesParams = {},
  agencySlug?: string | null,
): Promise<PaginatedProperties> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  const response = await fetchTemplateResponse(
    `/listings${query ? `?${query}` : ''}`,
    { next: { revalidate: 300 } },
    10000,
    agencySlug,
  );

  if (!response.ok) {
    return { properties: [], total: 0, page: 1, totalPages: 1 };
  }

  const data = await response.json() as any;
  const rawListings = Array.isArray(data) ? data : (data.listings || []);
  const total = data.total || rawListings.length;
  const page = data.page || 1;
  const totalPages = data.totalPages || Math.ceil(total / Number(params.limit || 10)) || 1;

  return {
    properties: rawListings.map((listing: any) => mapListingToProperty(listing, agencySlug)),
    total,
    page,
    totalPages,
  };
}

export async function getPropertyById(id: string, agencySlug?: string | null) {
  const response = await fetchTemplateResponse(
    `/listings/${id}`,
    { next: { revalidate: 300 } },
    10000,
    agencySlug,
  );

  if (!response.ok) return null;

  const data = await response.json() as any;
  return mapListingToProperty(data, agencySlug);
}

export async function getAgents(agencySlug?: string | null) {
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';
  const response = await fetchTemplateResponse('/agents', { next: { revalidate: 300 } }, 10000, agencySlug);

  if (!response.ok) {
    return {
      organization: normalizeOrganization(undefined, fallbackSlug),
      agents: [] as SiteAgent[],
    };
  }

  const data = await response.json() as any;
  return {
    organization: normalizeOrganization(data.organization, fallbackSlug),
    agents: Array.isArray(data.agents) ? normalizeSiteAgents(data.agents) : [],
  };
}

export async function getAgentProfile(agentSlug: string, agencySlug?: string | null) {
  const response = await fetchTemplateResponse(
    `/agents/${agentSlug}`,
    { next: { revalidate: 300 } },
    10000,
    agencySlug,
  );
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';

  if (!response.ok) return null;

  const data = await response.json() as any;
  return {
    organization: normalizeOrganization(data.organization, fallbackSlug),
    profile: normalizeSiteProfile(data.profile || null),
    agent: normalizeSiteAgent(data.agent || null),
    stats: data.stats || {
      activeListings: 0,
      soldListings: 0,
      rentedListings: 0,
    },
    activeListings: Array.isArray(data.activeListings)
      ? data.activeListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [],
    soldListings: Array.isArray(data.soldListings)
      ? data.soldListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [],
    rentedListings: Array.isArray(data.rentedListings)
      ? data.rentedListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [],
  };
}

export async function submitOrgInquiry(payload: Record<string, unknown>) {
  const response = await fetchTemplateResponse('/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to submit inquiry');
  }

  return await response.json();
}

export function toSocialUrl(network: string, handle?: string | null) {
  if (!handle) return '';
  const trimmed = handle.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http')) return trimmed;

  switch (network.toLowerCase()) {
    case 'instagram':
      return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
    case 'twitter':
      return `https://twitter.com/${trimmed.replace(/^@/, '')}`;
    case 'linkedin':
      return trimmed.includes('linkedin.com') ? trimmed : `https://linkedin.com/in/${trimmed}`;
    case 'whatsapp':
      return `https://wa.me/${trimmed.replace(/\D/g, '')}`;
    default:
      return trimmed;
  }
}
