'use server';

import { getEffectiveAgencySlug } from '@/lib/agency-routing';
import { submitOrgInquiry } from '@/lib/api';
import { getRequestAgencySlug } from '@/lib/server-agency';

export type SubmitInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  templateName?: string;
  formContext?: string;
  agencySlug?: string | null;
};

export async function submitContactInquiryAction(input: SubmitInquiryInput) {
  const agencySlug = getEffectiveAgencySlug(input.agencySlug || (await getRequestAgencySlug()));

  return submitOrgInquiry({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    message: input.message.trim(),
    templateName: input.templateName,
    formContext: input.formContext,
  }, agencySlug);
}
