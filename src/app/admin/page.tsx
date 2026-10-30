import type { Metadata } from "next";
import { Suspense } from "react";
import { Download, LogOut } from "lucide-react";
import { isAdmin } from "@/lib/admin-auth";
import { mongoConfigured } from "@/lib/mongodb";
import { programs, formatNaira, getProgram } from "@/lib/programs";
import {
  listRegistrations,
  registrationStats,
  type PaymentStatus,
} from "@/lib/registrations";
import { ColorBar, buttonStyles, label } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { LoginForm } from "./login-form";
import { logout } from "./actions";
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
type Params = Promise<{ program?: string; status?: string; q?: string }>;
const statuses: PaymentStatus[] = ["paid", "pending", "abandoned", "failed"];
const statusStyle: Record<PaymentStatus, string> = {
  paid: "bg-lime text-ink",
  pending: "bg-straw text-ink",
  abandoned: "bg-mist text-ink/75",
  failed: "bg-rust/15 text-rust",
};
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});
async function Dashboard({ searchParams }: { searchParams: Params }) {
  if (!(await isAdmin()))
    return (
      <div className="mx-auto max-w-sm py-24">
        <h1 className="font-heading text-[2rem] leading-none tracking-[-0.02em]">
          Admin
        </h1>
        <p className="mt-3 font-serif text-lg text-ink/75">
          Sign in to see program registrations and payments.
        </p>
        <LoginForm />
      </div>
    );
  if (!mongoConfigured())
    return (
      <p className="py-24 font-serif text-xl">
        MongoDB is not configured. Set MONGODB_URI to see registrations.
      </p>
    );
  const params = await searchParams;
  const filters = {
    program: getProgram(params.program || "") ? params.program : undefined,
    status: statuses.includes(params.status as PaymentStatus)
      ? params.status
      : undefined,
    q: params.q?.slice(0, 100) || undefined,
  };
  const [rows, stats] = await Promise.all([
    listRegistrations(filters),
    registrationStats(),
  ]);
  const query = new URLSearchParams(
    Object.entries(filters).filter((e): e is [string, string] => !!e[1]),
  ).toString();
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 py-10">
        <div>
          <p className={cn(label, "text-forest")}>Admin</p>
          <h1 className="mt-3 font-heading text-[2rem] leading-none tracking-[-0.02em]">
            Program registrations
          </h1>
        </div>
        <div className="flex gap-3">
          <a
            href={`/admin/export${query ? `?${query}` : ""}`}
            className={buttonStyles("outline", "min-h-11 gap-3 px-4")}
          >
            Export CSV
            <Download size={16} aria-hidden="true" />
          </a>
          <form action={logout}>
            <button className={buttonStyles("ink", "min-h-11 gap-3 px-4")}>
              Sign out
              <LogOut size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
      <section
        aria-label="Totals"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {programs.map((program) => {
          const forProgram = stats.filter((s) => s._id.program === program.id);
          const paid = forProgram.find((s) => s._id.status === "paid");
          const total = forProgram.reduce((sum, s) => sum + s.count, 0);
          return (
            <div key={program.id} className="bg-paper p-5">
              <p className="font-sans text-[0.8125rem] font-medium">
                {program.name}
              </p>
              <p className="mt-3 font-heading text-[2rem] leading-none">
                {paid?.count ?? 0}
                <span className="ml-2 font-sans text-sm text-ink/60">
                  paid of {total}
                </span>
              </p>
              <p className="mt-2 font-sans text-[0.8125rem] text-ink/70">
                {formatNaira(paid?.amount ?? 0)} collected
              </p>
            </div>
          );
        })}
      </section>
      <form className="mt-8 flex flex-wrap items-end gap-3 border-y border-ink/10 py-5">
        <label className="grid gap-1 font-sans text-[0.75rem] font-medium">
          Program
          <select
            name="program"
            defaultValue={filters.program ?? ""}
            className="min-h-11 border border-ink/25 bg-white px-3 text-sm"
          >
            <option value="">All programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 font-sans text-[0.75rem] font-medium">
          Payment status
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="min-h-11 border border-ink/25 bg-white px-3 text-sm capitalize"
          >
            <option value="">Any status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="grid flex-1 gap-1 font-sans text-[0.75rem] font-medium">
          Search
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Name, email, phone or reference"
            className="min-h-11 min-w-56 border border-ink/25 bg-white px-3 text-sm"
          />
        </label>
        <button className={buttonStyles("ink", "min-h-11 px-5")}>Filter</button>
      </form>
      <p className="mt-6 font-sans text-sm text-ink/70" role="status">
        {rows.length} registration{rows.length === 1 ? "" : "s"}
      </p>
      <div className="mt-3 overflow-x-auto pb-16">
        <table className="w-full min-w-[56rem] border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-ink/20 text-[0.75rem] uppercase tracking-[0.08em] text-ink/60">
              {[
                "Date",
                "Name",
                "Email",
                "Phone",
                "Program",
                "Amount",
                "Status",
                "Reference",
              ].map((heading) => (
                <th key={heading} scope="col" className="py-3 pr-4 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.reference}
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
                <td className="whitespace-nowrap py-3 pr-4">
                  <a href={`tel:${row.phone.replace(/[^\d+]/g, "")}`}>
                    {row.phone}
                  </a>
                </td>
                <td className="py-3 pr-4">{row.programName}</td>
                <td className="whitespace-nowrap py-3 pr-4">
                  {formatNaira(row.amount)}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 text-[0.75rem] font-semibold capitalize",
                      statusStyle[row.status],
                    )}
                  >
                    {row.status}
                  </span>
                  {row.paidAt && (
                    <span className="mt-1 block whitespace-nowrap text-[0.75rem] text-ink/60">
                      {dateFormat.format(row.paidAt)}
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4 font-mono text-[0.75rem] text-ink/70">
                  {row.reference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="py-10 font-serif text-lg text-ink/70">
            No registrations match these filters yet.
          </p>
        )}
      </div>
    </>
  );
}
export default function AdminPage({ searchParams }: { searchParams: Params }) {
  return (
    <main id="main-content" className="mx-auto w-[calc(100%-2.5rem)] max-w-7xl">
      <ColorBar className="h-1.5" />
      <Suspense fallback={<p className="py-24 font-serif text-xl">Loading…</p>}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
