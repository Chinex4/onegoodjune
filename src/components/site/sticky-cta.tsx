"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// Slides in once every watched section (hero, pricing, closing CTA) is out of
// view, so a primary action is always one tap away on long sales pages.
export function StickyCta({
  watch,
  children,
}: {
  watch: string[];
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const ids = watch.join(" ");
  useEffect(() => {
    const inView = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      setVisible(inView.size === 0);
    });
    for (const id of ids.split(" ")) {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    }
    return () => observer.disconnect();
  }, [ids]);
  return (
    <div
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 text-white backdrop-blur-md transition-[transform,opacity] duration-300 ease-out-soft [--focus-ring:var(--color-lime)] motion-reduce:transition-opacity",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 motion-reduce:translate-y-0",
      )}
    >
      {children}
    </div>
  );
}
