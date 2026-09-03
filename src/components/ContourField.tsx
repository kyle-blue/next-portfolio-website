"use client";

import { useEffect, useRef } from "react";

/**
 * Animated topographic contour lines.
 *
 * A 3-octave value-noise height field is evaluated on a coarse grid (48px
 * cells) and upsampled with Catmull-Rom cubics to an 8px grid, where iso-lines
 * are extracted with marching squares at 10 levels. The pointer acts as a lens:
 * a Gaussian bump raised into the field makes contours crowd around it, and
 * segments inside the lens are re-stroked in teal with a radial falloff.
 */

const COARSE = 48;
const SUB = 6;
const FINE = COARSE / SUB;
const LEVELS = 10;
const LEVEL_MIN = 0.16;
const LEVEL_STEP = 0.068;
const LENS_R = 280;
const LENS_SIGMA = 118;
const LENS_AMP = 0.42;
/** How far (in noise units) the whole field slides as the pointer crosses the hero. */
const PARALLAX = 0.28;
/** Time evolution: XY drift and the Z (third noise axis) sweep, in units per second. */
const DRIFT_RATE = 0.03;
const EVOLVE_RATE = 0.13;
const NOISE_SCALE = 0.17;

const LINE = "rgba(31, 41, 51, 0.13)";
const INDEX_LINE = "rgba(31, 41, 51, 0.24)";
const CROSS = "rgba(31, 41, 51, 0.14)";

function hash3(x: number, y: number, z: number): number {
    let h = Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(z, 0x9e3779b1);
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

function smooth(t: number): number {
    return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, z: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const iz = Math.floor(z);
    const u = smooth(x - ix);
    const v = smooth(y - iy);
    const w = smooth(z - iz);
    const c000 = hash3(ix, iy, iz);
    const c100 = hash3(ix + 1, iy, iz);
    const c010 = hash3(ix, iy + 1, iz);
    const c110 = hash3(ix + 1, iy + 1, iz);
    const c001 = hash3(ix, iy, iz + 1);
    const c101 = hash3(ix + 1, iy, iz + 1);
    const c011 = hash3(ix, iy + 1, iz + 1);
    const c111 = hash3(ix + 1, iy + 1, iz + 1);
    const x00 = c000 + (c100 - c000) * u;
    const x10 = c010 + (c110 - c010) * u;
    const x01 = c001 + (c101 - c001) * u;
    const x11 = c011 + (c111 - c011) * u;
    const y0 = x00 + (x10 - x00) * v;
    const y1 = x01 + (x11 - x01) * v;
    return y0 + (y1 - y0) * w;
}

function fbm(x: number, y: number, z: number): number {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    for (let o = 0; o < 3; o++) {
        sum += amp * valueNoise(x * freq + o * 17.3, y * freq + o * 9.1, z);
        freq *= 2;
        amp *= 0.5;
    }
    return sum / 0.875;
}

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
    return (
        0.5 *
        (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
    );
}

/** Marching-squares edge pairs, indexed by corner mask (a b c d = TL TR BR BL). */
const CASES: ReadonlyArray<ReadonlyArray<number>> = [
    [],
    [3, 2],
    [2, 1],
    [3, 1],
    [0, 1],
    [0, 3, 2, 1],
    [0, 2],
    [0, 3],
    [0, 3],
    [0, 2],
    [0, 1, 3, 2],
    [0, 1],
    [3, 1],
    [2, 1],
    [3, 2],
    [],
];

interface Lens {
    x: number;
    y: number;
    amp: number;
    /** Field offset driven by pointer position (parallax), in noise units. */
    shiftX: number;
    shiftY: number;
}

interface FieldState {
    width: number;
    height: number;
    coarseW: number;
    coarseH: number;
    fineW: number;
    fineH: number;
    coarse: Float32Array;
    row: Float32Array;
    fine: Float32Array;
    levelSegs: number[][];
    lensSegs: number[];
}

function makeState(width: number, height: number): FieldState {
    const coarseW = Math.ceil(width / COARSE) + 4;
    const coarseH = Math.ceil(height / COARSE) + 4;
    const fineW = Math.ceil(width / FINE) + 1;
    const fineH = Math.ceil(height / FINE) + 1;
    return {
        width,
        height,
        coarseW,
        coarseH,
        fineW,
        fineH,
        coarse: new Float32Array(coarseW * coarseH),
        row: new Float32Array(coarseW),
        fine: new Float32Array(fineW * fineH),
        levelSegs: Array.from({ length: LEVELS }, () => []),
        lensSegs: [],
    };
}

function buildField(s: FieldState, time: number, lens: Lens): void {
    const { coarseW, coarseH, fineW, fineH, coarse, row, fine } = s;
    const drift = time * DRIFT_RATE;
    const z = time * EVOLVE_RATE;
    for (let j = 0; j < coarseH; j++) {
        for (let i = 0; i < coarseW; i++) {
            coarse[j * coarseW + i] = fbm(
                (i - 1) * NOISE_SCALE + drift + lens.shiftX,
                (j - 1) * NOISE_SCALE * 1.15 + lens.shiftY,
                z,
            );
        }
    }

    const twoSigma2 = 2 * LENS_SIGMA * LENS_SIGMA;
    const lensOn = lens.amp > 0.001;
    for (let fy = 0; fy < fineH; fy++) {
        const cy = fy / SUB + 1;
        const jy = Math.floor(cy);
        const ty = cy - jy;
        for (let ci = 0; ci < coarseW; ci++) {
            row[ci] = catmull(
                coarse[(jy - 1) * coarseW + ci],
                coarse[jy * coarseW + ci],
                coarse[(jy + 1) * coarseW + ci],
                coarse[(jy + 2) * coarseW + ci],
                ty,
            );
        }
        const py = fy * FINE;
        for (let fx = 0; fx < fineW; fx++) {
            const cx = fx / SUB + 1;
            const ix = Math.floor(cx);
            const tx = cx - ix;
            let v = catmull(row[ix - 1], row[ix], row[ix + 1], row[ix + 2], tx);
            if (lensOn) {
                const dx = fx * FINE - lens.x;
                const dy = py - lens.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < LENS_R * LENS_R * 1.6) {
                    v += lens.amp * LENS_AMP * Math.exp(-d2 / twoSigma2);
                }
            }
            fine[fy * fineW + fx] = v;
        }
    }
}

