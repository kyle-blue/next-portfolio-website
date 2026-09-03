import {
    SiAkamai,
    SiAngular,
    SiAnthropic,
    SiCircleci,
    SiCloudflare,
    SiCypress,
    SiDatadog,
    SiDocker,
    SiFigma,
    SiFlask,
    SiGit,
    SiGithubactions,
    SiGnubash,
    SiGo,
    SiGooglecloud,
    SiGrafana,
    SiHelm,
    SiHtmx,
    SiHuggingface,
    SiJavascript,
    SiKubernetes,
    SiLinux,
    SiMilvus,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiOpenjdk,
    SiPostgresql,
    SiPrometheus,
    SiPython,
    SiPytorch,
    SiQwen,
    SiReact,
    SiRetool,
    SiRust,
    SiSentry,
    SiSvelte,
    SiTailwindcss,
    SiTerraform,
    SiTypescript,
    SiVuedotjs,
} from "@icons-pack/react-simple-icons";
import type { ComponentType, SVGProps } from "react";

/**
 * Registry of tools/technologies referenced by `cv.ts`.
 *
 * Each entry has a brand icon where simple-icons provides one. Where no brand
 * icon exists, `icon` is undefined and `monogram` gives 1–2 letters a draft can
 * render in its own style instead. Drafts decide how to present these; this
 * file only holds data.
 */

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export interface Tech {
    key: string;
    label: string;
    /** One-line tooltip text. */
    blurb: string;
    /** Brand hex colour (from simple-icons) for drafts that want colour on hover. */
    color: string;
    icon?: IconComponent;
    monogram?: string;
}

const t = (
    key: string,
    label: string,
    blurb: string,
    color: string,
    icon?: IconComponent,
    monogram?: string,
): Tech => ({ key, label, blurb, color, icon, monogram });

