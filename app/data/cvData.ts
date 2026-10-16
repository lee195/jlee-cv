export interface Stat {
  label: string;
  value: string;
  /** Optional interactive behaviour for the hero stats row */
  kind?: "coffee" | "jokes";
}

export interface RaceLane {
  label: string;
  /** Simulated duration in minutes (use the midpoint for ranges) */
  minutes: number;
  /** What's printed at the end of the bar, e.g. "1–2 h" */
  display: string;
  note?: string;
}

export interface MetricRace {
  title: string;
  lanes: RaceLane[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  highlights: string[];
  technologies: string[];
  race?: MetricRace;
}

export interface ShowcaseDecision {
  title: string;
  body: string;
}

export interface ShowcaseFact {
  label: string;
  value: string;
}

export interface ShowcaseImage {
  src: string;
  thumb: string;
  alt: string;
  caption: string;
  /** Intrinsic size of the file in public/, for layout-stable <img width height> */
  width: number;
  height: number;
}

export interface ProjectShowcase {
  /** One line under the title */
  tagline: string;
  /** Problem → approach, 2–3 short paragraphs */
  story: string[];
  /** "Why it's built this way" */
  decisions: ShowcaseDecision[];
  /** Small stat row */
  facts: ShowcaseFact[];
  /** Real screenshots. Omitted when `demo` is set. */
  gallery?: ShowcaseImage[];
  /** Selects a hand-written interactive component instead of a gallery */
  demo?: "fresh-eyes";
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  technologies: string[];
  github?: string;
  link?: string;
  /** Opens a detail modal from the project card when present */
  showcase?: ProjectShowcase;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: { name: string; level: number; tag?: string }[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface Language {
  name: string;
  fluency: string;
  flag: string;
  proficiency: number;
}

const projects: Project[] = [
  {
    id: "proj-1",
    title: "Ember",
    category: "Desktop",
    description:
      "Your Claude Code usage at a glance, a portable profile and config playground.",
    highlights: [
      "Deterministic profile descriptors",
      "Optional LLM-generated prose",
      "Default local and privacy-preserving",
      "Package and port your profile between machines",
    ],
    technologies: ["Rust", "Tauri 2", "Vue 3", "TypeScript", "Vite"],
    github: "https://github.com/lee195/ember",
    showcase: {
      tagline: "Your Claude Code usage, read locally, explained honestly.",
      icon: "/projects/ember/icon.webp",
      story: [
        "Claude Code writes a transcript of every session into ~/.claude, and then nothing ever looks at it. Ember reads those files on-device and turns them into a dashboard: tokens in and out, cache hit rate, activity by hour, which projects and tools get the most attention.",
        "From the same scan it derives a profile of how you work, with deterministic trait descriptors computed in Rust. An optional narrative is written by any OpenAI-compatible endpoint, including a local Ollama or LM Studio, so the whole thing can run without a network.",
        "The Portable tab packs skills, settings and CLAUDE.md into a bundle you can carry between machines, and the Profiles tab runs several isolated Claude Code configurations side by side without touching your real ~/.claude.",
      ],
      decisions: [
        {
          title: "Deterministic first, LLM optional",
          body: "The archetype and trait cards come from counting, not from a model. The LLM only writes prose on top, and only when you point it at an endpoint.",
        },
        {
          title: "Read-only and nothing uploaded",
          body: "~/.claude is never written, credential files are never read, and API keys live in the macOS Keychain, which is touched only when an action needs it.",
        },
        {
          title: "Session length is gap-summed",
          body: "First-to-last timestamp said sessions lasted 75 hours. Summing only gaps of 30 minutes or less gives 52 minutes, which is what a session actually feels like.",
        },
        {
          title: "Numbers cross-checked",
          body: "Dashboard totals were verified against an independent Python recount of the same transcripts. Early screenshots with real data were purged from git history and replaced by synthetic personas.",
        },
      ],
      facts: [
        { label: "stack", value: "Tauri 2 · Rust · Vue 3" },
        { label: "Rust tests", value: "25" },
        { label: "uploads by default", value: "0" },
        { label: "built", value: "Jun – Sep 2026" },
      ],
      gallery: [
        {
          src: "/projects/ember/technical-writer-dashboard.webp",
          thumb: "/projects/ember/technical-writer-dashboard-thumb.webp",
          alt: "Ember dashboard showing sessions, messages, token totals, token usage over time, activity by hour and a per-project table",
          caption:
            "Dashboard: everything a session transcript knows, summed up",
          width: 1400,
          height: 801,
        },
        {
          src: "/projects/ember/technical-writer-profile.webp",
          thumb: "/projects/ember/technical-writer-profile-thumb.webp",
          alt: "Ember profile tab with the archetype The Methodical Markdown Explorer and its trait cards",
          caption:
            "Profile: a deterministic archetype, here a technical writer persona",
          width: 1400,
          height: 801,
        },
        {
          src: "/projects/ember/data-analyst-dashboard.webp",
          thumb: "/projects/ember/data-analyst-dashboard-thumb.webp",
          alt: "Ember dashboard for a data analyst persona working in Jupyter notebooks",
          caption:
            "Same dashboard, data analyst persona: non-code file types count too",
          width: 1400,
          height: 801,
        },
        {
          src: "/projects/ember/data-analyst-profile.webp",
          thumb: "/projects/ember/data-analyst-profile-thumb.webp",
          alt: "Ember profile tab with the archetype The Methodical Jupyter Builder",
          caption: "Profile: The Methodical Jupyter Builder",
          width: 1400,
          height: 801,
        },
        {
          src: "/projects/ember/portable.webp",
          thumb: "/projects/ember/portable-thumb.webp",
          alt: "Ember portable tab for exporting and importing a bundle of skills, settings and profile",
          caption:
            "Portable: export a bundle, import it elsewhere as a dry run first",
          width: 1400,
          height: 428,
        },
        {
          src: "/projects/ember/profiles.webp",
          thumb: "/projects/ember/profiles-thumb.webp",
          alt: "Ember profiles tab listing isolated Claude Code configurations with launch buttons",
          caption:
            "Profiles: isolated CLAUDE_CONFIG_DIR setups, launched side by side",
          width: 1400,
          height: 428,
        },
      ],
    },
  },
  {
    id: "proj-2",
    title: "Fresh Eyes",
    category: "Browser Extension",
    description:
      "LLM-driven browser extension that reacts to your web app the way a non-technical user would.",
    highlights: [
      "Persona driven comments, feedback and verdicts",
      "Add and customize personas as needed",
      "User provided LLM endpoint and API keys, no vendor lock-in, local ready",
      "Feedback gets pinned to the elements that caused them",
    ],
    technologies: ["Chrome MV3", "Vue 3", "TypeScript", "Vite", "Vitest"],
    github: "https://github.com/lee195/fresh-eyes",
    showcase: {
      tagline:
        "A non-technical user on demand, pinned to the element that lost them.",
      demo: "fresh-eyes",
      story: [
        'You stop being able to see your own product. You know what "workspace" means, which grey box is clickable, and what happens after the button. Fresh Eyes tells you what happens to someone who doesn\'t, while you are still building the thing.',
        "It is not a lint report. Other tools say contrast ratio 3.1:1, missing label. This one plays one of four people, a retired teacher, a warehouse worker on a phone, a florist spending her own money, an office manager who was phished once, and writes their reactions in their own voice, pinned to the element that caused each one, ending in a verdict: did they get through, or did they close the tab?",
        "Personas can be added, edited and duplicated; storage keeps only what differs from the defaults.",
      ],
      decisions: [
        {
          title: "A perceivable page model, not HTML",
          body: "The model sees only what a person could see or act on: role, accessible name, visible text, position, font size, contrast, dead clicks. Roughly 1–3k tokens for a real page, plus felt signals like wait time and layout shift.",
        },
        {
          title: "Grounding or it's dropped",
          body: "Every reaction must name an element that was captured and quote text that is actually on the page. Anything else is dropped, not repaired.",
        },
        {
          title: "Form values never leave the browser",
          body: "Labels, types and validation state go; what you typed does not, and password fields are excluded entirely. Text that slips through anyway is redacted before the request.",
        },
        {
          title: "No host permissions by default",
          body: "Ships with no content scripts and no site access. It reads a page only when you press the button (activeTab) and talks only to the one model origin you granted, behind an allowlist that starts at localhost.",
        },
        {
          title: "A closed vocabulary",
          body: "hesitates → opens_new_tab_to_search → abandons_task is an enum, not free text. That makes two runs comparable and lets the panel draw the line below which nothing was ever seen.",
        },
      ],
      facts: [
        { label: "stack", value: "Chrome MV3 · Vue 3 · TS" },
        { label: "Vitest tests", value: "101" },
        { label: "built-in personas", value: "4" },
        { label: "host permissions", value: "0" },
      ],
    },
  },
  {
    id: "proj-3",
    title: "Flint (WIP)",
    category: "Desktop",
    description:
      "App for macOS that gives non-technical users working local AI with zero dev-tool gates",
    highlights: [
      "Automatically probes machine hardware to recommend fitting models",
      "Ships with ollama.cpp for zero setup",
      "All local, no cloud, no vendor lock-in",
    ],
    technologies: ["deno", "Vue 3", "TypeScript", "Vite", "Tauri"],
    github: "https://github.com/lee195/flint",
  },
];

export const cvData = {
  personal: {
    name: "Jisu Lee",
    title: "Senior Full Stack Software Engineer",
    status: "Available for Software Engineer Roles",
    location: "Bischofsheim, Germany / Remote",
    email: "jisu_lee@hotmail.de",
    github: "https://github.com/lee195",
    avatar: "/profile.jpg", // Place your image in public/profile.jpg (or .png/.webp)
    bio: "7+ years fullstack web developer. Worked on diverse projects in varying team sizes. Looking for new opportunities in Europe. Particularly AI-driven software engineering.",
  },
  stats: [
    { label: "years experience", value: "7+" },
    { label: "production projects", value: "4" },
    { label: "cups of coffee", value: String(250 * 2 * 7), kind: "coffee" },
    { label: "bad jokes", value: "many", kind: "jokes" },
  ] as Stat[],
  jokes: [
    "I'd tell you a UDP joke, but you might not get it.",
    "I have a great joke about Jira, but it's still in the backlog.",
    "I'd make a joke about ISO 27001, but it has to be documented, reviewed and approved first.",
    "German is my native language, so my variable names come out like userSessionTimeoutConfigurationManagerFactory.",
    "My Korean is at 50%. Enough to order food, not enough to know what I ordered.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    'A SQL query walks into a bar, goes up to two tables and asks: "Can I join you?"',
    "Knock knock. Race condition. Who's there?",
    "There are 10 kinds of people: those who understand binary and those who don't.",
    "How many developers does it take to change a light bulb? None, that's a hardware problem.",
    "It works on my machine. Fine, then we'll ship your machine. And that's how Docker was born.",
    "I asked a pentester for a joke. He said he'd get back to me once he found a way in.",
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Senior Fullstack Software Engineer",
      company: "Seibert Products GmbH",
      location: "Wiesbaden, Germany",
      period: "2025 - Present",
      type: "Full-time",
      description:
        "Technical lead on new automation platform for product demo environment provisioning started from a technical spike.",
      highlights: [
        "Reduced time from user interaction to fully provisioned demo from 1-2 hours to 15 minutes. Success rate from 80% to 95%",
        "Created template creation engine to build fully customized Atlassian cloud instance templates",
        "Optimized database architecture and data synchronization reducing operational cost by 60%",
        "Communicated with internal customers and stakeholders to understand their needs and requirements and translated them into technical specifications",
      ],
      race: {
        title: "Time to a fully provisioned demo",
        lanes: [
          {
            label: "Before",
            minutes: 90,
            display: "1–2 h",
            note: "80% success",
          },
          { label: "Now", minutes: 15, display: "15 min", note: "95% success" },
        ],
      },
      technologies: [
        "TypeScript",
        "React",
        "Vercel",
        "GCP",
        "Docker",
        "PostgreSQL",
      ],
    },
    {
      id: "exp-2",
      role: "Application Security Engineer",
      company: "Seibert Media GmbH / Seibert Products GmbH",
      location: "Wiesbaden, Germany",
      period: "2024 - 2025",
      type: "Full-time",
      description:
        "Responsible for ISO27001 relevant guidelines and processes in software development.",
      highlights: [
        "Worked on security relevant guidelines and processes in software development for ISO27001 certification",
        "Managed Bugcrowd program and derived security standards from submissions reducing program costs by 70%",
        "Headed and organized Security Champion program with members from all development teams",
        "Created and organized internal security workshops and created training plans based on external security training platforms",
      ],
      technologies: [
        "Jira",
        "Confluence",
        "OWASP",
        "Bugcrowd",
        "Security Champions",
      ],
    },
    {
      id: "exp-3",
      role: "Fullstack Software Engineer",
      company: "Seibert Media GmbH",
      location: "Wiesbaden, Germany",
      period: "2021 - 2024",
      type: "Full-time",
      description:
        "Fullstack and mobile, CI/CD, infrastructure, architecture, everything.",
      highlights: [
        "Built Atlassian Forge app to integrate the SAFe framework into Jira Cloud",
        "Developed new standalone cloud-based intranet application",
      ],
      technologies: [
        "Firebase",
        "Flutter",
        "GCP",
        "Vue",
        "TypeScript",
        "Express",
        "Algolia",
        "Atlassian Forge",
        "React",
      ],
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
        "Created automated UI tests for complex UI interactions with CodeceptJS",
      ],
      technologies: [
        "Java",
        "Maven",
        "JavaScript",
        "Vue",
        "CSS3/Sass",
        "Jest",
        "Webpack",
      ],
    },
  ] as Experience[],
  projects,
  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "TU Darmstadt",
      period: "2013 - 2019",
      details:
        "Thesis: Effects of Ordering Heuristics on the Source DPOR Algorithm",
    },
  ] as Education[],
  certifications: [
    {
      title: "Security Engineer Learning Path",
      issuer: "TryHackMe",
      date: "2024",
    },
  ] as Certification[],
  languages: [
    {
      name: "German",
      fluency: "Native",
      flag: "🇩🇪",
      proficiency: 100,
    },
    {
      name: "English",
      fluency: "Fluent",
      flag: "🇬🇧",
      proficiency: 90,
    },
    {
      name: "Korean",
      fluency: "Basic",
      flag: "🇰🇷",
      proficiency: 50,
    },
  ] as Language[],
};
