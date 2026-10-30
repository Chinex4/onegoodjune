import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArrowIcon, buttonStyles, type ButtonVariant } from "./primitives";
// One CTA style for internal routes, in-page anchors, mailto and external links.
export function ActionLink({
  href,
  children,
  variant = "ink",
  icon = ArrowUpRight,
  newTab,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  icon?: typeof ArrowUpRight;
  newTab?: boolean;
  className?: string;
}) {
  const content = (
    <>
      {children}
      <ArrowIcon Icon={icon} />
    </>
  );
  const classes = buttonStyles(variant, className);
  if (href.startsWith("/") && !href.startsWith("//"))
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  return (
    <a
      href={href}
      className={classes}
      {...((newTab ?? /^https?:/.test(href)) && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {content}
    </a>
  );
}
