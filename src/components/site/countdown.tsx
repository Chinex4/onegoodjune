"use client";
import { useSyncExternalStore } from "react";
import { getCountdown } from "@/lib/countdown";
const subscribe = (callback: () => void) => {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
};
const snapshot = () => Math.floor(Date.now() / 1000);
const serverSnapshot = () => null;
export function Countdown() {
  const now = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const time = now === null ? null : getCountdown(now * 1000);
  if (time?.complete)
    return (
      <p className="mt-8 border-y border-ink/20 py-6 text-xl" role="status">
        The scheduled launch date has arrived. Get in touch for course
        availability.
      </p>
    );
  return (
    <div className="mt-8">
      <p className="mb-5 font-sans text-[11px] uppercase tracking-widest">
        Launching January 15, 2027 · Lagos time
      </p>
      <div
        role="timer"
        aria-label="Time until January 15, 2027"
        className="grid max-w-xl grid-cols-4 border-y border-ink/20 py-6"
      >
        {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
          <div
            key={unit}
            className="border-r border-ink/15 text-center last:border-0"
          >
            <span className="font-sans text-2xl tabular-nums md:text-4xl">
              {time ? String(time[unit]).padStart(2, "0") : "—"}
            </span>
            <span className="mt-3 block font-sans text-[9px] uppercase tracking-widest">
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
