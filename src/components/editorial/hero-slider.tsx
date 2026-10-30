"use client";
import { Children, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
// Slides are server-rendered children; this only controls which one shows.
export function HeroSlider({
  children,
  interval = 7000,
}: {
  children: React.ReactNode;
  interval?: number;
}) {
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const count = slides.length;
  const playing = count > 1 && !paused && !hovered && !reduced;
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearTimeout(timer);
  }, [playing, index, count, interval]);
  const go = (next: number) => setIndex((next + count) % count);
  const control =
    "grid size-11 place-items-center border border-ink/15 bg-white text-ink transition-colors hover:bg-lime";
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured stories"
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="grid">
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-700 ease-out-soft",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {slide}
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="mt-5 flex items-center gap-2 md:absolute md:bottom-6 md:right-6 md:mt-0">
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => go(index - 1)}
            className={control}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => go(index + 1)}
            className={control}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          {/* Hidden by CSS (not render logic) so server and client markup match. */}
          <button
            type="button"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            onClick={() => setPaused((p) => !p)}
            className={cn(control, "motion-reduce:hidden")}
          >
            {paused ? (
              <Play size={17} aria-hidden="true" />
            ) : (
              <Pause size={17} aria-hidden="true" />
            )}
          </button>
          <div
            className="ml-3 flex gap-1.5"
            role="group"
            aria-label="Choose a story"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show story ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className="grid h-11 w-6 place-items-center"
              >
                <span
                  className={cn(
                    "block h-1.5 transition-all",
                    i === index ? "w-6 bg-orange" : "w-3 bg-ink/25",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
