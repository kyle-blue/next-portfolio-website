"use client";

import { useEffect, useRef, useState } from "react";
import { type Experience, experience } from "@/content/cv";
import { SectionHeader } from "./SectionHeader";
import { TechRow } from "./TechTile";
import { useReveal } from "./useReveal";

function TimelineNode({ item, index }: { item: Experience; index: number }) {
    const [open, setOpen] = useState(false);
    const { ref, visible } = useReveal<HTMLLIElement>();
    const idx = String(index + 1).padStart(2, "0");
    const panelId = `cx-exp-${item.id}`;

    const groups =
        item.sections && item.sections.length > 0
            ? item.sections
            : [{ title: null, bullets: item.bullets }];

    // Running stagger index across groups so bullets appear in reading order.
    const offsets: number[] = [];
    let total = 0;
    for (const g of groups) {
        offsets.push(total);
        total += g.bullets.length + (g.title ? 1 : 0);
    }

    return (
        <li
            ref={ref}
            className="cx-node cx-reveal"
            data-visible={visible ? "true" : "false"}
            style={{ "--reveal-delay": `${Math.min(index, 7) * 50}ms` } as React.CSSProperties}
        >
            <span className="cx-node-index" aria-hidden="true">
                {idx}
            </span>
            <span className="cx-node-marker" aria-hidden="true" />
            <article className="cx-node-card" data-open={open ? "true" : "false"}>
                <button
                    type="button"
                    className="cx-node-head"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="cx-node-title">
                        <span className="cx-node-company">
                            <span className="cx-node-inline-index" aria-hidden="true">
                                {idx}
                            </span>
                            {item.company}
                            {item.companyNote ? (
                                <span className="cx-node-note"> / {item.companyNote}</span>
                            ) : null}
                        </span>
                        <span className="cx-node-role">{item.role}</span>
                    </span>
                    <span className="cx-node-meta">
                        <span className="cx-node-period">{item.period}</span>
                        <span className="cx-node-location">{item.location}</span>
                    </span>
                    <span className="cx-node-chevron" aria-hidden="true">
                        <svg
                            viewBox="0 0 16 16"
                            width="14"
                            height="14"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 6l4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </button>
                <div className="cx-node-body">
                    <p className="cx-node-blurb">{item.blurb}</p>
                    <p className="cx-node-summary">{item.summary}</p>
                    <TechRow keys={item.tech} />
                </div>
                <div className="cx-panel" id={panelId} aria-hidden={!open}>
                    <div className="cx-panel-inner">
                        <div className="cx-panel-content">
                            {groups.map((g, gi) => (
                                <div key={g.title ?? gi} className="cx-panel-group">
                                    {g.title ? (
                                        <p
                                            className="cx-panel-title"
                                            style={{ "--i": offsets[gi] } as React.CSSProperties}
                                        >
                                            <span className="cx-panel-title-index">
                                                {idx}.{gi + 1}
                                            </span>
                                            {g.title}
                                        </p>
                                    ) : null}
                                    <ul className="cx-bullets">
                                        {g.bullets.map((b, bi) => (
                                            <li
                                                key={b}
                                                style={
                                                    {
                                                        "--i": offsets[gi] + 1 + bi,
                                                    } as React.CSSProperties
                                                }
                                            >
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            {item.link ? (
                                <a
                                    href={item.link.href}
                                    className="cx-node-link"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    tabIndex={open ? 0 : -1}
                                    style={{ "--i": total } as React.CSSProperties}
                                >
                                    {item.link.label}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </article>
        </li>
    );
}

export function Timeline() {
    const listRef = useRef<HTMLOListElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const list = listRef.current;
        const svg = svgRef.current;
        const path = pathRef.current;
        if (!list || !svg || !path) return;

        // Dash lengths are computed in pixels (no pathLength) so the ink stroke is exact.
        let length = 1;
        let raf = 0;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const update = () => {
            raf = 0;
            const rect = list.getBoundingClientRect();
            const anchor = window.innerHeight * 0.66;
            const progress = reduced
                ? 1
                : Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length * (1 - progress)}`;
        };
        const schedule = () => {
            if (raf === 0) raf = requestAnimationFrame(update);
        };

        const ro = new ResizeObserver(() => {
            const h = Math.max(1, Math.round(svg.getBoundingClientRect().height));
            length = h;
            svg.setAttribute("viewBox", `0 0 2 ${h}`);
            for (const p of svg.querySelectorAll("path")) p.setAttribute("d", `M1 0V${h}`);
            update();
        });
        ro.observe(svg);

        if (reduced) return () => ro.disconnect();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            ro.disconnect();
            if (raf !== 0) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, []);

    return (
        <section id="experience" className="cx-section" aria-labelledby="experience-title">
            <SectionHeader
                id="experience"
                title="Experience"
                eyebrow="Timeline"
                note={`${experience.length} roles · 2021 — present`}
            />
            <div className="cx-timeline">
                <svg ref={svgRef} className="cx-spine" viewBox="0 0 2 1" aria-hidden="true">
                    <path className="cx-spine-track" d="M1 0V1" />
                    <path ref={pathRef} className="cx-spine-ink" d="M1 0V1" />
                </svg>
                <ol ref={listRef} className="cx-nodes">
                    {experience.map((item, i) => (
                        <TimelineNode key={item.id} item={item} index={i} />
                    ))}
                </ol>
            </div>
        </section>
    );
}
