"use client";

import { type CSSProperties, useId, useLayoutEffect, useRef, useState } from "react";
import { getTech, type Tech } from "@/content/tech";

export function TechTile({ item }: { item: Tech }) {
    const [open, setOpen] = useState(false);
    const [shift, setShift] = useState(0);
    const tipRef = useRef<HTMLSpanElement>(null);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const id = useId();
    const Icon = item.icon;

    // Clamp the tooltip inside the viewport horizontally once it is shown.
    // Measure from the (static) anchor and the tooltip's untransformed width so
    // the in-flight transform transition can never feed back into the shift.
    useLayoutEffect(() => {
        if (!open) {
            setShift(0);
            return;
        }
        const tip = tipRef.current;
        const anchor = anchorRef.current;
        if (!tip || !anchor) return;
        const pad = 12;
        const a = anchor.getBoundingClientRect();
        const half = tip.offsetWidth / 2;
        const centre = a.left + a.width / 2;
        let next = 0;
        if (centre - half < pad) next = pad - (centre - half);
        else if (centre + half > window.innerWidth - pad)
            next = window.innerWidth - pad - (centre + half);
        setShift(Math.round(next));
    }, [open]);

    const show = () => setOpen(true);
    const hide = () => setOpen(false);

    return (
        <span className="cx-tile-wrap">
            <button
                ref={anchorRef}
                type="button"
                aria-label={item.label}
                aria-describedby={id}
                className="cx-tile"
                style={{ "--tech-color": item.color } as CSSProperties}
                onPointerEnter={show}
                onPointerLeave={hide}
                onFocus={show}
                onBlur={hide}
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") hide();
                }}
            >
                {Icon ? (
                    <Icon size={16} color="currentColor" aria-hidden="true" />
                ) : (
                    <span className="cx-tile-mono">{item.monogram}</span>
                )}
            </button>
            <span
                ref={tipRef}
                role="tooltip"
                id={id}
                className="cx-tip"
                data-open={open ? "true" : "false"}
                style={{ "--tip-shift": `${shift}px` } as CSSProperties}
            >
                <span className="cx-tip-label">{item.label}</span>
                <span className="cx-tip-blurb">{item.blurb}</span>
            </span>
            <span className="cx-tip-caret" data-open={open ? "true" : "false"} aria-hidden="true" />
        </span>
    );
}

/** Mono-labelled row of tech tiles. Resolves keys client-side (icons are components). */
export function TechRow({ keys, label = "Stack" }: { keys: readonly string[]; label?: string }) {
    const items = getTech(keys);
    if (items.length === 0) return null;
    return (
        <div className="cx-techrow">
            <span className="cx-techrow-label">{label}</span>
            <ul className="cx-techrow-list" aria-label={label}>
                {items.map((t) => (
                    <li key={t.key}>
                        <TechTile item={t} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
