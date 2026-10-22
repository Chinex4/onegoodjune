import Image from "next/image";
import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { Reveal, HeroWordmark, HoverFrame } from "@/components/site/reveal";
import { ActionLink } from "@/components/site/action-link";
import {
  Container,
  Eyebrow,
  heading,
  subheading,
  sectionSpace,
  TextLink,
} from "@/components/site/primitives";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: {
    absolute:
      "OneGoodJune — A creative studio for faith-based African visionaries",
  },
  alternates: { canonical: "/" },
};
export default function Home() {
  return (
    <main id="main-content">
      <section id="studio">
        <Container className="pb-8 pt-8">
          <div className="flex items-center justify-between">
            <Eyebrow>Creative studio · Lagos, Nigeria</Eyebrow>
            <a
              href="#what-we-do"
              className="hidden items-center gap-3 font-sans text-[10px] tracking-widest uppercase sm:flex"
            >
              A little introduction
              <ArrowDown size={14} />
            </a>
          </div>
          <h1 className="mb-8 mt-16 font-heading font-normal">
            <span className="block text-[24px] leading-[2] tracking-[-0.04em] md:text-[32px]">
              We Are
            </span>
            <HeroWordmark />
          </h1>
          <Reveal delay={0.15}>
            <div className="grid gap-7 md:grid-cols-[.6fr_2.2fr_80px]">
              <span className="hidden pt-3 font-sans text-[10px] text-ink/70 md:block">
                (01 — 03)
              </span>
              <div>
                <p className="max-w-3xl text-2xl leading-relaxed tracking-[-0.015em] lg:text-[30px]">
                  {home.introduction}
                </p>
                <div className="mt-7">
                  <TextLink href="#experience">Explore Our Work</TextLink>
                </div>
              </div>
              <a
                href="#experience"
                aria-label="Explore our work"
                className="group hidden size-20 items-center justify-center rounded-full border border-ink transition-colors hover:bg-lime md:flex"
              >
                <ArrowUpRight
                  size={36}
                  strokeWidth={1.2}
                  className="transition-transform duration-500 motion-safe:group-hover:rotate-45"
                />
              </a>
            </div>
          </Reveal>
          <div className="mt-16 flex justify-between font-sans text-[9px] uppercase tracking-widest text-ink/70">
            <span>Lagos, Nigeria</span>
            <ArrowDown size={14} />
          </div>
        </Container>
      </section>
      <section id="what-we-do" className={cn(sectionSpace, "bg-straw")}>
        <Container>
          <Reveal>
            <div className="grid items-end gap-10 md:grid-cols-2 md:gap-20">
              <div>
                <Eyebrow>In a nutshell</Eyebrow>
                <h2 className={cn(heading, "mt-8")}>
                  What
                  <br />
                  We Do.
                </h2>
              </div>
              <p className="max-w-xl text-2xl leading-relaxed">
                {home.whatWeDo}
              </p>
            </div>
          </Reveal>
          <div className="mt-14 border-b border-ink/30">
            {home.services.map((service, i) => (
              <Reveal key={service.number} delay={i * 0.07}>
                <article className="group grid grid-cols-[24px_minmax(0,1fr)] gap-x-5 gap-y-6 border-t border-ink/30 py-9 md:grid-cols-[.15fr_.9fr_1fr] md:gap-8">
                  <span className="pt-2 font-sans text-xs transition-colors group-hover:text-forest">
                    {service.number}.
                  </span>
                  <h3 className={cn(subheading, "text-[18px] sm:text-[21px]")}>
                    {service.title}
                  </h3>
                  <div className="col-start-2 text-lg leading-relaxed md:col-start-auto">
                    <p className="mb-3 text-xl italic">{service.tagline}</p>
                    <p>{service.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <section id="experience" className={sectionSpace}>
        <Container>
          <Reveal>
            <div className="mb-14 flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Explore our work</Eyebrow>
                <h2 className={cn(heading, "mt-8")}>
                  Experience
                  <br />
                  <span className="text-forest">OneGoodJune.</span>
                </h2>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="hidden size-20 md:block"
                strokeWidth={1}
              />
            </div>
          </Reveal>
          <div className="space-y-8">
            <Reveal>
              <HoverFrame>
                <article
                  id="fiction"
                  className="group grid overflow-hidden bg-ink/5 md:grid-cols-2"
                >
                  <div className="relative min-h-80 overflow-hidden">
                    <Image
                      src={site.assets.writing}
                      alt="A writer putting pen to paper in an open notebook"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                    />
                    <span className="absolute bottom-6 left-6 bg-paper px-4 py-2 text-base italic">
                      The art of a story that stays.
                    </span>
                  </div>
                  <div className="flex flex-col items-start justify-center p-7 lg:p-12">
                    <Eyebrow>01 / Fiction writing · Q1 2027</Eyebrow>
                    <h3 className={cn(subheading, "mt-8")}>
                      {home.fiction.title}
                    </h3>
                    <p className="my-7 text-xl leading-relaxed">
                      {home.fiction.description}
                    </p>
                    <ActionLink href="/fiction-writing">
                      Join the waitlist – 50% OFF
                    </ActionLink>
                  </div>
                </article>
              </HoverFrame>
            </Reveal>
            <Reveal>
              <HoverFrame>
                <article
                  id="growth"
                  className="group grid overflow-hidden bg-lime md:grid-cols-2"
                >
                  <div className="order-2 flex flex-col items-start justify-center p-7 md:order-1 lg:p-12">
                    <Eyebrow>02 / Personal leadership & branding</Eyebrow>
                    <h3 className={cn(subheading, "mt-8")}>
                      {home.growth.title}
                    </h3>
                    <p className="my-7 text-xl leading-relaxed">
                      {home.growth.description}
                    </p>
                    <ActionLink href="/school-of-growth">
                      Enroll Today
                    </ActionLink>
                  </div>
                  <div className="relative order-1 flex min-h-80 items-center justify-center overflow-hidden bg-forest p-8 text-lime md:order-2">
                    <Image
                      src={site.assets.growth}
                      alt="An open notebook and books on a creative workspace"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover opacity-15 mix-blend-luminosity transition-transform duration-700 motion-safe:group-hover:scale-105"
                    />
                    <div className="relative" aria-hidden="true">
                      <div className="font-heading text-[25px] leading-[1.95] tracking-[-0.05em] lg:text-[36px]">
                        School
                        <br />
                        of Growth
                      </div>
                      <p className="mt-7 border-t border-lime/40 pt-5 text-lg leading-relaxed">
                        Build your career.
                        <br />
                        Grow your personal brand.
                      </p>
                    </div>
                  </div>
                </article>
              </HoverFrame>
            </Reveal>
            <Reveal>
              <article
                id="publications"
                className="grid items-center gap-12 bg-ink p-8 text-paper md:grid-cols-2 lg:gap-20 lg:p-14"
              >
                <HoverFrame className="mx-auto w-full max-w-sm">
                  <div
                    aria-hidden="true"
                    className="-rotate-3 border-l-8 border-earth/15 bg-[#f4f0df] p-6 text-earth transition-transform duration-500 motion-safe:hover:rotate-0"
                  >
                    <div className="flex justify-between gap-4 border-b border-earth/30 pb-4 font-sans text-[8px] tracking-wider uppercase">
                      <span>OneGoodJune</span>
                      <span>Literary Magazine</span>
                    </div>
                    <div className="py-10 font-heading text-[26px] leading-[1.8] tracking-[-0.05em] lg:text-[36px]">
                      Stories
                      <br />
                      that stir.
                      <br />
                      <em className="font-serif text-[1.3em]">And stick.</em>
                    </div>
                    <p className="border-t border-earth/30 pt-4 font-sans text-[8px] uppercase">
                      Fiction / Poetry / Essays / Creative nonfiction
                    </p>
                  </div>
                </HoverFrame>
                <div>
                  <Eyebrow className="text-lime">
                    03 / Our literary publication
                  </Eyebrow>
                  <h3 className={cn(subheading, "mt-8")}>
                    {home.magazine.title}
                  </h3>
                  <p className="my-7 text-xl leading-relaxed">
                    {home.magazine.description}
                  </p>
                  <ActionLink href="/read-pubs" variant="light">
                    Read Your First
                  </ActionLink>
                </div>
              </article>
            </Reveal>
          </div>
        </Container>
      </section>
      <section id="community" className={cn(sectionSpace, "bg-lime")}>
        <Container className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <Eyebrow>Join our community</Eyebrow>
            <h2 className={cn(heading, "mt-8")}>
              Join
              {/* <br /> */}
              <em className="font-serif text-[1.7em]"> Our</em>
              <br />
              Community.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-2xl leading-relaxed">
              {home.newsletter.description}
            </p>
            <p className="mt-6 flex items-baseline gap-3 font-sans text-[11px] leading-relaxed">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-forest"
              />
              {home.newsletter.subscribers}
            </p>
            <iframe
              src={site.links.newsletterEmbed}
              title="Subscribe to the OneGoodJune newsletter on Substack"
              width="480"
              height="150"
              loading="lazy"
              className="my-6 h-[150px] w-full max-w-[480px] border-0 bg-transparent"
            />
            <TextLink href={site.links.newsletter}>
              Read the Newsletter
            </TextLink>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
