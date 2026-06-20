/**
 * Phone validation rules per country.
 *
 * Each entry contains:
 * - `code`         – international dialling code (with leading '+')
 * - `localDigits`  – number of digits the subscriber number should have
 *                    (i.e. digits *after* the country code)
 * - `placeholder`  – example number shown to the user
 *
 * The country key is matched case-insensitively against the value returned
 * by `siteConfig.organization.country`.
 */

export type PhoneRules = {
  code: string;
  localDigits: number;
  placeholder: string;
};

const PHONE_RULES_BY_COUNTRY: Record<string, PhoneRules> = {
  // United Arab Emirates – 9 local digits (e.g. 50 123 4567)
  uae: { code: '+971', localDigits: 9, placeholder: '+971 50 123 4567' },
  'united arab emirates': { code: '+971', localDigits: 9, placeholder: '+971 50 123 4567' },

  // Australia – 9 local digits (e.g. 4XX XXX XXX)
  australia: { code: '+61', localDigits: 9, placeholder: '+61 412 345 678' },
  aus: { code: '+61', localDigits: 9, placeholder: '+61 412 345 678' },

  // India – 10 local digits
  india: { code: '+91', localDigits: 10, placeholder: '+91 98765 43210' },
  ind: { code: '+91', localDigits: 10, placeholder: '+91 98765 43210' },

  // United Kingdom – 10 local digits
  uk: { code: '+44', localDigits: 10, placeholder: '+44 7911 123456' },
  'united kingdom': { code: '+44', localDigits: 10, placeholder: '+44 7911 123456' },

  // United States – 10 local digits
  us: { code: '+1', localDigits: 10, placeholder: '+1 555 123 4567' },
  usa: { code: '+1', localDigits: 10, placeholder: '+1 555 123 4567' },
  'united states': { code: '+1', localDigits: 10, placeholder: '+1 555 123 4567' },

  // Saudi Arabia – 9 local digits
  'saudi arabia': { code: '+966', localDigits: 9, placeholder: '+966 50 123 4567' },
  ksa: { code: '+966', localDigits: 9, placeholder: '+966 50 123 4567' },

  // Oman – 8 local digits
  oman: { code: '+968', localDigits: 8, placeholder: '+968 9123 4567' },

  // Bahrain – 8 local digits
  bahrain: { code: '+973', localDigits: 8, placeholder: '+973 3612 3456' },

  // Qatar – 8 local digits
  qatar: { code: '+974', localDigits: 8, placeholder: '+974 5512 3456' },

  // Kuwait – 8 local digits
  kuwait: { code: '+965', localDigits: 8, placeholder: '+965 5123 4567' },
};

// Fallback when country is unknown or not mapped
const DEFAULT_PHONE_RULES: PhoneRules = {
  code: '+971',
  localDigits: 9,
  placeholder: '+971...',
};

/**
 * Look up phone-input rules for the given country string.
 * Returns sensible defaults when the country is unknown.
 */
export function getPhoneRulesForCountry(country?: string | null): PhoneRules {
  if (!country) return DEFAULT_PHONE_RULES;
  return PHONE_RULES_BY_COUNTRY[country.trim().toLowerCase()] ?? DEFAULT_PHONE_RULES;
}

/**
 * Total max-length for the `<input>` element, including the country code,
 * optional spaces, and local digits.
 *
 * We allow the country code + 1 space + local digits.
 * Example for UAE: "+971" (4 chars) + 1 space + 9 digits = 14
 */
export function getPhoneMaxLength(rules: PhoneRules): number {
  // country code chars (e.g. "+971" = 4) + space + local digits
  return rules.code.length + 1 + rules.localDigits;
}

/**
 * Strips all non-digit characters (except a leading '+') from the phone
 * value, then validates that it has the correct number of digits after the
 * country code.
 *
 * Returns an error message string if invalid, or `null` if valid.
 */
export function validatePhone(value: string, rules: PhoneRules): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Phone number is required';

  // Extract only digits (drop leading '+' for counting)
  const digits = trimmed.replace(/[^\d]/g, '');

  const codeDigits = rules.code.replace(/[^\d]/g, '');
  const expectedTotalDigits = codeDigits.length + rules.localDigits;

  if (digits.length < expectedTotalDigits) {
    return `Phone number must be ${rules.localDigits} digits after ${rules.code}`;
  }

  if (digits.length > expectedTotalDigits) {
    return `Phone number must be ${rules.localDigits} digits after ${rules.code}`;
  }

  return null;
}
