/**
 * Single source of truth for portfolio content, transcribed from Kyle's CV.
 * Every draft renders from this data; none of them should hard-code copy.
 *
 * `tech` keys reference entries in `./tech.tsx`.
 */

export const person = {
    name: "Kyle Doidge",
    firstName: "Kyle",
    role: "Senior Full Stack Engineer",
    focus: "AI Products",
    location: "Leeds, UK",
    availability: "Remote (UK / EU)",
    email: "kyle.blue.doidge@gmail.com",
    phone: "07913 348271",
    yearsExperience: 5,
    tagline: "I ship AI products end to end.",
    /** Short one-liner for hero subheads. */
    summary:
        "From RAG and agent pipelines, through the backends that serve them, to the interfaces people actually use.",
    /** Full profile paragraph. */
    profile:
        "Full stack engineer with 5 years of experience shipping products end to end, from RAG and agent pipelines through the backends that serve them to the interfaces people actually use. Founder of Still, an AI notes and assistant product built alone across Go, React Native and a fine-tuned open-weight model, and currently leading frontend delivery on an AI assurance platform for the Royal Navy. As comfortable owning a design system as a database migration or an eval harness. Looking for an AI product team small enough that individual ownership still counts.",
    lookingFor: "An AI product team small enough that individual ownership still counts.",
} as const;

export const links = {
    github: { label: "GitHub", href: "https://github.com/kyle-blue", handle: "kyle-blue" },
    linkedin: {
        label: "LinkedIn",
        href: "https://linkedin.com/in/kyle-doidge",
        handle: "kyle-doidge",
    },
    email: { label: "Email", href: "mailto:kyle.blue.doidge@gmail.com", handle: person.email },
    still: { label: "Still", href: "https://stillapp.io", handle: "stillapp.io" },
    site: { label: "kblue.io", href: "https://kblue.io", handle: "kblue.io" },
    cv: { label: "Download CV", href: "/Kyle-Doidge-CV.pdf", handle: "Kyle-Doidge-CV.pdf" },
} as const;

export type LinkKey = keyof typeof links;

export interface Highlight {
    /** Big number / figure. */
    value: string;
    label: string;
}

/** Headline figures for stat strips. */
export const highlights: Highlight[] = [
    { value: "5+", label: "years shipping end to end" },
    { value: "$1M+", label: "contract secured by an edge integration I architected" },
    { value: "200%", label: "B2C revenue growth during my tenure at RoEx" },
    { value: "40+", label: "accessible components in a design system I built solo" },
    { value: "100k+", label: "additional RPS the backend was load tested for" },
    { value: "1st", label: "Class Honours, Chancellor's Award" },
];

export interface Experience {
    id: string;
    company: string;
    /** Parent org / acquirer, shown as a suffix. */
    companyNote?: string;
    role: string;
    start: string; // ISO-ish "YYYY-MM"
    end: string | null; // null = present
    period: string; // human readable
    location: string;
    /** One-line context for the org. */
    blurb: string;
    /** Short summary shown collapsed. */
    summary: string;
    /** Optional sub-sections (e.g. multiple clients at a consultancy). */
    sections?: { title: string; bullets: string[] }[];
    /** Bullets shown when expanded (used when no sections). */
    bullets: string[];
    tech: string[];
    link?: { label: string; href: string };
}

