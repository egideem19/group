import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          username: string
          password: string
          role: 'admin' | 'contact_manager' | 'recruitment_manager'
          name: string
          email: string
          is_first_login: boolean
          is_active: boolean
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          username: string
          password: string
          role: 'admin' | 'contact_manager' | 'recruitment_manager'
          name: string
          email: string
          is_first_login?: boolean
          is_active?: boolean
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          username?: string
          password?: string
          role?: 'admin' | 'contact_manager' | 'recruitment_manager'
          name?: string
          email?: string
          is_first_login?: boolean
          is_active?: boolean
          created_at?: string
          last_login?: string | null
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: 'pending' | 'processed' | 'rejected'
          submitted_at: string
          processed_at: string | null
          processed_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          status?: 'pending' | 'processed' | 'rejected'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: 'pending' | 'processed' | 'rejected'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          notes?: string | null
        }
      }
      join_us_applications: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          domain: string
          presentation: string
          portfolio: string | null
          status: 'pending' | 'processed' | 'rejected'
          submitted_at: string
          processed_at: string | null
          processed_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          domain: string
          presentation: string
          portfolio?: string | null
          status?: 'pending' | 'processed' | 'rejected'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          domain?: string
          presentation?: string
          portfolio?: string | null
          status?: 'pending' | 'processed' | 'rejected'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'contact_manager' | 'recruitment_manager'
      status_type: 'pending' | 'processed' | 'rejected'
    }
  }
}