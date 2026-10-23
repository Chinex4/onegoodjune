"use client";
import { Children, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
const noop = () => () => {};
// Below lg the three plans stack into ~4,500px; a segmented control shows one
// at a time instead. All plans render until hydration and on large screens.
export function PlanSwitcher({
  names,
  initial = 0,
  children,
}: {
  names: string[];
  initial?: number;
  children: React.ReactNode;
}) {
  const [selected, setActive] = useState(initial);
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const active = hydrated ? selected : null;
  const plans = Children.toArray(children);
  return (
    <>
      <div
        role="group"
        aria-label="Compare plans"
        className="sticky top-3 z-10 mb-6 grid grid-cols-3 gap-1 bg-ink p-1 shadow-lg shadow-ink/10 lg:hidden"
      >
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={active === i}
            aria-controls={`plan-${i}`}
            onClick={() => setActive(i)}
            className={cn(
              "min-h-11 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-colors [--focus-ring:var(--color-lime)]",
              active === i
                ? "bg-lime text-ink"
                : "text-white/75 hover:text-white",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-3 lg:gap-6">
        {plans.map((plan, i) => (
          <div
            key={names[i]}
            id={`plan-${i}`}
            className={cn(active !== null && active !== i && "max-lg:hidden")}
          >
            {plan}
          </div>
        ))}
      </div>
    </>
  );
}
