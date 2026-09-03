import { ImageResponse } from "next/og";
import { person } from "@/content/cv";

export const alt = "Kyle Doidge — Senior Full Stack Engineer · AI Products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 72,
                background: "linear-gradient(135deg, #0b0b0e 0%, #14161f 100%)",
                color: "#f4f4f5",
                fontFamily: "sans-serif",
            }}
        >
            <div style={{ display: "flex", fontSize: 26, color: "#9a9aa3", letterSpacing: 6 }}>
                KBLUE.IO
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -4 }}>
                    {person.name}
                </div>
                <div style={{ display: "flex", fontSize: 38, color: "#c9c9d1" }}>
                    {person.role} · {person.focus}
                </div>
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#9a9aa3" }}>
                {person.location} · Founder of Still · github.com/kyle-blue
            </div>
        </div>,
        size,
    );
}
