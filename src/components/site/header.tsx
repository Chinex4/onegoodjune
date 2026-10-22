"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Suspense, useRef } from "react";
import { navigation } from "@/lib/site-config";
import { shell } from "./primitives";
import { cn } from "@/lib/utils";
type NavProps = {
  item: { href: string; label: string };
  className: string;
  onClick?: () => void;
};
function ActiveLink({ item, className, onClick }: NavProps) {
  const pathname = usePathname();
  const current =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href + "/"));
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={className}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}
function NavItem(props: NavProps) {
  return (
    <Suspense
      fallback={
        <Link
          href={props.item.href}
          className={props.className}
          onClick={props.onClick}
        >
          {props.item.label}
        </Link>
      }
    >
      <ActiveLink {...props} />
    </Suspense>
  );
}
export function Header() {
  const menu = useRef<HTMLDialogElement>(null);
  return (
    <header
      id="top"
      className={cn(
        shell,
        "flex h-24 items-center justify-between gap-7 border-b border-ink/15",
      )}
    >
      <Link
        href="/"
        aria-label="OneGoodJune home"
        className="font-heading text-[17px] leading-loose tracking-[-0.06em]"
      >
        OneGoodJune
      </Link>
      <nav
        aria-label="Main navigation"
        className="ml-auto hidden items-center gap-5 lg:flex"
      >
        {navigation.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            className="group relative inline-flex min-h-11 items-center font-sans text-[11px] after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
          />
        ))}
      </nav>
      <Link
        href="/contact"
        className="group hidden min-h-11 items-center gap-4 border border-ink px-4 font-sans text-[11px] transition-colors hover:bg-lime xl:inline-flex"
      >
        Get in touch
        <ArrowUpRight
          size={16}
          className="transition-transform motion-safe:group-hover:rotate-45"
        />
      </Link>
      <button
        type="button"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        onClick={() => menu.current?.showModal()}
        className="grid size-11 place-items-center lg:hidden"
      >
        <Menu />
      </button>
      <dialog
        ref={menu}
        aria-label="Navigation"
        className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-md bg-paper p-6 text-ink backdrop:bg-ink/70"
      >
        <div className="flex items-center justify-between border-b border-ink/15 pb-6">
          <span className="font-heading text-base">OneGoodJune</span>
          <button
            type="button"
            aria-label="Close navigation"
            className="grid size-11 place-items-center"
            onClick={() => menu.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="my-8 flex flex-col">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              onClick={() => menu.current?.close()}
              className="border-b border-ink/10 py-4 text-2xl transition-colors hover:text-forest aria-[current=page]:text-forest"
            />
          ))}
          <Link
            href="/contact"
            className="py-5 text-2xl"
            onClick={() => menu.current?.close()}
          >
            Get in touch ↗
          </Link>
        </nav>
      </dialog>
    </header>
  );
}
