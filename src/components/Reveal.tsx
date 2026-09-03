"use client";

import { createElement, type ReactNode } from "react";
import { useReveal } from "./useReveal";

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Stagger slot (0–7); each slot adds 50ms. */
    delay?: number;
    as?: "div" | "li" | "article" | "section" | "header";
    id?: string;
}

export function Reveal({ children, className, delay = 0, as = "div", id }: RevealProps) {
    const { ref, visible } = useReveal<HTMLElement>();
    return createElement(
        as,
        {
            ref,
            id,
            className: `cx-reveal ${className ?? ""}`.trim(),
            "data-visible": visible ? "true" : "false",
            style: { "--reveal-delay": `${Math.min(delay, 7) * 50}ms` },
        },
        children,
    );
}
