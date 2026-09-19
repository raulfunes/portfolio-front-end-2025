export interface Profile {
  id: string
  title: string
  subtitle: string | null
  paragraph: string | null
  roles: string[]
  image_url: string | null
  github_url: string | null
  linkedin_url: string | null
  email: string | null
  updated_at?: string
}

export interface Project {
  id: string
  title: string
  description_es: string | null
  description_en: string | null
  tech: string[]
  image_url: string | null
  demo_link: string | null
  github_link: string | null
  status: string
  year: string | null
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  period: string | null
  duration: string | null
  type: string | null
  location: string | null
  description_es: string | null
  description_en: string | null
  achievements_es: string[]
  achievements_en: string[]
  technologies: string[]
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface TechCategory {
  id: string
  name_es: string
  name_en: string
  icon: string | null
  display_order: number
}

export interface Technology {
  id: string
  category_id: string
  name: string
  level: number
  color: string
  display_order: number
}

export interface TechCategoryWithTech extends TechCategory {
  technologies: Technology[]
}

export interface Translation {
  id: string
  locale: string
  key: string
  value: string | null
}

export type Locale = "es" | "en"
