// All public dates use the client's format and Lagos time.
export function heroDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "2-digit", year: "numeric", timeZone: "Africa/Lagos",
  }).format(new Date(value));
}
