import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { Reveal, HeroWordmark } from "@/components/site/reveal";
import { Container, heading, TextLink } from "@/components/site/primitives";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute:
      "OneGoodJune — A creative studio for faith-based African visionaries",
  },
  alternates: { canonical: "/" },
};
const experiences = [
  {
    title: home.fiction.title,
    href: "/fiction-writing",
    action: "Join the waitlist",
  },
  {
    title: home.growth.title,
    href: "/school-of-growth",
    action: "Enroll today",
  },
  { title: home.magazine.title, href: "/read-pubs", action: "Read your first" },
];
export default function Home() {
  return (
    <main id="main-content" className="bg-white text-black">
      <section id="studio">
        <Container className="pb-16 pt-12 md:pb-20 md:pt-16">
          <h1 className="font-heading text-[4.7vw] font-normal leading-[2.1] sm:text-[4.8vw] xl:text-[60px]">
            <span className="block text-[17px] leading-[2] md:text-[22px]">
              We Are
            </span>
            <HeroWordmark />
          </h1>
          <div className="mt-8 grid items-start gap-8 md:mt-12 md:grid-cols-[1fr_1.8fr] md:gap-16">
            <p className="max-w-60 font-sans text-sm leading-relaxed">
              A creative studio.
              <br />
              Lagos, Nigeria.
            </p>
            <div>
              <p className="max-w-2xl text-lg leading-[1.7] md:text-xl">
                {home.introduction}
              </p>
              <div className="mt-6">
                <TextLink href="#experience">Explore Our Work</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section id="what-we-do" className="bg-black py-16 text-white md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-[1fr_1.8fr] md:gap-16">
            <Reveal>
              <h2 className={heading}>What We Do.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-2xl text-lg leading-[1.7]">{home.whatWeDo}</p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-x-12 gap-y-10 lg:grid-cols-3 lg:gap-x-14">
            {home.services.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.07}>
                <article>
                  <h3 className="font-sans text-base font-medium">
                    {service.title}
                  </h3>
                  <p className="mb-4 mt-5 text-lg italic">{service.tagline}</p>
                  <p className="text-base leading-[1.75]">
                    {service.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <section id="experience" className="py-16 md:py-24">
        <Container>
          <div className="mb-10 flex items-center justify-between gap-6">
            <h2 className={heading}>Experience OneGoodJune.</h2>
            <ArrowDown
              className="hidden shrink-0 sm:block"
              size={24}
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </div>
          <div className="space-y-3">
            {experiences.map((item, i) => (
              <Reveal key={item.href} delay={i * 0.04}>
                <Link
                  href={item.href}
                  className={`group flex min-h-40 flex-col justify-between gap-6 p-7 sm:min-h-44 sm:flex-row sm:items-center md:p-10 ${i === 1 ? "bg-white text-black ring-2 ring-inset ring-black" : "bg-black text-white"}`}
                >
                  <h3 className="max-w-2xl font-heading text-[15px] leading-[1.9] tracking-[-0.035em] sm:text-[17px] lg:text-[20px]">
                    {item.title}
                  </h3>
                  <span className="flex shrink-0 items-center gap-5 font-sans text-sm">
                    {item.action}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={24}
                      strokeWidth={1.3}
                      className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <section id="community" className="pb-16 md:pb-24">
        <Container className="grid gap-8 md:grid-cols-[1fr_1.8fr] md:gap-16">
          <Reveal>
            <h2 className={heading}>
              Join Our
              <br />
              Community.
            </h2>
          </Reveal>
          <div>
            <p className="max-w-xl text-lg leading-[1.7]">
              {home.newsletter.description}
            </p>
            <p className="mt-5 font-sans text-sm">
              {home.newsletter.subscribers}
            </p>
            <div className="my-6">
              <a
                href={site.links.newsletter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-8 bg-forest px-6 py-4 font-sans text-sm text-white hover:bg-black"
              >
                Subscribe on Substack
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <TextLink href={site.links.newsletter}>
              Read the Newsletter
            </TextLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
