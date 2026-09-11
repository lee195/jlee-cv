export interface Experience {
  id: string
  role: string
  company: string
  location: string
  period: string
  type: string
  description: string
  highlights: string[]
  technologies: string[]
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  highlights: string[]
  technologies: string[]
  github?: string
  link?: string
}

export interface SkillCategory {
  category: string
  icon: string
  skills: { name: string; level: number; tag?: string }[]
}

export interface Education {
  degree: string
  institution: string
  period: string
  details: string
}

export interface Certification {
  title: string
  issuer: string
  date: string
  credentialId?: string
}

export interface Language {
  name: string
  fluency: string
  flag: string
  proficiency: number
}

export const cvData = {
  personal: {
    name: "Jisu Lee",
    title: "Senior Full Stack Software Engineer",
    status: "Available for Software Engineer Roles",
    location: "Bischofsheim, Germany / Remote",
    email: "jisu_lee@hotmail.de",
    github: "https://github.com/lee195",
    avatar: "/profile.jpg", // Place your image in public/profile.jpg (or .png/.webp)
    bio: "7+ years fullstack web developer. Worked on diverse projects in varying team sizes. Looking for new opportunities in Europe. Particularly AI-driven software engineering."
  },
  stats: [
    { label: "years experience", value: "7+" },
    { label: "docs complaints", value: "a lot of" },
    { label: "cups of coffee", value: "9000+" },
    { label: "bad jokes experienced", value: "too many" }
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Senior Fullstack Software Engineer",
      company: "Seibert Products GmbH",
      location: "Wiesbaden, Germany",
      period: "2025 - Present",
      type: "Full-time",
      description: "Technical lead on new automation platform for product demo environment provisioning started from a technical spike.",
      highlights: [
        "Reduced time from user interaction to fully provisioned demo from 1-2 hours to 15 minutes. Success rate from 80% to 95%",
        "Created template creation engine to build fully customized Atlassian cloud instance templates",
        "Optimized database architecture and data synchronization reducing operational cost by 60%",
        "Communicated with internal customers and stakeholders to understand their needs and requirements and translated them into technical specifications"
      ],
      technologies: ["TypeScript", "React", "Vercel", "GCP", "Docker", "PostgreSQL"]
    },
    {
      id: "exp-2",
      role: "Application Security Engineer",
      company: "Seibert Media GmbH / Seibert Products GmbH",
      location: "Wiesbaden, Germany",
      period: "2024 - 2025",
      type: "Full-time",
      description: "Responsible for ISO27001 relevant guidelines and processes in software development.",
      highlights: [
        "Worked on security relevant guidelines and processes in software development for ISO27001 certification",
        "Managed Bugcrowd program and derived security standards from submissions reducing program costs by 70%",
        "Headed and organized Security Champion program with members from all development teams",
        "Created and organized internal security workshops and created training plans based on external security training platforms"
      ],
      technologies: ["Jira", "Confluence", "OWASP", "Bugcrowd", "Security Champions"]
    },
    {
      id: "exp-3",
      role: "Fullstack Software Engineer",
      company: "Seibert Media GmbH",
      location: "Wiesbaden, Germany",
      period: "2021 - 2024",
      type: "Full-time",
      description: "Fullstack and mobile, CI/CD, infrastructure, architecture, everything.",
      highlights: [
        "Built Atlassian Forge app to integrate the SAFe framework into Jira Cloud",
        "Developed new standalone cloud-based intranet application",
      ],
      technologies: ["Firebase", "Flutter", "GCP", "Vue", "TypeScript", "Express", "Algolia", "Atlassian Forge", "React"]
    },
    {
      id: "exp-4",
      role: "Fullstack Software Developer",
      company: "Seibert Media GmbH",
      location: "Wiesbaden, Germany",
      period: "2019 - 2021",
      type: "Full-time",
      description: "Backend, Frontend, Deployment, and everything in between.",
      highlights: [
        "Worked on intranet solution for Atlassian DC",
        "Created automated UI tests for complex UI interactions with CodeceptJS"
      ],
      technologies: ["Java", "Maven", "JavaScript", "Vue 2", "CSS3/Sass", "Jest", "Webpack"]
    }
  ] as Experience[],
  projects: [
    {
      id: "proj-1",
      title: "Ember",
      category: "Desktop",
      description: "Your Claude Code usage at a glance, a portable profile and config playground.",
      highlights: [
        "Deterministic profile descriptors",
        "Optional LLM-generated prose",
        "Default local and privacy-preserving",
        "Package and port your profile between machines"
      ],
      technologies: ["npm", "Vue 3", "TypeScript", "Vite", "Tauri"],
      github: "https://github.com/lee195/ember",
    },
    {
      id: "proj-2",
      title: "Fresh Eyes",
      category: "Browser Extension",
      description: "LLM-driven browser extension that reacts to your web app the way a non-technical user would.",
      highlights: [
        "Persona driven comments, feedback and verdicts",
        "Add and customize personas as needed",
        "User provided LLM endpoint and API keys, no vendor lock-in, local ready",
        "Feedback gets pinned to the elements that caused them"
      ],
      technologies: ["npm", "Vue 3", "TypeScript", "Vite", "Tauri"],
      github: "https://github.com/lee195/fresh-eyes",
    },
    {
      id: "proj-3",
      title: "Flint (WIP)",
      category: "Desktop",
      description: "App for macOS that gives non-technical users working local AI with zero dev-tool gates",
      highlights: [
        "Automatically probes machine hardware to recommend fitting models",
        "Ships with ollama.cpp for zero setup",
        "All local, no cloud, no vendor lock-in"
      ],
      technologies: ["deno", "Vue 3", "TypeScript", "Vite", "Tauri"],
      github: "https://github.com/lee195/flint",
    }
  ] as Project[],
  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "TU Darmstadt",
      period: "2013 - 2019",
      details: "Thesis: Effects of Ordering Heuristics on the Source DPOR Algorithm"
    }
  ] as Education[],
  certifications: [
    {
      title: "Security Engineer Learning Path",
      issuer: "TryHackMe",
      date: "2024"
    },
  ] as Certification[],
  languages: [
    {
      name: "German",
      fluency: "Native",
      flag: "🇩🇪",
      proficiency: 100
    },
    {
      name: "English",
      fluency: "Fluent",
      flag: "🇬🇧",
      proficiency: 90
    },
    {
      name: "Korean",
      fluency: "Basic",
      flag: "🇰🇷",
      proficiency: 50
    }
  ] as Language[]
}
