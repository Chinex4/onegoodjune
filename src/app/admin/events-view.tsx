import { buttonStyles } from "@/components/site/primitives";
import {
  eventRegistrationCounts,
  listEventRegistrations,
} from "@/lib/event-registrations";
import { AdminHeader } from "./admin-header";
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});
export async function EventsView({
  params,
}: {
  params: { event?: string; q?: string };
}) {
  const filters = {
    event: /^[a-z0-9-]{1,96}$/.test(params.event || "")
      ? params.event
      : undefined,
    q: params.q?.slice(0, 100) || undefined,
  };
  const [rows, counts] = await Promise.all([
    listEventRegistrations(filters),
    eventRegistrationCounts(),
  ]);
  const query = new URLSearchParams({
    view: "events",
    ...(filters.event && { event: filters.event }),
    ...(filters.q && { q: filters.q }),
  }).toString();
  return (
    <>
      <AdminHeader
        title="Event registrations"
        view="events"
        exportHref={`/admin/export?${query}`}
      />
      <section
        aria-label="Totals"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {counts.map((c) => (
          <div key={c._id} className="bg-paper p-5">
            <p className="font-sans text-[0.8125rem] font-medium">{c.title}</p>
            <p className="mt-3 font-heading text-[2rem] leading-none">
              {c.count}
              <span className="ml-2 font-sans text-sm text-ink/70">
                registered
              </span>
            </p>
          </div>
        ))}
        {!counts.length && (
          <p className="font-serif text-lg text-ink/70">
            No event registrations yet.
          </p>
        )}
      </section>
      <form className="mt-8 flex flex-wrap items-end gap-3 border-y border-ink/10 py-5">
        <input type="hidden" name="view" value="events" />
        <label className="grid gap-1 font-sans text-[0.75rem] font-medium">
          Event
          <select
            name="event"
            defaultValue={filters.event ?? ""}
            className="min-h-11 border border-ink/25 bg-white px-3 text-sm"
          >
            <option value="">All events</option>
            {counts.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid flex-1 gap-1 font-sans text-[0.75rem] font-medium">
          Search
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Name, email or answer"
            className="min-h-11 min-w-56 border border-ink/25 bg-white px-3 text-sm"
          />
        </label>
        <button className={buttonStyles("ink", "min-h-11 px-5")}>Filter</button>
      </form>
      <p className="mt-6 font-sans text-sm text-ink/70" role="status">
        {rows.length} registration{rows.length === 1 ? "" : "s"}
      </p>
      <div className="mt-3 overflow-x-auto pb-16">
        <table className="w-full min-w-[48rem] border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-ink/20 text-[0.75rem] uppercase tracking-[0.08em] text-ink/70">
              {["Registered", "Name", "Email", "Event", "Answer"].map((h) => (
                <th key={h} scope="col" className="py-3 pr-4 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.event}-${row.email}`}
                className="border-b border-ink/10 align-top"
              >
                <td className="whitespace-nowrap py-3 pr-4 text-ink/70">
                  {dateFormat.format(row.createdAt)}
                </td>
                <td className="py-3 pr-4 font-medium">{row.name}</td>
                <td className="py-3 pr-4">
                  <a
                    href={`mailto:${row.email}`}
                    className="underline underline-offset-2"
                  >
                    {row.email}
                  </a>
                </td>
                <td className="py-3 pr-4">{row.eventTitle}</td>
                <td className="py-3 pr-4">
                  {row.answer}
                  {row.question && (
                    <span className="mt-1 block text-[0.75rem] text-ink/70">
                      {row.question}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
