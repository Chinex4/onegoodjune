import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Container, heading } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { sog } from "@/content/sog";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "School of Growth",
  sog.introduction,
  "/school-of-growth",
);
const text = "whitespace-pre-line text-base leading-[1.8] md:text-lg";
function Access({ light = false }: { light?: boolean }) {
  return (
    <a
      href={site.links.enrollment}
      className={`group inline-flex min-h-12 items-center justify-between gap-8 px-6 py-4 font-sans text-sm motion-safe:transition-transform motion-safe:active:scale-[0.98] ${light ? "bg-lime text-black hover:bg-white" : "bg-black text-white hover:bg-forest"}`}
    >
      Get instant access
      <ArrowUpRight
        size={19}
        aria-hidden="true"
        className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
      />
    </a>
  );
}
function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <p key={item} className={text}>
          {item}
        </p>
      ))}
    </div>
  );
}
function Benefit({ value }: { value: string }) {
  const [title, ...body] = value.split("\n");
  return (
    <li className="text-base leading-[1.7]">
      {body.length ? (
        <>
          <strong className="mb-2 block font-sans text-sm font-medium">
            {title}
          </strong>
          <span>{body.join("\n")}</span>
        </>
      ) : (
        title
      )}
    </li>
  );
}
export default function Growth() {
  return (
    <main id="main-content" className="bg-white text-black">
      <section className="bg-black py-10 text-white md:py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="mb-10 font-heading text-[11px] leading-loose tracking-[-0.04em]">
              ONEGOODJUNE
            </p>
            <h1 className="font-heading text-[28px] leading-[1.85] tracking-[-0.05em] sm:text-[36px] lg:text-[44px]">
              School
              <br />
              of Growth
            </h1>
            <p className="mt-5 font-sans text-sm text-lime">{sog.strapline}</p>
            <p className="mt-7 max-w-xl text-lg leading-[1.7]">
              {sog.introduction}
            </p>
            <p className="mt-5 text-base">{sog.promise}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Access light />
              <a
                href="#pathways"
                className="inline-flex min-h-11 items-center gap-3 font-sans text-sm hover:text-lime"
              >
                Choose your path
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[550px] lg:max-w-none">
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
            <p id="video-description" className="mt-3 text-sm leading-relaxed">
              School of Growth with Esther Uzoamaka Okoloeze.
            </p>
          </div>
        </Container>
      </section>
      <Container>
        <section className="grid gap-10 py-16 md:grid-cols-[.85fr_1.2fr] md:py-24 md:gap-20">
          <Reveal>
            <h2 className={heading}>{sog.goalsTitle}</h2>
            <p className="mt-7 text-base leading-relaxed">
              {sog.invitation[0]}
            </p>
            <p className="mt-4 text-lg">{sog.invitation[1]}</p>
          </Reveal>
          <ul className="space-y-5">
            {sog.goals.map((goal) => (
              <li key={goal} className="flex gap-4 text-lg leading-relaxed">
                <ArrowUpRight
                  className="mt-1 shrink-0 text-forest"
                  size={18}
                  aria-hidden="true"
                />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="pb-16 md:pb-24">
          <div className="grid gap-10 md:grid-cols-[.85fr_1.2fr] md:gap-20">
            <div>
              <h2 className="max-w-sm font-serif text-3xl leading-snug">
                {sog.storyTitle}
              </h2>
              <div className="relative mt-8 aspect-[4/5] max-w-sm overflow-hidden bg-black">
                <Image
                  src={site.assets.sogCoach}
                  alt="Esther Uzoamaka Okoloeze, founder of School of Growth"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover"
                />
              </div>
            </div>
            <Paragraphs items={sog.story} />
          </div>
        </section>
      </Container>
      <section className="bg-lime py-16 md:py-20">
        <Container>
          <h2 className="max-w-3xl font-serif text-3xl leading-snug md:text-4xl">
            {sog.opportunities[0]}
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <Paragraphs items={sog.opportunities.slice(1, 5)} />
            <Paragraphs items={sog.opportunities.slice(5)} />
          </div>
        </Container>
      </section>
      <Container>
        <section className="grid gap-10 py-16 md:grid-cols-2 md:gap-20 md:py-24">
          <div>
            <h2 className={heading}>{sog.stakesTitle}</h2>
            <ul className="mt-8 list-disc space-y-4 pl-5">
              {sog.stakes.map((item) => (
                <li key={item} className={text}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Paragraphs items={sog.rationale} />
        </section>
      </Container>
      <section className="bg-black py-16 text-white md:py-20">
        <Container>
          <h2 className={heading}>{sog.positioning}</h2>
          <p className="mt-8 max-w-3xl text-lg leading-[1.75]">
            {sog.definition}
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {sog.foundations.map((item) => {
              const [title, description] = item.split("\n");
              return (
                <div key={item}>
                  <h3 className="font-sans text-sm text-lime">{title}</h3>
                  <p className="mt-3 text-xl leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
      <Container>
        <section className="grid gap-12 py-16 md:grid-cols-2 md:gap-20 md:py-24">
          <div>
            <h2 className={heading}>{sog.audienceTitle}</h2>
            <div className="mt-7">
              <Paragraphs items={sog.audience} />
              <p className="mt-5 text-lg leading-relaxed">
                {sog.invitationToGrow}
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-2xl leading-snug">
              {sog.exclusionsTitle}
            </h2>
            <ul className="mt-7 list-disc space-y-4 pl-5">
              {sog.exclusions.map((item) => (
                <li key={item} className={text}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="pathways" className="scroll-mt-8 pb-16 md:pb-24">
          <h2 className={heading}>{sog.pathwaysTitle}</h2>
          <p className="mt-7 max-w-3xl text-lg leading-[1.75]">
            {sog.pathwaysIntro}
          </p>
          <div className="mt-10 space-y-4">
            {sog.plans.map((plan, i) => (
              <article
                key={plan.name}
                className={`p-7 md:p-10 ${i === 1 ? "bg-black text-white" : "bg-neutral-100"}`}
              >
                <div className="grid gap-8 lg:grid-cols-[.75fr_1.3fr] lg:gap-16">
                  <div>
                    <h3 className="font-heading text-[24px] leading-[1.9] tracking-[-0.04em]">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-lg">{plan.strapline}</p>
                    <p className="mt-6 whitespace-pre-line font-sans text-lg leading-relaxed">
                      {plan.price}
                    </p>
                    <p className="my-6 text-base leading-[1.75]">
                      {plan.description}
                    </p>
                    <Access light={i === 1} />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-medium">
                      What you get
                    </h4>
                    {plan.inherited && (
                      <p className="mt-5 text-base">{plan.inherited}</p>
                    )}
                    <ul className="mt-6 space-y-6">
                      {plan.benefits.map((benefit) => (
                        <Benefit key={benefit} value={benefit} />
                      ))}
                    </ul>
                    {plan.roadmap && (
                      <div className="mt-8">
                        <h4 className="mb-4 font-sans text-sm font-medium">
                          Your 12-month Growth Roadmap
                        </h4>
                        <p className="whitespace-pre-line text-base leading-[1.9]">
                          {plan.roadmap}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="pb-16 md:pb-24">
          <h2 className={heading}>{sog.testimonialsTitle}</h2>
          <div className="mt-10 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {sog.testimonials.map((item) => (
              <figure key={item.author}>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <blockquote className="mt-5 whitespace-pre-line text-base leading-[1.8]">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-5 whitespace-pre-line font-sans text-sm leading-relaxed">
                  {item.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </Container>
      <section className="bg-neutral-100 py-16 md:py-20">
        <Container>
          <h2 className={heading}>Clarity → Action → Transformation</h2>
          <p className="mt-6 text-lg leading-relaxed">
            {sog.framework.split("\n").slice(1).join("\n")}
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {sog.steps.map((item) => {
              const [title, ...body] = item.split("\n");
              return (
                <div key={item}>
                  <h3 className="font-sans text-base font-medium">{title}</h3>
                  <p className="mt-5 text-base leading-[1.8]">
                    {body.join("\n")}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-16">
            <h3 className="font-serif text-2xl leading-snug">
              {sog.advisoryTitle}
            </h3>
            <Paragraphs items={sog.advisory} />
          </div>
        </Container>
      </section>
      <Container>
        <section className="py-16 md:py-24">
          <h2 className={heading}>{sog.resultsTitle}</h2>
          <p className="mt-3 text-base">{sog.resultsCondition}</p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {sog.results.map((item) => (
              <div key={item.name}>
                <h3 className="font-serif text-2xl">{item.name}</h3>
                <ul className="mt-5 list-disc space-y-4 pl-5">
                  {item.items.map((result) => (
                    <li key={result} className="text-base leading-relaxed">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-12 pb-16 md:grid-cols-2 md:gap-20 md:pb-24">
          {sog.explanation.map((item) => (
            <div key={item.title}>
              <h2 className="font-serif text-2xl">{item.title}</h2>
              <p className={`mt-6 ${text}`}>{item.text}</p>
            </div>
          ))}
        </section>
        <section className="grid gap-10 pb-16 md:grid-cols-[.7fr_1.3fr] md:gap-16 md:pb-24">
          <div>
            <h2 className={heading}>
              Frequently asked
              <br />
              questions
            </h2>
            <a
              className="mt-7 inline-flex min-h-11 items-center font-sans text-sm underline underline-offset-4"
              href="mailto:sayhi@onegoodjune.com"
            >
              sayhi@onegoodjune.com
            </a>
          </div>
          <div className="space-y-3">
            {sog.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-neutral-100 p-5 open:bg-lime/30"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 font-sans text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="text-xl group-open:hidden"
                  >
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-xl group-open:block"
                  >
                    −
                  </span>
                </summary>
                <p className="mt-4 whitespace-pre-line text-base leading-[1.8]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Container>
      <section className="bg-black py-16 text-white md:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="max-w-2xl font-sans text-lg leading-[1.7]">
            {sog.closing}
          </p>
          <div className="shrink-0">
            <Access light />
          </div>
        </Container>
      </section>
    </main>
  );
}
