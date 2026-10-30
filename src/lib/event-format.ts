// Events are scheduled in Lagos time (WAT); show them that way everywhere.
const zone = { timeZone: "Africa/Lagos" } as const;
export const eventDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    ...zone,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
export const eventTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    ...zone,
    hour: "numeric",
    minute: "2-digit",
  })
    .format(new Date(iso))
    .replace(":00", "") + " WAT";
export const eventDay = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { ...zone, day: "2-digit" }).format(
    new Date(iso),
  );
export const eventMonth = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { ...zone, month: "short" }).format(
    new Date(iso),
  );
export const isUpcoming = (iso: string, now = Date.now()) =>
  Date.parse(iso) > now;
