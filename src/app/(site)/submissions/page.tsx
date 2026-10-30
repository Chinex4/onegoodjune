import { Mail } from "lucide-react";
import { NewsletterSection } from "@/components/site/newsletter";
import { submissionLines, getSections } from "@/content/pages";
import {
  Container,
  PageIntro,
  label,
  sectionSpace,
} from "@/components/site/primitives";
import { SourceSections } from "@/components/editorial/source-sections";
import { ActionLink } from "@/components/site/action-link";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  "Submissions",
  "Guidelines for sharing your fiction, poetry, essays and creative nonfiction with OneGoodJune.",
  "/submissions",
);
// "•Your email subject: Creative Submission – Your Name" → value after the colon.
function ruleValue(lines: string[], prefix: string) {
  const line = lines.find((l) => l.startsWith(`•${prefix}`));
  return line?.slice(line.indexOf(":") + 1).trim() ?? "";
}
export default function Submissions() {
  const body = submissionLines.slice(2, -1);
  const sections = getSections(body, (s) => /^[A-Z' ]+$/.test(s)).map(
    (section) => ({
      ...section,
      // Source headings are set in capitals; title-case them for display.
      title: section.title
        .toLowerCase()
        .replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
    }),
  );
  const subject = ruleValue(body, "Your email subject");
  const filename = ruleValue(body, "Document name");
  const email = site.links.submissions.replace("mailto:", "");
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="Share your work"
          accent="text-rust"
          title={submissionLines[0]}
          description={submissionLines[1]}
        />
        <div
          className={cn(sectionSpace, "grid gap-14 lg:grid-cols-12 lg:gap-10")}
        >
          <div className="lg:col-span-7">
            <SourceSections sections={sections} numbered />
          </div>
          <aside
            aria-label="How to submit"
            className="lg:col-span-4 lg:col-start-9"
          >
            <div className="ground-dark p-7 sm:p-9 lg:sticky lg:top-32">
              <p className={cn(label, "text-sunshine")}>Send your work to</p>
              <a
                href={site.links.submissions}
                className="mt-3 inline-flex min-h-11 items-center gap-3 break-all font-serif text-xl underline decoration-white/30 underline-offset-[6px] hover:text-sunshine hover:decoration-sunshine"
              >
                <Mail size={18} aria-hidden="true" className="shrink-0" />
                {email}
              </a>
              <dl className="mt-7 space-y-5 border-t border-white/15 pt-6">
                <div>
                  <dt className={cn(label, "text-white/55")}>Email subject</dt>
                  <dd className="mt-1.5 font-serif text-lg">{subject}</dd>
                </div>
                <div>
                  <dt className={cn(label, "text-white/55")}>Document name</dt>
                  <dd className="mt-1.5 break-words font-serif text-lg">
                    {filename}
                  </dd>
                </div>
              </dl>
              <ActionLink
                href={`${site.links.submissions}?subject=${encodeURIComponent(subject)}`}
                variant="sunshine"
                icon={Mail}
                className="mt-8 w-full"
              >
                Submit Your Work
              </ActionLink>
            </div>
          </aside>
        </div>
      </Container>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