function extractContours(s: FieldState, lens: Lens): void {
    const { fineW, fineH, fine, levelSegs, lensSegs } = s;
    for (const arr of levelSegs) arr.length = 0;
    lensSegs.length = 0;
    const lensOn = lens.amp > 0.001;
    const lensR2 = LENS_R * LENS_R;
    const px = new Float64Array(4);
    const py = new Float64Array(4);

    for (let j = 0; j < fineH - 1; j++) {
        const rowA = j * fineW;
        const rowB = rowA + fineW;
        const y0 = j * FINE;
        const y1 = y0 + FINE;
        for (let i = 0; i < fineW - 1; i++) {
            const a = fine[rowA + i];
            const b = fine[rowA + i + 1];
            const c = fine[rowB + i + 1];
            const d = fine[rowB + i];
            const mn = Math.min(a, b, c, d);
            const mx = Math.max(a, b, c, d);
            const kMin = Math.max(0, Math.ceil((mn - LEVEL_MIN) / LEVEL_STEP));
            const kMax = Math.min(LEVELS - 1, Math.floor((mx - LEVEL_MIN) / LEVEL_STEP));
            if (kMin > kMax) continue;
            const x0 = i * FINE;
            const x1 = x0 + FINE;
            for (let k = kMin; k <= kMax; k++) {
                const L = LEVEL_MIN + k * LEVEL_STEP;
                const mask = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
                const edges = CASES[mask];
                if (edges.length === 0) continue;
                // Edge midpoints: 0 top, 1 right, 2 bottom, 3 left.
                px[0] = x0 + ((L - a) / (b - a)) * FINE;
                py[0] = y0;
                px[1] = x1;
                py[1] = y0 + ((L - b) / (c - b)) * FINE;
                px[2] = x0 + ((L - d) / (c - d)) * FINE;
                py[2] = y1;
                px[3] = x0;
                py[3] = y0 + ((L - a) / (d - a)) * FINE;
                const out = levelSegs[k];
                for (let e = 0; e < edges.length; e += 2) {
                    const e0 = edges[e];
                    const e1 = edges[e + 1];
                    const ax = px[e0];
                    const ay = py[e0];
                    const bx = px[e1];
                    const by = py[e1];
                    out.push(ax, ay, bx, by);
                    if (lensOn) {
                        const mx2 = (ax + bx) * 0.5 - lens.x;
                        const my2 = (ay + by) * 0.5 - lens.y;
                        if (mx2 * mx2 + my2 * my2 < lensR2) lensSegs.push(ax, ay, bx, by);
                    }
                }
            }
        }
    }
}

function strokeSegments(ctx: CanvasRenderingContext2D, segs: number[]): void {
    if (segs.length === 0) return;
    ctx.beginPath();
    for (let i = 0; i < segs.length; i += 4) {
        ctx.moveTo(segs[i], segs[i + 1]);
        ctx.lineTo(segs[i + 2], segs[i + 3]);
    }
    ctx.stroke();
}

function drawCrosses(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const step = COARSE * 4;
    const arm = 3;
    ctx.strokeStyle = CROSS;
    ctx.beginPath();
    for (let y = step; y < height; y += step) {
        for (let x = step; x < width; x += step) {
            ctx.moveTo(x - arm, y + 0.5);
            ctx.lineTo(x + arm + 1, y + 0.5);
            ctx.moveTo(x + 0.5, y - arm);
            ctx.lineTo(x + 0.5, y + arm + 1);
        }
    }
    ctx.stroke();
}

