/** Section index shared by the nav rail and the section headers. */
export const sections = [
    { id: "intro", index: "00", label: "Intro" },
    { id: "profile", index: "01", label: "Profile" },
    { id: "experience", index: "02", label: "Experience" },
    { id: "projects", index: "03", label: "Projects" },
    { id: "skills", index: "04", label: "Skills" },
    { id: "education", index: "05", label: "Education" },
    { id: "contact", index: "06", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export function sectionIndex(id: SectionId): string {
    const found = sections.find((s) => s.id === id);
    return found ? found.index : "00";
}
