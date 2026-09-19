"use client";

import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  Project,
  Experience,
  TechCategoryWithTech,
} from "@/lib/types";

const supabase = createClient();

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<Profile | null>(
    "profile",
    async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
  );
  return { profile: data, error, isLoading, mutate };
}

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    "projects",
    async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  );
  return { projects: data ?? [], error, isLoading, mutate };
}

export function useExperiences() {
  const { data, error, isLoading, mutate } = useSWR<Experience[]>(
    "experiences",
    async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  );
  return { experiences: data ?? [], error, isLoading, mutate };
}

export function useTechnologies() {
  const { data, error, isLoading, mutate } = useSWR<TechCategoryWithTech[]>(
    "tech_categories",
    async () => {
      const { data: categories, error: catError } = await supabase
        .from("tech_categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (catError) throw catError;

      const { data: techs, error: techError } = await supabase
        .from("technologies")
        .select("*")
        .order("display_order", { ascending: true });
      if (techError) throw techError;

      return (categories ?? []).map((cat) => ({
        ...cat,
        technologies: (techs ?? []).filter((t) => t.category_id === cat.id),
      }));
    }
  );
  return { categories: data ?? [], error, isLoading, mutate };
}
