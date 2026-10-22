import { draftMode } from "next/headers";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response("Forbidden", { status: 403 });
  (await draftMode()).disable();
  return new Response(null, {
    status: 303,
    headers: { Location: "/read-pubs", "Cache-Control": "no-store" },
  });
}
