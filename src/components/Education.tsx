import { education } from "@/content/cv";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function Education() {
    return (
        <section id="education" className="cx-section" aria-labelledby="education-title">
            <SectionHeader id="education" title="Education" eyebrow="Background" />
            <Reveal as="article" className="cx-panel-win">
                <h3 className="cx-win-title">
                    <span className="cx-sq" aria-hidden="true" />
                    <span className="cx-win-index">05.1</span>
                    {education.institution}
                </h3>
                <div className="cx-win-body cx-edu">
                    <div>
                        <p className="cx-edu-degree">{education.degree}</p>
                        <p className="cx-edu-inst">{education.institution}</p>
                    </div>
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
        </section>
    );
}
