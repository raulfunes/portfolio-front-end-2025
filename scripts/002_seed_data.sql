-- Seed initial portfolio data

-- Insert profile data (matches profile table schema)
INSERT INTO profile (id, title, subtitle, paragraph, roles, image_url, github_url, linkedin_url, email) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Raul Funes',
  'Full Stack Developer',
  'Soy un desarrollador con experiencia en el desarrollo de aplicaciones web y móviles. Desde muy pequeño supe que los videojuegos serían mi pasión, pasión que me llevo a estudiar informática. Actualmente, mi enfoque está en crear soluciones innovadoras y escalables que ofrezcan experiencias de usuario excepcionales.',
  ARRAY['Desarrollador Full Stack', 'Desarrollador Web', 'Programador'],
  '/images/myself.jpg',
  'https://github.com/raulfunes',
  'https://www.linkedin.com/in/raulfuneslorente/',
  'raulfuneslorente@gmail.com'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  paragraph = EXCLUDED.paragraph,
  roles = EXCLUDED.roles,
  image_url = EXCLUDED.image_url,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url,
  email = EXCLUDED.email,
  updated_at = now();

-- Insert experiences (matches experiences table schema)
INSERT INTO experiences (id, title, company, period, duration, type, location, description_es, description_en, achievements_es, achievements_en, technologies, display_order) VALUES
(
  '00000000-0000-0000-0000-000000000010',
  'Desarrollador Full Stack',
  'Viewnext - IBM',
  'Oct 2023 - Actualidad',
  '1 año 4 meses',
  'Jornada completa',
  'Madrid, España',
  'Trabajo con arquitecturas de microservicios utilizando Spring Boot en el backend y Angular en el frontend. Desarrollo de APIs RESTful y gestión de bases de datos.',
  'Working with microservices architectures using Spring Boot on the backend and Angular on the frontend. Development of RESTful APIs and database management.',
  ARRAY['Desarrollo de microservicios con Spring Boot', 'Implementación de interfaces con Angular', 'Gestión de bases de datos PostgreSQL'],
  ARRAY['Microservices development with Spring Boot', 'Interface implementation with Angular', 'PostgreSQL database management'],
  ARRAY['Java', 'Spring Boot', 'Angular', 'TypeScript', 'PostgreSQL', 'Docker'],
  1
),
(
  '00000000-0000-0000-0000-000000000011',
  'Alumno en prácticas',
  'CAS Training',
  'Jun 2023 - Sep 2023',
  '4 meses',
  'Prácticas',
  'Madrid, España',
  'Trabajé en un proyecto de desarrollo de aplicaciones móviles para una empresa de telecomunicaciones.',
  'Worked on a mobile application development project for a telecommunications company.',
  ARRAY['Desarrollo de aplicaciones móviles', 'Trabajo en equipo ágil'],
  ARRAY['Mobile application development', 'Agile teamwork'],
  ARRAY['React Native', 'JavaScript', 'Node.js'],
  2
);

-- Insert projects (matches projects table schema)
INSERT INTO projects (id, title, description_es, description_en, tech, image_url, demo_link, github_link, status, year, display_order) VALUES
(
  '00000000-0000-0000-0000-000000000020',
  'Clon de Spotify',
  'Un clon de la aplicación de música de Spotify con funcionalidades básicas de reproducción.',
  'A clone of the Spotify music app with basic playback functionalities.',
  ARRAY['Astro', 'Tailwind CSS', 'TypeScript'],
  'https://camo.githubusercontent.com/ac3cb6d783a6588e3b83dfa4eb2b9f68a6c2d0ab8798c82aae58fa2a91a2f24c/68747470733a2f2f692e706f7374696d672e63632f5a71595735374b702f53706f746966792d506c61796c6973742e706e67',
  'https://github.com/raulfunes/spotify-clone',
  'https://github.com/raulfunes/spotify-clone',
  'completed',
  '2024',
  1
),
(
  '00000000-0000-0000-0000-000000000021',
  'Portfolio Personal',
  'Mi portfolio personal con modo de edición para superusuarios.',
  'My personal portfolio with editing mode for superusers.',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  NULL,
  'https://raulfunes.dev',
  'https://github.com/raulfunes/portfolio',
  'development',
  '2024',
  2
);

-- Insert tech categories (matches tech_categories table schema)
INSERT INTO tech_categories (id, name_es, name_en, icon, display_order) VALUES
('00000000-0000-0000-0000-000000000030', 'Frontend', 'Frontend', 'layout', 1),
('00000000-0000-0000-0000-000000000031', 'Backend', 'Backend', 'server', 2),
('00000000-0000-0000-0000-000000000032', 'Base de Datos', 'Database', 'database', 3),
('00000000-0000-0000-0000-000000000033', 'DevOps', 'DevOps', 'cloud', 4),
('00000000-0000-0000-0000-000000000034', 'Otras', 'Others', 'wrench', 5);

