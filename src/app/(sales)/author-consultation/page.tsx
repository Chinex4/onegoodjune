import Image from "next/image";
import { Check } from "lucide-react";
import {
  ColorBar,
  Container,
  Eyebrow,
  heading,
  label,
  lead,
  prose,
  subheading,
  title,
} from "@/components/site/primitives";
import { EnrollButton, EnrollDialog } from "@/components/site/enroll";
import { Reveal } from "@/components/site/reveal";
import { StickyCta } from "@/components/site/sticky-cta";
import { consultation as c } from "@/content/consultation";
import { getProgram } from "@/lib/programs";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  "Author Business Consultation",
  c.subtitle,
  "/author-consultation",
);
function Terms({ className = "" }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-wrap gap-x-3 gap-y-1 font-sans text-sm font-medium",
        className,
      )}
    >
      {c.terms.map((term, i) => (
        <span key={term} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true">·</span>}
          {term}
        </span>
      ))}
    </p>
  );
}
function Book({
  variant = "white",
  className = "",
}: {
  variant?: "white" | "ink" | "sunshine";
  className?: string;
}) {
  return (
    <EnrollButton
      program="author-consultation"
      variant={variant}
      className={cn("gap-8", className)}
    >
      {c.cta}
    </EnrollButton>
  );
}
export default function AuthorConsultation() {
  const program = getProgram("author-consultation")!;
  return (
    <main id="main-content" className="bg-white text-ink">
      <section
        id="hero"
        className="bg-earth text-white [--focus-ring:var(--color-straw)]"
      >
        <Container className="grid items-center gap-12 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow className="text-straw">
              Author Business Consultation
            </Eyebrow>
            <h1 className="mt-6 font-heading text-[2.5rem] leading-[1.04] tracking-[-0.03em] sm:text-[3.25rem] lg:text-[4rem]">
              {c.title}
            </h1>
            <p className={cn(lead, "mt-6 max-w-xl text-white/85")}>
              {c.subtitle}
            </p>
            <Book className="mt-9" />
            <Terms className="mt-5 text-straw" />
          </div>
          <figure className="mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <Image
                src={site.assets.sogCoach}
                alt="Esther Uzoamaka Okoloeze"
                fill
                priority
                sizes="(max-width: 1024px) 384px, 30vw"
                className="object-cover"
              />
            </div>
            <figcaption className={cn(label, "mt-4 text-white/75")}>
              With Esther Uzoamaka Okoloeze
            </figcaption>
          </figure>
        </Container>
        <ColorBar />
      </section>

      <Container>
        <section className="mx-auto max-w-3xl py-16 md:py-24">
          {c.opening.map((line, i) => (
            <p
              key={line}
              className={cn(
                i === 1 || i === c.opening.length - 1
                  ? "font-heading text-[1.375rem] leading-tight tracking-[-0.015em] text-earth md:text-[1.75rem]"
                  : lead,
                i > 0 && "mt-5",
              )}
            >
              {line}
            </p>
          ))}
        </section>
      </Container>

      <section className="bg-paper py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <h2 className={cn(heading, "lg:col-span-5")}>{c.introTitle}</h2>
          <div className="space-y-5 lg:col-span-6 lg:col-start-7">
            {c.intro.map((p) => (
              <p key={p} className={prose}>
                {p}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-24">
          <h2 className={heading}>{c.topicsTitle}</h2>
          <p className={cn(lead, "mt-5 text-ink/80")}>{c.topicsIntro}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.topics.map((topic, i) => (
              <Reveal key={topic.title} delay={(i % 2) * 0.06}>
                <article className="h-full border-t-4 border-earth bg-paper p-6 md:p-8">
                  <h3 className={title}>{topic.title}</h3>
                  <p className={cn(prose, "mt-3 text-ink/85")}>{topic.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 font-serif text-lg italic text-ink/75">
            {c.topicsNote}
          </p>
        </section>

        <section className="grid gap-10 border-t border-ink/15 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className={heading}>{c.outcomesTitle}</h2>
            {c.outcomesIntro.map((p) => (
              <p key={p} className={cn(prose, "mt-5")}>
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="space-y-3">
              {c.outcomes.map((item) => (
                <li key={item} className="flex gap-4 bg-straw/50 p-5">
                  <Check
                    size={20}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-forest"
                  />
                  <span className="font-serif text-lg leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-5">
              {c.outcomesAfter.map((p) => (
                <p key={p} className={cn(prose, "text-ink/85")}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      </Container>

      <section className="ground-dark py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className={heading}>{c.audienceTitle}</h2>
            <p className={cn(prose, "mt-5 text-white/85")}>{c.audienceIntro}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-white/15 border-y border-white/15">
              {c.audience.map((item) => (
                <li key={item} className="flex gap-4 py-4">
                  <Check
                    size={18}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-straw"
                  />
                  <span className="font-serif text-lg leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-serif text-lg italic text-white/75">
              {c.audienceNote}
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-24">
          <h2 className={heading}>{c.stepsTitle}</h2>
          <ol className="mt-10 grid gap-px bg-ink/15 md:grid-cols-3">
            {c.steps.map((step, i) => (
              <li key={step.title} className="bg-white p-6 md:p-8">
                <span className="font-heading text-[2.5rem] leading-none text-earth">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <h3 className={cn(subheading, "mt-5")}>{step.title}</h3>
                <p className={cn(prose, "mt-3 text-ink/85")}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      <section
        id="closing"
        className="bg-earth py-16 text-white [--focus-ring:var(--color-straw)] md:py-24"
      >
        <Container className="max-w-3xl text-center">
          <h2 className={heading}>{c.closingTitle}</h2>
          {c.closing.map((p) => (
            <p key={p} className={cn(lead, "mt-5 text-white/85")}>
              {p}
            </p>
          ))}
          <Book className="mt-10" />
          <Terms className="mt-5 justify-center text-straw" />
        </Container>
      </section>

      <StickyCta watch={["hero", "closing"]}>
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-4 py-3">
          <p className="min-w-0 font-sans text-xs leading-snug text-white/75 sm:text-[0.8125rem]">
            <span className="block truncate font-semibold text-white">
              Author Business Consultation
            </span>
            {program.price} · 60 minutes
          </p>
          <EnrollButton
            program="author-consultation"
            variant="sunshine"
            className="min-h-11 shrink-0 gap-3 px-4"
          >
            Book now
          </EnrollButton>
        </Container>
      </StickyCta>
      <EnrollDialog
        title="Author Business Consultation"
        eyebrow="Book your consultation"
        defaultOption={program.id}
        options={[program].map(({ id, name, price, period }) => ({
          id,
          name,
          price,
          period,
        }))}
      />
    </main>
  );
}
