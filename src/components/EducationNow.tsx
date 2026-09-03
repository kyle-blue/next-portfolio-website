import { education, now, person } from "@/content/cv";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function EducationNow() {
    return (
        <section id="education" className="cx-section" aria-labelledby="education-title">
            <SectionHeader id="education" title="Education & Now" eyebrow="Background" />
            <div className="cx-two">
                <Reveal as="article" className="cx-panel-win">
                    <h3 className="cx-win-title">
                        <span className="cx-sq" aria-hidden="true" />
                        <span className="cx-win-index">05.1</span>
                        Education
                    </h3>
                    <div className="cx-win-body">
                        <p className="cx-edu-degree">{education.degree}</p>
                        <p className="cx-edu-inst">{education.institution}</p>
                        <dl className="cx-meta cx-meta-tight">
                            <div className="cx-meta-row">
                                <dt>Period</dt>
                                <dd>{education.period}</dd>
                            </div>
                            <div className="cx-meta-row">
                                <dt>Grade</dt>
                                <dd>{education.grade}</dd>
                            </div>
                            <div className="cx-meta-row">
                                <dt>Award</dt>
                                <dd>{education.award}</dd>
                            </div>
                        </dl>
                    </div>
                </Reveal>
                <Reveal as="article" className="cx-panel-win" delay={1}>
                    <h3 className="cx-win-title">
                        <span className="cx-sq" aria-hidden="true" />
                        <span className="cx-win-index">05.2</span>
                        Now
                    </h3>
                    <div className="cx-win-body">
                        <ol className="cx-now">
                            {now.map((n, i) => (
                                <li key={n}>
                                    <span className="cx-now-index">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {n}
                                </li>
                            ))}
                        </ol>
                        <p className="cx-now-status">
                            <span className="cx-dot" aria-hidden="true" />
                            Available
                            <span aria-hidden="true">·</span>
                            {person.availability}
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
