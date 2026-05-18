import type { CommercialProperty, OffPlanProject, Property } from './types';
import type { LiveProperty, PropertyImage, SiteAgent, SiteConfig } from './live-types';

function getImageUrl(image?: PropertyImage | null) {
  if (!image) return '';
  return typeof image === 'string' ? image : image.src;
}

function getGalleryUrls(images: PropertyImage[]) {
  return images.map((image) => getImageUrl(image)).filter(Boolean);
}

function getAgentImage(agent?: LiveProperty['agent'] | SiteAgent | null) {
  if (!agent) return '';
  if ('avatar' in agent && typeof agent.avatar === 'string' && agent.avatar) {
    return agent.avatar;
  }
  return agent.avatarUrl || '';
}

function buildFeatureList(listing: LiveProperty) {
  if (listing.amenities.length > 0) {
    return listing.amenities.slice(0, 8);
  }

  return [
    listing.type,
    listing.transactionType === 'Rent' ? 'Flexible Leasing' : 'Prime Investment',
    listing.location,
  ].filter(Boolean);
}

function buildOffPlanPaymentSteps(listing: LiveProperty) {
  const plan = (listing.paymentPlanData || {}) as Record<string, unknown>;
  const steps: { milestone: string; percentage: number; amount: number }[] = [];

  const getPercent = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ''));
      return Number.isFinite(parsed) ? parsed : null;
    }
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      return (
        getPercent(record.percentage)
        || getPercent(record.percent)
        || getPercent(record.value)
        || getPercent(record.amount)
      );
    }
    return null;
  };

  const toAmount = (percentage: number) => {
    if (!listing.price || listing.price <= 0) return 0;
    return Math.round((listing.price * percentage) / 100);
  };

  const pushStep = (milestone: string, percent: unknown) => {
    const percentage = getPercent(percent);
    if (percentage === null) return;
    steps.push({
      milestone,
      percentage,
      amount: toAmount(percentage),
    });
  };

  pushStep('Down Payment', plan.down_payment);

  const constructionLinked = Array.isArray(plan.construction_linked_payments)
    ? plan.construction_linked_payments.reduce((sum, item) => sum + (getPercent(item) || 0), 0)
    : getPercent(plan.construction_linked_payments);
  if (constructionLinked !== null) {
    steps.push({
      milestone: 'During Construction',
      percentage: constructionLinked,
      amount: toAmount(constructionLinked),
    });
  }

  pushStep('On Handover', plan.handover_payment);
  pushStep('Post Handover', plan.post_handover_payment);

  return steps;
}

export function isLikelyCommercialProperty(listing: LiveProperty) {
  const haystack = `${listing.type} ${listing.title} ${listing.description}`.toLowerCase();
  return ['office', 'retail', 'warehouse', 'commercial', 'shop', 'floor'].some((keyword) =>
    haystack.includes(keyword),
  );
}

export function toAetherProperty(listing: LiveProperty): Property {
  const gallery = getGalleryUrls(listing.images);

  return {
    id: listing.id,
    type: listing.transactionType === 'Rent' ? 'RENT' : 'BUY',
    title: listing.title,
    price: listing.price,
    address: listing.mapAddress || listing.location,
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    area: listing.sqft,
    image: gallery[0] || '',
    images: gallery,
    description: listing.description,
    keyFeatures: buildFeatureList(listing),
    virtualTourUrl: listing.virtualTourUrl || null,
    agent: {
      name: listing.agent?.name || listing.organizationName || 'Property Consultant',
      image: getAgentImage(listing.agent),
    },
    dldPermitNo: listing.reraPermit || undefined,
  };
}

export function toAetherCommercialProperty(listing: LiveProperty): CommercialProperty {
  const gallery = getGalleryUrls(listing.images);
  const normalizedType = listing.type.toLowerCase();
  const propertyType =
    normalizedType.includes('retail')
      ? 'Retail'
      : normalizedType.includes('warehouse')
        ? 'Warehouse'
        : 'Office';

  return {
    id: listing.id,
    transactionType: listing.transactionType === 'Rent' ? 'RENT' : 'BUY',
    propertyType,
    title: listing.title,
    price: listing.price,
    address: listing.mapAddress || listing.location,
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    area: listing.sqft,
    image: gallery[0] || '',
    images: gallery,
    description: listing.description,
    virtualTourUrl: listing.virtualTourUrl || null,
    agent: {
      name: listing.agent?.name || listing.organizationName || 'Property Consultant',
      image: getAgentImage(listing.agent),
    },
    amenities: listing.amenities,
    dldPermitNo: listing.reraPermit || undefined,
  };
}

export function toAetherOffPlanProject(listing: LiveProperty): OffPlanProject {
  const gallery = getGalleryUrls(listing.images);

  return {
    id: listing.id,
    projectName: listing.title,
    developer: listing.developerName || listing.organizationName || 'Developer TBC',
    handover: listing.handoverDate || 'TBC',
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    image: gallery[0] || '',
    images: gallery,
    description: listing.description,
    virtualTourUrl: listing.virtualTourUrl || null,
    paymentPlan: buildOffPlanPaymentSteps(listing),
  };
}

export function getAgencyDisplayName(siteConfig?: SiteConfig | null) {
  return siteConfig?.branding?.displayName || siteConfig?.organization.name || 'Agency Website';
}

export function getAgencyBrochureUrl(siteConfig?: SiteConfig | null) {
  return (
    siteConfig?.profile?.brochureUrl
    || siteConfig?.branding?.brochureUrl
    || null
  );
}

export function getAgencyEmail(siteConfig?: SiteConfig | null) {
  return (
    siteConfig?.profile?.contact?.officialEmail
    || siteConfig?.branding?.publicEmail
    || null
  );
}

export function getAgencyPhone(siteConfig?: SiteConfig | null) {
  return (
    siteConfig?.profile?.contact?.primaryPhone
    || siteConfig?.branding?.publicPhone
    || siteConfig?.profile?.contact?.secondaryPhone
    || null
  );
}

function getPossessiveName(agencyName: string) {
  return agencyName.endsWith('s') ? `${agencyName}'` : `${agencyName}'s`;
}

export function replaceTemplateBranding(text: string, agencyName: string) {
  const normalizedAgencyName = agencyName.trim() || 'Agency Website';

  return text
    .replace(/Aether Luxury Properties/g, normalizedAgencyName)
    .replace(/Aether Properties/g, normalizedAgencyName)
    .replace(/Aether's/g, getPossessiveName(normalizedAgencyName))
    .replace(/\bAether\b/g, normalizedAgencyName);
}
