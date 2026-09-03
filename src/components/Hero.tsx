import { links, person } from "@/content/cv";
import { ContourField } from "./ContourField";

const COORDS = "53.8008° N, 1.5491° W";

export function Hero() {
    return (
        <section id="intro" className="cx-hero" aria-labelledby="intro-title">
            <ContourField className="cx-hero-canvas" />
            <div className="cx-hero-fade" aria-hidden="true" />
            <div className="cx-hero-inner">
                <p className="cx-eyebrow cx-hero-eyebrow">
                    <span className="cx-eyebrow-index">00</span>
                    <span aria-hidden="true">/</span>
                    {person.role}
                    <span className="cx-eyebrow-sep" aria-hidden="true">
                        ·
                    </span>
                    {person.focus}
                </p>
                <h1 id="intro-title" className="cx-hero-name">
                    {person.name}
                </h1>
                <p className="cx-hero-coords">
                    {COORDS}
                    <span aria-hidden="true"> — </span>
                    {person.location}
                </p>
                <p className="cx-hero-status">
                    <span className="cx-dot" aria-hidden="true" />
                    <span>Available</span>
                    <span aria-hidden="true">·</span>
                    <span>{person.availability}</span>
                    <span aria-hidden="true">·</span>
                    <span>{person.clearance}</span>
                </p>
                <p className="cx-hero-tagline">{person.tagline}</p>
                <p className="cx-hero-summary">{person.summary}</p>
                <div className="cx-hero-ctas">
                    <a href={links.email.href} className="cx-btn cx-btn-primary">
                        {links.email.label}
                    </a>
                    <a
                        href={links.github.href}
                        className="cx-btn"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {links.github.label}
                    </a>
                    <a
                        href={links.linkedin.href}
                        className="cx-btn"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {links.linkedin.label}
                    </a>
                    <a href={links.cv.href} className="cx-btn" download>
                        {links.cv.label}
                    </a>
                </div>
            </div>
            <p className="cx-hero-corner" aria-hidden="true">
                <span>FIG. 00</span>
                <span>HEIGHT FIELD · 10 LEVELS</span>
            </p>
        </section>
    );
}
