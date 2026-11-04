"use client";
export function AnalyticsPreferencesLink({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <button type="button" onClick={() => window.dispatchEvent(new Event("ogj-open-analytics-preferences"))} className="inline-flex min-h-10 items-center text-left hover:text-lime">Analytics preferences</button>;
}
