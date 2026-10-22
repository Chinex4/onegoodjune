import { submissionLines, getSections } from "@/content/pages";
import {
  Container,
  PageIntro,
  sectionSpace,
} from "@/components/site/primitives";
import { SourceSections } from "@/components/editorial/source-sections";
import { ActionLink } from "@/components/site/action-link";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Submissions",
  "Guidelines for sharing your fiction, poetry, essays and creative nonfiction with OneGoodJune.",
  "/submissions",
);
export default function Submissions() {
  const sections = getSections(submissionLines.slice(2, -1), (s) =>
    /^[A-Z' ]+$/.test(s),
  );
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="Share your work"
          title={submissionLines[0]}
          description={submissionLines[1]}
        />
        <div className={`${sectionSpace} mx-auto max-w-3xl`}>
          <SourceSections sections={sections} />
          <div className="mt-10">
            <ActionLink href={site.links.submissions}>
              Submit Your Work
            </ActionLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
