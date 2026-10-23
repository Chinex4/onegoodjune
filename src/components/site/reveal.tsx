"use client";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
// Content is server-rendered visible; reveals only nudge it on first view.
// MotionProvider drops the movement for reduced-motion users.
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ y: [14, 0], opacity: [0.6, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
const progressGradient =
  "bg-[linear-gradient(90deg,var(--color-forest),var(--color-sage),var(--color-lime),var(--color-straw),var(--color-sunshine),var(--color-orange),var(--color-rust),var(--color-earth))]";
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  // Clip rather than scale so the full palette stays in proportion.
  const clipPath = useTransform(
    progress,
    (value) => `inset(0 ${100 - value * 100}% 0 0)`,
  );
  // Keep the server/client tree identical; CSS hides decorative progress for
  // reduced-motion users before hydration as well as after it.
  return (
    <motion.div
      aria-hidden="true"
      style={{ clipPath }}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] motion-reduce:hidden",
        progressGradient,
      )}
    />
  );
}
