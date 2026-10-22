import Image from "next/image";
import {
  Container,
  PageIntro,
  heading,
  Eyebrow,
  sectionSpace,
} from "@/components/site/primitives";
import { ProgramAction } from "@/components/site/program-action";
import { home } from "@/content/home";
import { site } from "@/lib/site-config";
import { Reveal } from "@/components/site/reveal";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "School of Growth",
  home.growth.description,
  "/school-of-growth",
);
export default function Growth() {
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="Personal leadership & branding"
          title="School of Growth Program"
          description={home.growth.description}
        >
          <div className="mt-9">
            <ProgramAction
              href={site.links.enrollment}
              label="Enroll Today"
              kind="enrollment"
            />
          </div>
        </PageIntro>
      </Container>
      <section className={`${sectionSpace} bg-lime`}>
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <Eyebrow>Strategy & stewardship</Eyebrow>
            <h2 className={`${heading} mt-8`}>
              Real systems
              <br />
              for growth.
            </h2>
            <p className="mt-8 text-xl leading-relaxed">
              {home.services[1].description}
            </p>
          </Reveal>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={site.assets.growth}
              alt="Books and a notebook on a creative workspace"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
      <Container className="py-20">
        <Eyebrow>Program information</Eyebrow>
        <h2 className={`${heading} mt-8`}>
          Build your career.
          <br />
          Grow your personal brand.
        </h2>
        <div className="mt-10 max-w-2xl border-y border-ink/15 py-8">
          <p className="font-sans text-xs uppercase tracking-widest">
            Content to be supplied
          </p>
          <p className="mt-4 text-xl leading-relaxed">
            Full program details, schedule, delivery format, and enrollment
            information will be added here.
          </p>
        </div>
      </Container>
    </main>
  );
}
