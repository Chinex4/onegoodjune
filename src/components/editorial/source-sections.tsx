import { label, subheading } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
// "Ownership: Ensure…" → bold lead-in. The source wording is never altered.
function Line({ text }: { text: string }) {
  const match = text.trim().match(/^([A-Z][^:.]{1,60}):\s([\s\S]+)$/);
  if (!match) return <>{text.trim()}</>;
  return (
    <>
      <strong className="font-semibold text-ink">{match[1]}:</strong>{" "}
      {match[2]}
    </>
  );
}
export function SourceParagraphs({ lines }: { lines: string[] }) {
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("•")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("•"))
        items.push(lines[i++].slice(1));
      i--;
      blocks.push(
        <ul key={i} className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-[0.7em] size-1.5 shrink-0 bg-forest"
              />
              <span>
                <Line text={item} />
              </span>
            </li>
          ))}
        </ul>,
      );
    } else
      blocks.push(
        <p key={i}>
          <Line text={lines[i]} />
        </p>,
      );
  }
  return (
    <div className="space-y-5 font-serif text-lg leading-[1.75] text-ink/85 md:text-xl">
      {blocks}
    </div>
  );
}
export function SourceSections({
  sections,
  numbered = false,
}: {
  sections: { title: string; paragraphs: string[] }[];
  numbered?: boolean;
}) {
  return (
    <div>
      {sections.map((section, i) => (
        <section
          key={section.title}
          id={`section-${i + 1}`}
          className="scroll-mt-28 border-t border-ink/15 py-10 first:border-t-0 first:pt-0 md:py-12"
        >
          {numbered && (
            <p className={cn(label, "mb-3 text-rust")}>
              {String(i + 1).padStart(2, "0")}
            </p>
          )}
          <h2 className={cn(subheading, "mb-6")}>{section.title}</h2>
          <SourceParagraphs lines={section.paragraphs} />
        </section>
      ))}
    </div>
  );
}
