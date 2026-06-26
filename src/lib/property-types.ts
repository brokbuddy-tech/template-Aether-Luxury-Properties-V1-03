import { normalizeCategory } from './search-utils';

export type PropertyTypeGroup = 'residential' | 'commercial';

export type PropertyTypeOption = {
  value: string;
  label: string;
};

export const RESIDENTIAL_PROPERTY_TYPES: PropertyTypeOption[] = [
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Villa Compound', label: 'Villa Compound' },
  { value: 'Hotel Apartment', label: 'Hotel Apartment' },
  { value: 'Land', label: 'Land' },
  { value: 'Floor', label: 'Floor' },
  { value: 'Building', label: 'Building' },
  { value: 'Duplex', label: 'Duplex' },
  { value: 'Duplex Apartment', label: 'Duplex Apartment' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Flat', label: 'Flat' },
  { value: 'Mansion', label: 'Mansion' },
  { value: 'Bungalow', label: 'Bungalow' },
  { value: 'Compound', label: 'Compound' },
  { value: 'House', label: 'House' },
  { value: 'Residential Floor', label: 'Residential Floor' },
  { value: 'Full Floor', label: 'Full Floor' },
  { value: 'Half Floor', label: 'Half Floor' },
  { value: 'Bulk Rent unit', label: 'Bulk Rent Unit' },
  { value: 'Residential Building', label: 'Residential Building' },
  { value: 'Whole building', label: 'Whole Building' },
  { value: 'Residential Land', label: 'Residential Land' },
];

export const COMMERCIAL_PROPERTY_TYPES: PropertyTypeOption[] = [
  { value: 'Office', label: 'Office' },
  { value: 'Shop', label: 'Shop' },
  { value: 'Showroom', label: 'Showroom' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Business Center', label: 'Business Center' },
  { value: 'Co-working Space', label: 'Co-working Space' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Factory', label: 'Factory' },
  { value: 'Commercial Floor', label: 'Commercial Floor' },
  { value: 'Bulk Unit', label: 'Bulk Unit' },
  { value: 'Commercial Building', label: 'Commercial Building' },
  { value: 'Commercial Villa', label: 'Commercial Villa' },
  { value: 'Commercial Land', label: 'Commercial Land' },
  { value: 'Mixed Use Land', label: 'Mixed Use Land' },
  { value: 'Industrial Land', label: 'Industrial Land' },
  { value: 'Labour Camp', label: 'Labour Camp' },
  { value: 'Staff Accommodation', label: 'Staff Accommodation' },
  { value: 'Farm', label: 'Farm' },
];

export const PROPERTY_TYPES_BY_GROUP: Record<PropertyTypeGroup, PropertyTypeOption[]> = {
  residential: RESIDENTIAL_PROPERTY_TYPES,
  commercial: COMMERCIAL_PROPERTY_TYPES,
};

export const ALL_PROPERTY_TYPES = [
  ...RESIDENTIAL_PROPERTY_TYPES,
  ...COMMERCIAL_PROPERTY_TYPES,
];

const PROPERTY_TYPE_BY_LOWER = new Map(
  ALL_PROPERTY_TYPES.map((option) => [option.value.toLowerCase(), option] as const),
);

const PROPERTY_TYPE_GROUP_BY_LOWER = new Map(
  [
    ...RESIDENTIAL_PROPERTY_TYPES.map((option) => [option.value.toLowerCase(), 'residential'] as const),
    ...COMMERCIAL_PROPERTY_TYPES.map((option) => [option.value.toLowerCase(), 'commercial'] as const),
  ],
);

export function normalizePropertyTypeValue(value?: string | null) {
  const normalized = normalizeCategory(value);
  if (!normalized) return undefined;

  return PROPERTY_TYPE_BY_LOWER.get(normalized.toLowerCase())?.value;
}

export function getPropertyTypeGroup(value?: string | null): PropertyTypeGroup | undefined {
  const normalized = normalizePropertyTypeValue(value);
  if (!normalized) return undefined;

  return PROPERTY_TYPE_GROUP_BY_LOWER.get(normalized.toLowerCase());
}

export function sortPropertyTypeValues(values: string[]) {
  const normalizedValues = Array.from(
    new Set(values.map(normalizePropertyTypeValue).filter(Boolean) as string[]),
  );
  const order = new Map(ALL_PROPERTY_TYPES.map((option, index) => [option.value, index]));

  return normalizedValues.sort((left, right) => {
    return (order.get(left) ?? Number.MAX_SAFE_INTEGER) - (order.get(right) ?? Number.MAX_SAFE_INTEGER);
  });
}

export function getAvailablePropertyTypeValuesFromListings(
  listings: Array<{
    type?: string | null;
    propertyType?: string | null;
    category?: string | null;
  }>,
) {
  const availableTypes = new Set<string>();

  listings.forEach((listing) => {
    const candidates = [listing.type, listing.propertyType, listing.category];
    const matchedType = candidates
      .map(normalizePropertyTypeValue)
      .find(Boolean);

    if (matchedType) {
      availableTypes.add(matchedType);
    }
  });

  return sortPropertyTypeValues(Array.from(availableTypes));
}
