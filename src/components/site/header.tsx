"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowUpRight } from "lucide-react";
import { Suspense, useRef, useState, useEffect } from "react";
import { navigation } from "@/lib/site-config";
import { shell } from "./primitives";
import { motion, useReducedMotion } from "motion/react";
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
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const close = () => {
    menu.current?.close();
    setOpen(false);
  };
  return (
    <header
      id="top"
      className={cn(shell, "flex h-24 items-center justify-between gap-6")}
    >
      <Link
        href="/"
        aria-label="OneGoodJune home"
        className="font-heading text-[13px] sm:text-[14px] leading-loose tracking-[-0.06em]"
      >
        ONEGOODJUNE
      </Link>
      <nav
        aria-label="Main navigation"
        className="ml-auto hidden items-center gap-8 lg:flex"
      >
        {navigation
          .filter((item) =>
            ["/about", "/read-pubs", "/submissions"].includes(item.href),
          )
          .map((item) => (
            <NavItem
              key={item.href}
              item={item}
              className="inline-flex min-h-11 items-center font-sans text-sm hover:text-forest aria-[current=page]:text-forest"
            />
          ))}
      </nav>
      <Link
        href="/contact"
        className="group hidden min-h-11 items-center gap-4 bg-black px-4 text-white font-sans text-[13px] transition-colors hover:bg-lime xl:inline-flex"
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
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => {
          menu.current?.showModal();
          setOpen(true);
        }}
        className="group flex min-h-12 w-[76px] items-center justify-end"
      >
        <span aria-hidden="true" className="flex w-12 flex-col gap-[7px]">
          <span className="h-[2px] w-12 bg-current motion-safe:transition-transform motion-safe:group-hover:translate-y-0.5" />
          <span className="h-[2px] w-12 bg-current motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5" />
        </span>
      </button>
      <dialog
        ref={menu}
        id="site-navigation"
        onClose={() => setOpen(false)}
        aria-label="Navigation"
        className="fixed inset-0 m-0 h-dvh max-h-dvh w-screen max-w-none overflow-y-auto bg-black p-6 text-white backdrop:bg-black sm:p-10 lg:px-16"
      >
        <div className="flex items-center justify-between pb-8">
          <span className="font-heading text-[13px] sm:text-[14px]">
            ONEGOODJUNE
          </span>
          <button
            type="button"
            aria-label="Close navigation"
            className="grid size-11 place-items-center"
            onClick={close}
          >
            <X />
          </button>
        </div>
        <motion.nav
          aria-label="Mobile navigation"
          className="mx-auto my-8 flex max-w-5xl flex-col sm:my-14"
          initial={false}
          animate={
            open && !reduced
              ? { y: [10, 0], opacity: [0.8, 1] }
              : { y: 0, opacity: 1 }
          }
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              onClick={close}
              className="py-3 font-serif text-2xl transition-colors hover:text-lime aria-[current=page]:text-lime sm:text-4xl"
            />
          ))}
          <Link
            href="/contact"
            className="mt-6 py-5 font-sans text-sm hover:text-lime"
            onClick={close}
          >
            Get in touch ↗
          </Link>
        </motion.nav>
      </dialog>
    </header>
  );
}
