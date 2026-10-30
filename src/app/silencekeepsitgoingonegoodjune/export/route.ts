import { isAdmin } from "@/lib/admin-auth";
import { listRegistrations } from "@/lib/registrations";
import { listEventRegistrations } from "@/lib/event-registrations";
// Neutralise spreadsheet formulas and quote every cell.
const cell = (value: unknown) => {
  const text = value == null ? "" : String(value);
  return `"${(/^[=+\-@]/.test(text) ? `'${text}` : text).replace(/"/g, '""')}"`;
};
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const params = new URL(request.url).searchParams;
  if (params.get("view") === "events") return exportEvents(params);
  const rows = await listRegistrations({
    program: params.get("program") || undefined,
    status: params.get("status") || undefined,
    q: params.get("q")?.slice(0, 100) || undefined,
  });
  const header = [
    "Created",
    "Name",
    "Email",
    "Phone",
    "Program",
    "Amount (NGN)",
    "Status",
    "Paid at",
    "Reference",
  ];
  const csv = [
    header.map(cell).join(","),
    ...rows.map((r) =>
      [
        r.createdAt.toISOString(),
        r.name,
        r.email,
        r.phone,
        r.programName,
        r.amount / 100,
        r.status,
        r.paidAt?.toISOString(),
        r.reference,
      ]
        .map(cell)
        .join(","),
    ),
  ].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="onegoodjune-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
async function exportEvents(params: URLSearchParams) {
  const rows = await listEventRegistrations({
    event: params.get("event") || undefined,
    q: params.get("q")?.slice(0, 100) || undefined,
  });
  const header = ["Registered", "Name", "Email", "Event", "Question", "Answer"];
  return csvResponse(
    [
      header.map(cell).join(","),
      ...rows.map((r) =>
        [
          r.createdAt.toISOString(),
          r.name,
          r.email,
          r.eventTitle,
          r.question,
          r.answer,
        ]
          .map(cell)
          .join(","),
      ),
    ].join("\r\n"),
    "event-registrations",
  );
}
function csvResponse(csv: string, name: string) {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="onegoodjune-${name}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
