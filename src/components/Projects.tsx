import { projects } from "@/content/cv";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { TechRow } from "./TechTile";

export function Projects() {
    return (
        <section id="projects" className="cx-section" aria-labelledby="projects-title">
            <SectionHeader
                id="projects"
                title="Projects"
                eyebrow="Selected work"
                note={`${projects.length} entries`}
            />
            <ul className="cx-projects">
                {projects.map((p, i) => (
                    <Reveal as="li" key={p.id} className="cx-card" delay={i}>
                        <div className="cx-card-top">
                            <span className="cx-card-index">{String(i + 1).padStart(2, "0")}</span>
                            <span className="cx-pill" data-status={p.status}>
                                {p.status}
                            </span>
                        </div>
                        <h3 className="cx-card-name">{p.name}</h3>
                        <p className="cx-card-desc">{p.description}</p>
                        <p className="cx-card-detail">{p.detail}</p>
                        <div className="cx-card-foot">
                            <TechRow keys={p.tech} />
                            {p.link ? (
                                <a
                                    href={p.link.href}
                                    className="cx-card-link"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {p.link.label}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            ) : null}
                        </div>
                    </Reveal>
                ))}
            </ul>
        </section>
    );
}