function render(ctx: CanvasRenderingContext2D, s: FieldState, lens: Lens): void {
    ctx.clearRect(0, 0, s.width, s.height);
    drawCrosses(ctx, s.width, s.height);
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let k = 0; k < LEVELS; k++) {
        ctx.strokeStyle = k % 4 === 0 ? INDEX_LINE : LINE;
        strokeSegments(ctx, s.levelSegs[k]);
    }
    if (lens.amp > 0.001 && s.lensSegs.length > 0) {
        const g = ctx.createRadialGradient(lens.x, lens.y, 0, lens.x, lens.y, LENS_R);
        const a = Math.min(0.7, 0.55 * lens.amp);
        g.addColorStop(0, `rgba(15, 118, 110, ${a})`);
        g.addColorStop(0.55, `rgba(15, 118, 110, ${a * 0.55})`);
        g.addColorStop(1, "rgba(15, 118, 110, 0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        strokeSegments(ctx, s.lensSegs);
    }
}

export function ContourField({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Reduced motion runs the field in a calm mode: slower evolution, no
        // autonomous wandering, smaller lens. Pointer-driven response is kept
        // because it is user-initiated.
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const timeScale = calm ? 0.4 : 1;
        const finePointer = window.matchMedia("(pointer: fine)").matches;

        let state: FieldState | null = null;
        let raf = 0;
        let visible = true;
        let last = 0;
        let time = 0;
        let pointerActive = false;
        let pointerClientX = 0;
        let pointerClientY = 0;
        let pointerSpeed = 0;
        let lastPointerT = 0;
        const lens: Lens = { x: -1e4, y: -1e4, amp: 0, shiftX: 0, shiftY: 0 };
        let lensX = 0;
        let lensY = 0;
        let started = false;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(1, Math.round(rect.width));
            const h = Math.max(1, Math.round(rect.height));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            state = makeState(w, h);
            if (!started) {
                lensX = w * 0.62;
                lensY = h * 0.42;
                started = true;
            }
        };

        const frame = (now: number) => {
            raf = 0;
            if (!visible || document.hidden || !state) return;
            const dt = last === 0 ? 16 : Math.min(50, now - last);
            last = now;
            time += (dt / 1000) * timeScale;

            let targetX: number;
            let targetY: number;
            let targetAmp: number;
            if (pointerActive) {
                const rect = canvas.getBoundingClientRect();
                targetX = pointerClientX - rect.left;
                targetY = pointerClientY - rect.top;
                // Faster pointer movement pushes the lens harder, so the field visibly
                // responds to gestures rather than only to position.
                targetAmp = (calm ? 0.6 : 1) + Math.min(calm ? 0.1 : 0.25, pointerSpeed * 0.0004);
                pointerSpeed *= 0.92;
            } else if (calm) {
                // Rest position, gentle amplitude, no wandering.
                targetX = state.width * 0.62;
                targetY = state.height * 0.42;
                targetAmp = 0.3;
            } else {
                // Autonomous drift on a slow Lissajous path.
                targetX = state.width * (0.5 + 0.36 * Math.sin(time * 0.11));
                targetY = state.height * (0.5 + 0.3 * Math.cos(time * 0.083));
                targetAmp = 0.45;
            }
            // Heavy, slow follow so the lens glides rather than snaps to the pointer.
            lensX += (targetX - lensX) * 0.055;
            lensY += (targetY - lensY) * 0.055;
            lens.amp += (targetAmp - lens.amp) * 0.05;
            lens.x = lensX;
            lens.y = lensY;
            // Slide the whole field a little against the pointer so contours away
            // from the lens still react (a slow parallax, not a jump).
            lens.shiftX = (lensX / state.width - 0.5) * PARALLAX;
            lens.shiftY = (lensY / state.height - 0.5) * PARALLAX * 0.6;

            buildField(state, time, lens);
            extractContours(state, lens);
            render(ctx, state, lens);
            raf = requestAnimationFrame(frame);
        };

        const start = () => {
            if (raf !== 0) return;
            last = 0;
            raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            if (raf !== 0) cancelAnimationFrame(raf);
            raf = 0;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!finePointer) return;
            const now = performance.now();
            if (pointerActive && lastPointerT > 0) {
                const dt = Math.max(1, now - lastPointerT);
                const dx = e.clientX - pointerClientX;
                const dy = e.clientY - pointerClientY;
                pointerSpeed = Math.min(1500, (Math.hypot(dx, dy) / dt) * 1000);
            }
            lastPointerT = now;
            pointerClientX = e.clientX;
            pointerClientY = e.clientY;
            pointerActive = true;
        };
        const onPointerOut = (e: PointerEvent) => {
            if (e.relatedTarget === null) pointerActive = false;
        };
        const onVisibility = () => {
            if (document.hidden) stop();
            else if (visible) start();
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const io = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                if (visible) start();
                else stop();
            },
            { threshold: 0 },
        );
        io.observe(canvas);

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("pointerout", onPointerOut);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerout", onPointerOut);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} />;
}
