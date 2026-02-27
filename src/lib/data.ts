import type { Property, OffPlanProject } from './types';

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
