import useSWR from 'swr'
import { supabase, Project, Experience, TechCategory, Technology, PersonalInfo, ContactLink, HeroTech, HeroRole } from '../lib/supabase'
import { useEditMode } from '../contexts/EditModeContext'

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

// Helper: returns a no-op if in demo mode, otherwise runs fn
function useDemoGuard() {
  const { isDemoMode } = useEditMode()
  return function guard<T>(fn: () => Promise<T>): Promise<T> {
    if (isDemoMode) return Promise.resolve(undefined as T)
    return fn()
  }
}

// Projects hook
export function useProjects() {
  const guard = useDemoGuard()
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    'projects',
    () => fetcher<Project>('projects', 'sort_order')
  )

  const updateProject = (id: string, updates: Partial<Project>) =>
    guard(async () => {
      const { error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      mutate()
    })

  const createProject = (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) =>
    guard(async () => {
      const { error } = await supabase.from('projects').insert(project)
      if (error) throw error
      mutate()
    })

  const deleteProject = (id: string) =>
    guard(async () => {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      mutate()
    })

  return { projects: data ?? [], isLoading, error, updateProject, createProject, deleteProject, mutate }
}

// Experiences hook
export function useExperiences() {
  const guard = useDemoGuard()
  const { data, error, isLoading, mutate } = useSWR<Experience[]>(
    'experiences',
    () => fetcher<Experience>('experiences', 'sort_order')
  )

  const updateExperience = (id: string, updates: Partial<Experience>) =>
    guard(async () => {
      const { error } = await supabase
        .from('experiences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      mutate()
    })

  const createExperience = (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) =>
    guard(async () => {
      const { error } = await supabase.from('experiences').insert(experience)
      if (error) throw error
      mutate()
    })

  const deleteExperience = (id: string) =>
    guard(async () => {
      const { error } = await supabase.from('experiences').delete().eq('id', id)
      if (error) throw error
      mutate()
    })

  return { experiences: data ?? [], isLoading, error, updateExperience, createExperience, deleteExperience, mutate }
}

// Tech categories with technologies hook
export function useTechnologies() {
  const guard = useDemoGuard()
  const { data: categories, error: catError, isLoading: catLoading, mutate: mutateCategories } = useSWR<TechCategory[]>(
    'tech_categories',
    () => fetcher<TechCategory>('tech_categories', 'sort_order')
  )

  const { data: technologies, error: techError, isLoading: techLoading, mutate: mutateTechnologies } = useSWR<Technology[]>(
    'technologies',
    () => fetcher<Technology>('technologies', 'sort_order')
  )

  const updateTechnology = (id: string, updates: Partial<Technology>) =>
    guard(async () => {
      const { error } = await supabase.from('technologies').update(updates).eq('id', id)
      if (error) throw error
      mutateTechnologies()
    })

  const createTechnology = (technology: Omit<Technology, 'id'>) =>
    guard(async () => {
      const { error } = await supabase.from('technologies').insert(technology)
      if (error) throw error
      mutateTechnologies()
    })

  const deleteTechnology = (id: string) =>
    guard(async () => {
      const { error } = await supabase.from('technologies').delete().eq('id', id)
      if (error) throw error
      mutateTechnologies()
    })

  const updateCategory = (id: string, updates: Partial<TechCategory>) =>
    guard(async () => {
      const { error } = await supabase.from('tech_categories').update(updates).eq('id', id)
      if (error) throw error
      mutateCategories()
    })

  const createCategory = (category: Omit<TechCategory, 'id'>) =>
    guard(async () => {
      const { error } = await supabase.from('tech_categories').insert(category)
      if (error) throw error
      mutateCategories()
    })

  const deleteCategory = (id: string) =>
    guard(async () => {
      const { error } = await supabase.from('tech_categories').delete().eq('id', id)
      if (error) throw error
      mutateCategories()
      mutateTechnologies()
    })

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
    createCategory,
    deleteCategory,
    mutate: () => { mutateCategories(); mutateTechnologies() }
  }
}

