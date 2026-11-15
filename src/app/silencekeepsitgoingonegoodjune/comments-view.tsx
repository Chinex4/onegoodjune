import { buttonStyles } from "@/components/site/primitives";
import { engagementTotals, listAllComments } from "@/lib/engagement";
import { cn } from "@/lib/utils";
import { moderateComment } from "./actions";
import { AdminHeader } from "./admin-header";
import { ConfirmButton } from "./confirm-button";
const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});
const small = "min-h-9 px-3 text-[0.75rem]";
export async function CommentsView({
  params,
}: {
  params: { q?: string; status?: string };
}) {
  const filters = {
    q: params.q?.slice(0, 100) || undefined,
    status: ["visible", "hidden"].includes(params.status || "")
      ? params.status
      : undefined,
  };
  const [rows, totals] = await Promise.all([
    listAllComments(filters),
    engagementTotals(),
  ]);
  return (
    <>
      <AdminHeader title="Pub comments" view="comments" />
      <section
        aria-label="Totals"
        className="grid gap-3 sm:grid-cols-3"
      >
        {[
          ["Likes", totals.likes],
          ["Live comments", totals.comments],
          ["Hidden comments", totals.hidden],
        ].map(([name, value]) => (
          <div key={name} className="bg-paper p-5">
            <p className="font-sans text-[0.8125rem] font-medium">{name}</p>
            <p className="mt-3 font-heading text-[2rem] leading-none">
              {value.toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </section>
      <p className="mt-6 font-serif text-lg text-ink/75">
        Comments go live as soon as readers post them. Hide one to take it off
        the site while keeping a record, or delete it for good.
      </p>
      <form className="mt-6 flex flex-wrap items-end gap-3 border-y border-ink/10 py-5">
        <input type="hidden" name="view" value="comments" />
        <label className="grid gap-1 font-sans text-[0.75rem] font-medium">
          Status
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="min-h-11 border border-ink/25 bg-white px-3 text-sm"
          >
            <option value="">All comments</option>
            <option value="visible">Live</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <label className="grid flex-1 gap-1 font-sans text-[0.75rem] font-medium">
          Search
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Name, comment or publication"
            className="min-h-11 min-w-56 border border-ink/25 bg-white px-3 text-sm"
          />
        </label>
        <button className={buttonStyles("ink", "min-h-11 px-5")}>Filter</button>
      </form>
      <p className="mt-6 font-sans text-sm text-ink/70" role="status">
        {rows.length} comment{rows.length === 1 ? "" : "s"}
      </p>
      <ol className="mt-3 divide-y divide-ink/10 border-y border-ink/10 pb-16 font-sans text-sm">
        {rows.map((row) => {
          const id = String(row._id);
          return (
            <li
              key={id}
              className={cn("grid gap-3 py-5 md:grid-cols-[1fr_auto]", row.hidden && "opacity-60")}
            >
              <div>
                <p>
                  <span className="font-semibold">{row.name}</span>
                  <span className="text-ink/60">
                    {" · "}
                    {dateFormat.format(row.createdAt)}
                    {" · "}
                    <a
                      href={`/pubs/${row.slug}#comments`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-forest"
                    >
                      {row.postTitle}
                    </a>
                  </span>
                  {row.hidden && (
                    <span className="ml-2 inline-block bg-mist px-2 py-0.5 text-[0.75rem] font-semibold">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="mt-2 max-w-3xl whitespace-pre-line break-words font-serif text-lg leading-[1.4]">
                  {row.body}
                </p>
              </div>
              <form action={moderateComment} className="flex items-start gap-2">
                <input type="hidden" name="id" value={id} />
                <button
                  name="action"
                  value={row.hidden ? "show" : "hide"}
                  className={buttonStyles("outline", small)}
                >
                  {row.hidden ? "Show" : "Hide"}
                </button>
                <ConfirmButton
                  name="action"
                  value="delete"
                  message={`Delete ${row.name}'s comment permanently? This can't be undone.`}
                  className={cn(buttonStyles("outline", small), "text-rust")}
                >
                  Delete
                </ConfirmButton>
              </form>
            </li>
          );
        })}
      </ol>
      {!rows.length && (
        <p className="py-10 font-serif text-lg text-ink/70">
          No comments match these filters yet.
        </p>
      )}
    </>
  );
}
