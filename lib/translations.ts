export const translations = {
  es: {
    about: {
      title: "Hola, soy Raul Funes",
      roles: [
        "Full Stack Developer",
        "Frontend Specialist",
        "React Enthusiast",
        "TypeScript Lover",
      ],
      paragraph:
        "Desarrollador apasionado por crear experiencias web modernas y eficientes. Especializado en React, TypeScript y arquitecturas escalables.",
    },
    experience: {
      title: "Experiencia Laboral",
      subtitle: "Mi trayectoria profesional",
    },
    projects: {
      title: "Proyectos",
      subtitle: "./mis_trabajos --list",
    },
    technologies: {
      title: "Tecnologias",
      subtitle: "cat skills.json | jq '.technologies'",
    },
    scroll: {
      label1: "Desliza para",
      label2: "explorar",
    },
  },
  en: {
    about: {
      title: "Hi, I'm Raul Funes",
      roles: [
        "Full Stack Developer",
        "Frontend Specialist",
        "React Enthusiast",
        "TypeScript Lover",
      ],
      paragraph:
        "Passionate developer creating modern and efficient web experiences. Specialized in React, TypeScript and scalable architectures.",
    },
    experience: {
      title: "Work Experience",
      subtitle: "My professional journey",
    },
    projects: {
      title: "Projects",
      subtitle: "./my_work --list",
    },
    technologies: {
      title: "Technologies",
      subtitle: "cat skills.json | jq '.technologies'",
    },
    scroll: {
      label1: "Scroll to",
      label2: "explore",
    },
  },
};

export type Locale = keyof typeof translations;
