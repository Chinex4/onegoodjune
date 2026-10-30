"use client";
import { useSyncExternalStore } from "react";
import { getCountdown } from "@/lib/countdown";
import { label } from "./primitives";
import { cn } from "@/lib/utils";
const subscribe = (callback: () => void) => {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
};
const snapshot = () => Math.floor(Date.now() / 1000);
const serverSnapshot = () => null;
export function Countdown({ className = "" }: { className?: string }) {
  const now = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const time = now === null ? null : getCountdown(now * 1000);
  if (time?.complete)
    return (
      <p
        className={cn(
          "border-y border-current/20 py-6 font-serif text-xl",
          className,
        )}
        role="status"
      >
        The scheduled launch date has arrived. Get in touch for course
        availability.
      </p>
    );
  return (
    <div className={className}>
      <p className={cn(label, "opacity-70")}>
        Launching January 15, 2027 · Lagos time
      </p>
      <div
        role="timer"
        aria-label="Time until January 15, 2027"
        className="mt-4 grid max-w-2xl grid-cols-4 border-y border-current/20"
      >
        {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
          <div
            key={unit}
            className="border-l border-current/15 px-3 py-5 first:border-l-0 first:pl-0 sm:px-5"
          >
            <span className="block font-sans text-[2rem] font-semibold leading-none tabular-nums tracking-[-0.02em] text-orange font-stretch-semi-expanded sm:text-[3rem] md:text-[3.5rem]">
              {time ? String(time[unit]).padStart(2, "0") : "—"}
            </span>
            <span
              className={cn(label, "mt-3 block text-[0.625rem] opacity-70")}
            >
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
