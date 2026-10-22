import { course } from "@/content/pages";
import {
  Container,
  PageIntro,
  heading,
  subheading,
  Eyebrow,
  sectionSpace,
} from "@/components/site/primitives";
import { Countdown } from "@/components/site/countdown";
import { ProgramAction } from "@/components/site/program-action";
import { Reveal } from "@/components/site/reveal";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  course.title,
  course.description,
  "/fiction-writing",
);
export default function Fiction() {
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="A specialized fiction writing course"
          title={course.title}
          description={course.description}
        >
          <Countdown />
          <div className="mt-9">
            <ProgramAction
              href={site.links.waitlist}
              label="Join the Waitlist"
              kind="waitlist"
            />
          </div>
        </PageIntro>
        <section className="grid gap-10 py-20 md:grid-cols-[.7fr_1fr]">
          <Reveal>
            <Eyebrow>The craft, in depth</Eyebrow>
            <h2 className={`${heading} mt-8`}>Course Modules</h2>
          </Reveal>
          <ol>
            {course.modules.map((module, i) => (
              <li
                key={module}
                className="flex items-baseline gap-6 border-b border-ink/20 py-5 text-xl leading-relaxed"
              >
                <span className="font-sans text-[11px] text-forest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{module}</span>
              </li>
            ))}
          </ol>
        </section>
      </Container>
      <section className={`${sectionSpace} bg-straw`}>
        <Container className="grid gap-12 md:grid-cols-2">
          <h2 className={heading}>Guaranteed Results</h2>
          <div className="space-y-8 text-2xl leading-relaxed">
            {course.results.map((result) => (
              <Reveal key={result}>
                <p>{result}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <Container className="grid gap-14 py-20 md:grid-cols-2">
        <section>
          <Eyebrow>Who Is It For?</Eyebrow>
          <p className="mt-6 text-2xl leading-relaxed">{course.audience}</p>
        </section>
        <section>
          <Eyebrow>Writing Instructor</Eyebrow>
          <h2 className={`${subheading} mt-6`}>Esther Uzoamaka Okoloeze</h2>
          <p className="mt-5 text-xl leading-relaxed">{course.instructor}</p>
          <p className="mt-5 font-sans text-xs text-ink/70">
            Instructor photograph to be supplied.
          </p>
        </section>
      </Container>
      <section className="bg-lime py-20">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Your Investment</Eyebrow>
            <h2 className={`${heading} mt-8`}>Waitlist Price</h2>
            <p className="mt-6 text-4xl">$20 / #27,500</p>
            <p className="mt-4 text-lg">
              Original Price:{" "}
              <span className="line-through">$109 / ₦150,000</span>
            </p>
            <p className="my-7 max-w-lg text-lg leading-relaxed">
              {course.deadline}
            </p>
            <ProgramAction
              href={site.links.waitlist}
              label="Save Your Seat on the Waitlist"
              kind="waitlist"
            />
          </div>
          <div>
            <h3 className={subheading}>Perks of Joining the Waitlist</h3>
            <ul className="mt-8 space-y-6">
              {course.perks.map((perk) => (
                <li
                  key={perk}
                  className="border-t border-ink/20 pt-5 text-xl leading-relaxed"
                >
                  {perk.replace(/^▪︎ /, "")}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <Container className="grid gap-12 py-20 md:grid-cols-2">
        {[
          { title: "Delivery Mode", text: course.delivery },
          { title: "Duration", text: course.duration },
          { title: "How You'll Access the Course", text: course.access },
          { title: "When Is It Launching?", text: "January 15, 2027." },
        ].map((item) => (
          <section key={item.title}>
            <h2 className={subheading}>{item.title}</h2>
            <p className="mt-6 text-xl leading-relaxed">{item.text}</p>
          </section>
        ))}
      </Container>
    </main>
  );
}
