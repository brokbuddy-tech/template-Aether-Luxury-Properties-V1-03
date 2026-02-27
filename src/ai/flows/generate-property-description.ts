'use server';
/**
 * @fileOverview An AI agent that generates detailed and engaging property descriptions.
 *
 * - generatePropertyDescription - A function that handles the property description generation process.
 * - GeneratePropertyDescriptionInput - The input type for the generatePropertyDescription function.
 * - GeneratePropertyDescriptionOutput - The return type for the generatePropertyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertyDescriptionInputSchema = z.object({
  address: z.object({
    street: z.string().describe('The street address of the property.'),
    city: z.string().describe('The city where the property is located.'),
    state: z.string().describe('The state where the property is located.'),
    zip: z.string().describe('The zip code of the property.'),
  }),
  bedrooms: z.number().int().positive().describe('The number of bedrooms.'),
  bathrooms: z.number().int().positive().describe('The number of bathrooms.'),
  squareFootage: z.number().positive().describe('The total square footage of the property.'),
  propertyType: z.enum(['house', 'condo', 'apartment', 'land', 'villa', 'penthouse', 'townhouse']).describe('The type of property.'),
  keyFeatures: z.array(z.string()).describe('A list of key features, e.g., "gourmet kitchen," "ocean view," "swimming pool," "smart home technology."'),
  neighborhoodDescription: z.string().describe('A description of the neighborhood, e.g., "walkable," "vibrant," "family-friendly," "proximity to amenities."'),
  askingPrice: z.number().positive().describe('The asking price of the property.'),
});
export type GeneratePropertyDescriptionInput = z.infer<typeof GeneratePropertyDescriptionInputSchema>;

const GeneratePropertyDescriptionOutputSchema = z.object({
  headline: z.string().describe('A captivating headline for the property description.'),
  description: z.string().describe('A detailed and engaging property description, optimized for luxury real estate.'),
});
export type GeneratePropertyDescriptionOutput = z.infer<typeof GeneratePropertyDescriptionOutputSchema>;

export async function generatePropertyDescription(input: GeneratePropertyDescriptionInput): Promise<GeneratePropertyDescriptionOutput> {
  return generatePropertyDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropertyDescriptionPrompt',
  input: {schema: GeneratePropertyDescriptionInputSchema},
  output: {schema: GeneratePropertyDescriptionOutputSchema},
  prompt: `You are a highly skilled luxury real estate copywriter for Aether Luxury Properties. Your task is to craft a compelling and detailed property description based on the provided attributes.

Focus on evoking a sense of luxury, exclusivity, and the unique lifestyle the property offers. Use sophisticated language and highlight the most appealing aspects to attract discerning buyers.

Property Details:
Address: {{{address.street}}}, {{{address.city}}}, {{{address.state}}} {{{address.zip}}}
Type: {{{propertyType}}}
Bedrooms: {{{bedrooms}}}
Bathrooms: {{{bathrooms}}}
Square Footage: {{{squareFootage}}} sq ft
Asking Price: $J{{askingPrice}}
Key Features: {{{keyFeatures}}}. Join them with commas and list them elegantly.
Neighborhood: {{{neighborhoodDescription}}}

Craft a captivating headline and then a detailed, engaging description. Avoid jargon and focus on benefits and experiences. The description should be suitable for a high-end luxury real estate listing.`,
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePropertyDescriptionFlow',
    inputSchema: GeneratePropertyDescriptionInputSchema,
    outputSchema: GeneratePropertyDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate property description.');
    }
    return output;
  }
);
