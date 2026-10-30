import { home } from "@/content/home";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import {
  Container,
  Eyebrow,
  TextLink,
  heading,
  lead,
  meta,
} from "./primitives";
// Shared on every public page except About and the sales pages.
export function NewsletterSection({ className = "" }: { className?: string }) {
  const [count, ...rest] = home.newsletter.subscribers.split(" ");
  return (
    <section id="community" className={cn("pb-20 md:pb-28", className)}>
      <Container>
        <div className="grid gap-10 border-t border-ink/15 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-forest">Newsletter</Eyebrow>
            <h2 className={cn(heading, "mt-5")}>
              Join Our
              <br />
              Community<span className="text-orange">.</span>
            </h2>
            <p className={cn(lead, "mt-6 max-w-md text-ink/80")}>
              {home.newsletter.description}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
            {/* Substack centres its form, so the panel is centred to match. */}
            <div className="flex flex-col items-center bg-lime px-5 py-10 text-center sm:px-10 sm:py-12">
              <p>
                <span className="block font-heading text-[3rem] leading-none tracking-[-0.03em] text-forest md:text-[3.75rem]">
                  {count}
                </span>
                <span className={cn(meta, "mt-3 block text-ink/80")}>
                  {rest.join(" ")}
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
  );
}
