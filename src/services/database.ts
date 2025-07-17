import { supabase } from '../lib/supabase'
import { Database } from '../lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Job = Database['public']['Tables']['jobs']['Row']
type ServiceProvider = Database['public']['Tables']['service_providers']['Row']
type Bid = Database['public']['Tables']['bids']['Row']

// Profile operations
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    
    if (error) {
      console.error('Error updating profile:', error)
      return false
    }
    
    return true
  }
}

// Job operations
export const jobService = {
  async createJob(job: Database['public']['Tables']['jobs']['Insert']): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating job:', error)
      return null
    }
    
    return data
  },

  async getJobs(filters?: {
    category?: string
    location?: string
    status?: string
    customerId?: string
  }): Promise<Job[]> {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        profiles!jobs_customer_id_fkey (
          id,
          display_name,
          email,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching jobs:', error)
      return []
    }
    
    return data || []
  },

  async getJob(jobId: string): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles!jobs_customer_id_fkey (
          id,
          display_name,
          email,
          avatar_url
        )
      `)
      .eq('id', jobId)
      .single()
    
    if (error) {
      console.error('Error fetching job:', error)
      return null
    }
    
    return data
  },

  async updateJob(jobId: string, updates: Partial<Job>): Promise<boolean> {
    const { error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
    
    if (error) {
      console.error('Error updating job:', error)
      return false
    }
    
    return true
  }
}

// Service Provider operations
export const providerService = {
  async createProvider(provider: Database['public']['Tables']['service_providers']['Insert']): Promise<ServiceProvider | null> {
    const { data, error } = await supabase
      .from('service_providers')
      .insert(provider)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating provider:', error)
      return null
    }
    
    return data
  },

  async getProvider(userId: string): Promise<ServiceProvider | null> {
    const { data, error } = await supabase
      .from('service_providers')
      .select(`
        *,
        profiles!service_providers_user_id_fkey (
          id,
          display_name,
          email,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching provider:', error)
      return null
    }
    
    return data
  },

  async getProviders(filters?: {
    category?: string
    location?: string
    verified?: boolean
  }): Promise<ServiceProvider[]> {
    let query = supabase
      .from('service_providers')
      .select(`
        *,
        profiles!service_providers_user_id_fkey (
          id,
          display_name,
          email,
          avatar_url
        )
      `)
      .order('rating', { ascending: false })
    
    if (filters?.category) {
      query = query.contains('categories', [filters.category])
    }
    
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    
    if (filters?.verified !== undefined) {
      query = query.eq('verified', filters.verified)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching providers:', error)
      return []
    }
    
    return data || []
  },

  async updateProvider(userId: string, updates: Partial<ServiceProvider>): Promise<boolean> {
    const { error } = await supabase
      .from('service_providers')
      .update(updates)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error updating provider:', error)
      return false
    }
    
    return true
  }
}

// Bid operations
export const bidService = {
  async createBid(bid: Database['public']['Tables']['bids']['Insert']): Promise<Bid | null> {
    const { data, error } = await supabase
      .from('bids')
      .insert(bid)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating bid:', error)
      return null
    }
    
    return data
  },

  async getBidsForJob(jobId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        profiles!bids_provider_id_fkey (
          id,
          display_name,
          email,
          avatar_url
        ),
        service_providers!service_providers_user_id_fkey (
          rating,
          review_count,
          completed_jobs,
          verified
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching bids:', error)
      return []
    }
    
    return data || []
  },

  async getBidsForProvider(providerId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        jobs!bids_job_id_fkey (
          id,
          title,
          description,
          budget,
          budget_type,
          location,
          status
        )
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching provider bids:', error)
      return []
    }
    
    return data || []
  },

  async updateBid(bidId: string, updates: Partial<Bid>): Promise<boolean> {
    const { error } = await supabase
      .from('bids')
      .update(updates)
      .eq('id', bidId)
    
    if (error) {
      console.error('Error updating bid:', error)
      return false
    }
    
    return true
  }
}