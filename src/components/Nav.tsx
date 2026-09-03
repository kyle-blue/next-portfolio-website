"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { links, person } from "@/content/cv";
import { scrollToSection } from "@/lib/scroll";
import { type SectionId, sections } from "@/lib/sections";

/** Height of the fixed top bar shown below the desktop breakpoint. */
const TOPBAR_OFFSET = 56;

function onSectionClick(e: MouseEvent<HTMLAnchorElement>, id: SectionId) {
    // Let modified clicks (new tab etc.) behave natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const offset = window.matchMedia("(min-width: 1024px)").matches ? 0 : TOPBAR_OFFSET;
    scrollToSection(id, offset);
}

const railLinks = [links.github, links.linkedin, links.email, links.cv] as const;

export function Nav() {
    const [active, setActive] = useState<SectionId>("intro");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const els = sections
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => el !== null);
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id as SectionId);
                }
            },
            { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
        );
        for (const el of els) io.observe(el);

        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            io.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const items = sections.map((s) => (
        <li key={s.id}>
            <a
                href={`#${s.id}`}
                className="cx-nav-link"
                onClick={(e) => onSectionClick(e, s.id)}
                data-active={active === s.id ? "true" : "false"}
                aria-current={active === s.id ? "location" : undefined}
            >
                <span className="cx-nav-index">{s.index}</span>
                <span className="cx-nav-label">{s.label}</span>
            </a>
        </li>
    ));

    return (
        <>
            <aside className="cx-rail" aria-label="Site navigation">
                {/* biome-ignore lint/a11y/useValidAnchor: in-page navigation; the href works without JS, the handler only eases the scroll. */}
                <a href="#intro" className="cx-brand" onClick={(e) => onSectionClick(e, "intro")}>
                    <span className="cx-brand-mark" aria-hidden="true">
                        KD
                    </span>
                    <span className="cx-brand-text">
                        <span>{links.site.handle}</span>
                        <span className="cx-brand-sub">{person.location}</span>
                    </span>
                </a>
                <nav aria-label="Sections">
                    <p className="cx-rail-title">Index</p>
                    <ol className="cx-nav-list">{items}</ol>
                </nav>
                <div className="cx-rail-foot">
                    <p className="cx-rail-title">Links</p>
                    <ul className="cx-rail-links">
                        {railLinks.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    className="cx-rail-link"
                                    {...(l.href.startsWith("http")
                                        ? { target: "_blank", rel: "noreferrer noopener" }
                                        : {})}
                                >
                                    {l.label}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className="cx-rail-status">
                        <span className="cx-dot" aria-hidden="true" />
                        {person.availability}
                    </p>
                </div>
            </aside>

            <header className="cx-topbar" data-scrolled={scrolled ? "true" : "false"}>
                {/* biome-ignore lint/a11y/useValidAnchor: in-page navigation; the href works without JS, the handler only eases the scroll. */}
                <a
                    href="#intro"
                    className="cx-topbar-brand"
                    onClick={(e) => onSectionClick(e, "intro")}
                >
                    <span className="cx-brand-mark" aria-hidden="true">
                        KD
                    </span>
                    <span>{links.site.handle}</span>
                </a>
                <nav aria-label="Sections" className="cx-topbar-nav">
                    <ol className="cx-topbar-list">{items}</ol>
                </nav>
            </header>
        </>
    );
}
