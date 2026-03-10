-- =============================================
-- Portfolio Edit Mode: Database Setup
-- =============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS technologies CASCADE;
DROP TABLE IF EXISTS tech_categories CASCADE;
DROP TABLE IF EXISTS contact_links CASCADE;
DROP TABLE IF EXISTS personal_info CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Tabla de proyectos con soporte i18n
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  image TEXT,
  link TEXT,
  github TEXT,
  status TEXT CHECK (status IN ('live', 'development', 'archived')) DEFAULT 'development',
  year TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de experiencias laborales
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  duration_es TEXT,
  duration_en TEXT,
  type_es TEXT,
  type_en TEXT,
  location_es TEXT,
  location_en TEXT,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  achievements_es TEXT[] NOT NULL DEFAULT '{}',
  achievements_en TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de categorias de tecnologias
CREATE TABLE tech_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Tabla de tecnologias individuales
CREATE TABLE technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES tech_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER CHECK (level >= 0 AND level <= 100) DEFAULT 50,
  color TEXT NOT NULL DEFAULT '#ffffff',
  sort_order INTEGER DEFAULT 0
);

-- Tabla de informacion personal (contenido i18n)
CREATE TABLE personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value_es TEXT NOT NULL,
  value_en TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de links de contacto
CREATE TABLE contact_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('email', 'linkedin', 'github', 'cv', 'other')),
  url TEXT NOT NULL,
  label_es TEXT,
  label_en TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;

-- Politicas de lectura publica (SELECT)
CREATE POLICY "projects_public_read" ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "experiences_public_read" ON experiences FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "tech_categories_public_read" ON tech_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "technologies_public_read" ON technologies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "personal_info_public_read" ON personal_info FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "contact_links_public_read" ON contact_links FOR SELECT TO anon, authenticated USING (true);

-- Politicas de escritura para usuarios autenticados (INSERT, UPDATE, DELETE)
CREATE POLICY "projects_auth_insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "projects_auth_update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "projects_auth_delete" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "experiences_auth_insert" ON experiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "experiences_auth_update" ON experiences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "experiences_auth_delete" ON experiences FOR DELETE TO authenticated USING (true);

CREATE POLICY "tech_categories_auth_insert" ON tech_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tech_categories_auth_update" ON tech_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "tech_categories_auth_delete" ON tech_categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "technologies_auth_insert" ON technologies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "technologies_auth_update" ON technologies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "technologies_auth_delete" ON technologies FOR DELETE TO authenticated USING (true);

CREATE POLICY "personal_info_auth_insert" ON personal_info FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "personal_info_auth_update" ON personal_info FOR UPDATE TO authenticated USING (true);
CREATE POLICY "personal_info_auth_delete" ON personal_info FOR DELETE TO authenticated USING (true);

CREATE POLICY "contact_links_auth_insert" ON contact_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "contact_links_auth_update" ON contact_links FOR UPDATE TO authenticated USING (true);
CREATE POLICY "contact_links_auth_delete" ON contact_links FOR DELETE TO authenticated USING (true);

-- =============================================
-- Seed Data: Proyectos
-- =============================================

INSERT INTO projects (title_es, title_en, description_es, description_en, tech, image, link, github, status, year, sort_order)
VALUES 
(
  'Portfolio Personal',
  'Personal Portfolio',
  'Web personal con tema oscuro, selector de idioma, animaciones fluidas y diseno retro inspirado en terminales.',
  'Personal website with dark theme, language selector, smooth animations, and retro terminal-inspired design.',
  ARRAY['React', 'TypeScript', 'CSS', 'i18n'],
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop',
  'https://miportafolio.com',
  'https://github.com/raulfunes/portfolio',
  'live',
  '2024',
  1
),
(
  'Task Manager CLI',
  'Task Manager CLI',
  'API REST para gestion de tareas con autenticacion, roles de usuario y documentacion Swagger.',
  'REST API for task management with authentication, user roles, and Swagger documentation.',
  ARRAY['Node.js', 'MongoDB', 'Express', 'JWT'],
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
  'https://taskmanager-api.com',
  'https://github.com/raulfunes/task-manager',
  'live',
  '2024',
  2
),
(
  'E-commerce Dashboard',
  'E-commerce Dashboard',
  'Panel de administracion para tiendas online con analytics en tiempo real y gestion de inventario.',
  'Admin panel for online stores with real-time analytics and inventory management.',
  ARRAY['Next.js', 'Tailwind', 'Prisma', 'PostgreSQL'],
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  'https://ecommerce-dash.com',
  'https://github.com/raulfunes/ecommerce-dashboard',
  'development',
  '2023',
  3
),
(
  'Weather Station',
  'Weather Station',
  'Sistema IoT que recopila datos meteorologicos y los visualiza en una interfaz web interactiva.',
  'IoT system that collects weather data and displays it in an interactive web interface.',
  ARRAY['Python', 'Raspberry Pi', 'Flask', 'Chart.js'],
  'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
  NULL,
  'https://github.com/raulfunes/weather-station',
  'archived',
  '2023',
  4
);

-- =============================================
-- Seed Data: Experiencias
-- =============================================

