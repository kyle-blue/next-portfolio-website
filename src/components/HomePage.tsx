import { mono, sans } from "@/lib/fonts";
import { Hero } from "./Hero";
import { Nav } from "./Nav";
import "@/styles/site.css";

export function HomePage() {
    return (
        <div className={`site ${mono.variable} ${sans.variable}`}>
            <Nav />
            <main id="main" className="cx-main">
                <Hero />
            </main>
        </div>
    );
}
