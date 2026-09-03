import { skills } from "@/content/cv";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { TechRow } from "./TechTile";

export function Skills() {
    return (
        <section id="skills" className="cx-section" aria-labelledby="skills-title">
            <SectionHeader
                id="skills"
                title="Skills"
                eyebrow="Capabilities"
                note={`${skills.length} groups`}
            />
            <ul className="cx-skills">
                {skills.map((g, i) => (
                    <Reveal as="li" key={g.id} className="cx-panel-win" delay={i}>
                        <h3 className="cx-win-title">
                            <span className="cx-sq" aria-hidden="true" />
                            <span className="cx-win-index">{String(i + 1).padStart(2, "0")}</span>
                            {g.title}
                        </h3>
                        <div className="cx-win-body">
                            <ul className="cx-chips">
                                {g.items.map((item) => (
                                    <li key={item} className="cx-chip">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <TechRow keys={g.tech} label="Tools" />
                        </div>
                    </Reveal>
                ))}
            </ul>
        </section>
    );
}