INSERT INTO experiences (title_es, title_en, company, period, duration_es, duration_en, type_es, type_en, location_es, location_en, description_es, description_en, achievements_es, achievements_en, technologies, sort_order)
VALUES 
(
  'Frontend Developer',
  'Frontend Developer',
  'TechCorp',
  '2022 - Presente',
  '2+ anos',
  '2+ years',
  'Tiempo completo',
  'Full-time',
  'Remoto',
  'Remote',
  'Desarrollo de interfaces modernas con React, implementacion de diseno responsive y mantenimiento de componentes UI reutilizables para aplicaciones de alto trafico.',
  'Development of modern interfaces with React, responsive design implementation, and maintenance of reusable UI components for high-traffic applications.',
  ARRAY['Reduci el tiempo de carga en un 40% optimizando componentes', 'Implemente sistema de design tokens usado por 5 equipos', 'Lidere migracion de JavaScript a TypeScript'],
  ARRAY['Reduced load time by 40% through component optimization', 'Implemented design tokens system used by 5 teams', 'Led JavaScript to TypeScript migration'],
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux'],
  1
),
(
  'Desarrollador Web Jr.',
  'Junior Web Developer',
  'WebStudio',
  '2020 - 2022',
  '2 anos',
  '2 years',
  'Tiempo completo',
  'Full-time',
  'Hibrido',
  'Hybrid',
  'Maquetacion HTML/CSS, desarrollo JavaScript y creacion de sitios con WordPress para clientes de diversos sectores.',
  'HTML/CSS layout, JavaScript development, and WordPress site creation for clients across various sectors.',
  ARRAY['Desarrolle +15 sitios web para clientes', 'Automatice procesos de deploy reduciendo errores un 60%', 'Cree plantillas reutilizables para acelerar entregas'],
  ARRAY['Developed 15+ websites for clients', 'Automated deploy processes reducing errors by 60%', 'Created reusable templates to speed up deliveries'],
  ARRAY['HTML', 'CSS', 'JavaScript', 'WordPress', 'PHP'],
  2
);

-- =============================================
-- Seed Data: Categorias de Tecnologias
-- =============================================

INSERT INTO tech_categories (slug, title_es, title_en, icon, sort_order)
VALUES 
('frontend', 'Frontend', 'Frontend', '[>_]', 1),
('backend', 'Backend', 'Backend', '[~/]', 2),
('devops', 'DevOps & Tools', 'DevOps & Tools', '[#!]', 3);

-- =============================================
-- Seed Data: Tecnologias
-- =============================================

-- Frontend technologies
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'React', 90, '#61DAFB', 1 FROM tech_categories WHERE slug = 'frontend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'TypeScript', 85, '#3178C6', 2 FROM tech_categories WHERE slug = 'frontend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Next.js', 80, '#ffffff', 3 FROM tech_categories WHERE slug = 'frontend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Tailwind CSS', 85, '#06B6D4', 4 FROM tech_categories WHERE slug = 'frontend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Vue.js', 70, '#4FC08D', 5 FROM tech_categories WHERE slug = 'frontend';

-- Backend technologies
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Node.js', 85, '#68A063', 1 FROM tech_categories WHERE slug = 'backend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Python', 75, '#3776AB', 2 FROM tech_categories WHERE slug = 'backend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Express', 80, '#ffffff', 3 FROM tech_categories WHERE slug = 'backend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'PostgreSQL', 75, '#4169E1', 4 FROM tech_categories WHERE slug = 'backend';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'MongoDB', 70, '#47A248', 5 FROM tech_categories WHERE slug = 'backend';

-- DevOps technologies
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Git', 90, '#F05032', 1 FROM tech_categories WHERE slug = 'devops';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Docker', 75, '#2496ED', 2 FROM tech_categories WHERE slug = 'devops';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'AWS', 65, '#FF9900', 3 FROM tech_categories WHERE slug = 'devops';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'Linux', 70, '#FCC624', 4 FROM tech_categories WHERE slug = 'devops';
INSERT INTO technologies (category_id, name, level, color, sort_order)
SELECT id, 'CI/CD', 70, '#22c55e', 5 FROM tech_categories WHERE slug = 'devops';

-- =============================================
-- Seed Data: Informacion Personal
-- =============================================

INSERT INTO personal_info (key, value_es, value_en)
VALUES 
('title', 'Hola! Soy Raul Funes', 'Hi! I am Raul Funes'),
('subtitle', 'Desarrollador FullStack', 'Software Engineer'),
('paragraph', 'Desarrollador apasionado por crear experiencias web modernas y eficientes. Me especializo en React, TypeScript y Node.js, con enfoque en codigo limpio, rendimiento y accesibilidad. Siempre aprendiendo nuevas tecnologias.', 'Passionate developer focused on creating modern and efficient web experiences. I specialize in React, TypeScript, and Node.js, with a strong emphasis on clean code, performance, and accessibility. Always learning new technologies.'),
('roles', 'Desarrollador Frontend,Desarrollador Backend,Desarrollador FullStack,Software Engineer', 'Frontend Developer,Backend Developer,FullStack Developer,Software Engineer');

-- =============================================
-- Seed Data: Links de Contacto
-- =============================================

INSERT INTO contact_links (type, url, label_es, label_en, icon, sort_order)
VALUES 
('email', 'mailto:raulsergiofunes@gmail.com', 'Email', 'Email', 'Mail', 1),
('linkedin', 'https://linkedin.com/in/raulfunes', 'LinkedIn', 'LinkedIn', 'Linkedin', 2),
('cv', 'https://cv.raulfunes.com', 'Curriculum', 'Resume', 'FileTextIcon', 3),
('github', 'https://github.com/raulfunes', 'Github', 'Github', 'Github', 4);
