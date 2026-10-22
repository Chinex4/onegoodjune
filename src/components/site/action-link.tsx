import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
export function ActionLink({
  href,
  children,
  variant = "dark",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "plain";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        variant === "plain"
          ? "inline-flex min-h-11 items-center py-2 font-sans text-xs transition-colors hover:text-forest"
          : "group inline-flex min-h-12 items-center justify-between gap-8 rounded-sm border border-transparent px-5 py-4 font-sans text-xs leading-relaxed transition-colors",
        variant === "dark" && "bg-ink text-white hover:bg-forest",
        variant === "light" && "bg-lime text-ink hover:bg-straw",
        className,
      )}
    >
      {children}
      {variant !== "plain" && (
        <ArrowUpRight
          size={18}
          aria-hidden="true"
          className="transition-transform motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}
