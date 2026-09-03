/**
 * Per-environment configuration.
 *
 * `NEXT_PUBLIC_ENVIRONMENT` is a build-time env var inlined into the client
 * bundle. The Dockerfile and CI set it to "production".
 */

export type Environment = "development" | "production";

interface Config {
    env: Environment;
    /** Absolute origin of the deployed site (no trailing slash). */
    siteUrl: string;
    isProduction: boolean;
}

const configs: Record<Environment, Config> = {
    development: {
        env: "development",
        siteUrl: "http://localhost:3000",
        isProduction: false,
    },
    production: {
        env: "production",
        siteUrl: "https://www.kblue.io",
        isProduction: true,
    },
};

const envKey = (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development") as Environment;
export const config: Config = configs[envKey] ?? configs.development;
