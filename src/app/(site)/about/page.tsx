import Image from "next/image";
import { about } from "@/content/pages";
import {
  Container,
  PageIntro,
  heading,
  subheading,
  Eyebrow,
  sectionSpace,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { ActionLink } from "@/components/site/action-link";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "About",
  "Born out of necessity. Built on candid insights. Run on divine adventure.",
  "/about",
);
export default function About() {
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="Our story"
          title={about.opening.slice(0, 3).join("\n")}
        />
        <section className="grid gap-10 py-16 md:grid-cols-[.5fr_1fr]">
          <Eyebrow>Born out of necessity</Eyebrow>
          <Reveal>
            <div className="max-w-3xl space-y-6 text-base leading-[1.8] md:text-lg">
              {about.opening.slice(3).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>
      </Container>
      <section className={`${sectionSpace} bg-straw`}>
        <Container className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <h2 className={heading}>A Simple Quest</h2>
          </Reveal>
          <p className="text-lg leading-[1.75]">{about.mission}</p>
        </Container>
      </section>
      <Container className={sectionSpace}>
        <Eyebrow>The people behind the quest</Eyebrow>
        <h2 className={`${heading} mt-8 mb-16`}>Adventure Builders</h2>
        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
          {about.team.map((person, i) => {
            const photo = site.assets.team[i];
            return (
              <Reveal key={person.name} delay={(i % 2) * 0.1}>
                <article>
                  <div className="relative mb-8 flex aspect-[4/3] items-end overflow-hidden bg-ink/5 p-6">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center font-heading text-5xl text-forest/70"
                        >
                          {person.name
                            .replace(/^‘/, "")
                            .split(" ")
                            .map((x) => x[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <p className="relative bg-paper px-3 py-2 font-sans text-[10px] text-ink/70">
                          Photograph to be supplied
                        </p>
                      </>
                    )}
                  </div>
                  <Eyebrow className="text-forest">{person.role}</Eyebrow>
                  <h3 className={`${subheading} mt-6`}>{person.name}</h3>
                  <p className="mt-5 max-w-lg text-lg leading-relaxed">
                    {person.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
      <section className="bg-lime py-20">
        <Container>
          <h2 className={heading}>Start your own adventure</h2>
          <p className="my-7 text-lg leading-[1.75]">
            Read our literary publications or start building your creative life
          </p>
          <div className="flex flex-wrap gap-4">
            <ActionLink href="/read-pubs">Read OGJ Stacks</ActionLink>
            <ActionLink href="/school-of-growth">Join SOG</ActionLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
