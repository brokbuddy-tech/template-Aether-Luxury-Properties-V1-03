

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
  Property,
  OffPlanProject,
  Service,
  Stat,
  TeamMember,
  NewsArticle,
  Community,
  SocialLink,
  CommercialProperty,
} from './types';

export const properties: Property[] = [
  {
    id: '1',
    type: 'BUY',
    title: 'Modern Villa in the Hills',
    price: 3500000,
    address: '123 Pinnacle Drive, Beverly Hills, CA 90210',
    bedrooms: 5,
    bathrooms: 6,
    area: 5200,
    image: 'property-1-ext',
    images: ['property-1-ext', 'property-1-int', 'property-2-int'],
    description: 'Nestled in the prestigious hills of Beverly Hills, this modern villa offers unparalleled luxury and breathtaking city views. Featuring an open-plan living space, a gourmet kitchen, and an infinity pool, this property is an oasis of tranquility and sophistication.',
    keyFeatures: ['Infinity Pool', 'City Views', 'Gourmet Kitchen', 'Home Theater', '3-Car Garage'],
    agent: {
      name: 'Isabella Rossi',
      image: 'agent-1',
    },
  },
  {
    id: '2',
    type: 'BUY',
    title: 'Luxury Downtown Penthouse',
    price: 5200000,
    address: '888 Grand Avenue, Apt 4501, Los Angeles, CA 90017',
    bedrooms: 3,
    bathrooms: 4,
    area: 3800,
    image: 'property-2-ext',
    images: ['property-2-ext', 'property-2-int', 'property-3-int'],
    description: 'Experience the height of urban living in this exquisite penthouse. With panoramic views of the downtown skyline, floor-to-ceiling windows, and bespoke finishes, this residence is the epitome of elegance. Building amenities include a rooftop pool, fitness center, and 24/7 concierge.',
    keyFeatures: ['Panoramic Views', 'Rooftop Pool', '24/7 Concierge', 'Smart Home System', 'Designer Finishes'],
    agent: {
      name: 'James Carter',
      image: 'agent-2',
    },
  },
  {
    id: '3',
    type: 'RENT',
    title: 'Serene Beachfront Escape',
    price: 25000,
    address: '2500 Pacific Coast Highway, Malibu, CA 90265',
    bedrooms: 4,
    bathrooms: 4,
    area: 3100,
    image: 'property-3-ext',
    images: ['property-3-ext', 'property-3-int', 'property-1-int'],
    description: 'Wake up to the sound of waves in this stunning beachfront home in Malibu. Offering direct beach access, a spacious deck for entertaining, and a light-filled interior, this property is the perfect monthly retreat from the city.',
    keyFeatures: ['Direct Beach Access', 'Oceanfront Deck', 'Sunset Views', 'Gourmet Kitchen', 'Fully Furnished'],
    agent: {
      name: 'Isabella Rossi',
      image: 'agent-1',
    },
  },
  {
    id: '4',
    type: 'RENT',
    title: 'Chic Urban Loft',
    price: 8500,
    address: '123 Arts District, Los Angeles, CA 90013',
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    image: 'property-2-int',
    images: ['property-2-int', 'property-1-int', 'property-2-ext'],
    description: 'Located in the vibrant Arts District, this stylish loft features high ceilings, exposed brick walls, and an open-concept layout. Perfect for creatives and professionals seeking a dynamic urban lifestyle.',
    keyFeatures: ['High Ceilings', 'Exposed Brick', 'Walkable Neighborhood', 'Community Gym', 'Secure Parking'],
    agent: {
      name: 'James Carter',
      image: 'agent-2',
    },
  },
];

export const commercialProperties: CommercialProperty[] = [
  {
    id: 'c1',
    transactionType: 'BUY',
    propertyType: 'Office',
    title: 'Grade A Office Space in Business Bay',
    price: 15000000,
    address: 'Executive Towers, Business Bay, Dubai',
    area: 5000,
    image: 'commercial-1',
    images: ['commercial-1', 'commercial-office-int-1', 'hero-dubai'],
    description: 'A premium, fully-fitted office space in the heart of Dubai\'s business district. Offering stunning canal views, high-speed elevators, and access to world-class amenities. Perfect for a corporate headquarters.',
    agent: {
      name: 'James Carter',
      image: 'agent-2',
    },
    grade: 'Grade A+',
    views: ['Canal View', 'Burj Khalifa View'],
    condition: 'Fully Fitted',
    parking: 10,
    amenities: ['Covered Parking', '24/7 Security', 'High-speed elevators', 'Meeting Rooms', 'Retail in building'],
  },
  {
    id: 'c2',
    transactionType: 'RENT',
    propertyType: 'Retail',
    title: 'Prime Retail Unit in Dubai Mall',
    price: 850000,
    address: 'The Dubai Mall, Downtown Dubai',
    area: 2500,
    image: 'commercial-2',
    images: ['commercial-2', 'commercial-retail-int-1', 'hero-dubai'],
    description: 'Exceptional retail opportunity with high footfall in the world\'s most visited shopping and entertainment destination. Features a wide glass frontage and modern interiors, ideal for a luxury brand.',
    agent: {
      name: 'Isabella Rossi',
      image: 'agent-1',
    },
    condition: 'Shell & Core',
    parking: 5,
    amenities: ['High Footfall Area', 'Visitor Parking', 'Direct Mall Access'],
  },
  {
    id: 'c3',
    transactionType: 'BUY',
    propertyType: 'Warehouse',
    title: 'Large Industrial Warehouse in JAFZA',
    price: 25000000,
    address: 'Jebel Ali Free Zone (JAFZA), Dubai',
    area: 20000,
    image: 'commercial-3',
    images: ['commercial-3', 'commercial-warehouse-int-1', 'hero-dubai'],
    description: 'A state-of-the-art industrial warehouse with high ceilings, multiple loading bays, and integrated office space. Located in a prime logistics hub with excellent transport links.',
    agent: {
      name: 'James Carter',
      image: 'agent-2',
    },
    condition: 'Fitted with Racking',
    parking: 30,
    amenities: ['Loading Docks', '24/7 Security', 'Office Space Included', 'Easy Highway Access'],
  },
    {
    id: 'c4',
    transactionType: 'RENT',
    propertyType: 'Office',
    title: 'Modern Co-working Space in Dubai Marina',
    price: 25000,
    address: 'Marina Gate, Dubai Marina',
    area: 1500,
    image: 'commercial-office-int-1',
    images: ['commercial-office-int-1', 'commercial-1', 'hero-dubai'],
    description: 'A vibrant and fully-serviced office space with flexible terms. Includes access to meeting rooms, high-speed internet, and a professional community. Ideal for startups and freelancers.',
    agent: {
      name: 'Isabella Rossi',
      image: 'agent-1',
    },
    grade: 'Grade A',
    views: ['Marina View'],
    condition: 'Fully Furnished',
    amenities: ['Shared Reception', 'Meeting Rooms', 'High-Speed WiFi', 'Coffee & Tea'],
  },
];


