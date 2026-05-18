import {
  Briefcase,
  Clock,
  Mic,
  Star,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import type {
  Community,
  NewsArticle,
  Service,
  SocialLink,
  Stat,
} from './types';

export const services: Service[] = [
  {
    title: 'Buy',
    description: 'Find your dream home from our exclusive collection of luxury properties.',
    href: '/buy',
    image: 'property-1-ext',
  },
  {
    title: 'Rent',
    description: 'Discover exceptional properties for long-term and short-term lease.',
    href: '/rent',
    image: 'property-3-ext',
  },
  {
    title: 'Sell',
    description: 'Our experts will help you achieve the best value for your property.',
    href: '/sell',
    image: 'hero-sell',
  },
  {
    title: 'Commercial',
    description: 'Explore prime commercial real estate opportunities.',
    href: '/commercial',
    image: 'property-2-ext',
  },
  {
    title: 'Off-Plan',
    description: 'Invest in the future with our portfolio of off-plan projects.',
    href: '/off-plan',
    image: 'offplan-1',
  },
  {
    title: 'Property Management',
    description: 'Comprehensive management services for your real estate assets.',
    href: '#',
    image: 'property-2-int',
  },
  {
    title: 'Holiday Homes',
    description: 'Luxury vacation rentals for an unforgettable stay.',
    href: '#',
    image: 'property-3-int',
  },
  {
    title: 'About Us',
    description: 'Learn more about our mission and what sets our team apart.',
    href: '/about',
    image: 'hero-2',
  },
];

export const stats: Stat[] = [
  {
    value: '300+',
    label: 'Community Brokers',
    icon: Briefcase,
  },
  {
    value: '4.9/5',
    label: 'Google Rating (1,152 Reviews)',
    icon: Star,
  },
  {
    value: '6,000+',
    label: 'Property Transactions in 2026',
    icon: TrendingUp,
  },
  {
    value: '24/7',
    label: 'We work round the clock',
    icon: Clock,
  },
];

export const newsArticles: NewsArticle[] = [
  {
    title: 'A Smoother Path to Completion',
    description: 'Discover how our structured approach and dedicated client managers are setting new standards for efficiency and transparency in property transactions.',
    href: '#',
  },
  {
    title: 'The Rise of Branded Residences',
    description: 'We dive deep into the growing trend of branded residences in Dubai and what it means for luxury real estate investors.',
    href: '#',
  },
  {
    title: 'When is the Best Time to Renovate?',
    description: 'Timing your renovation after purchasing a property in Dubai is key, whether for personal use or investment. Learn the optimal strategies.',
    href: '#',
  },
];

export const communities: Community[] = [
  {
    name: 'Palm Jumeirah',
    image: 'community-palm',
    href: '/buy?community=Palm%20Jumeirah',
    description: 'Iconic man-made island known for its luxurious villas and high-end hotels.',
  },
  {
    name: 'Dubai Marina',
    image: 'community-marina',
    href: '/buy?community=Dubai%20Marina',
    description: 'A vibrant waterfront community with skyscrapers, restaurants, and entertainment.',
  },
  {
    name: 'Downtown Dubai',
    image: 'hero-dubai',
    href: '/buy?community=Downtown%20Dubai',
    description: "Home to the Burj Khalifa and The Dubai Mall, the heart of the city's buzz.",
  },
  {
    name: 'Emirates Hills',
    image: 'property-1-ext',
    href: '/buy?community=Emirates%20Hills',
    description: 'An exclusive gated community with sprawling villas and lush green golf courses.',
  },
];

export const socialLinks: SocialLink[] = [
  { title: 'Meet The Team', href: '/about', icon: Users },
  { title: 'Careers', href: '#', icon: Briefcase },
  { title: 'Videos', href: '#', icon: Video },
  { title: 'Podcasts', href: '#', icon: Mic },
];
