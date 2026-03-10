import useSWR from 'swr'
import { supabase, Project, Experience, TechCategory, Technology, PersonalInfo, ContactLink, HeroTech, HeroRole } from '../lib/supabase'

// Generic fetcher for Supabase
const fetcher = async <T>(table: string, orderBy?: string): Promise<T[]> => {
  let query = supabase.from(table).select('*')
  if (orderBy) {
    query = query.order(orderBy)
  }
  const { data, error } = await query
  if (error) throw error
  return data as T[]
}

// Projects hook
export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    'projects',
    () => fetcher<Project>('projects', 'sort_order')
  )

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
    mutate()
  }

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('projects').insert(project)
    if (error) throw error
    mutate()
  }

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    mutate()
  }

  return {
    projects: data ?? [],
    isLoading,
    error,
    updateProject,
    createProject,
    deleteProject,
    mutate
  }
}

// Experiences hook
export function useExperiences() {
  const { data, error, isLoading, mutate } = useSWR<Experience[]>(
    'experiences',
    () => fetcher<Experience>('experiences', 'sort_order')
  )

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    const { error } = await supabase
      .from('experiences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
    mutate()
  }

  const createExperience = async (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('experiences').insert(experience)
    if (error) throw error
    mutate()
  }

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) throw error
    mutate()
  }

  return {
    experiences: data ?? [],
    isLoading,
    error,
    updateExperience,
    createExperience,
    deleteExperience,
    mutate
  }
}

// Tech categories with technologies hook
export function useTechnologies() {
  const { data: categories, error: catError, isLoading: catLoading, mutate: mutateCategories } = useSWR<TechCategory[]>(
    'tech_categories',
    () => fetcher<TechCategory>('tech_categories', 'sort_order')
  )

  const { data: technologies, error: techError, isLoading: techLoading, mutate: mutateTechnologies } = useSWR<Technology[]>(
    'technologies',
    () => fetcher<Technology>('technologies', 'sort_order')
  )

  const updateTechnology = async (id: string, updates: Partial<Technology>) => {
    const { error } = await supabase
      .from('technologies')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
    mutateTechnologies()
  }

  const createTechnology = async (technology: Omit<Technology, 'id'>) => {
    const { error } = await supabase.from('technologies').insert(technology)
    if (error) throw error
    mutateTechnologies()
  }

  const deleteTechnology = async (id: string) => {
    const { error } = await supabase.from('technologies').delete().eq('id', id)
    if (error) throw error
    mutateTechnologies()
  }

  const updateCategory = async (id: string, updates: Partial<TechCategory>) => {
    const { error } = await supabase
      .from('tech_categories')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
    mutateCategories()
  }

  // Group technologies by category
  const categoriesWithTech = categories?.map(cat => ({
    ...cat,
    technologies: technologies?.filter(t => t.category_id === cat.id) ?? []
  })) ?? []

  return {
    categories: categoriesWithTech,
    isLoading: catLoading || techLoading,
    error: catError || techError,
    updateTechnology,
    createTechnology,
    deleteTechnology,
    updateCategory,
    mutate: () => {
      mutateCategories()
      mutateTechnologies()
    }
  }
}

// Personal info hook
export function usePersonalInfo() {
  const { data, error, isLoading, mutate } = useSWR<PersonalInfo[]>(
    'personal_info',
    () => fetcher<PersonalInfo>('personal_info')
  )

  const getInfo = (key: string, lang: 'es' | 'en' = 'es'): string => {
    const info = data?.find(i => i.key === key)
    return lang === 'es' ? (info?.value_es ?? '') : (info?.value_en ?? '')
  }

  const updateInfo = async (key: string, value_es: string, value_en: string) => {
    const existing = data?.find(i => i.key === key)
    
    if (existing) {
      const { error } = await supabase
        .from('personal_info')
        .update({ value_es, value_en, updated_at: new Date().toISOString() })
        .eq('key', key)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('personal_info')
        .insert({ key, value_es, value_en })
      if (error) throw error
    }
    
    mutate()
  }

  return {
    personalInfo: data ?? [],
    getInfo,
    isLoading,
    error,
    updateInfo,
    mutate
  }
}

// Contact links hook
export function useContactLinks() {
  const { data, error, isLoading, mutate } = useSWR<ContactLink[]>(
    'contact_links',
    () => fetcher<ContactLink>('contact_links', 'sort_order')
  )

  const updateLink = async (id: string, updates: Partial<ContactLink>) => {
    const { error } = await supabase
      .from('contact_links')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
    mutate()
  }

  const createLink = async (link: Omit<ContactLink, 'id'>) => {
    const { error } = await supabase.from('contact_links').insert(link)
    if (error) throw error
    mutate()
  }

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from('contact_links').delete().eq('id', id)
    if (error) throw error
    mutate()
  }

  return {
    links: data ?? [],
    isLoading,
    error,
    updateLink,
    createLink,
    deleteLink,
    mutate
  }
}

// Hero techs hook (tech badges in AboutMe)
export function useHeroTechs() {
  const { data, error, isLoading, mutate } = useSWR<HeroTech[]>(
    'hero_techs',
    () => fetcher<HeroTech>('hero_techs', 'sort_order')
  )

  const updateTech = async (id: string, updates: Partial<HeroTech>) => {
    const { error } = await supabase
      .from('hero_techs')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
    mutate()
  }

  const createTech = async (tech: Omit<HeroTech, 'id'>) => {
    const { error } = await supabase.from('hero_techs').insert(tech)
    if (error) throw error
    mutate()
  }

  const deleteTech = async (id: string) => {
    const { error } = await supabase.from('hero_techs').delete().eq('id', id)
    if (error) throw error
    mutate()
  }

  return {
    techs: data ?? [],
    isLoading,
    error,
    updateTech,
    createTech,
    deleteTech,
    mutate
  }
}

// Hero roles hook (rotating roles in AboutMe)
export function useHeroRoles() {
  const { data, error, isLoading, mutate } = useSWR<HeroRole[]>(
    'hero_roles',
    () => fetcher<HeroRole>('hero_roles', 'sort_order')
  )

  const updateRole = async (id: string, updates: Partial<HeroRole>) => {
    const { error } = await supabase
      .from('hero_roles')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
    mutate()
  }

  const createRole = async (role: Omit<HeroRole, 'id'>) => {
    const { error } = await supabase.from('hero_roles').insert(role)
    if (error) throw error
    mutate()
  }

  const deleteRole = async (id: string) => {
    const { error } = await supabase.from('hero_roles').delete().eq('id', id)
    if (error) throw error
    mutate()
  }

  return {
    roles: data ?? [],
    isLoading,
    error,
    updateRole,
    createRole,
    deleteRole,
    mutate
  }
}
