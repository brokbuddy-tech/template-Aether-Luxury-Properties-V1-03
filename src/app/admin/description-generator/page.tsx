"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePropertyDescription, GeneratePropertyDescriptionInput, GeneratePropertyDescriptionOutput } from '@/ai/flows/generate-property-description';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip code is required'),
  bedrooms: z.coerce.number().int().positive('Must be a positive number'),
  bathrooms: z.coerce.number().int().positive('Must be a positive number'),
  squareFootage: z.coerce.number().positive('Must be a positive number'),
  propertyType: z.enum(['house', 'condo', 'apartment', 'land', 'villa', 'penthouse', 'townhouse']),
  keyFeatures: z.string().min(1, 'Please list at least one feature'),
  neighborhoodDescription: z.string().min(1, 'Neighborhood description is required'),
  askingPrice: z.coerce.number().positive('Must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

export default function DescriptionGeneratorPage() {
  const [generationResult, setGenerationResult] = useState<GeneratePropertyDescriptionOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: 'villa',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsGenerating(true);
    setGenerationResult(null);

    const input: GeneratePropertyDescriptionInput = {
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      squareFootage: data.squareFootage,
      propertyType: data.propertyType,
      keyFeatures: data.keyFeatures.split(',').map(s => s.trim()),
      neighborhoodDescription: data.neighborhoodDescription,
      askingPrice: data.askingPrice,
    };

    try {
      const result = await generatePropertyDescription(input);
      setGenerationResult(result);
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating the property description. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Property Description Generator</CardTitle>
          <CardDescription>Enter property details to generate a compelling listing description.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="street" render={({ field }) => (
                  <FormItem><FormLabel>Street</FormLabel><FormControl><Input placeholder="123 Luxury Lane" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Beverly Hills" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="CA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="zip" render={({ field }) => (
                  <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input placeholder="90210" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField control={form.control} name="bedrooms" render={({ field }) => (
                  <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="bathrooms" render={({ field }) => (
                  <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" placeholder="6" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="squareFootage" render={({ field }) => (
                  <FormItem><FormLabel>Sq. Footage</FormLabel><FormControl><Input type="number" placeholder="5200" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              
              <FormField control={form.control} name="propertyType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['house', 'condo', 'apartment', 'land', 'villa', 'penthouse', 'townhouse'].map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="keyFeatures" render={({ field }) => (
                <FormItem><FormLabel>Key Features (comma-separated)</FormLabel><FormControl><Textarea placeholder="e.g., Ocean view, Infinity pool, Gourmet kitchen" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="neighborhoodDescription" render={({ field }) => (
                <FormItem><FormLabel>Neighborhood Description</FormLabel><FormControl><Textarea placeholder="e.g., Quiet, family-friendly, close to top-rated schools" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="askingPrice" render={({ field }) => (
                  <FormItem><FormLabel>Asking Price</FormLabel><FormControl><Input type="number" placeholder="3500000" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Description'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>Review and copy the AI-generated content below.</CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating && (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          )}
          {generationResult && (
            <div className="space-y-6">
              <div>
                <Label className="font-bold">Headline</Label>
                <div className="mt-2 rounded-md border bg-muted p-4 text-lg font-headline font-semibold">{generationResult.headline}</div>
              </div>
              <div>
                <Label className="font-bold">Description</Label>
                <div className="mt-2 rounded-md border bg-muted p-4 whitespace-pre-wrap">{generationResult.description}</div>
              </div>
            </div>
          )}
          {!isGenerating && !generationResult && (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-center">
              Your generated property description will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
