import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from vite.config.ts define
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database types
export interface Project {
  id: string
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  tech: string[]
  image: string | null
  link: string | null
  github: string | null
  status: 'live' | 'development' | 'archived'
  year: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  title_es: string
  title_en: string
  company: string
  period: string
  duration_es: string | null
  duration_en: string | null
  type_es: string | null
  type_en: string | null
  location_es: string | null
  location_en: string | null
  description_es: string
  description_en: string
  achievements_es: string[]
  achievements_en: string[]
  technologies: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TechCategory {
  id: string
  slug: string
  title_es: string
  title_en: string
  icon: string
  sort_order: number
}

export interface Technology {
  id: string
  category_id: string
  name: string
  level: number
  color: string
  sort_order: number
}

export interface PersonalInfo {
  id: string
  key: string
  value_es: string
  value_en: string
  updated_at: string
}

export interface ContactLink {
  id: string
  type: 'email' | 'linkedin' | 'github' | 'cv' | 'other'
  url: string
  label_es: string | null
  label_en: string | null
  icon: string | null
  sort_order: number
}

export interface HeroTech {
  id: string
  name: string
  color: string
  sort_order: number
}

export interface HeroRole {
  id: string
  role_es: string
  role_en: string
  sort_order: number
}
