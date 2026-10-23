import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
export const shell =
  "mx-auto w-[calc(100%-2.5rem)] max-w-7xl sm:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)]";
export const sectionSpace = "py-20 md:py-28";
// Display sizes assume Songbird's 50% size-adjust (see app/layout.tsx).
export const display =
  "font-heading text-[2.375rem] leading-[1.06] tracking-[-0.02em] sm:text-[2.875rem] lg:text-[3.375rem]";
export const heading =
  "font-heading text-[2rem] leading-[1.08] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[2.875rem]";
export const subheading =
  "font-heading text-[1.625rem] leading-[1.12] tracking-[-0.015em] md:text-[1.875rem]";
export const title =
  "font-heading text-[1.375rem] leading-[1.15] tracking-[-0.01em] md:text-[1.5rem]";
export const lead =
  "font-serif text-[1.375rem] leading-[1.45] md:text-[1.625rem]";
export const prose = "font-serif text-lg leading-[1.7] md:text-xl";
export const label =
  "font-sans text-[0.6875rem] font-medium uppercase leading-relaxed tracking-[0.14em] font-stretch-expanded";
export const meta = "font-sans text-[0.8125rem] leading-relaxed";

// Order runs deep green → light → sunshine → deep earth, like a proof strip.
export const palette = [
  "bg-forest",
  "bg-sage",
  "bg-lime",
  "bg-straw",
  "bg-sunshine",
  "bg-orange",
  "bg-rust",
  "bg-earth",
] as const;
export function ColorBar({
  className = "",
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn("flex h-2", className)}>
      {palette.map((color, i) => (
        <span
          key={color}
          className={cn(
            "flex-1 origin-left",
            animated && "motion-safe:animate-draw",
            color,
          )}
          style={animated ? { animationDelay: `${300 + i * 60}ms` } : undefined}
        />
      ))}
    </div>
  );
}

const buttonVariants = {
  ink: "bg-ink text-white hover:bg-forest",
  lime: "bg-lime text-ink hover:bg-white",
  orange: "bg-orange text-ink hover:bg-sunshine",
  sunshine: "bg-sunshine text-ink hover:bg-white",
  white: "bg-white text-ink hover:bg-lime",
  outline:
    "border border-current hover:border-ink hover:bg-ink hover:text-white",
  "outline-light":
    "border border-white/50 text-white hover:border-white hover:bg-white hover:text-ink",
} as const;
export type ButtonVariant = keyof typeof buttonVariants;
export function buttonStyles(variant: ButtonVariant = "ink", className = "") {
  return cn(
    "group inline-flex min-h-12 items-center justify-between gap-6 px-6 py-3 font-sans text-[0.8125rem] font-medium leading-snug tracking-[0.01em] font-stretch-semi-expanded transition-colors duration-200 motion-safe:active:scale-[0.98] disabled:cursor-wait disabled:opacity-60",
    buttonVariants[variant],
    className,
  );
}
export function ArrowIcon({
  Icon = ArrowUpRight,
  size = 17,
}: {
  Icon?: typeof ArrowUpRight;
  size?: number;
}) {
  return (
    <Icon
      size={size}
      aria-hidden="true"
      className="shrink-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out-soft motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
    />
  );
}

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(shell, className)}>{children}</div>;
}
export function Eyebrow({
  children,
  className = "",
  swatch = "bg-current",
}: {
  children: React.ReactNode;
  className?: string;
  swatch?: string;
}) {
  return (
    <p className={cn(label, "flex items-center gap-3", className)}>
      <span aria-hidden="true" className={cn("size-2 shrink-0", swatch)} />
      {children}
    </p>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
  accent = "text-forest",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  accent?: string;
}) {
  return (
    <header className="border-b border-ink/15 pb-14 pt-14 md:pb-20 md:pt-20">
      <Eyebrow className={accent}>{eyebrow}</Eyebrow>
      <h1 className={cn(display, "mt-7 max-w-4xl whitespace-pre-line")}>
        {title}
      </h1>
      {description && (
        <p className={cn(lead, "mt-7 max-w-2xl text-ink/80")}>{description}</p>
      )}
      {children}
    </header>
  );
}
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "group inline-flex min-h-11 items-center gap-3 border-b border-current py-2 font-sans text-[0.8125rem] font-medium transition-colors hover:text-forest",
        className,
      )}
    >
      {children}
      <ArrowIcon size={15} />
    </a>
  );
}
