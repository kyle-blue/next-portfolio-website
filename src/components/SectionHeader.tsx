import { type SectionId, sectionIndex } from "@/lib/sections";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
    id: SectionId;
    title: string;
    eyebrow: string;
    /** Optional right-aligned mono note. */
    note?: string;
}

export function SectionHeader({ id, title, eyebrow, note }: SectionHeaderProps) {
    return (
        <Reveal as="header" className="cx-sh">
            <p className="cx-eyebrow">
                <span className="cx-eyebrow-index">{sectionIndex(id)}</span>
                <span aria-hidden="true">/</span>
                {eyebrow}
            </p>
            <div className="cx-sh-row">
                <h2 id={`${id}-title`} className="cx-h2">
                    {title}
                </h2>
                {note ? <p className="cx-sh-note">{note}</p> : null}
            </div>
            <div className="cx-rule" aria-hidden="true">
                <span className="cx-rule-sq" />
            </div>
        </Reveal>
    );
}
