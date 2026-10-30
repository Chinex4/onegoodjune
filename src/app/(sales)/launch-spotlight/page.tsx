import { Check, Plus } from "lucide-react";
import {
  ColorBar,
  Container,
  Eyebrow,
  heading,
  label,
  lead,
  prose,
  subheading,
} from "@/components/site/primitives";
import { EnrollButton, EnrollDialog } from "@/components/site/enroll";
import { StickyCta } from "@/components/site/sticky-cta";
import { spotlight as s } from "@/content/spotlight";
import { programs } from "@/lib/programs";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  "Launch Spotlight",
  s.subheadline,
  "/launch-spotlight",
);
const packageStyles = [
  { card: "bg-white ring-1 ring-ink/15", button: "ink" as const },
  { card: "ground-dark lg:-my-6 lg:py-12", button: "sunshine" as const },
  { card: "bg-white ring-1 ring-ink/15", button: "ink" as const },
];
export default function LaunchSpotlight() {
  const options = programs
    .filter((p) => p.group === "launch-spotlight")
    .map(({ id, name, price, period }) => ({ id, name, price, period }));
  return (
    <main id="main-content" className="bg-white text-ink">
      <section id="hero" className="ground-dark">
        <Container className="pb-16 pt-14 md:pb-24 md:pt-20">
          <Eyebrow className="text-sunshine">
            Launch Spotlight · OneGoodJune Pubs
          </Eyebrow>
          <h1 className="mt-6 max-w-4xl font-heading text-[2.375rem] leading-[1.05] tracking-[-0.03em] sm:text-[3.25rem] lg:text-[4rem]">
            {s.headline}
          </h1>
          <p className={cn(lead, "mt-6 max-w-2xl text-white/85")}>
            {s.subheadline}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <EnrollButton variant="sunshine" program="spotlight-standard">
              {s.cta}
            </EnrollButton>
            <a
              href="#packages"
              className="inline-flex min-h-11 items-center border-b border-white/40 font-sans text-sm font-medium hover:border-sunshine hover:text-sunshine"
            >
              From ₦25,000
            </a>
          </div>
        </Container>
        <ColorBar />
      </section>

      <Container>
        <section className="mx-auto max-w-3xl py-16 md:py-24">
          <h2 className={heading}>{s.problemTitle}</h2>
          {s.problem.map((p) => (
            <p key={p} className={cn(prose, "mt-5")}>
              {p}
            </p>
          ))}
          <p className="mt-8 font-heading text-[1.5rem] leading-tight tracking-[-0.015em] text-rust md:text-[1.875rem]">
            {s.room}
          </p>
        </section>
      </Container>

      <section className="bg-sunshine/20 py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className={heading}>{s.meetTitle}</h2>
            <p className={cn(prose, "mt-5")}>{s.meet}</p>
            <p className="mt-6 border-l-4 border-orange pl-5 font-serif text-lg italic">
              {s.choice}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {s.includes.map((item) => (
              <li key={item} className="flex gap-3 bg-white p-4">
                <Check
                  size={18}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-forest"
                />
                <span className="font-serif text-[1.0625rem] leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-24">
          <h2 className={heading}>{s.stepsTitle}</h2>
          <ol className="mt-10 grid gap-px bg-ink/15 md:grid-cols-3">
            {s.steps.map((step, i) => (
              <li key={step.title} className="bg-white p-6 md:p-8">
                <span className="font-heading text-[2.5rem] leading-none text-rust">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <h3 className={cn(subheading, "mt-5")}>{step.title}</h3>
                <p className={cn(prose, "mt-3 text-ink/85")}>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 font-sans text-sm font-medium text-rust">
            {s.stepsNote}
          </p>
        </section>
      </Container>

      <section id="packages" className="scroll-mt-4 bg-paper py-16 md:py-24">
        <Container>
          <h2 className={heading}>{s.packagesTitle}</h2>
          <div className="mt-12 grid items-start gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {s.packages.map((pkg, i) => (
              <article
                key={pkg.id}
                className={cn(
                  "flex flex-col p-7 sm:p-9",
                  packageStyles[i].card,
                )}
              >
                <h3 className="font-heading text-[1.75rem] leading-none tracking-[-0.02em]">
                  {pkg.name}
                </h3>
                <p className="mt-6 font-heading text-[2.75rem] leading-none tracking-[-0.03em]">
                  {pkg.price}
                </p>
                <p className="mt-4 font-serif text-lg leading-snug opacity-90">
                  {pkg.for}
                </p>
                <EnrollButton
                  program={pkg.id}
                  variant={packageStyles[i].button}
                  className="mt-7 w-full"
                >
                  {pkg.button}
                </EnrollButton>
                <ul className="mt-7 space-y-3 border-t border-current/15 pt-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-1 grid size-5 shrink-0 place-items-center bg-sunshine text-ink"
                      >
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className="font-serif text-[1.0625rem] leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <section className="grid gap-8 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <h2 className={cn(heading, "lg:col-span-5")}>{s.pagesTitle}</h2>
          <div className="space-y-5 lg:col-span-6 lg:col-start-7">
            {s.pages.map((p) => (
              <p key={p} className={prose}>
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-ink/15 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <h2 className={cn(heading, "lg:col-span-4")}>{s.faqTitle}</h2>
          <div className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
            {s.faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-ink/15">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl leading-snug hover:text-rust [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center border border-ink/20 transition-transform duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-white"
                  >
                    <Plus size={16} />
                  </span>
                </summary>
                <p className={cn(prose, "pb-7 pr-12 text-ink/85")}>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Container>

      <section id="closing" className="ground-dark py-16 md:py-24">
        <Container className="max-w-3xl text-center">
          <p className={cn(label, "text-sunshine")}>Launch Spotlight</p>
          <h2 className={cn(heading, "mt-4")}>{s.closingTitle}</h2>
          <p className={cn(lead, "mt-5 text-white/85")}>{s.closing}</p>
          <EnrollButton
            variant="sunshine"
            program="spotlight-standard"
            className="mt-9"
          >
            {s.cta}
          </EnrollButton>
        </Container>
      </section>

      <StickyCta watch={["hero", "packages", "closing"]}>
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-4 py-3">
          <p className="min-w-0 font-sans text-xs leading-snug text-white/75 sm:text-[0.8125rem]">
            <span className="block truncate font-semibold text-white">
              Launch Spotlight
            </span>
            From ₦25,000
          </p>
          <EnrollButton
            variant="sunshine"
            program="spotlight-standard"
            className="min-h-11 shrink-0 gap-3 px-4"
          >
            {s.cta}
          </EnrollButton>
        </Container>
      </StickyCta>
      <EnrollDialog
        title="Launch Spotlight"
        eyebrow="Feature my book"
        optionLegend="Choose your package"
        defaultOption="spotlight-standard"
        askBook
        options={options}
      />
    </main>
  );
}
