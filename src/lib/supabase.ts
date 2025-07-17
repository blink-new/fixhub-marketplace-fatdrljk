import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exfahnmqrnngtxvjshhu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZmFobm1xcm5uZ3R4dmpzaGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzEzMTMsImV4cCI6MjA2ODM0NzMxM30.ns_0PKWY1hem0f5Mej4Nji5dBt-LScQ4GLGFmZ4pvNs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          user_type: 'customer' | 'provider'
          avatar_url: string | null
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          user_type: 'customer' | 'provider'
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          user_type?: 'customer' | 'provider'
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      service_providers: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          description: string
          categories: string[]
          hourly_rate: number
          rating: number
          review_count: number
          completed_jobs: number
          verified: boolean
          portfolio: string[]
          skills: string[]
          availability: string
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          description: string
          categories: string[]
          hourly_rate: number
          rating?: number
          review_count?: number
          completed_jobs?: number
          verified?: boolean
          portfolio?: string[]
          skills?: string[]
          availability: string
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          description?: string
          categories?: string[]
          hourly_rate?: number
          rating?: number
          review_count?: number
          completed_jobs?: number
          verified?: boolean
          portfolio?: string[]
          skills?: string[]
          availability?: string
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          customer_id: string
          title: string
          description: string
          category: string
          subcategory: string | null
          budget: number
          budget_type: 'fixed' | 'hourly'
          location: string
          urgency: 'low' | 'medium' | 'high'
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          images: string[] | null
          requirements: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          title: string
          description: string
          category: string
          subcategory?: string | null
          budget: number
          budget_type: 'fixed' | 'hourly'
          location: string
          urgency: 'low' | 'medium' | 'high'
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          images?: string[] | null
          requirements?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          title?: string
          description?: string
          category?: string
          subcategory?: string | null
          budget?: number
          budget_type?: 'fixed' | 'hourly'
          location?: string
          urgency?: 'low' | 'medium' | 'high'
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          images?: string[] | null
          requirements?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          job_id: string
          provider_id: string
          amount: number
          message: string
          estimated_duration: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          provider_id: string
          amount: number
          message: string
          estimated_duration: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          provider_id?: string
          amount?: number
          message?: string
          estimated_duration?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}