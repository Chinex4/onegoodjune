"use client";
import { cn } from "@/lib/utils";
export function AnalyticsPreferencesLink({ enabled, className }: { enabled: boolean; className?: string }) {
  if (!enabled) return null;
  return <button type="button" onClick={() => window.dispatchEvent(new Event("ogj-open-analytics-preferences"))} className={cn("inline-flex min-h-10 items-center text-left hover:text-lime", className)}>Analytics preferences</button>;
}
