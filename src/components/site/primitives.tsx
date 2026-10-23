import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
export const shell =
  "mx-auto w-[calc(100%-2.75rem)] max-w-7xl sm:w-[calc(100%-5rem)] lg:w-[calc(100%-8rem)]";
export const sectionSpace = "py-16 md:py-24";
export const heading =
  "font-heading text-[19px] leading-[1.9] tracking-[-0.04em] sm:text-[22px] lg:text-[25px]";
export const subheading =
  "font-heading text-[17px] leading-[1.9] tracking-[-0.035em] md:text-[20px]";
export const label =
  "font-sans text-[13px] leading-relaxed tracking-[0.12em] uppercase";
export const prose = "text-base leading-[1.75] md:text-lg";
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn(label, className)}>{children}</p>;
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-ink/15 pb-12 pt-16 md:pb-16 md:pt-24">
      <Eyebrow className="mb-8 text-forest">{eyebrow}</Eyebrow>
      <h1 className={cn(heading, "max-w-4xl whitespace-pre-line")}>{title}</h1>
      {description && (
        <p className="mt-8 max-w-2xl text-lg leading-relaxed">{description}</p>
      )}
      {children}
    </header>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex min-h-11 items-center gap-8 border-b border-current py-3 font-sans text-[13px] transition-colors hover:text-forest"
    >
      {children}
      <ArrowUpRight
        size={18}
        className="transition-transform motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1"
        aria-hidden="true"
      />
    </a>
  );
}