export const experience: Experience[] = [
    {
        id: "still",
        company: "Still",
        companyNote: "Still Group Ltd",
        role: "Founder & Engineer",
        start: "2026-03",
        end: null,
        period: "Mar 2026 — Present",
        location: "Remote",
        blurb: "AI-native notes and personal assistant. stillapp.io · Company no. 17188025",
        summary:
            "Sole founder, director and engineer of an AI-native notes and personal assistant product. Own every layer, from retrieval and the model pipeline through the backend and mobile client to infrastructure and product direction.",
        bullets: [
            "Built the retrieval-augmented generation (RAG) layer the product runs on, covering chunking, embedding and semantic search over a user's notes, so the assistant answers from the user's own corpus rather than model priors and writes back into it.",
            "Designed an LLM agent pipeline on Anthropic's API with tool use, multi-step orchestration and structured output, served from a Go backend to a React Native client.",
            "Fine-tuning a Qwen-family open-weight model to run complex note-processing tasks at a fraction of frontier-model cost and latency, evaluated against a task set built from real usage traces.",
            "Made a non-deterministic agent pipeline reliably regression-testable in CI, using a deterministic fake provider alongside testcontainers-backed integration tests with per-test user isolation.",
            "Full Detox end-to-end coverage on React Native, chosen over Maestro after evaluating both on debugging ergonomics and CI stability.",
        ],
        tech: [
            "go",
            "react-native",
            "typescript",
            "anthropic",
            "qwen",
            "pytorch",
            "postgresql",
            "gcp",
            "docker",
            "terraform",
            "github-actions",
            "detox",
            "testcontainers",
        ],
        link: { label: "stillapp.io", href: "https://stillapp.io" },
    },
    {
        id: "methods",
        company: "Methods",
        companyNote: "Alten",
        role: "Full Stack Software Engineering Consultant",
        start: "2025-08",
        end: null,
        period: "Aug 2025 — Present",
        location: "Remote",
        blurb: "UK defence and central government clients",
        summary:
            "Delivering software for UK defence and central government clients, across greenfield AI product development and modernisation of large microservice estates.",
        sections: [
            {
                title: "Royal Navy / MoD — AI Ethical Assurance Platform",
                bullets: [
                    "Joined a stalled project with no agreed product direction and a fixed delivery date; produced the Figma design system and end-to-end flows that became the team's single reference point, unblocking parallel work across four workstreams.",
                    "Led frontend delivery as the only dedicated frontend engineer, designing and building a bespoke SvelteKit design system of 40+ accessible components and then shipping the full application on top of it.",
                    "Built the platform's core capability, including a user-configurable assurance workflow and dynamic form engine, in-app chat, notifications, user management and audit logging.",
                    "Implemented role-based access control across 12 distinct service roles, spanning SvelteKit route guards, backend endpoint authorisation, permission-aware response shaping and supporting schema migrations.",
                    "Used AI-assisted and agentic development workflows where permitted to compress delivery timelines, holding quality through review standards, typed contracts and test coverage.",
                ],
            },
            {
                title: "HMCTS — Microservice Estate & 3rd Line Support",
                bullets: [
                    "3rd line support across an estate of 70+ services and thousands of repositories; learned Java and Angular on-project and was resolving production incidents in an unfamiliar legacy codebase within three weeks.",
                    "Operate ActiveMQ Artemis messaging infrastructure, including a custom management console built against Jolokia/JMX endpoints; currently delivering Angular components for ongoing service modernisation.",
                ],
            },
        ],
        bullets: [],
        tech: [
            "sveltekit",
            "typescript",
            "figma",
            "java",
            "angular",
            "activemq",
            "postgresql",
            "kubernetes",
            "helm",
            "docker",
        ],
    },
    {
        id: "roex",
        company: "RoEx",
        role: "Product Engineer",
        start: "2023-12",
        end: "2025-08",
        period: "Dec 2023 — Aug 2025",
        location: "Remote",
        blurb: "Music AI startup, 8-person team · B2C revenue grew over 200% during tenure",
        summary:
            "Product engineer at an 8-person music AI startup, owning UI/UX and marketing input alongside engineering as team size demanded. B2C revenue grew over 200% during tenure.",
        bullets: [
            "Researched and prototyped natural-language prompting to extract mixing and mastering preferences, letting users express complex intent without a complex interface, a direct response to user interviews I ran myself.",
            "Rebuilt and A/B tested the core user interface using Microsoft Clarity session data, lifting conversion 20%; rebuilt key components for mobile after analytics showed 60%+ mobile traffic.",
            "Launched client-side buffered audio previews so pro users heard results faster.",
            "Built a deployment pipeline with a Cypress integration suite, cutting critical platform errors by 40% and release cycle time by 25%.",
            "Resolved escalated customer issues at a 95% user-reported satisfaction rating; owned UI/UX and marketing input alongside engineering.",
        ],
        tech: [
            "vue",
            "typescript",
            "python",
            "flask",
            "openai",
            "cypress",
            "gcp",
            "datastore",
            "clarity",
        ],
    },
    {
        id: "passfort",
        company: "PassFort",
        companyNote: "Moody's Analytics",
        role: "Full Stack Software Engineer",
        start: "2022-08",
        end: "2023-12",
        period: "Aug 2022 — Dec 2023",
        location: "London / Remote",
        blurb: "KYC and compliance platform, team of 10 · Acquired by Moody's Analytics during tenure",
        summary:
            "Full stack engineer on a KYC and compliance platform (team of 10), acquired by Moody's Analytics during tenure. Practised TDD, held 80% test coverage and sustained 99.9%+ uptime.",
        bullets: [
            "Migrated a legacy configuration system to a DAG-based versioned model in Rust, adding concurrent editing and complete validation, which sharply reduced customer issues around promoting config between environments.",
            "Led full isolation of the largest integration test suite end to end, cutting re-runs from colliding tests by around 30% and running roughly 50% faster through added parallelism.",
            "Practised TDD and held 80% test coverage; monitored services through Grafana, Loki, Datadog and Retool to sustain 99.9%+ uptime.",
            "Ran core team ceremonies, including standups, retros, post-incident reviews and support handover.",
        ],
        tech: [
            "rust",
            "python",
            "react",
            "typescript",
            "postgresql",
            "kubernetes",
            "grafana",
            "loki",
            "datadog",
            "retool",
            "circleci",
        ],
    },
    {
        id: "netacea",
        company: "Netacea",
        role: "Junior Full Stack Software Engineer",
        start: "2021-07",
        end: "2022-08",
        period: "Jul 2021 — Aug 2022",
        location: "Manchester / Remote",
        blurb: "AI-powered bot mitigation and cybersecurity, B2B",
        summary:
            "First engineering role at an AI-powered bot mitigation company. Architected the edge integration that secured a contract worth over $1,000,000.",
        bullets: [
            "Architected and led a from-scratch Akamai EdgeWorkers integration that secured a contract worth over $1,000,000, profiling it to fit hard limits of 2.5MB memory and 20ms CPU.",
            "Shipped JavaScript edge logic across three CDN platforms (Cloudflare, Akamai and AWS CloudFront) to cut latency and database load; load tested the backend for 100,000+ additional RPS.",
        ],
        tech: [
            "javascript",
            "typescript",
            "akamai",
            "cloudflare",
            "aws",
            "nodejs",
            "python",
            "mongodb",
        ],
    },
];

