import { highlights, person } from "@/content/cv";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const meta = [
    { label: "Location", value: person.location },
    { label: "Availability", value: person.availability },
    { label: "Experience", value: `${person.yearsExperience} years` },
    { label: "Looking for", value: person.lookingFor },
];

export function Profile() {
    return (
        <section id="profile" className="cx-section" aria-labelledby="profile-title">
            <SectionHeader id="profile" title="Profile" eyebrow="About" note="Spec sheet" />
            <Reveal className="cx-profile">
                <p className="cx-profile-text">{person.profile}</p>
                <dl className="cx-meta">
                    {meta.map((m) => (
                        <div key={m.label} className="cx-meta-row">
                            <dt>{m.label}</dt>
                            <dd>{m.value}</dd>
                        </div>
                    ))}
                </dl>
            </Reveal>
            <Reveal as="div" className="cx-spec" delay={1}>
                <p className="cx-spec-title">
                    <span className="cx-sq" aria-hidden="true" />
                    Highlights
                </p>
                <dl className="cx-spec-rows">
                    {highlights.map((h, i) => (
                        <div key={h.label} className="cx-spec-row">
                            <dt>
                                <span className="cx-spec-index">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                {h.label}
                            </dt>
                            <span className="cx-leader" aria-hidden="true" />
                            <dd>{h.value}</dd>
                        </div>
                    ))}
                </dl>
            </Reveal>
        </section>
    );
}
