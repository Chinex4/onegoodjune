import { ADMIN_PATH } from "./admin-path";
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-88EXS6ZTJH";
export function trackablePath(path: string) {
  return ![ADMIN_PATH, "/studio", "/api", "/payment", "/consult/book"].some(prefix => path === prefix || path.startsWith(prefix + "/"));
}
export function analyticsLocation(origin: string, path: string) {
  const url = new URL(origin);
  url.pathname = path.split(/[?#]/)[0];
  url.search = "";
  url.hash = "";
  return url.href;
}

export function analyticsReferrer(value: string) {
  try { return new URL(value).origin + "/"; } catch { return ""; }
}

export function analyticsPromptPath(path: string) {
  return trackablePath(path) && !["/sog", "/fiction-course", "/consult", "/spotlight"].some(prefix => path === prefix || path.startsWith(prefix + "/"));
}