const list: Tech[] = [
    t(
        "typescript",
        "TypeScript",
        "Primary language across frontend and Node backends",
        "#3178C6",
        SiTypescript,
    ),
    t(
        "javascript",
        "JavaScript",
        "Edge logic, tooling and everything in between",
        "#F7DF1E",
        SiJavascript,
    ),
    t("go", "Go", "Backend services, agent pipelines and CLIs", "#00ADD8", SiGo),
    t("python", "Python", "ML, data tooling and Flask services", "#3776AB", SiPython),
    t("rust", "Rust", "DAG-based versioned config engine at PassFort", "#000000", SiRust),
    t("java", "Java", "Learned on-project for HMCTS microservices", "#437291", SiOpenjdk),
    t(
        "sql",
        "SQL",
        "PostgreSQL and MySQL schema design and migrations",
        "#4479A1",
        undefined,
        "SQL",
    ),
    t("bash", "Bash", "Scripting, CI glue and Linux ops", "#4EAA25", SiGnubash),

    t(
        "anthropic",
        "Anthropic API",
        "Tool use, multi-step orchestration, structured output",
        "#191919",
        SiAnthropic,
    ),
    t(
        "openai",
        "OpenAI API",
        "Natural-language prompting and embeddings",
        "#412991",
        undefined,
        "AI",
    ),
    t("qwen", "Qwen", "Fine-tuning open-weight models for note processing", "#615CED", SiQwen),
    t(
        "pytorch",
        "PyTorch",
        "Transformer internals, fine-tuning and quantisation",
        "#EE4C2C",
        SiPytorch,
    ),
    t(
        "huggingface",
        "Hugging Face",
        "Model hub, transformers and evaluation",
        "#FFD21E",
        SiHuggingface,
    ),
    t("milvus", "Milvus", "Vector database for retrieval pipelines", "#00A1EA", SiMilvus),

    t("react", "React", "Component architecture and design systems", "#61DAFB", SiReact),
    t(
        "react-native",
        "React Native",
        "Still's mobile client with full Detox coverage",
        "#61DAFB",
        SiReact,
    ),
    t("nextjs", "Next.js", "This site, and Still's marketing site", "#000000", SiNextdotjs),
    t(
        "sveltekit",
        "SvelteKit",
        "40+ component design system for the Royal Navy platform",
        "#FF3E00",
        SiSvelte,
    ),
    t("angular", "Angular", "Service modernisation components at HMCTS", "#0F0F11", SiAngular),
    t("vue", "Vue", "RoEx product UI, rebuilt and A/B tested", "#4FC08D", SiVuedotjs),
    t("htmx", "HTMX", "Hypermedia-driven interfaces", "#3366CC", SiHtmx),
    t("tailwind", "Tailwind CSS", "Utility-first styling", "#06B6D4", SiTailwindcss),
    t("figma", "Figma", "Design systems and end-to-end flows", "#F24E1E", SiFigma),

    t("nodejs", "Node.js", "APIs, tooling and edge runtimes", "#5FA04E", SiNodedotjs),
    t("flask", "Flask", "Python web services", "#000000", SiFlask),
    t("postgresql", "PostgreSQL", "Primary relational store", "#4169E1", SiPostgresql),
    t("mysql", "MySQL", "Relational data", "#4479A1", SiMysql),
    t("mongodb", "MongoDB", "Document storage", "#47A248", SiMongodb),
    t("datastore", "Google Datastore", "NoSQL storage on GCP", "#4285F4", undefined, "DS"),
    t(
        "activemq",
        "ActiveMQ Artemis",
        "Messaging infra with a custom Jolokia/JMX console",
        "#78161D",
        undefined,
        "MQ",
    ),

    t("docker", "Docker", "Containerised everything", "#2496ED", SiDocker),
    t(
        "kubernetes",
        "Kubernetes",
        "Orchestration for microservice estates",
        "#326CE5",
        SiKubernetes,
    ),
    t("helm", "Helm", "Kubernetes packaging", "#0F1689", SiHelm),
    t("aws", "AWS", "CloudFront edge logic and backend services", "#FF9900", undefined, "AWS"),
    t("gcp", "Google Cloud", "Cloud Run, Cloud SQL, Artifact Registry", "#4285F4", SiGooglecloud),
    t("terraform", "Terraform", "Infrastructure as code", "#844FBA", SiTerraform),
    t("github-actions", "GitHub Actions", "CI/CD pipelines", "#2088FF", SiGithubactions),
    t("circleci", "CircleCI", "CI pipelines", "#343434", SiCircleci),
    t("cloudflare", "Cloudflare", "Workers edge logic", "#F38020", SiCloudflare),
    t(
        "akamai",
        "Akamai",
        "EdgeWorkers integration within 2.5MB / 20ms limits",
        "#0096D6",
        SiAkamai,
    ),

    t("grafana", "Grafana", "Dashboards and alerting", "#F46800", SiGrafana),
    t("prometheus", "Prometheus", "Metrics", "#E6522C", SiPrometheus),
    t("datadog", "Datadog", "APM and monitoring", "#632CA6", SiDatadog),
    t("sentry", "Sentry", "Error tracking", "#362D59", SiSentry),
    t("loki", "Loki", "Log aggregation", "#F5A623", undefined, "Lk"),
    t("retool", "Retool", "Internal tooling", "#3D3D3D", SiRetool),
    t(
        "clarity",
        "Microsoft Clarity",
        "Session analytics that drove a 20% conversion lift",
        "#0078D4",
        undefined,
        "Cl",
    ),

    t(
        "cypress",
        "Cypress",
        "Integration suite that cut critical errors by 40%",
        "#69D3A7",
        SiCypress,
    ),
    t("detox", "Detox", "Gray-box end-to-end tests for React Native", "#5B8BF7", undefined, "Dx"),
    t(
        "testcontainers",
        "Testcontainers",
        "Real dependencies in integration tests",
        "#2496ED",
        undefined,
        "Tc",
    ),
    t("linux", "Linux", "Daily driver and production OS", "#FCC624", SiLinux),
    t("git", "Git", "Version control", "#F05032", SiGit),
];

export const tech: Record<string, Tech> = Object.fromEntries(list.map((item) => [item.key, item]));

/** Look up tech entries by key, skipping unknown keys (never throws at render). */
export function getTech(keys: readonly string[]): Tech[] {
    return keys.map((k) => tech[k]).filter((x): x is Tech => Boolean(x));
}
