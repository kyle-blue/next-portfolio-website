import { mono, sans } from "@/lib/fonts";
import { Contact } from "./Contact";
import { Education } from "./Education";
import { Hero } from "./Hero";
import { Nav } from "./Nav";
import { Profile } from "./Profile";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Timeline } from "./Timeline";
import "@/styles/site.css";

export function HomePage() {
    return (
        <div className={`site ${mono.variable} ${sans.variable}`}>
            <Nav />
            <main id="main" className="cx-main">
                <Hero />
                <Profile />
                <Timeline />
                <Projects />
                <Skills />
                <Education />
                <Contact />
            </main>
        </div>
    );
}
