import { Mail, MapPin } from "lucide-react";
import { NewsletterSection } from "@/components/site/newsletter";
import {
  Container,
  Eyebrow,
  PageIntro,
  heading,
  label,
  lead,
} from "@/components/site/primitives";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/footer";
import { Reveal } from "@/components/site/reveal";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  "Get in touch",
  "Want to work together or have a question? Get in touch with ONEGOODJUNE.",
  "/contact",
);
export default function Contact() {
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="Let's start a conversation"
          title="Get in touch"
          description="Want to work together or have a question?"
        />
        <div className="grid gap-14 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className={cn(lead, "max-w-sm")}>
                Fill out the contact form below and we&apos;ll be in touch as
                soon as possible.
              </p>
              <dl className="mt-10 space-y-6 border-t border-ink/15 pt-8">
                <div>
                  <dt className={cn(label, "text-ink/60")}>Email</dt>
                  <dd className="mt-2">
                    <a
                      href={site.links.email}
                      className="group inline-flex min-h-11 items-center gap-3 break-all font-serif text-xl underline decoration-ink/30 underline-offset-[6px] transition-colors hover:text-forest hover:decoration-forest"
                    >
                      <Mail
                        size={18}
                        aria-hidden="true"
                        className="shrink-0 text-forest"
                      />
                      sayhi@onegoodjune.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={cn(label, "text-ink/60")}>Studio</dt>
                  <dd className="mt-2 flex items-center gap-3 font-serif text-xl">
                    <MapPin
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-forest"
                    />
                    Lagos, Nigeria
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
          <div className="bg-paper p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </Container>
      <section className="bg-straw py-20 md:py-24">
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow className="text-earth">Follow OGJ</Eyebrow>
            <h2 className={cn(heading, "mt-6")}>You can also find us on…</h2>
          </div>
          <SocialLinks className="text-base lg:col-span-5 lg:justify-end" />
        </Container>
      </section>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
