export interface User {
  id: string
  email: string
  displayName: string
  userType: 'customer' | 'provider'
  avatar?: string
  phone?: string
  location?: string
  createdAt: string
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  subcategories: string[]
}

export interface Job {
  id: string
  customerId: string
  title: string
  description: string
  category: string
  subcategory?: string
  budget: number
  budgetType: 'fixed' | 'hourly'
  location: string
  urgency: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  images?: string[]
  requirements?: string[]
  createdAt: string
  updatedAt: string
  customer?: User
}

export interface Bid {
  id: string
  jobId: string
  providerId: string
  amount: number
  message: string
  estimatedDuration: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  provider?: User
}

export interface ServiceProvider {
  id: string
  userId: string
  businessName?: string
  description: string
  categories: string[]
  hourlyRate: number
  rating: number
  reviewCount: number
  completedJobs: number
  verified: boolean
  portfolio: string[]
  skills: string[]
  availability: string
  location: string
  createdAt: string
  user?: User
}