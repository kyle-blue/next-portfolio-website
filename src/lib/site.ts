import { config } from "@/config";

/** Static site metadata used for SEO, OG tags and JSON-LD. */
export const site = {
    name: "Kyle Doidge",
    handle: "kblue",
    title: "Kyle Doidge — Senior Full Stack Engineer · AI Products",
    description:
        "Kyle Doidge is a senior full stack engineer building AI products end to end: RAG and agent pipelines, Go and TypeScript backends, and the interfaces people actually use. Founder of Still. Leeds, UK.",
    url: config.siteUrl,
    locale: "en_GB",
    keywords: [
        "Kyle Doidge",
        "full stack engineer",
        "AI engineer",
        "RAG",
        "LLM agents",
        "Go",
        "TypeScript",
        "React",
        "SvelteKit",
        "Leeds",
        "Still",
        "stillapp.io",
    ],
} as const;
