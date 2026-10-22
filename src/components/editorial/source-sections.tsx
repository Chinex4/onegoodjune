import { subheading } from "@/components/site/primitives";
export function SourceParagraphs({ lines }: { lines: string[] }) {
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("•")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("•"))
        items.push(lines[i++].slice(1));
      i--;
      blocks.push(
        <ul key={i} className="list-disc space-y-3 pl-6">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>,
      );
    } else blocks.push(<p key={i}>{lines[i]}</p>);
  }
  return (
    <div className="space-y-5 text-lg leading-[1.85] md:text-xl">{blocks}</div>
  );
}
export function SourceSections({
  sections,
}: {
  sections: { title: string; paragraphs: string[] }[];
}) {
  return (
    <div>
      {sections.map((section, i) => (
        <section
          key={section.title}
          id={`section-${i + 1}`}
          className="scroll-mt-8 border-b border-ink/15 py-10 first:pt-0"
        >
          <h2 className={`${subheading} mb-6`}>{section.title}</h2>
          <SourceParagraphs lines={section.paragraphs} />
        </section>
      ))}
    </div>
  );
}
