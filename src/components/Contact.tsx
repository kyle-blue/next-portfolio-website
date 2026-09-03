import { links, person } from "@/content/cv";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const rows = [
    { key: "EMAIL", link: links.email },
    { key: "GITHUB", link: links.github },
    { key: "LINKEDIN", link: links.linkedin },
    { key: "CV", link: links.cv },
    { key: "STILL", link: links.still },
    { key: "SITE", link: links.site },
] as const;

export function Contact() {
    return (
        <section
            id="contact"
            className="cx-section cx-section-last"
            aria-labelledby="contact-title"
        >
            <SectionHeader id="contact" title="Contact" eyebrow="Get in touch" note="Spec block" />
            <Reveal className="cx-contact-lead">
                <p>
                    Building something in the AI product space and small enough that ownership
                    counts? Say hello.
                </p>
            </Reveal>
            <Reveal as="div" className="cx-contact" delay={1}>
                <ul className="cx-contact-rows">
                    {rows.map((r) => {
                        const external = r.link.href.startsWith("http");
                        return (
                            <li key={r.key}>
                                <a
                                    href={r.link.href}
                                    className="cx-contact-row"
                                    {...(external
                                        ? { target: "_blank", rel: "noreferrer noopener" }
                                        : {})}
                                    {...(r.key === "CV" ? { download: true } : {})}
                                >
                                    <span className="cx-contact-key">{r.key}</span>
                                    <span className="cx-contact-val">{r.link.handle}</span>
                                    <span className="cx-contact-arrow" aria-hidden="true">
                                        →
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </Reveal>
            <footer className="cx-footer">
                <p>
                    © {new Date().getFullYear()} {person.name}
                    <span aria-hidden="true"> · </span>
                    {person.location}
                </p>
                <p>
                    <span>53.8008° N</span>
                    <span aria-hidden="true"> · </span>
                    <span>Next.js</span>
                    <span aria-hidden="true"> · </span>
                    <span>rev. contour</span>
                </p>
            </footer>
        </section>
    );
}