// Personal info hook
export function usePersonalInfo() {
  const guard = useDemoGuard()
  const { data, error, isLoading, mutate } = useSWR<PersonalInfo[]>(
    'personal_info',
    () => fetcher<PersonalInfo>('personal_info')
  )

  const getInfo = (key: string, lang: 'es' | 'en' = 'es'): string => {
    const info = data?.find(i => i.key === key)
    return lang === 'es' ? (info?.value_es ?? '') : (info?.value_en ?? '')
  }

  const updateInfo = (key: string, value_es: string, value_en: string) =>
    guard(async () => {
      const existing = data?.find(i => i.key === key)
      if (existing) {
        const { error } = await supabase
          .from('personal_info')
          .update({ value_es, value_en, updated_at: new Date().toISOString() })
          .eq('key', key)
        if (error) throw error
      } else {
        const { error } = await supabase.from('personal_info').insert({ key, value_es, value_en })
        if (error) throw error
      }
      mutate()
    })

  return { personalInfo: data ?? [], getInfo, isLoading, error, updateInfo, mutate }
}

// Contact links hook
export function useContactLinks() {
  const guard = useDemoGuard()
  const { data, error, isLoading, mutate } = useSWR<ContactLink[]>(
    'contact_links',
    () => fetcher<ContactLink>('contact_links', 'sort_order')
  )

  const updateLink = (id: string, updates: Partial<ContactLink>) =>
    guard(async () => {
      const { error } = await supabase.from('contact_links').update(updates).eq('id', id)
      if (error) throw error
      mutate()
    })

  const createLink = (link: Omit<ContactLink, 'id'>) =>
    guard(async () => {
      const { error } = await supabase.from('contact_links').insert(link)
      if (error) throw error
      mutate()
    })

  const deleteLink = (id: string) =>
    guard(async () => {
      const { error } = await supabase.from('contact_links').delete().eq('id', id)
      if (error) throw error
      mutate()
    })

  return { links: data ?? [], isLoading, error, updateLink, createLink, deleteLink, mutate }
}

// Hero techs hook
export function useHeroTechs() {
  const guard = useDemoGuard()
  const { data, error, isLoading, mutate } = useSWR<HeroTech[]>(
    'hero_techs',
    () => fetcher<HeroTech>('hero_techs', 'sort_order')
  )

  const updateTech = (id: string, updates: Partial<HeroTech>) =>
    guard(async () => {
      const { error } = await supabase.from('hero_techs').update(updates).eq('id', id)
      if (error) throw error
      mutate()
    })

  const createTech = (tech: Omit<HeroTech, 'id'>) =>
    guard(async () => {
      const { error } = await supabase.from('hero_techs').insert(tech)
      if (error) throw error
      mutate()
    })

  const deleteTech = (id: string) =>
    guard(async () => {
      const { error } = await supabase.from('hero_techs').delete().eq('id', id)
      if (error) throw error
      mutate()
    })

  return { techs: data ?? [], isLoading, error, updateTech, createTech, deleteTech, mutate }
}

// Hero roles hook
export function useHeroRoles() {
  const guard = useDemoGuard()
  const { data, error, isLoading, mutate } = useSWR<HeroRole[]>(
    'hero_roles',
    () => fetcher<HeroRole>('hero_roles', 'sort_order')
  )

  const updateRole = (id: string, updates: Partial<HeroRole>) =>
    guard(async () => {
      const { error } = await supabase.from('hero_roles').update(updates).eq('id', id)
      if (error) throw error
      mutate()
    })

  const createRole = (role: Omit<HeroRole, 'id'>) =>
    guard(async () => {
      const { error } = await supabase.from('hero_roles').insert(role)
      if (error) throw error
      mutate()
    })

  const deleteRole = (id: string) =>
    guard(async () => {
      const { error } = await supabase.from('hero_roles').delete().eq('id', id)
      if (error) throw error
      mutate()
    })

  return { roles: data ?? [], isLoading, error, updateRole, createRole, deleteRole, mutate }
}