export const offPlanProjects: OffPlanProject[] = [
  {
    id: 'op-1',
    projectName: 'Elysian Towers',
    developer: 'Celestial Developments',
    handover: 'Q3 2026',
    image: 'offplan-1',
    images: ['offplan-1', 'offplan-2'],
    description: 'Elysian Towers is set to redefine luxury living. A masterpiece of modern architecture, this residential tower will offer state-of-the-art amenities and unparalleled views of the city. Invest in the future of luxury.',
    paymentPlan: [
      { milestone: 'Down Payment', percentage: 10, amount: 150000 },
      { milestone: 'On 20% Construction', percentage: 10, amount: 150000 },
      { milestone: 'On 40% Construction', percentage: 10, amount: 150000 },
      { milestone: 'On 60% Construction', percentage: 10, amount: 150000 },
      { milestone: 'On Handover', percentage: 60, amount: 900000 },
    ],
  },
  {
    id: 'op-2',
    projectName: 'Veridian Residences',
    developer: 'GreenScape Properties',
    handover: 'Q1 2026',
    image: 'offplan-2',
    images: ['offplan-2', 'offplan-1'],
    description: 'A new master-planned community integrating nature and modern design. Veridian Residences will feature lush parks, eco-friendly homes, and a vibrant community center. A perfect place for families to grow.',
    paymentPlan: [
      { milestone: 'Booking Amount', percentage: 5, amount: 50000 },
      { milestone: '30 Days from Booking', percentage: 5, amount: 50000 },
      { milestone: 'On 50% Construction', percentage: 20, amount: 200000 },
      { milestone: 'On Handover', percentage: 70, amount: 700000 },
    ],
  },
];

export function getPropertyById(id: string) {
  return properties.find(p => p.id === id);
}

export function getOffPlanProjectById(id: string) {
  return offPlanProjects.find(p => p.id === id);
}

export function getCommercialPropertyById(id: string) {
  return commercialProperties.find(p => p.id === id);
}

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
    description: 'Learn more about our mission and the Aether difference.',
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

export const teamMembers: TeamMember[] = [
  { name: 'Isabella Rossi', role: 'Founder & CEO', image: 'agent-1' },
  { name: 'James Carter', role: 'Head of Sales', image: 'agent-2' },
  { name: 'Sophia Loren', role: 'Lead Architect Advisor', image: 'agent-1' },
  { name: 'Marcus Aurelius', role: 'Chief Financial Officer', image: 'agent-2' },
];

export const newsArticles: NewsArticle[] = [
    {
        title: "A Smoother Path to Completion",
        description: "Discover how Aether's structured approach and dedicated client managers are setting new standards for efficiency and transparency in property transactions.",
        href: '#'
    },
    {
        title: "The Rise of Branded Residences",
        description: "We dive deep into the growing trend of branded residences in Dubai and what it means for luxury real estate investors.",
        href: '#'
    },
    {
        title: "When is the Best Time to Renovate?",
        description: "Timing your renovation after purchasing a property in Dubai is key, whether for personal use or investment. Learn the optimal strategies.",
        href: '#'
    }
];

export const communities: Community[] = [
    { name: "Palm Jumeirah", image: "community-palm", href: "#", description: "Iconic man-made island known for its luxurious villas and high-end hotels."},
    { name: "Dubai Marina", image: "community-marina", href: "#", description: "A vibrant waterfront community with skyscrapers, restaurants, and entertainment."},
    { name: "Downtown Dubai", image: "hero-dubai", href: "#", description: "Home to the Burj Khalifa and The Dubai Mall, the heart of the city's buzz."},
    { name: "Emirates Hills", image: "property-1-ext", href: "#", description: "An exclusive gated community with sprawling villas and lush green golf courses."},
]

export const socialLinks: SocialLink[] = [
    { title: "Meet The Team", href: "/about", icon: Users },
    { title: "Careers", href: "#", icon: Briefcase },
    { title: "Videos", href: "#", icon: Video },
    { title: "Podcasts", href: "#", icon: Mic },
]

    