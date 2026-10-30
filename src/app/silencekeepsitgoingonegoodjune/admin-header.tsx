import Link from "next/link";
import { ADMIN_PATH } from "@/lib/admin-path";
import { Download, LogOut } from "lucide-react";
import { buttonStyles, label } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { logout } from "./actions";
const tabs = [
  { view: "programs", label: "Programs & payments", href: ADMIN_PATH },
  {
    view: "events",
    label: "Event registrations",
    href: `${ADMIN_PATH}?view=events`,
  },
];
export function AdminHeader({
  title,
  view,
  exportHref,
}: {
  title: string;
  view: "programs" | "events";
  exportHref: string;
}) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 pt-10">
        <div>
          <p className={cn(label, "text-forest")}>Admin</p>
          <h1 className="mt-3 font-heading text-[2rem] leading-none tracking-[-0.02em]">
            {title}
          </h1>
        </div>
        <div className="flex gap-3">
          <a
            href={exportHref}
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
      <nav
        aria-label="Admin sections"
        className="mb-8 mt-6 flex gap-6 border-b border-ink/15"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.view}
            href={tab.href}
            aria-current={tab.view === view ? "page" : undefined}
            className="-mb-px inline-flex min-h-12 items-center border-b-2 border-transparent font-sans text-sm font-medium text-ink/70 hover:text-ink aria-[current=page]:border-forest aria-[current=page]:text-ink"
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
