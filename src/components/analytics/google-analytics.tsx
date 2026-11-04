"use client";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { analyticsLocation, analyticsPromptPath, analyticsReferrer, GA_ID, trackablePath } from "@/lib/analytics";

type Consent = "accepted" | "declined" | "unset";
const storageKey = "ogj-analytics-consent";
let memoryConsent: Consent = "unset";
function snapshot(): Consent {
  try {
    const value = localStorage.getItem(storageKey);
    return value === "accepted" || value === "declined" ? value : memoryConsent;
  } catch { return memoryConsent; }
}
const serverSnapshot = (): Consent => "unset";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ogj-analytics-consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ogj-analytics-consent", callback);
  };
}
declare global {
interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean | undefined;
}
}
function choose(value: Consent) {
  memoryConsent = value;
  try { localStorage.setItem(storageKey, value); } catch { /* Session-only preference when storage is blocked. */ }
  const w = window;
  w[`ga-disable-${GA_ID}`] = value !== "accepted";
  w.gtag?.("consent", "update", { analytics_storage: value === "accepted" ? "granted" : "denied" });
  if (value !== "accepted") {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.trim().split("=")[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      const expired = `${name}=; Max-Age=0; path=/`;
      document.cookie = expired;
      for (const domain of new Set([location.hostname, location.hostname.replace(/^www\./, "")])) document.cookie = `${expired}; domain=.${domain}`;
    }
  }
  window.dispatchEvent(new Event("ogj-analytics-consent"));
}
export function GoogleAnalytics({ enabled }: { enabled: boolean }) {
  const path = usePathname();
  const consent = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [preferences, setPreferences] = useState(false);
  useEffect(() => {
    const open = () => setPreferences(true);
    window.addEventListener("ogj-open-analytics-preferences", open);
    return () => window.removeEventListener("ogj-open-analytics-preferences", open);
  }, []);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);
  const previous = useRef<string | null>(null);
  const initialReferrer = useRef("");
  const allowed = enabled && /^G-[A-Z0-9]+$/.test(GA_ID) && trackablePath(path);
  useEffect(() => {
    const w = window;
    w[`ga-disable-${GA_ID}`] = !allowed || consent !== "accepted";
    if (!allowed || consent !== "accepted" || !ready) {
      previous.current = null;
      return;
    }
    if (previous.current === path) return;
    w.gtag?.("event", "page_view", {
      page_location: analyticsLocation(location.origin, path),
      page_referrer: previous.current ? analyticsLocation(location.origin, previous.current) : initialReferrer.current,
    });
    previous.current = path;
  }, [allowed, consent, ready, path]);
  if (!allowed) return null;
  const select = (value: Consent) => { choose(value); setPreferences(false); };
  return <>
    {consent === "accepted" && <Script
      id="ogj-google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
      onReady={() => {
        if (snapshot() !== "accepted" || !trackablePath(location.pathname)) return;
        const w = window;
        w[`ga-disable-${GA_ID}`] = false;
        w.dataLayer = w.dataLayer || [];
        w.gtag = w.gtag || function () {
          // Preserve the command-record format used by Google’s gtag snippet.
          // eslint-disable-next-line prefer-rest-params
          w.dataLayer!.push(arguments);
        };
        if (!initialized.current) {
          initialReferrer.current = analyticsReferrer(document.referrer);
          w.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
          w.gtag("js", new Date());
          w.gtag("config", GA_ID, { send_page_view: false, page_location: analyticsLocation(location.origin, location.pathname), page_referrer: initialReferrer.current, allow_google_signals: false, allow_ad_personalization_signals: false });
          initialized.current = true;
        }
        setReady(true);
      }} />}
    {analyticsPromptPath(path) && (consent === "unset" || preferences) ? <aside aria-label="Analytics preferences" className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-sm border border-ink/20 bg-white p-3 text-ink shadow-lg sm:p-4">
      <p className="font-sans text-xs font-semibold">Analytics preferences</p>
      <p className="mt-1.5 font-serif text-sm leading-normal">Allow Google Analytics to help us understand how this website is used? <Link href="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link></p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => select("accepted")} className="min-h-11 bg-ink px-3 font-sans text-xs text-white hover:bg-forest">Accept analytics</button>
        <button type="button" onClick={() => select("declined")} className="min-h-11 border border-ink px-3 font-sans text-xs hover:bg-paper">Decline analytics</button>
      </div>
    </aside> : null}
  </>;
}
