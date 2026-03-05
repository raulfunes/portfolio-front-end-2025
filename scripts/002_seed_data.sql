-- Seed initial portfolio data

-- Insert profile data
INSERT INTO profile (id, name, title, bio_es, bio_en, image_url, github_url, linkedin_url, email) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Raul Funes',
  'Full Stack Developer',
  'Soy un desarrollador con experiencia en el desarrollo de aplicaciones web y móviles. Desde muy pequeño supe que los videojuegos serían mi pasión, pasión que me llevo a estudiar informática. Actualmente, mi enfoque está en crear soluciones innovadoras y escalables que ofrezcan experiencias de usuario excepcionales. Siempre estoy en busca de nuevas tecnologías y metodologías que me permitan crecer profesionalmente y aportar valor a cada proyecto.',
  'I am a developer with experience in web and mobile application development. Since I was very young, I knew that video games would be my passion, a passion that led me to study computer science. Currently, my focus is on creating innovative and scalable solutions that offer exceptional user experiences. I am always looking for new technologies and methodologies that allow me to grow professionally and add value to each project.',
  '/images/myself.jpg',
  'https://github.com/raulfunes',
  'https://www.linkedin.com/in/raulfuneslorente/',
  'raulfuneslorente@gmail.com'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio_es = EXCLUDED.bio_es,
  bio_en = EXCLUDED.bio_en,
  image_url = EXCLUDED.image_url,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url,
  email = EXCLUDED.email;

-- Insert experiences
INSERT INTO experiences (company, role_es, role_en, description_es, description_en, start_date, end_date, is_current, sort_order) VALUES
(
  'Viewnext - IBM',
  'Desarrollador Full Stack',
  'Full Stack Developer',
  'Trabajo con arquitecturas de microservicios utilizando Spring Boot en el backend y Angular en el frontend.',
  'Working with microservices architectures using Spring Boot on the backend and Angular on the frontend.',
  '2023-10-01',
  NULL,
  true,
  1
),
(
  'CAS Training',
  'Alumno en prácticas',
  'Intern',
  'Trabajé en un proyecto de desarrollo de aplicaciones móviles para una empresa de telecomunicaciones.',
  'Worked on a mobile application development project for a telecommunications company.',
  '2023-06-01',
  '2023-09-30',
  false,
  2
);

-- Insert projects
INSERT INTO projects (title, description_es, description_en, image_url, project_url, github_url, technologies, sort_order) VALUES
(
  'Clon de Spotify',
  'Un clon de la aplicación de música de Spotify con funcionalidades básicas de reproducción.',
  'A clone of the Spotify music app with basic playback functionalities.',
  'https://camo.githubusercontent.com/ac3cb6d783a6588e3b83dfa4eb2b9f68a6c2d0ab8798c82aae58fa2a91a2f24c/68747470733a2f2f692e706f7374696d672e63632f5a71595735374b702f53706f746966792d506c61796c6973742e706e67',
  'https://github.com/raulfunes/spotify-clone',
  'https://github.com/raulfunes/spotify-clone',
  ARRAY['Astro', 'Tailwind CSS', 'TypeScript'],
  1
),
(
  'Proyecto en desarrollo',
  'En busca de proyectos personales para seguir aprendiendo y creciendo como desarrollador.',
  'Looking for personal projects to keep learning and growing as a developer.',
  NULL,
  NULL,
  NULL,
  ARRAY['Coming Soon'],
  2
);

-- Insert tech categories and technologies
INSERT INTO tech_categories (name_es, name_en, sort_order) VALUES
('Frontend', 'Frontend', 1),
('Backend', 'Backend', 2),
('Base de Datos', 'Database', 3),
('DevOps', 'DevOps', 4),
('Otras', 'Others', 5);

-- Get category IDs and insert technologies
DO $$
DECLARE
  frontend_id UUID;
  backend_id UUID;
  database_id UUID;
  devops_id UUID;
  others_id UUID;
BEGIN
  SELECT id INTO frontend_id FROM tech_categories WHERE name_en = 'Frontend';
  SELECT id INTO backend_id FROM tech_categories WHERE name_en = 'Backend';
  SELECT id INTO database_id FROM tech_categories WHERE name_en = 'Database';
  SELECT id INTO devops_id FROM tech_categories WHERE name_en = 'DevOps';
  SELECT id INTO others_id FROM tech_categories WHERE name_en = 'Others';

  -- Frontend technologies
  INSERT INTO technologies (category_id, name, icon, sort_order) VALUES
  (frontend_id, 'React', 'react', 1),
  (frontend_id, 'Angular', 'angular', 2),
  (frontend_id, 'TypeScript', 'typescript', 3),
  (frontend_id, 'JavaScript', 'javascript', 4),
  (frontend_id, 'HTML5', 'html5', 5),
  (frontend_id, 'CSS3', 'css3', 6),
  (frontend_id, 'Tailwind CSS', 'tailwindcss', 7),
  (frontend_id, 'Next.js', 'nextjs', 8),
  (frontend_id, 'Astro', 'astro', 9);

  -- Backend technologies
  INSERT INTO technologies (category_id, name, icon, sort_order) VALUES
  (backend_id, 'Java', 'java', 1),
  (backend_id, 'Spring Boot', 'spring', 2),
  (backend_id, 'Node.js', 'nodejs', 3),
  (backend_id, 'Python', 'python', 4),
  (backend_id, 'C#', 'csharp', 5);

  -- Database technologies
  INSERT INTO technologies (category_id, name, icon, sort_order) VALUES
  (database_id, 'PostgreSQL', 'postgresql', 1),
  (database_id, 'MySQL', 'mysql', 2),
  (database_id, 'MongoDB', 'mongodb', 3),
  (database_id, 'Redis', 'redis', 4);

  -- DevOps technologies
  INSERT INTO technologies (category_id, name, icon, sort_order) VALUES
  (devops_id, 'Docker', 'docker', 1),
  (devops_id, 'Git', 'git', 2),
  (devops_id, 'GitHub', 'github', 3),
  (devops_id, 'Azure', 'azure', 4);

  -- Other technologies
  INSERT INTO technologies (category_id, name, icon, sort_order) VALUES
  (others_id, 'Figma', 'figma', 1),
  (others_id, 'Linux', 'linux', 2);
END $$;

-- Insert translations
INSERT INTO translations (key, es, en) VALUES
('nav.about', 'Sobre mí', 'About me'),
('nav.experience', 'Experiencia', 'Experience'),
('nav.projects', 'Proyectos', 'Projects'),
('nav.technologies', 'Tecnologías', 'Technologies'),
('hero.greeting', '¡Hola! Soy', 'Hi! I''m'),
('hero.role1', 'Desarrollador Full Stack', 'Full Stack Developer'),
('hero.role2', 'Desarrollador Web', 'Web Developer'),
('hero.role3', 'Programador', 'Programmer'),
('section.experience', 'Experiencia', 'Experience'),
('section.projects', 'Proyectos', 'Projects'),
('section.technologies', 'Tecnologías', 'Technologies'),
('experience.current', 'Actualidad', 'Present'),
('projects.viewCode', 'Ver código', 'View code'),
('projects.viewProject', 'Ver proyecto', 'View project'),
('footer.rights', 'Todos los derechos reservados', 'All rights reserved'),
('footer.madeWith', 'Hecho con', 'Made with');
