import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { Reveal } from "@/components/site/reveal";
import {
  ArrowIcon,
  ColorBar,
  Container,
  buttonStyles,
  heading,
  label,
  lead,
  prose,
  title,
} from "@/components/site/primitives";
import { NewsletterSection } from "@/components/site/newsletter";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute:
      "ONEGOODJUNE — A creative studio for faith-based African visionaries",
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
    image: "/images/home/experience-fiction.jpg",
    kind: "Course · Launching Q1 2027",
    action: "Join the waitlist",
    card: "bg-black text-white hover:bg-orange hover:text-ink",
    kicker: "text-sunshine group-hover:text-ink",
    pill: "bg-orange text-ink group-hover:bg-ink group-hover:text-white",
  },
  {
    ...home.growth,
    href: "/school-of-growth",
    image: "/images/home/experience-growth.jpg",
    kind: "Program · Career & personal brand",
    action: "Enroll today",
    card: "bg-white text-ink ring-2 ring-inset ring-ink hover:bg-lime",
    kicker: "text-forest group-hover:text-ink",
    pill: "bg-lime text-ink group-hover:bg-ink group-hover:text-white",
  },
  {
    ...home.magazine,
    href: "/read-pubs",
    image: "/images/home/experience-magazine.jpg",
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
        <Container className="grid gap-12 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-20">
          <div className="lg:col-span-7">
            {/* Inline-block so the palette strip matches the wordmark's width. */}
            <div className="inline-block max-w-full">
              <h1 className="font-normal">
                <span className="block font-serif text-[1.5rem] leading-none motion-safe:animate-rise md:text-[1.875rem]">
                  We Are
                </span>
                <span className="mt-2 block whitespace-nowrap font-heading text-[clamp(2.25rem,13.4vw,5.75rem)] leading-[1.02] tracking-[-0.035em] motion-safe:animate-rise md:mt-3">
                  ONEGOODJUNE
                </span>
              </h1>
              <ColorBar animated className="mt-4 h-2 md:mt-5" />
            </div>
            <p className={cn(lead, "mt-8 max-w-2xl md:mt-10")}>
              {home.introduction}
            </p>
            <a
              href="#experience"
              className={buttonStyles("ink", "mt-8 gap-10")}
            >
              Explore Our Work
              <ArrowIcon Icon={ArrowDown} />
            </a>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden bg-mist lg:col-span-5">
            <Image
              src="/images/home/hero.jpg"
              alt="Five women of the ONEGOODJUNE community"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section id="what-we-do" className="ground-dark py-20 md:py-28">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-4">
              <h2 className={heading}>
                <span className="font-serif font-normal">What</span>
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
                      "mt-5 font-heading text-[2.25rem] leading-none",
                      serviceAccents[i].number,
                    )}
                  >
                    {service.number}.
                  </p>
                  <h3 className={cn(title, "mt-6")}>{service.title}</h3>
                  <p
                    className={cn(
                      "mt-3 font-serif text-lg italic",
                      serviceAccents[i].tagline,
                    )}
                  >
                    {service.tagline}
                  </p>
                  <p className="mt-4 font-serif text-[1.0625rem] leading-[1.7] text-white/75">
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
              <span className="font-serif font-normal">Experience</span>
              <br className="sm:hidden" /> ONEGOODJUNE
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
                      "group grid gap-6 p-4 transition-colors duration-300 ease-out-soft sm:p-5 md:grid-cols-12 md:items-center md:gap-8 lg:p-6",
                      item.card,
                    )}
                  >
                    <div className="relative aspect-[852/572] overflow-hidden bg-mist md:col-span-4">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="px-2 pb-2 md:col-span-5 md:p-0">
                      <p
                        className={cn(
                          label,
                          "transition-colors duration-300",
                          item.kicker,
                        )}
                      >
                        {String(i + 1).padStart(2, "0")} — {item.kind}
                      </p>
                      <h3 className="mt-3 font-serif text-[1.5rem] font-semibold leading-tight md:text-[1.75rem]">
                        {item.title}
                      </h3>
                      <p className={cn(prose, "mt-3 opacity-80")}>
                        {item.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "mx-2 mb-2 inline-flex min-h-12 items-center justify-between gap-6 justify-self-start px-6 py-3 font-sans text-[0.8125rem] font-medium font-stretch-semi-expanded transition-colors duration-300 md:col-span-3 md:m-0 md:mr-4 md:justify-self-end",
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

      <NewsletterSection />
    </main>
  );
}
