import {
  Container,
  PageIntro,
  heading,
  Eyebrow,
} from "@/components/site/primitives";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/footer";
import { Reveal } from "@/components/site/reveal";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Get in touch",
  "Want to work together or have a question? Get in touch with OneGoodJune.",
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
        <div className="grid gap-14 py-16 md:grid-cols-[.7fr_1fr]">
          <Reveal>
            <p className="max-w-sm text-2xl leading-relaxed">
              Fill out the contact form below and we&apos;ll be in touch as soon
              as possible.
            </p>
            <a
              href="mailto:admin@onegoodjune.com"
              className="mt-8 inline-flex min-h-11 items-center break-all border-b border-ink/30 text-lg"
            >
              admin@onegoodjune.com
            </a>
            <p className="mt-5 font-sans text-xs text-ink/65">Lagos, Nigeria</p>
          </Reveal>
          <ContactForm />
        </div>
      </Container>
      <section className="bg-straw py-20">
        <Container>
          <Eyebrow>Follow OGJ</Eyebrow>
          <h2 className={`${heading} my-8`}>You can also find us on…</h2>
          <SocialLinks />
        </Container>
      </section>
    </main>
  );
}
