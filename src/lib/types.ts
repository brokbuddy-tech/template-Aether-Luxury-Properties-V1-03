

import type { LucideIcon } from 'lucide-react';

export type Property = {
  id: string;
  type: 'BUY' | 'RENT';
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images: string[];
  description: string;
  keyFeatures: string[];
  agent: {
    name: string;
    image: string;
  };
};

export type CommercialProperty = {
  id: string;
  transactionType: 'BUY' | 'RENT';
  propertyType: 'Office' | 'Retail' | 'Warehouse';
  title: string;
  price: number;
  address: string;
  area: number;
  image: string;
  images: string[];
  description: string;
  agent: {
    name: string;
    image: string;
  };
  grade?: string;
  views?: string[];
  condition?: string;
  parking?: number;
  amenities?: string[];
  dldPermitNo?: string;
};

export type OffPlanProject = {
  id: string;
  projectName: string;
  developer: string;
  handover: string;
  image: string;
  images: string[];
  description: string;
  paymentPlan: {
    milestone: string;
    percentage: number;
    amount: number;
  }[];
};

export type Service = {
  title: string;
  description: string;
  href: string;
  image: string;
};

export type Stat = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export type NewsArticle = {
  title: string;
  description: string;
  href: string;
};

export type Community = {
  name: string;
  image: string;
  href: string;
  description: string;
};

export type SocialLink = {
  title: string;
  href: string;
  icon: LucideIcon;
};

    