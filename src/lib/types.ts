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
