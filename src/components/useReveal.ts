"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-once hook: returns a ref and a `visible` flag that flips true when the
 * element enters the viewport (or immediately under reduced motion).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVisible(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                    }
                }
            },
            { threshold, rootMargin: "0px 0px -6% 0px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);

    return { ref, visible };
}
