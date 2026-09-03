/**
 * Eased, cancellable scroll to a section. Used by the navigation instead of
 * native hash jumps so the landing position is exact and the motion is a short
 * ease-out tween rather than the browser's slow default.
 *
 * The browser is never allowed to perform the hash navigation itself: the URL
 * is updated with `replaceState` after the scroll, which avoids the classic
 * "page jumps then leaves a gap" problem caused by `:target` / scroll anchoring.
 */

let active: number | null = null;

const CANCEL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

function easeOutQuart(t: number): number {
    return 1 - (1 - t) ** 4;
}

export function scrollToSection(id: string, offset = 0): void {
    const el = document.getElementById(id);
    if (!el) return;

    const startY = window.scrollY;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = Math.max(0, Math.min(maxY, startY + el.getBoundingClientRect().top - offset));
    const distance = targetY - startY;

    const finish = () => {
        history.replaceState(null, "", `#${id}`);
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
    };

    if (Math.abs(distance) < 2) {
        window.scrollTo({ top: targetY, behavior: "instant" });
        finish();
        return;
    }

    if (active !== null) cancelAnimationFrame(active);
    // Short and snappy: ~320ms nearby, capped at 700ms for a full-page hop.
    // Reduced motion keeps the ease (an instant jump is more disorienting) but
    // caps it at 360ms.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = Math.min(reduced ? 360 : 700, 260 + Math.abs(distance) * 0.18);
    const t0 = performance.now();

    const cancel = () => {
        if (active !== null) cancelAnimationFrame(active);
        active = null;
        for (const ev of CANCEL_EVENTS) window.removeEventListener(ev, cancel);
    };
    for (const ev of CANCEL_EVENTS) window.addEventListener(ev, cancel, { passive: true });

    const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        window.scrollTo({ top: startY + distance * easeOutQuart(t), behavior: "instant" });
        if (t < 1) {
            active = requestAnimationFrame(step);
        } else {
            cancel();
            finish();
        }
    };
    active = requestAnimationFrame(step);
}