export interface Project {
    id: string;
    name: string;
    description: string;
    /** Longer explanation for expanded/hover states. */
    detail: string;
    tech: string[];
    status: "private" | "public" | "live";
    link?: { label: string; href: string };
}

export const projects: Project[] = [
    {
        id: "still",
        name: "Still",
        description:
            "AI-native notes and personal assistant, built alone across Go, React Native and a fine-tuned open-weight model.",
        detail: "Speak or type your thoughts. Still captures, structures and organises them, then answers from your own notes rather than model priors. Retrieval, agent pipeline, backend, mobile client and infrastructure all built solo.",
        tech: ["go", "react-native", "anthropic", "qwen", "postgresql", "gcp"],
        status: "live",
        link: { label: "stillapp.io", href: "https://stillapp.io" },
    },
    {
        id: "rag-engine",
        name: "RAG engine",
        description:
            "Retrieval pipeline that makes large, unfamiliar codebases explorable in natural language.",
        detail: "Chunking, embedding and semantic retrieval over whole repositories, so questions about an unfamiliar codebase get grounded answers with citations back to source.",
        tech: ["python", "milvus", "openai"],
        status: "private",
    },
    {
        id: "gpt-from-scratch",
        name: "GPT from scratch",
        description:
            "A transformer implemented from the primitives up, following “Attention Is All You Need”.",
        detail: "Tokeniser, embeddings, multi-head attention, positional encoding and the training loop, written by hand to understand every tensor shape.",
        tech: ["python", "pytorch"],
        status: "public",
        link: { label: "GitHub", href: "https://github.com/kyle-blue" },
    },
    {
        id: "llm-quantisation",
        name: "LLM quantisation",
        description:
            "Compressing causal LM parameters to cut memory and compute at minimal quality cost.",
        detail: "Post-training quantisation experiments on causal language models, measuring perplexity against memory footprint and throughput.",
        tech: ["python", "pytorch", "huggingface"],
        status: "public",
        link: { label: "GitHub", href: "https://github.com/kyle-blue" },
    },
    {
        id: "autograd",
        name: "Scalar autograd engine",
        description: "Backpropagation built at the scalar level to internalise the mechanics.",
        detail: "A tiny reverse-mode autodiff engine and neural net library, operating on individual scalars, to make the chain rule concrete.",
        tech: ["python"],
        status: "public",
        link: { label: "GitHub", href: "https://github.com/kyle-blue" },
    },
];

