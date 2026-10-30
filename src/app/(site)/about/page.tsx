import Image from "next/image";
import { about } from "@/content/pages";
import {
  Container,
  Eyebrow,
  PageIntro,
  heading,
  subheading,
  label,
  lead,
  prose,
  sectionSpace,
  title,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { ActionLink } from "@/components/site/action-link";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  "About",
  "Born out of necessity. Built on candid insights. Run on divine adventure.",
  "/about",
);
const stopColors = ["text-forest", "text-orange", "text-rust"];
const portraitTints = [
  "bg-lime/45",
  "bg-straw/70",
  "bg-sunshine/45",
  "bg-sage/55",
];
export default function About() {
  const [lead1, ...story] = about.opening.slice(3);
  const pullQuote = story.at(-1)?.split(". ").slice(0, 3).join(". ") + ".";
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="Our story"
          // Reading font, sized so each statement holds one line on phones.
          titleClassName="font-serif text-[1.375rem] font-semibold leading-[1.3] min-[360px]:text-[1.5rem] sm:text-[2.125rem] lg:text-[2.625rem]"
          title={about.opening.slice(0, 3).map((line, i) => (
            <span key={line} className="block whitespace-nowrap">
              {line.replace(/\.$/, "")}
              <span className={stopColors[i]}>.</span>
            </span>
          ))}
        />
        <section className="grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <figure className="border-l-4 border-orange pl-6 lg:sticky lg:top-32">
              <blockquote className="font-heading text-[1.75rem] leading-[1.15] tracking-[-0.015em] md:text-[2rem]">
                {pullQuote}
              </blockquote>
              <figcaption className={cn(label, "mt-5 text-ink/60")}>
                Born out of necessity
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-6">
              <p className={cn(prose, "text-ink/85")}>{lead1}</p>
              {story.map((p) => (
                <p key={p} className={cn(prose, "text-ink/85")}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </section>
      </Container>
      <section className="bg-forest py-16 text-white [--focus-ring:var(--color-lime)] md:py-20">
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="text-white" swatch="bg-lime">
              Our mission
            </Eyebrow>
            <h2 className={cn(subheading, "mt-5")}>A Simple Quest</h2>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7 lg:col-start-6">
            <p className={lead}>{about.mission}</p>
          </Reveal>
        </Container>
      </section>
      <Container className={sectionSpace}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6">
            <Eyebrow className="text-forest">
              The people behind the quest
            </Eyebrow>
            <h2 className={cn(heading, "mt-6")}>Adventure Builders</h2>
          </div>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {about.team.map((person, i) => {
            const photo = site.assets.team[i];
            return (
              <Reveal key={person.name} delay={(i % 4) * 0.06}>
                <article>
                  <div
                    className={cn(
                      "relative flex aspect-[4/5] items-end overflow-hidden p-4",
                      photo ? "bg-mist" : portraitTints[i],
                    )}
                  >
                    {photo ? (
                      <Image
                        src={photo}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center font-heading text-[4.5rem] leading-none text-ink/80"
                        >
                          {person.name
                            .replace(/^‘/, "")
                            .split(" ")
                            .map((x) => x[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <p className="relative bg-white/80 px-2.5 py-1.5 font-sans text-[0.6875rem] text-ink/70">
                          Photograph to be supplied
                        </p>
                      </>
                    )}
                  </div>
                  <p className={cn(label, "mt-6 text-forest")}>{person.role}</p>
                  <h3 className={cn(title, "mt-3")}>{person.name}</h3>
                  <p className="mt-3 font-serif text-lg leading-[1.6] text-ink/80">
                    {person.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
      {/* A soft sunshine tint: the full-strength orange read as too loud. */}
      <section className="border-t-4 border-sunshine bg-sunshine/15 py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className={heading}>Start your own adventure</h2>
            <p className={cn(lead, "mt-6 max-w-xl")}>
              Read our literary publications or start building your creative
              life
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <ActionLink href="/read-pubs">Read OGJ Stacks</ActionLink>
            <ActionLink href="/school-of-growth" variant="outline">
              Join SOG
            </ActionLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
