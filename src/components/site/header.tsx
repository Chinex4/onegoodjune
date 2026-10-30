"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Suspense, useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { navigation, site } from "@/lib/site-config";
import { label, palette, shell, buttonStyles, ArrowIcon } from "./primitives";
import { SocialLinks } from "./footer";
import { cn } from "@/lib/utils";
type NavProps = {
  item: { href: string; label: string };
  className: string;
  onClick?: () => void;
  children?: React.ReactNode;
};
function ActiveLink({ item, className, onClick, children }: NavProps) {
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
      {children ?? item.label}
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
          {props.children ?? props.item.label}
        </Link>
      }
    >
      <ActiveLink {...props} />
    </Suspense>
  );
}
const desktopLink =
  "relative inline-flex min-h-11 items-center font-sans text-[0.8125rem] font-medium transition-colors hover:text-forest aria-[current=page]:text-forest after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100";
export function Header() {
  const menu = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
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
      className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80"
    >
      <div className={cn(shell, "flex h-[4.5rem] items-center gap-8 md:h-20")}>
        <Link
          href="/"
          aria-label="OneGoodJune home"
          className="font-heading text-[1.5rem] leading-none tracking-[-0.03em] md:text-[1.75rem]"
        >
          ONEGOODJUNE
        </Link>
        <nav
          aria-label="Main navigation"
          className="ml-auto hidden items-center gap-7 lg:flex xl:gap-9"
        >
          {navigation
            .filter((item) => item.href !== "/")
            .map((item) => (
              <NavItem key={item.href} item={item} className={desktopLink} />
            ))}
        </nav>
        <Link
          href="/contact"
          className={buttonStyles(
            "ink",
            "hidden min-h-11 gap-4 px-5 xl:inline-flex",
          )}
        >
          Get in touch
          <ArrowIcon size={15} />
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => {
            menu.current?.showModal();
            setOpen(true);
          }}
          className="group -mr-2 ml-auto grid size-12 place-items-center lg:hidden"
        >
          <span aria-hidden="true" className="flex w-8 flex-col gap-[6px]">
            <span className="h-[2px] w-8 bg-current motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
            <span className="h-[2px] w-8 bg-current motion-safe:transition-transform motion-safe:group-hover:-translate-x-1" />
          </span>
        </button>
      </div>
      <dialog
        ref={menu}
        id="site-navigation"
        onClose={() => setOpen(false)}
        aria-label="Navigation"
        className="ground-dark fixed inset-0 m-0 h-dvh max-h-dvh w-screen max-w-none overflow-y-auto p-0 backdrop:bg-black"
      >
        <div className={cn(shell, "flex min-h-full flex-col pb-10")}>
          <div className="flex h-[4.5rem] items-center justify-between md:h-20">
            <Link
              href="/"
              onClick={close}
              className="font-heading text-[1.5rem] leading-none tracking-[-0.03em] md:text-[1.75rem]"
            >
              ONEGOODJUNE
            </Link>
            <button
              type="button"
              aria-label="Close navigation"
              className="-mr-2.5 grid size-12 place-items-center transition-colors hover:text-lime"
              onClick={close}
            >
              <X size={26} strokeWidth={1.6} />
            </button>
          </div>
          <motion.nav
            aria-label="Mobile navigation"
            className="my-10 flex flex-col border-t border-white/15"
            initial={false}
            animate={open ? "open" : "closed"}
            variants={{ open: { transition: { staggerChildren: 0.04 } } }}
          >
            {navigation.map((item, i) => (
              <motion.div
                key={item.href}
                variants={{
                  closed: { opacity: 1, y: 0 },
                  open: { opacity: [0, 1], y: [12, 0] },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <NavItem
                  item={item}
                  onClick={close}
                  className="group flex items-center gap-5 border-b border-white/15 py-4 transition-colors hover:text-lime aria-[current=page]:text-lime sm:py-5"
                >
                  <span
                    aria-hidden="true"
                    className={cn(label, "w-7 text-white/50")}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-[1.875rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ml-auto size-3 scale-0 transition-transform duration-300 group-hover:scale-100 group-aria-[current=page]:scale-100",
                      palette[(i * 3) % palette.length],
                    )}
                  />
                </NavItem>
              </motion.div>
            ))}
          </motion.nav>
          <div className="mt-auto grid gap-8 sm:grid-cols-2 sm:items-end">
            <div>
              <Link
                href="/contact"
                onClick={close}
                className={buttonStyles("lime", "w-full sm:w-auto")}
              >
                Get in touch
                <ArrowIcon />
              </Link>
              <a
                href={site.links.email}
                className="mt-5 block font-serif text-lg text-white/80 hover:text-lime"
              >
                sayhi@onegoodjune.com
              </a>
            </div>
            <SocialLinks dark className="sm:justify-end" />
          </div>
        </div>
      </dialog>
    </header>
  );
}
