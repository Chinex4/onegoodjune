import Image from "next/image";
import { ArrowDown, Check, Plus, X } from "lucide-react";
import {
  ArrowIcon,
  ColorBar,
  Container,
  Eyebrow,
  buttonStyles,
  heading,
  label,
  lead,
  prose,
  subheading,
  title,
  type ButtonVariant,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { SalesTopBar } from "@/components/site/sales";
import { StickyCta } from "@/components/site/sticky-cta";
import { PlanSwitcher } from "@/components/site/plan-switcher";
import { sog } from "@/content/sog";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata(
  "School of Growth",
  sog.introduction,
  "/school-of-growth",
);
function Access({
  variant = "lime",
  className = "",
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <a
      href={site.links.enrollment}
      className={buttonStyles(variant, cn("gap-10", className))}
    >
      {sog.access}
      <ArrowIcon />
    </a>
  );
}
function Paragraphs({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      {items.map((item) => (
        <p key={item} className={cn(prose, "whitespace-pre-line")}>
          {item}
        </p>
      ))}
    </div>
  );
}
// "Title\nBody" → [title, body]
function split(value: string) {
  const [first, ...rest] = value.split("\n");
  return [first, rest.join("\n")] as const;
}
// "$56 / ₦75,000 per year (…)" → "$56", "₦75,000", "per year (…)"
function priceParts(price: string) {
  const [usd, rest = ""] = price.split(" / ");
  const [naira, ...period] = rest.split(" ");
  return { usd, naira, period: period.join(" ") };
}
function withEmailLinks(text: string) {
  return text.split(/(\S+@\S+\.[a-z]+)/i).map((part, i) =>
    i % 2 ? (
      <a
        key={part}
        href={`mailto:${part}`}
        className="underline underline-offset-4 hover:text-forest"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}
const planStyles = [
  {
    card: "bg-white ring-1 ring-ink/15",
    name: "text-ink",
    tag: "text-forest",
    button: "ink" as const,
    tick: "bg-lime text-ink",
    rule: "border-ink/15",
  },
  {
    card: "ground-dark lg:-my-6 lg:py-14",
    name: "text-white",
    tag: "text-lime",
    button: "lime" as const,
    tick: "bg-lime text-ink",
    rule: "border-white/15",
  },
  {
    card: "bg-white ring-1 ring-ink/15",
    name: "text-ink",
    tag: "text-earth",
    button: "ink" as const,
    tick: "bg-sunshine text-ink",
    rule: "border-ink/15",
  },
];
const testimonialTints = [
  "bg-lime/35",
  "bg-straw/60",
  "bg-sunshine/30",
  "bg-sage/40",
];
const stepColors = ["text-lime", "text-straw", "text-sunshine"];
export default function Growth() {
  const [definitionLead, formula] = sog.definition.split("formula: ");
  const [frameworkTitle, frameworkIntro] = split(sog.framework);
  const lowest = priceParts(sog.plans[0].price);
  // "FAQ — FREQUENTLY ASKED QUESTIONS" → label + sentence-case heading
  const [faqLabel, faqHeading = ""] = sog.faqTitle.split(" — ");
  return (
    <main id="main-content" className="bg-white text-ink">
      <section id="hero" className="ground-dark">
        <Container>
          <SalesTopBar
            cta={{ href: site.links.enrollment, label: sog.access }}
          />
          <div className="grid items-center gap-12 pb-16 pt-8 md:pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-12">
            <div className="lg:col-span-6">
              <p className={cn(label, "text-lime")}>{sog.strapline}</p>
              <h1 className="mt-6 font-heading text-[3.25rem] leading-[0.98] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[5.25rem]">
                School
                <br />
                of Growth
              </h1>
              <p className={cn(lead, "mt-8 max-w-xl text-white/85")}>
                {sog.introduction}
              </p>
              <p className="mt-5 font-heading text-[1.375rem] tracking-[-0.01em] text-straw">
                {sog.promise}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Access />
                <a
                  href="#pathways"
                  className="group inline-flex min-h-11 items-center gap-3 border-b border-white/40 font-sans text-sm font-medium transition-colors hover:border-lime hover:text-lime"
                >
                  {sog.choosePath}
                  <ArrowIcon Icon={ArrowDown} size={15} />
                </a>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[34rem] lg:col-span-6 lg:max-w-none">
              <div className="bg-lime p-2 sm:p-3">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={site.assets.sogPoster}
                  width={652}
                  height={540}
                  aria-label="Watch the School of Growth introduction"
                  aria-describedby="video-description"
                  className="aspect-[652/540] w-full bg-black object-contain"
                >
                  <source src={site.assets.sogVideo} type="video/mp4" />
                  Your browser does not support video.{" "}
                  <a href={site.assets.sogVideo}>Download the introduction.</a>
                </video>
              </div>
              <p
                id="video-description"
                className="mt-4 font-sans text-[0.8125rem] text-white/65"
              >
                School of Growth with Esther Uzoamaka Okoloeze.
              </p>
            </div>
          </div>
        </Container>
        <ColorBar />
      </section>

      <Container>
        <section className="grid gap-12 py-16 md:py-28 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <h2 className={heading}>{sog.goalsTitle}</h2>
            <p className={cn(prose, "mt-7 border-l-4 border-orange pl-5")}>
              {sog.invitation[0]}
            </p>
            <p className="mt-6 font-heading text-[1.75rem] leading-tight tracking-[-0.015em] text-forest">
              {sog.invitation[1]}
            </p>
          </Reveal>
          <ol className="lg:col-span-6 lg:col-start-7">
            {sog.goals.map((goal, i) => (
              <li
                key={goal}
                className="flex gap-5 border-b border-ink/15 py-5 first:pt-0 md:py-6"
              >
                <span className={cn(label, "mt-1.5 w-6 shrink-0 text-forest")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-xl leading-snug md:text-[1.375rem]">
                  {goal}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      <section className="bg-paper py-16 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-10">
              <h2 className={subheading}>{sog.storyTitle}</h2>
              <figure className="mt-8 max-w-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                  <Image
                    src={site.assets.sogCoach}
                    alt="Esther Uzoamaka Okoloeze, founder of School of Growth"
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-forest" />
                  <span className={cn(label, "text-ink/70")}>Coach Esther</span>
                </figcaption>
              </figure>
            </div>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <p className="font-heading text-[1.75rem] tracking-[-0.015em]">
              {sog.story[0]}
            </p>
            <Paragraphs items={sog.story.slice(1)} className="mt-6" />
          </Reveal>
        </Container>
      </section>

      <section className="bg-lime py-16 md:py-28">
        <Container>
          <Reveal>
            <h2 className={cn(heading, "max-w-4xl")}>{sog.opportunities[0]}</h2>
          </Reveal>
          <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-2 lg:gap-16">
            <Paragraphs items={sog.opportunities.slice(1, 4)} />
            <div>
              <p className="font-heading text-[1.75rem] leading-tight tracking-[-0.015em]">
                {sog.opportunities[4]}
              </p>
              <p className={cn(prose, "mt-5 font-semibold")}>
                {sog.opportunities[5]}
              </p>
              <Paragraphs
                items={sog.opportunities.slice(6, 8)}
                className="mt-5"
              />
            </div>
          </div>
          <p
            className={cn(
              lead,
              "mt-12 max-w-4xl border-t border-ink/20 pt-10 md:mt-16",
            )}
          >
            {sog.opportunities[8]}
          </p>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-28">
          <Eyebrow className="text-rust">{sog.yourTurn}</Eyebrow>
          <h2 className={cn(heading, "mt-6")}>{sog.stakesTitle}</h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {sog.stakes.map((item) => (
              <li key={item} className="flex gap-4 bg-paper p-6 md:p-7">
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center bg-rust text-white"
                >
                  <X size={15} strokeWidth={2.5} />
                </span>
                <span className="font-serif text-xl leading-snug">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-10">
            <Paragraphs
              items={sog.rationale.slice(0, 3)}
              className="lg:col-span-6"
            />
            <p
              className={cn(
                lead,
                "self-start border-l-4 border-forest pl-6 lg:col-span-5 lg:col-start-8",
              )}
            >
              {sog.rationale[3]}
            </p>
          </div>
        </section>
      </Container>

      <section className="ground-dark py-16 md:py-28">
        <Container>
          <p className={cn(label, "text-lime")}>{sog.thisIs}</p>
          <h2 className="mt-4 font-heading text-[3rem] leading-none tracking-[-0.03em] sm:text-[4rem] lg:text-[4.75rem]">
            {sog.programName}
          </h2>
          <p className={cn(subheading, "mt-5 text-straw")}>{sog.positioning}</p>
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
            <p className={cn(lead, "text-white/85 lg:col-span-6")}>
              {definitionLead}formula:
            </p>
            {formula && (
              <p className="font-heading text-[1.75rem] leading-[1.15] tracking-[-0.015em] text-lime md:text-[2.25rem] lg:col-span-6">
                {formula}
              </p>
            )}
          </div>
          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-3">
            {sog.foundations.map((item, i) => {
              const [name, description] = split(item);
              return (
                <div key={item} className="bg-black p-7 md:p-8">
                  <p className={cn(label, stepColors[i])}>{name}</p>
                  <p className="mt-4 font-serif text-2xl leading-snug">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Container>
        <section className="grid gap-14 py-16 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className={heading}>{sog.audienceTitle}</h2>
            <ul
              aria-label="School of Growth is for"
              className="mt-8 flex flex-wrap gap-2"
            >
              {sog.audience[0]
                .replace(/\.$/, "")
                .split(". ")
                .map((role) => (
                  <li
                    key={role}
                    className="bg-lime/45 px-3.5 py-2 font-sans text-sm font-medium"
                  >
                    {role}
                  </li>
                ))}
            </ul>
            <p className={cn(prose, "mt-8")}>{sog.audience[1]}</p>
          </div>
          <div className="self-start bg-paper p-7 md:p-9 lg:col-span-5 lg:col-start-8">
            <h3 className={title}>{sog.exclusionsTitle}</h3>
            <ul className="mt-6 space-y-4">
              {sog.exclusions.map((item) => (
                <li key={item} className="flex gap-4">
                  <X
                    size={18}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-rust"
                  />
                  <span className="font-serif text-lg leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>

      <section
        id="pathways"
        className="scroll-mt-4 border-t border-ink/10 bg-paper py-16 md:py-28"
      >
        <Container>
          <p className="mx-auto max-w-3xl text-center font-heading text-[1.75rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.25rem]">
            {sog.invitationToGrow}
          </p>
          <div className="mt-16 grid gap-6 border-t border-ink/15 pt-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Eyebrow className="text-forest">{sog.choosePath}</Eyebrow>
              <h2 className={cn(heading, "mt-6")}>{sog.pathwaysTitle}</h2>
            </div>
            <p className={cn(prose, "lg:col-span-6 lg:col-start-7 lg:pt-12")}>
              {sog.pathwaysIntro}
            </p>
          </div>
          <div className="mt-14 lg:mt-20">
            <PlanSwitcher names={sog.plans.map((p) => p.name)} initial={1}>
              {sog.plans.map((plan, i) => {
                const style = planStyles[i];
                const price = priceParts(plan.price);
                return (
                  <article
                    key={plan.name}
                    className={cn(
                      "flex h-full flex-col p-7 sm:p-9",
                      style.card,
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className={cn(
                          "font-heading text-[2rem] leading-none tracking-[-0.02em]",
                          style.name,
                        )}
                      >
                        {plan.name}
                      </h3>
                      <p className={cn(label, style.tag)}>{plan.strapline}</p>
                    </div>
                    <p className="mt-8">
                      <span className="font-heading text-[3.5rem] leading-none tracking-[-0.03em]">
                        {price.usd}
                      </span>
                      <span className="ml-2 font-sans text-lg font-medium">
                        / {price.naira}
                      </span>
                      <span className="mt-2 block font-sans text-sm opacity-75">
                        {price.period}
                      </span>
                    </p>
                    <p className="mt-6 font-serif text-lg leading-[1.6] opacity-90">
                      {plan.description}
                    </p>
                    <Access variant={style.button} className="mt-7 w-full" />
                    <div className={cn("mt-8 border-t pt-7", style.rule)}>
                      <h4 className={cn(label, "opacity-70")}>
                        {sog.whatYouGet}
                      </h4>
                      {plan.inherited && (
                        <p className="mt-4 font-serif text-lg font-semibold">
                          {plan.inherited}
                        </p>
                      )}
                      <ul className="mt-5 space-y-5">
                        {plan.benefits.map((benefit) => {
                          const [name, body] = split(benefit);
                          return (
                            <li key={benefit} className="flex gap-3.5">
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "mt-1 grid size-5 shrink-0 place-items-center",
                                  style.tick,
                                )}
                              >
                                <Check size={13} strokeWidth={3} />
                              </span>
                              <span className="font-serif text-[1.0625rem] leading-[1.55]">
                                {body ? (
                                  <>
                                    <strong className="block font-sans text-sm font-semibold">
                                      {name}
                                    </strong>
                                    <span className="mt-1 block opacity-85">
                                      {body}
                                    </span>
                                  </>
                                ) : (
                                  name
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      {plan.roadmap && (
                        <div className={cn("mt-8 border-t pt-7", style.rule)}>
                          <h4 className={cn(label, "text-lime")}>
                            {sog.roadmapTitle}
                          </h4>
                          <ol className="mt-5 space-y-4 border-l border-white/20 pl-5">
                            {plan.roadmap.split("\n").map((step) => {
                              const [period, text] = step.split(": ");
                              return (
                                <li key={step} className="relative">
                                  <span
                                    aria-hidden="true"
                                    className="absolute -left-[1.5625rem] top-2 size-2 bg-lime"
                                  />
                                  <span className="block font-sans text-sm font-semibold">
                                    {period}:
                                  </span>
                                  <span className="font-serif text-[1.0625rem] leading-snug opacity-85">
                                    {text}
                                  </span>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </PlanSwitcher>
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-28">
          <h2 className={cn(heading, "max-w-3xl")}>{sog.testimonialsTitle}</h2>
          {/* Phones: a swipeable row (next card peeks in); md+: a 2×2 grid. */}
          <div
            role="region"
            aria-label="Testimonials"
            tabIndex={0}
            className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0"
          >
            {sog.testimonials.map((item, i) => {
              const [name, role] = split(item.author);
              return (
                <Reveal
                  key={item.author}
                  delay={(i % 2) * 0.06}
                  className="w-[85%] shrink-0 snap-start sm:w-[70%] md:w-auto"
                >
                  <figure
                    className={cn(
                      "flex h-full flex-col p-7 sm:p-10",
                      testimonialTints[i],
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="font-heading text-[4rem] leading-[0.6] text-ink/25"
                    >
                      “
                    </span>
                    <h3 className={cn(title, "mt-4")}>{item.title}</h3>
                    <blockquote className="mt-5 whitespace-pre-line font-serif text-lg leading-[1.7]">
                      {item.quote}
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-3 pt-8">
                      <span aria-hidden="true" className="h-px w-8 bg-ink" />
                      <span>
                        <span className="block font-sans text-sm font-semibold">
                          {name}
                        </span>
                        <span className="block font-sans text-[0.8125rem] text-ink/70">
                          {role}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </section>
      </Container>

      <section className="ground-dark py-16 md:py-28">
        <Container>
          <p className={cn(label, "text-lime")}>{sog.frameworkLabel}</p>
          <h2 className={cn(heading, "mt-6")}>{frameworkTitle}</h2>
          <p className={cn(lead, "mt-6 max-w-2xl text-white/80")}>
            {frameworkIntro}
          </p>
          <ol className="mt-14 grid gap-px bg-white/15 md:grid-cols-3">
            {sog.steps.map((item, i) => {
              const [step, body] = split(item);
              const [number, ...name] = step.split(" ");
              return (
                <li key={item} className="bg-black p-7 md:p-9">
                  <span
                    className={cn(
                      "block font-heading text-[3rem] leading-none",
                      stepColors[i],
                    )}
                  >
                    {number}
                  </span>
                  <h3 className={cn(label, "mt-6 text-sm text-white")}>
                    {name.join(" ")}
                  </h3>
                  <p className="mt-4 font-serif text-lg leading-[1.65] text-white/80">
                    {body}
                  </p>
                </li>
              );
            })}
          </ol>
          <div className="mt-20 grid gap-10 border-t border-white/15 pt-14 lg:grid-cols-12 lg:gap-10">
            <h3 className={cn(subheading, "lg:col-span-5")}>
              {sog.advisoryTitle}
            </h3>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className={cn(prose, "text-white/85")}>{sog.advisory[0]}</p>
              <p className="mt-8 border-l-4 border-lime pl-5 font-heading text-[1.5rem] leading-tight tracking-[-0.01em] text-lime">
                {sog.advisory[1]}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={heading}>{sog.resultsTitle}</h2>
            <p className={cn(label, "text-ink/60")}>{sog.resultsCondition}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {sog.results.map((item, i) => (
              <div key={item.name} className="border-t-4 border-ink pt-6">
                <h3
                  className={cn(
                    title,
                    ["text-forest", "text-ink", "text-earth"][i],
                  )}
                >
                  {item.name}
                </h3>
                <ul className="mt-5 space-y-4">
                  {item.items.map((result) => (
                    <li key={result} className="flex gap-3.5">
                      <Check
                        size={18}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-forest"
                      />
                      <span className="font-serif text-lg leading-snug">
                        {result}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 grid gap-5 md:grid-cols-2">
            {sog.explanation.map((item, i) => (
              <div
                key={item.title}
                className={cn("p-7 sm:p-10", i ? "bg-paper" : "bg-lime/45")}
              >
                <h2 className={title}>{item.title}</h2>
                <p className={cn(prose, "mt-5")}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-ink/15 py-16 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-10">
              <p className={cn(label, "text-forest")}>{faqLabel}</p>
              <h2 className={cn(heading, "mt-6")}>
                {faqHeading.charAt(0) + faqHeading.slice(1).toLowerCase()}
              </h2>
              <p className="mt-6 font-serif text-lg text-ink/80">
                Got questions before signing up?
              </p>
              <a
                className="group mt-2 inline-flex min-h-11 items-center gap-3 border-b border-ink font-sans text-sm font-medium hover:border-forest hover:text-forest"
                href="mailto:sayhi@onegoodjune.com"
              >
                sayhi@onegoodjune.com
                <ArrowIcon size={15} />
              </a>
            </div>
          </div>
          <div className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
            {sog.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-ink/15"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl leading-snug transition-colors hover:text-forest [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center border border-ink/20 transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-white"
                  >
                    <Plus size={16} />
                  </span>
                </summary>
                <p className={cn(prose, "max-w-2xl pb-7 pr-12 text-ink/85")}>
                  {withEmailLinks(faq.answer)}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Container>

      <section id="closing" className="ground-dark py-16 md:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <p className="font-sans text-[1.5rem] font-semibold uppercase leading-[1.25] tracking-[-0.005em] font-stretch-expanded md:text-[2rem] lg:col-span-9">
            {sog.closing}
          </p>
          <div className="lg:col-span-3 lg:justify-self-end">
            <Access />
          </div>
        </Container>
      </section>

      <StickyCta watch={["hero", "pathways", "closing"]}>
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-4 py-3">
          <p className="min-w-0 font-sans text-xs leading-snug text-white/75 sm:text-[0.8125rem]">
            <span className="block truncate font-semibold text-white">
              {sog.programName}
            </span>
            <span className="whitespace-nowrap">
              From {lowest.usd} / {lowest.naira}
            </span>
          </p>
          <Access className="min-h-11 shrink-0 gap-3 px-4 sm:gap-4 sm:px-5" />
        </Container>
      </StickyCta>
    </main>
  );
}