export interface SkillGroup {
    id: string;
    title: string;
    /** Free-text list as on the CV. */
    items: string[];
    /** Tech keys that have icons. */
    tech: string[];
}

export const skills: SkillGroup[] = [
    {
        id: "languages",
        title: "Languages",
        items: ["TypeScript / JavaScript", "Go", "Python", "Rust", "Java", "SQL", "Bash"],
        tech: ["typescript", "javascript", "go", "python", "rust", "java", "sql", "bash"],
    },
    {
        id: "ai",
        title: "AI Engineering",
        items: [
            "RAG and vector retrieval",
            "Agent pipelines and tool use",
            "LLM application architecture",
            "Open-weight model fine-tuning (Qwen)",
            "Quantisation",
            "Evaluation and deterministic testing of non-deterministic systems",
            "Anthropic and OpenAI APIs",
            "PyTorch",
            "Transformer internals",
            "Milvus",
        ],
        tech: ["anthropic", "openai", "qwen", "pytorch", "huggingface", "milvus"],
    },
    {
        id: "frontend",
        title: "Frontend",
        items: ["SvelteKit", "React", "React Native", "Angular", "Vue", "Design systems", "HTMX"],
        tech: [
            "sveltekit",
            "react",
            "react-native",
            "angular",
            "vue",
            "htmx",
            "figma",
            "tailwind",
            "nextjs",
        ],
    },
    {
        id: "backend",
        title: "Backend & Data",
        items: [
            "Go",
            "Node",
            "Flask",
            "REST",
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Google Datastore",
        ],
        tech: ["go", "nodejs", "flask", "postgresql", "mysql", "mongodb", "datastore", "rust"],
    },
    {
        id: "infra",
        title: "Infrastructure",
        items: ["Docker", "Kubernetes", "Helm", "AWS", "GCP", "GitHub Actions", "CircleCI"],
        tech: [
            "docker",
            "kubernetes",
            "helm",
            "aws",
            "gcp",
            "terraform",
            "github-actions",
            "circleci",
        ],
    },
    {
        id: "observability",
        title: "Observability",
        items: ["Grafana", "Prometheus", "Datadog", "Sentry", "Loki"],
        tech: ["grafana", "prometheus", "datadog", "sentry", "loki"],
    },
    {
        id: "practices",
        title: "Practices",
        items: [
            "TDD",
            "testcontainers",
            "Cypress",
            "Detox",
            "Agentic development workflows",
            "Linux",
        ],
        tech: ["testcontainers", "cypress", "detox", "linux", "git"],
    },
];

export const education = {
    degree: "BSc Computer Science",
    institution: "University of Reading",
    period: "2018 — 2021",
    grade: "First Class Honours",
    award: "Chancellor's Award for the highest weighted grade in Computer Science",
} as const;
