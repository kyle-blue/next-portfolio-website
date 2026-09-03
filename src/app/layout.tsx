import type { Metadata, Viewport } from "next";
import { config } from "@/config";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(config.siteUrl),
    title: {
        default: site.title,
        template: `%s — ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [...site.keywords],
    authors: [{ name: site.name, url: config.siteUrl }],
    creator: site.name,
    publisher: site.name,
    referrer: "origin-when-cross-origin",
    formatDetection: { email: false, address: false, telephone: false },
    alternates: { canonical: "/" },
    openGraph: {
        type: "profile",
        url: config.siteUrl,
        title: site.title,
        description: site.description,
        siteName: site.name,
        locale: site.locale,
        firstName: "Kyle",
        lastName: "Doidge",
        username: site.handle,
    },
    twitter: {
        card: "summary_large_image",
        title: site.title,
        description: site.description,
    },
    robots: config.isProduction
        ? { index: true, follow: true, googleBot: { index: true, follow: true } }
        : { index: false, follow: false },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#0b0b0e",
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: config.siteUrl,
    jobTitle: "Senior Full Stack Engineer",
    email: "mailto:kyle.blue.doidge@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: "Leeds", addressCountry: "GB" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Reading" },
    worksFor: { "@type": "Organization", name: "Still", url: "https://stillapp.io" },
    sameAs: ["https://github.com/kyle-blue", "https://linkedin.com/in/kyle-doidge"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                {children}
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built server-side from typed data.
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </body>
        </html>
    );
}
