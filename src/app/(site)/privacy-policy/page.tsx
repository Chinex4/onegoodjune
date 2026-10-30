import { policySections } from "@/content/pages";
import { NewsletterSection } from "@/components/site/newsletter";
import { Container, PageIntro, label } from "@/components/site/primitives";
import { SourceSections } from "@/components/editorial/source-sections";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
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
        <div className="grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
          <nav
            aria-label="Policy sections"
            className="self-start lg:sticky lg:top-28 lg:col-span-3"
          >
            <p className={cn(label, "mb-4 text-ink/60")}>Contents</p>
            <ol className="grid border-l border-ink/15 sm:grid-cols-2 lg:grid-cols-1">
              {policySections.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#section-${i + 1}`}
                    className="-ml-px flex min-h-10 items-center border-l-2 border-transparent py-1.5 pl-4 font-sans text-[0.8125rem] leading-snug text-ink/75 transition-colors hover:border-forest hover:text-forest"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
            <SourceSections sections={policySections} />
          </div>
        </div>
      </Container>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
