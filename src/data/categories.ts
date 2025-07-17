import { ServiceCategory } from '../types'

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'home-repair',
    name: 'Home Repair',
    description: 'General home maintenance and repairs',
    icon: '🔧',
    subcategories: ['Plumbing', 'Electrical', 'HVAC', 'Appliance Repair', 'General Handyman']
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Professional cleaning services',
    icon: '🧽',
    subcategories: ['House Cleaning', 'Deep Cleaning', 'Move-in/Move-out', 'Post-Construction', 'Window Cleaning']
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    description: 'Outdoor and garden services',
    icon: '🌿',
    subcategories: ['Lawn Care', 'Tree Service', 'Garden Design', 'Irrigation', 'Snow Removal']
  },
  {
    id: 'painting',
    name: 'Painting',
    description: 'Interior and exterior painting',
    icon: '🎨',
    subcategories: ['Interior Painting', 'Exterior Painting', 'Cabinet Painting', 'Pressure Washing', 'Wallpaper']
  },
  {
    id: 'moving',
    name: 'Moving',
    description: 'Moving and delivery services',
    icon: '📦',
    subcategories: ['Local Moving', 'Long Distance', 'Packing', 'Furniture Assembly', 'Junk Removal']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car maintenance and repair',
    icon: '🚗',
    subcategories: ['Oil Change', 'Brake Service', 'Tire Service', 'Car Detailing', 'Mobile Mechanic']
  }
]