-- Insert technologies (matches technologies table schema)
INSERT INTO technologies (id, category_id, name, level, color, display_order) VALUES
-- Frontend
('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000030', 'React', 85, '#61DAFB', 1),
('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000030', 'Angular', 75, '#DD0031', 2),
('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000030', 'TypeScript', 80, '#3178C6', 3),
('00000000-0000-0000-0000-000000000043', '00000000-0000-0000-0000-000000000030', 'JavaScript', 90, '#F7DF1E', 4),
('00000000-0000-0000-0000-000000000044', '00000000-0000-0000-0000-000000000030', 'HTML5', 95, '#E34F26', 5),
('00000000-0000-0000-0000-000000000045', '00000000-0000-0000-0000-000000000030', 'CSS3', 90, '#1572B6', 6),
('00000000-0000-0000-0000-000000000046', '00000000-0000-0000-0000-000000000030', 'Tailwind CSS', 85, '#06B6D4', 7),
('00000000-0000-0000-0000-000000000047', '00000000-0000-0000-0000-000000000030', 'Next.js', 75, '#000000', 8),
('00000000-0000-0000-0000-000000000048', '00000000-0000-0000-0000-000000000030', 'Astro', 70, '#FF5D01', 9),
-- Backend
('00000000-0000-0000-0000-000000000050', '00000000-0000-0000-0000-000000000031', 'Java', 80, '#007396', 1),
('00000000-0000-0000-0000-000000000051', '00000000-0000-0000-0000-000000000031', 'Spring Boot', 75, '#6DB33F', 2),
('00000000-0000-0000-0000-000000000052', '00000000-0000-0000-0000-000000000031', 'Node.js', 70, '#339933', 3),
('00000000-0000-0000-0000-000000000053', '00000000-0000-0000-0000-000000000031', 'Python', 65, '#3776AB', 4),
('00000000-0000-0000-0000-000000000054', '00000000-0000-0000-0000-000000000031', 'C#', 60, '#239120', 5),
-- Database
('00000000-0000-0000-0000-000000000060', '00000000-0000-0000-0000-000000000032', 'PostgreSQL', 75, '#336791', 1),
('00000000-0000-0000-0000-000000000061', '00000000-0000-0000-0000-000000000032', 'MySQL', 70, '#4479A1', 2),
('00000000-0000-0000-0000-000000000062', '00000000-0000-0000-0000-000000000032', 'MongoDB', 65, '#47A248', 3),
('00000000-0000-0000-0000-000000000063', '00000000-0000-0000-0000-000000000032', 'Redis', 60, '#DC382D', 4),
-- DevOps
('00000000-0000-0000-0000-000000000070', '00000000-0000-0000-0000-000000000033', 'Docker', 70, '#2496ED', 1),
('00000000-0000-0000-0000-000000000071', '00000000-0000-0000-0000-000000000033', 'Git', 85, '#F05032', 2),
('00000000-0000-0000-0000-000000000072', '00000000-0000-0000-0000-000000000033', 'GitHub', 85, '#181717', 3),
('00000000-0000-0000-0000-000000000073', '00000000-0000-0000-0000-000000000033', 'Azure', 60, '#0078D4', 4),
-- Others
('00000000-0000-0000-0000-000000000080', '00000000-0000-0000-0000-000000000034', 'Figma', 70, '#F24E1E', 1),
('00000000-0000-0000-0000-000000000081', '00000000-0000-0000-0000-000000000034', 'Linux', 65, '#FCC624', 2);

-- Insert translations (matches translations table schema)
INSERT INTO translations (locale, key, value) VALUES
-- Spanish
('es', 'nav.about', 'Sobre mí'),
('es', 'nav.experience', 'Experiencia'),
('es', 'nav.projects', 'Proyectos'),
('es', 'nav.technologies', 'Tecnologías'),
('es', 'hero.greeting', '¡Hola! Soy'),
('es', 'hero.bio', 'Soy un desarrollador con experiencia en el desarrollo de aplicaciones web y móviles. Desde muy pequeño supe que los videojuegos serían mi pasión, pasión que me llevo a estudiar informática.'),
('es', 'section.experience', 'Experiencia'),
('es', 'section.projects', 'Proyectos'),
('es', 'section.technologies', 'Tecnologías'),
('es', 'experience.current', 'Actualidad'),
('es', 'projects.viewCode', 'Ver código'),
('es', 'projects.viewProject', 'Ver proyecto'),
('es', 'projects.inDevelopment', 'En desarrollo'),
('es', 'footer.rights', 'Todos los derechos reservados'),
('es', 'footer.madeWith', 'Hecho con'),
-- English
('en', 'nav.about', 'About me'),
('en', 'nav.experience', 'Experience'),
('en', 'nav.projects', 'Projects'),
('en', 'nav.technologies', 'Technologies'),
('en', 'hero.greeting', 'Hi! I''m'),
('en', 'hero.bio', 'I am a developer with experience in web and mobile application development. Since I was very young, I knew that video games would be my passion, a passion that led me to study computer science.'),
('en', 'section.experience', 'Experience'),
('en', 'section.projects', 'Projects'),
('en', 'section.technologies', 'Technologies'),
('en', 'experience.current', 'Present'),
('en', 'projects.viewCode', 'View code'),
('en', 'projects.viewProject', 'View project'),
('en', 'projects.inDevelopment', 'In development'),
('en', 'footer.rights', 'All rights reserved'),
('en', 'footer.madeWith', 'Made with')
ON CONFLICT (locale, key) DO UPDATE SET value = EXCLUDED.value;
