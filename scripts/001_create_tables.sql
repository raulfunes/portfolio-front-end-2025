-- Portfolio Database Schema
-- Creates all tables needed for the editable portfolio

-- Profile/About Me
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Raul Funes',
  subtitle TEXT DEFAULT 'Full Stack Developer',
  paragraph TEXT,
  roles TEXT[] DEFAULT ARRAY['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
  image_url TEXT DEFAULT '/images/myself.jpg',
  github_url TEXT DEFAULT 'https://github.com/raulfunes',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/in/raulfunes',
  email TEXT DEFAULT 'contact@raulfunes.dev',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  tech TEXT[] DEFAULT '{}',
  image_url TEXT,
  demo_link TEXT,
  github_link TEXT,
  status TEXT DEFAULT 'development',
  year TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Work Experience
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT,
  duration TEXT,
  type TEXT,
  location TEXT,
  description_es TEXT,
  description_en TEXT,
  achievements_es TEXT[] DEFAULT '{}',
  achievements_en TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Technology Categories
CREATE TABLE IF NOT EXISTS tech_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0
);

-- Individual Technologies
CREATE TABLE IF NOT EXISTS technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES tech_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INT DEFAULT 50,
  color TEXT DEFAULT '#ffffff',
  display_order INT DEFAULT 0
);

-- Translations (for i18n content)
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL DEFAULT 'es',
  key TEXT NOT NULL,
  value TEXT,
  UNIQUE(locale, key)
);

-- Enable Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Public read policies (portfolio is public)
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read tech_categories" ON tech_categories FOR SELECT USING (true);
CREATE POLICY "Public read technologies" ON technologies FOR SELECT USING (true);
CREATE POLICY "Public read translations" ON translations FOR SELECT USING (true);

-- Admin write policies (only authenticated users can write)
CREATE POLICY "Auth write profile" ON profile FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update profile" ON profile FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete profile" ON profile FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth write projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth write experiences" ON experiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update experiences" ON experiences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete experiences" ON experiences FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth write tech_categories" ON tech_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update tech_categories" ON tech_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete tech_categories" ON tech_categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth write technologies" ON technologies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update technologies" ON technologies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete technologies" ON technologies FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth write translations" ON translations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update translations" ON translations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete translations" ON translations FOR DELETE TO authenticated USING (true);
