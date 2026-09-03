import { JetBrains_Mono, Manrope } from "next/font/google";

export const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const sans = Manrope({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});
