import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
// A single shared admin password (ADMIN_PASSWORD) unlocks a signed, httpOnly
// session cookie. Rotate ADMIN_SESSION_SECRET to sign everyone out.
export const ADMIN_COOKIE = "ogj_admin";
const MAX_AGE = 60 * 60 * 12;
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32)
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  return value;
}
const sign = (payload: string) =>
  crypto.createHmac("sha256", secret()).update(payload).digest("hex");
const digest = (value: string) =>
  crypto.createHash("sha256").update(value).digest();
export function adminConfigured() {
  return !!process.env.ADMIN_PASSWORD && !!process.env.ADMIN_SESSION_SECRET;
}
export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return crypto.timingSafeEqual(digest(input), digest(expected));
}
export function createSessionToken(now = Date.now()) {
  const expires = String(now + MAX_AGE * 1000);
  return `${expires}.${sign(expires)}`;
}
export function isValidSessionToken(token?: string, now = Date.now()) {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < now) return false;
  const expected = sign(expires);
  return (
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
}
export async function isAdmin() {
  // Session checks depend on the current time, so always run per request.
  await connection();
  if (!adminConfigured()) return false;
  return isValidSessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
}
export async function startSession() {
  (await cookies()).set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}
export async function endSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}
