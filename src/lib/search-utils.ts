/**
 * All known UAE property types – used both for normalisation and direct
 * type-field matching. Each key is the canonical display label; the array
 * contains lowercase search/alias terms for fuzzy text matching.
 */
const CATEGORY_TERMS: Record<string, string[]> = {
  // ── Residential Units ──────────────────────────────────────────────
  Apartment: ['apartment', 'apartments', 'flat', 'flats'],
  Studio: ['studio', 'studios'],
  Penthouse: ['penthouse', 'penthouses'],
  Duplex: ['duplex', 'duplexes'],
  'Duplex Apartment': ['duplex apartment'],
  'Hotel Apartment': ['hotel apartment'],
  Flat: ['flat', 'flats'],
  // ── Residential Houses ─────────────────────────────────────────────
  Villa: ['villa', 'villas'],
  Townhouse: ['townhouse', 'townhouses'],
  Mansion: ['mansion', 'mansions'],
  Bungalow: ['bungalow', 'bungalows'],
  'Villa Compound': ['villa compound'],
  Compound: ['compound', 'compounds'],
  House: ['house', 'houses', 'home', 'homes'],
  // ── Residential Floors ─────────────────────────────────────────────
  'Residential Floor': ['residential floor'],
  'Full Floor': ['full floor'],
  'Half Floor': ['half floor'],
  Floor: ['floor', 'floors'],
  'Bulk Rent unit': ['bulk rent unit', 'bulk rent'],
  // ── Residential Buildings ──────────────────────────────────────────
  Building: ['building', 'buildings'],
  'Residential Building': ['residential building'],
  'Whole building': ['whole building'],
  // ── Residential Land ───────────────────────────────────────────────
  Land: ['land', 'plot', 'plots'],
  'Residential Land': ['residential land'],
  // ── Commercial Units ───────────────────────────────────────────────
  Office: ['office', 'offices'],
  Shop: ['shop', 'shops'],
  Showroom: ['showroom', 'showrooms'],
  Retail: ['retail'],
  'Business Center': ['business center', 'business centre'],
  'Co-working Space': ['co-working space', 'coworking space', 'co-working'],
  'Co-Working space': ['co-working space', 'coworking space'],
  // ── Commercial Floors ──────────────────────────────────────────────
  'Commercial Floor': ['commercial floor'],
  'Bulk Unit': ['bulk unit'],
  'Full floor': ['full floor'],
  // ── Commercial Buildings ───────────────────────────────────────────
  'Commercial Building': ['commercial building'],
  'Commercial Villa': ['commercial villa'],
  // ── Commercial Land ────────────────────────────────────────────────
  'Commercial Land': ['commercial land'],
  'Mixed Use Land': ['mixed use land'],
  Farm: ['farm', 'farms', 'acreage'],
  // ── Industrial ─────────────────────────────────────────────────────
  Warehouse: ['warehouse', 'warehouses'],
  Factory: ['factory', 'factories'],
  'Industrial Land': ['industrial land'],
  // ── Accommodation ──────────────────────────────────────────────────
  'Labour Camp': ['labour camp', 'labor camp'],
  'Staff Accommodation': ['staff accommodation'],
  // ── Other ──────────────────────────────────────────────────────────
  Other: ['other'],
  'Other Commercial': ['other commercial'],
  Rural: ['rural'],
};

const CATEGORY_ALIASES = Object.entries(CATEGORY_TERMS).flatMap(([category, terms]) =>
  terms.map((term) => [term, category] as const),
);

function cleanToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function editDistance(left: string, right: string) {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)),
  );

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}

/**
 * Normalise a user-supplied or URL-supplied category string to a canonical
 * property-type key. Returns the raw value when it matches a known key
 * exactly (case-insensitive), so unknown keys pass through as-is rather
 * than being silently dropped.
 */
export function normalizeCategory(value?: string | null) {
  const raw = (value || '').trim();
  if (!raw || raw.toLowerCase() === 'any') return undefined;

  // Exact key match (case-insensitive)
  const exactKey = Object.keys(CATEGORY_TERMS).find(
    (key) => key.toLowerCase() === raw.toLowerCase(),
  );
  if (exactKey) return exactKey;

  // Alias lookup via cleaned tokens
  const cleaned = cleanToken(raw);
  if (!cleaned) return undefined;
  const aliasMatch = CATEGORY_ALIASES.find(([term]) => cleanToken(term) === cleaned)?.[1];
  if (aliasMatch) return aliasMatch;

  // Pass through as-is so the value reaches matchesTemplateCategory
  return raw;
}

export function cleanQueryForCategory(query?: string | null, category?: string | null) {
  const trimmed = (query || '').trim();
  const categories = (category || '').split(',').map(normalizeCategory).filter(Boolean) as string[];
  if (!trimmed || categories.length === 0) return trimmed || undefined;

  const tokens = trimmed
    .split(/\s+/)
    .map(cleanToken)
    .filter(Boolean);

  if (tokens.length === 0 || tokens.length > 2) return trimmed;

  const categoryTerms = categories.flatMap((selectedCategory) => CATEGORY_TERMS[selectedCategory] || [selectedCategory]);
  const isOnlyCategoryText = tokens.every((token) =>
    categoryTerms.some((term) => {
      const normalizedTerm = cleanToken(term);
      const tolerance = normalizedTerm.length >= 8 ? 2 : 1;
      return token === normalizedTerm || editDistance(token, normalizedTerm) <= tolerance;
    }),
  );

  return isOnlyCategoryText ? undefined : trimmed;
}

export function matchesTemplateCategory(
  source: {
    category?: string | null;
    propertyType?: string | null;
    type?: string | null;
    title?: string | null;
    description?: string | null;
    searchableText?: string | null;
  },
  category?: string | null,
) {
  const categories = (category || '').split(',').map(normalizeCategory).filter(Boolean) as string[];
  if (categories.length === 0) return true;

  // Direct field values for exact matching (the reliable path)
  const directFields = [source.category, source.propertyType, source.type]
    .filter(Boolean)
    .map((field) => field!.toLowerCase());

  // Full text haystack for fuzzy fallback
  const haystack = [
    source.category,
    source.propertyType,
    source.type,
    source.title,
    source.description,
    source.searchableText,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return categories.some((selectedCategory) => {
    const categoryLower = selectedCategory.toLowerCase();

    // 1. Exact match on the property's type / category / propertyType field
    if (directFields.some((field) => field === categoryLower)) return true;

    // 2. For known property types, ONLY match on direct fields (step 1).
    //    Fuzzy text search causes false positives (e.g. "land" in "landmark").
    if (selectedCategory in CATEGORY_TERMS) return false;

    // 3. Fallback for unknown categories: substring match using the raw value
    return haystack.includes(categoryLower);
  });
}
