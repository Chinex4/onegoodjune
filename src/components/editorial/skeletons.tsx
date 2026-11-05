import { Container } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
// Loading placeholders shaped like the content they stand in for, so the page
// doesn't jump when it arrives. The text is for screen readers.
function Shimmer({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={cn("shimmer", className)} />;
}
function Loading({ children }: { children: string }) {
  return (
    <p role="status" className="sr-only">
      {children}
    </p>
  );
}
function TextLines({ widths, className = "" }: { widths: string[]; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {widths.map((width, i) => (
        <Shimmer key={i} className={cn("h-3.5", width)} />
      ))}
    </div>
  );
}
function CardSkeleton() {
  return (
    <div>
      <Shimmer className="aspect-[3/2]" />
      <Shimmer className="mt-5 h-2.5 w-20" />
      <Shimmer className="mt-4 h-5 w-11/12" />
      <Shimmer className="mt-2 h-5 w-2/3" />
      <TextLines className="mt-4" widths={["w-full", "w-5/6"]} />
      <Shimmer className="mt-5 h-2.5 w-1/3" />
    </div>
  );
}
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
export function MagazineSkeleton() {
  return (
    <>
      <Loading>Loading publications</Loading>
      <Container>
        <div className="flex min-h-11 items-center gap-5 overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <Shimmer key={i} className="h-4 w-14 shrink-0" />
          ))}
        </div>
      </Container>
      <Shimmer className="mt-4 min-h-[280px] md:mt-5 md:min-h-[480px]" />
      <Container className="py-10 md:py-14">
        <CardGridSkeleton count={6} />
      </Container>
    </>
  );
}
export function ArticleSkeleton() {
  return (
    <>
      <Loading>Loading story</Loading>
      <Shimmer className="h-[66vw] max-h-[calc(100dvh-4.5rem)] md:h-[70vh] md:max-h-none" />
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center pb-6 pt-8 md:pb-8">
          <Shimmer className="h-2.5 w-16" />
          <Shimmer className="mt-6 h-8 w-11/12 md:h-10" />
          <Shimmer className="mt-2 h-8 w-2/3 md:h-10" />
          <Shimmer className="mt-5 h-4 w-5/6 max-w-xl" />
          <Shimmer className="mt-2 h-4 w-3/5 max-w-md" />
          <Shimmer className="mt-6 h-3.5 w-32" />
          <Shimmer className="mt-3 h-3 w-40" />
          <div className="mt-5 flex gap-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Shimmer key={i} className="size-5" />
            ))}
          </div>
        </div>
        <TextLines
          className="mx-auto max-w-[720px] pb-12"
          widths={["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-2/3"]}
        />
      </Container>
    </>
  );
}
export function ContributorSkeleton() {
  return (
    <>
      <Loading>Loading contributor</Loading>
      <Shimmer className="aspect-[16/9] md:max-h-[520px]" />
      <Container>
        <div className="mt-6 max-w-3xl border-b border-ink/15 pb-6 md:pb-8">
          <Shimmer className="h-2.5 w-36" />
          <Shimmer className="mt-4 h-8 w-64 max-w-full" />
          <Shimmer className="mt-3 h-3.5 w-40" />
          <TextLines className="mt-6" widths={["w-full", "w-11/12", "w-4/5"]} />
        </div>
        <section className="py-12 md:py-16">
          <Shimmer className="mb-8 h-6 w-52" />
          <CardGridSkeleton />
        </section>
      </Container>
    </>
  );
}
export function EventListSkeleton() {
  return (
    <section className="py-14 md:py-20">
      <Loading>Loading events</Loading>
      <Shimmer className="mb-8 h-6 w-32" />
      <div className="grid gap-12 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i}>
            <Shimmer className="aspect-[3/2]" />
            <Shimmer className="mt-5 h-2.5 w-44" />
            <Shimmer className="mt-4 h-6 w-3/4" />
            <Shimmer className="mt-3 h-3.5 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}
export function EventSkeleton() {
  return (
    <Container className="pb-16 pt-10 md:pb-24 md:pt-14">
      <Loading>Loading event</Loading>
      <Shimmer className="h-4 w-24" />
      <Shimmer className="mx-auto mt-6 aspect-[3/2] max-w-5xl" />
      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Shimmer className="h-2.5 w-36" />
          <Shimmer className="mt-4 h-9 w-5/6" />
          <Shimmer className="mt-3 h-4 w-2/3" />
          <div className="mt-6 grid gap-3 border-y border-ink/15 py-5 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Shimmer key={i} className="h-4 w-3/5" />
            ))}
          </div>
          <TextLines className="mt-8" widths={["w-full", "w-11/12", "w-full", "w-2/3"]} />
        </div>
        <div className="space-y-5 bg-paper p-6 sm:p-8 lg:col-span-5">
          <Shimmer className="h-6 w-2/3" />
          {[0, 1, 2].map((i) => (
            <Shimmer key={i} className="h-11" />
          ))}
        </div>
      </div>
    </Container>
  );
}
