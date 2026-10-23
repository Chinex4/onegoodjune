import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { Reveal } from "@/components/site/reveal";
import {
  ArrowIcon,
  ColorBar,
  Container,
  Eyebrow,
  TextLink,
  buttonStyles,
  heading,
  label,
  lead,
  meta,
  prose,
  subheading,
  title,
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
// Sunshine marks storytelling, Earthy Green marks growth; straw sits between.
const serviceAccents = [
  { number: "text-orange", tagline: "text-sunshine", rule: "bg-orange" },
  { number: "text-lime", tagline: "text-lime", rule: "bg-lime" },
  { number: "text-straw", tagline: "text-straw", rule: "bg-straw" },
];
const experiences = [
  {
    ...home.fiction,
    href: "/fiction-writing",
    kind: "Course · Launching Q1 2027",
    action: "Join the waitlist",
    card: "bg-black text-white hover:bg-orange hover:text-ink",
    kicker: "text-sunshine group-hover:text-ink",
    pill: "bg-orange text-ink group-hover:bg-ink group-hover:text-white",
  },
  {
    ...home.growth,
    href: "/school-of-growth",
    kind: "Program · Career & personal brand",
    action: "Enroll today",
    card: "bg-white text-ink ring-2 ring-inset ring-ink hover:bg-lime",
    kicker: "text-forest group-hover:text-ink",
    pill: "bg-lime text-ink group-hover:bg-ink group-hover:text-white",
  },
  {
    ...home.magazine,
    href: "/read-pubs",
    kind: "Read Pubs · Literary magazine",
    action: "Read your first",
    card: "bg-black text-white hover:bg-straw hover:text-ink",
    kicker: "text-straw group-hover:text-ink",
    pill: "bg-straw text-ink group-hover:bg-ink group-hover:text-white",
  },
];
export default function Home() {
  return (
    <main id="main-content">
      <section id="studio">
        <Container className="pb-20 pt-14 md:pb-28 md:pt-20 lg:pt-24">
          {/* Inline-block so the palette strip matches the wordmark's width. */}
          <div className="inline-block max-w-full">
            <h1 className="font-heading font-normal">
              <span className="block text-[1.75rem] leading-none tracking-[-0.02em] motion-safe:animate-rise md:text-[2.25rem]">
                We Are
              </span>
              <span className="mt-2 block whitespace-nowrap text-[clamp(2.5rem,14.4vw,7.5rem)] leading-[1.02] tracking-[-0.035em] motion-safe:animate-rise md:mt-3">
                ONEGOODJUNE
              </span>
            </h1>
            <ColorBar animated className="mt-5 h-2.5 md:mt-6" />
          </div>
          <div className="mt-14 grid gap-8 border-t border-ink/15 pt-10 md:mt-20 md:grid-cols-12 md:gap-10 md:pt-12">
            <p
              className={cn(
                label,
                "text-ink/70 md:col-span-4 md:pt-2 lg:col-span-3",
              )}
            >
              A creative studio
              <br />
              Lagos, Nigeria
            </p>
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <p className={cn(lead, "max-w-3xl md:text-[1.875rem]")}>
                {home.introduction}
              </p>
              <a
                href="#experience"
                className={buttonStyles("ink", "mt-9 gap-10")}
              >
                Explore Our Work
                <ArrowIcon Icon={ArrowDown} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section id="what-we-do" className="ground-dark py-20 md:py-28">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-4">
              <h2 className={heading}>
                What
                <br />
                We Do<span className="text-lime">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-8 lg:col-start-5">
              <p className={cn(lead, "max-w-3xl text-white/85")}>
                {home.whatWeDo}
              </p>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-12">
            {home.services.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.08}>
                <article>
                  <span
                    aria-hidden="true"
                    className={cn("block h-1 w-12", serviceAccents[i].rule)}
                  />
                  <p
                    className={cn(
                      "mt-6 font-heading text-[2.75rem] leading-none",
                      serviceAccents[i].number,
                    )}
                  >
                    {service.number}.
                  </p>
                  <h3 className={cn(title, "mt-6")}>{service.title}</h3>
                  <p
                    className={cn(
                      "mt-3 font-serif text-xl italic",
                      serviceAccents[i].tagline,
                    )}
                  >
                    {service.tagline}
                  </p>
                  <p className="mt-4 font-serif text-lg leading-[1.7] text-white/75">
                    {service.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="experience" className="py-20 md:py-28">
        <Container>
          <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
            <h2 className={heading}>
              Experience
              <br className="sm:hidden" /> OneGoodJune
              <span className="text-forest">.</span>
            </h2>
            <ArrowDown
              className="mb-2 hidden shrink-0 sm:block"
              size={26}
              strokeWidth={1.3}
              aria-hidden="true"
            />
          </div>
          <ol className="space-y-3">
            {experiences.map((item, i) => (
              <li key={item.href}>
                <Reveal delay={i * 0.05}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group grid gap-8 p-7 transition-colors duration-300 ease-out-soft sm:p-9 md:grid-cols-12 md:items-center md:gap-10 lg:p-12",
                      item.card,
                    )}
                  >
                    <div className="md:col-span-8">
                      <p
                        className={cn(
                          label,
                          "transition-colors duration-300",
                          item.kicker,
                        )}
                      >
                        {String(i + 1).padStart(2, "0")} — {item.kind}
                      </p>
                      <h3 className={cn(subheading, "mt-5")}>{item.title}</h3>
                      <p className={cn(prose, "mt-4 max-w-2xl opacity-80")}>
                        {item.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex min-h-12 items-center justify-between gap-6 justify-self-start px-6 py-3 font-sans text-[0.8125rem] font-medium font-stretch-semi-expanded transition-colors duration-300 md:col-span-4 md:justify-self-end",
                        item.pill,
                      )}
                    >
                      {item.action}
                      <ArrowUpRight
                        aria-hidden="true"
                        size={17}
                        className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="community" className="pb-20 md:pb-28">
        <Container>
          <div className="grid gap-12 border-t border-ink/15 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <Eyebrow className="text-forest">Newsletter</Eyebrow>
              <h2 className={cn(heading, "mt-6")}>
                Join Our
                <br />
                Community<span className="text-orange">.</span>
              </h2>
              <p className={cn(lead, "mt-7 max-w-md text-ink/80")}>
                {home.newsletter.description}
              </p>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
              {/* Substack centres its form, so the panel is centred to match. */}
              <div className="flex flex-col items-center bg-paper px-5 py-10 text-center sm:px-10 sm:py-12">
                <p>
                  <span className="block font-heading text-[3.5rem] leading-none tracking-[-0.03em] text-forest md:text-[4.5rem]">
                    {home.newsletter.subscribers.split(" ")[0]}
                  </span>
                  <span className={cn(meta, "mt-3 block text-ink/75")}>
                    {home.newsletter.subscribers.split(" ").slice(1).join(" ")}
                  </span>
                </p>
                <iframe
                  src={site.links.newsletterEmbed}
                  title="Subscribe to the OneGoodJune newsletter on Substack"
                  loading="lazy"
                  width={480}
                  height={150}
                  className="mt-6 h-[150px] w-full max-w-[30rem] border-0 bg-transparent"
                />
                <TextLink href={site.links.newsletter} className="mt-2">
                  Read the Newsletter
                </TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </main>
  );
}
