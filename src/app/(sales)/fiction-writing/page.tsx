import Image from "next/image";
import { course } from "@/content/pages";
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
import { Countdown } from "@/components/site/countdown";
import { EnrollButton, EnrollDialog } from "@/components/site/enroll";
import { getProgram } from "@/lib/programs";
import { Reveal } from "@/components/site/reveal";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  course.title,
  course.description,
  "/fiction-writing",
);
export default function Fiction() {
  const details = [
    { title: "Delivery Mode", text: course.delivery },
    { title: "Duration", text: course.duration },
    { title: "Who Is It For?", text: course.audience },
    { title: "When Is It Launching?", text: "January 15, 2027." },
  ];
  const waitlist = getProgram("fiction-waitlist")!;
  return (
    <main id="main-content" className="bg-white">
      <section className="ground-dark">
        <Container>
          <div className="pb-16 pt-14 md:pb-24 md:pt-20">
            <Eyebrow className="text-sunshine">
              A specialized fiction writing course
            </Eyebrow>
            <h1 className="mt-7 max-w-5xl font-heading text-[2.5rem] leading-[1.04] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.5rem]">
              Write Fiction Like Great Movies
            </h1>
            <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-5">
                <p className={cn(lead, "text-white/85")}>
                  {course.description}
                </p>
                <div className="mt-9">
                  <EnrollButton program="fiction-waitlist" variant="orange">
                    Join the Waitlist
                  </EnrollButton>
                </div>
              </div>
              <Countdown className="lg:col-span-6 lg:col-start-7" />
            </div>
          </div>
        </Container>
        <ColorBar />
      </section>

      <Container>
        <section className="grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-10">
              <Eyebrow className="text-rust">The craft, in depth</Eyebrow>
              <h2 className={cn(heading, "mt-6")}>Course Modules</h2>
              <p className={cn(label, "mt-6 text-ink/60")}>
                {course.modules.length} modules
              </p>
            </div>
          </Reveal>
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
            {course.modules.map((module, i) => {
              const project = /^Project:/.test(module);
              return (
                <li
                  key={module}
                  className={cn(
                    "flex items-baseline gap-5 border-b border-ink/15 py-5",
                    project &&
                      "mt-4 border-0 bg-orange px-5 sm:col-span-2 sm:px-6",
                  )}
                >
                  <span
                    className={cn(
                      label,
                      "w-6 shrink-0",
                      project ? "text-ink" : "text-rust",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-xl leading-snug">
                    {module}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </Container>

      <section className="bg-orange py-20 md:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <h2 className={cn(heading, "lg:col-span-4")}>Guaranteed Results</h2>
          <div className="space-y-8 lg:col-span-7 lg:col-start-6">
            {course.results.map((result, i) => (
              <Reveal key={result} delay={i * 0.08}>
                <p className="flex gap-6 border-t border-ink/25 pt-8 font-serif text-[1.625rem] leading-[1.35] md:text-[2rem]">
                  <span className={cn(label, "mt-3 shrink-0")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {result}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <section className="grid gap-px bg-ink/15 py-px md:grid-cols-2 lg:grid-cols-4">
          {details.map((item) => (
            <div
              key={item.title}
              className="bg-white py-10 md:px-8 md:py-14 lg:first:pl-0"
            >
              <h2 className={cn(label, "text-rust")}>{item.title}</h2>
              <p className="mt-4 font-serif text-xl leading-snug">
                {item.text}
              </p>
            </div>
          ))}
        </section>
      </Container>

      <section id="investment" className="scroll-mt-4 bg-paper py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Eyebrow className="text-rust">Your Investment</Eyebrow>
            <div className="mt-8 bg-white p-7 ring-1 ring-ink/10 sm:p-10">
              <h2 className={cn(label, "text-ink/70")}>Waitlist Price</h2>
              <p className="mt-4 font-heading text-[3rem] leading-none tracking-[-0.03em] sm:text-[3.75rem]">
                $20 <span className="text-ink/35">/</span> #27,500
              </p>
              <p className="mt-5 font-sans text-sm">
                <span className="text-ink/70">Original Price: </span>
                <span className="font-medium line-through decoration-rust decoration-2">
                  $109 / ₦150,000
                </span>
              </p>
              <div className="mt-8 border-t border-ink/15 pt-7">
                <h3 className={cn(label, "text-rust")}>
                  Waitlist Price Deadline
                </h3>
                <p className={cn(prose, "mt-3")}>{course.deadline}</p>
              </div>
              <div className="mt-8">
                <EnrollButton program="fiction-waitlist" variant="orange">
                  Save Your Seat on the Waitlist
                </EnrollButton>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
            <h3 className={subheading}>Perks of Joining the Waitlist</h3>
            <ul className="mt-8 space-y-4">
              {course.perks.map((perk, i) => (
                <li
                  key={perk}
                  className="flex gap-5 border-t border-ink/15 pt-5"
                >
                  <span className={cn(label, "mt-1.5 text-rust")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-xl leading-snug">
                    {perk.replace(/^▪︎ /, "")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container>
        <section className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="relative aspect-[4/5] max-w-sm overflow-hidden bg-ink">
              <Image
                src={site.assets.sogCoach}
                alt="Esther Uzoamaka Okoloeze, writing instructor"
                fill
                sizes="(max-width: 1024px) 384px, 33vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Eyebrow className="text-rust">Writing Instructor</Eyebrow>
            <h2 className={cn(heading, "mt-6")}>Esther Uzoamaka Okoloeze</h2>
            <p className={cn(lead, "mt-7 text-ink/85")}>{course.instructor}</p>
          </div>
        </section>
      </Container>

      <section className="ground-dark py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className={cn(label, "text-sunshine")}>
              How You&apos;ll Access the Course
            </h2>
            <p className={cn(lead, "mt-5 text-white/85")}>{course.access}</p>
            <h2 className={cn(heading, "mt-14")}>
              Save Your Seat on the Waitlist
            </h2>
            <div className="mt-8">
              <EnrollButton program="fiction-waitlist" variant="orange">
                Join the Waitlist
              </EnrollButton>
            </div>
          </div>
          <Countdown className="self-end lg:col-span-6" />
        </Container>
      </section>
      <EnrollDialog
        title="Write Fiction Like Great Movies"
        defaultOption="fiction-waitlist"
        options={[waitlist].map(({ id, name, price, period }) => ({
          id,
          name,
          price,
          period,
        }))}
      />
    </main>
  );
}
