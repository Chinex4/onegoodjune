import { policySections } from "@/content/pages";
import { Container, PageIntro } from "@/components/site/primitives";
import { SourceSections } from "@/components/editorial/source-sections";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Privacy Policy",
  "OneGoodJune privacy policy. Effective Oct 19, 2026.",
  "/privacy-policy",
);
export default function Privacy() {
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="OneGoodJune · Effective Oct 19, 2026"
          title="Privacy Policy"
        />
        <div className="grid gap-12 py-16 lg:grid-cols-[260px_minmax(0,1fr)]">
          <nav
            aria-label="Policy sections"
            className="self-start border-l border-ink/20 pl-5 lg:sticky lg:top-8"
          >
            <ol className="space-y-1">
              {policySections.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#section-${i + 1}`}
                    className="block py-2 font-sans text-xs leading-relaxed hover:text-forest"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-3xl">
            <SourceSections sections={policySections} />
          </div>
        </div>
      </Container>
    </main>
  );
}
