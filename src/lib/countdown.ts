// Midnight on launch day in Lagos; one absolute instant in every time zone.
export const COURSE_LAUNCH = "2027-01-15T00:00:00+01:00";
export function getCountdown(now: number) {
  const remaining = Math.max(
    0,
    Math.floor((Date.parse(COURSE_LAUNCH) - now) / 1000),
  );
  return {
    complete: remaining === 0,
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
  };
}
