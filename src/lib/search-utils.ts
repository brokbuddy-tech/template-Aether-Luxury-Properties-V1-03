const CATEGORY_TERMS: Record<string, string[]> = {
  Apartment: ['apartment', 'apartments', 'flat', 'flats'],
  Villa: ['villa', 'villas'],
  Penthouse: ['penthouse', 'penthouses'],
  Townhouse: ['townhouse', 'townhouses', 'town', 'house'],
  House: ['house', 'houses', 'home', 'homes', 'mansion', 'mansions'],
  Land: ['land', 'plot', 'plots'],
  Office: ['office', 'offices'],
  Retail: ['retail', 'shop', 'shops', 'showroom', 'showrooms'],
  Warehouse: ['warehouse', 'warehouses', 'industrial'],
  Rural: ['rural', 'farm', 'acreage'],
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

export function normalizeCategory(value?: string | null) {
  const cleaned = cleanToken(value || '');
  if (!cleaned || cleaned === 'any') return undefined;

  const exact = Object.keys(CATEGORY_TERMS).find((category) => cleanToken(category) === cleaned);
  if (exact) return exact;

  return CATEGORY_ALIASES.find(([term]) => cleanToken(term) === cleaned)?.[1];
}

export function cleanQueryForCategory(query?: string | null, category?: string | null) {
  const trimmed = (query || '').trim();
  const normalizedCategory = normalizeCategory(category);
  if (!trimmed || !normalizedCategory) return trimmed || undefined;

  const tokens = trimmed
    .split(/\s+/)
    .map(cleanToken)
    .filter(Boolean);

  if (tokens.length === 0 || tokens.length > 2) return trimmed;

  const categoryTerms = CATEGORY_TERMS[normalizedCategory] || [normalizedCategory];
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
    type?: string | null;
    title?: string | null;
    description?: string | null;
    searchableText?: string | null;
  },
  category?: string | null,
) {
  const normalizedCategory = normalizeCategory(category);
  if (!normalizedCategory) return true;

  const terms = CATEGORY_TERMS[normalizedCategory] || [normalizedCategory];
  const haystack = [
    source.type,
    source.title,
    source.description,
    source.searchableText,
  ].filter(Boolean).join(' ').toLowerCase();

  return terms.some((term) => haystack.includes(term.toLowerCase()));
}
