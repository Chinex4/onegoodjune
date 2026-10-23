"use client";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { y: [12, 0], opacity: [0.7, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function HeroWordmark() {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="block text-[4.7vw] leading-[2.1] tracking-[-0.055em] sm:text-[4.8vw] xl:text-[60px]"
      initial={false}
      animate={reduced ? undefined : { y: [8, 0], opacity: [0.8, 1] }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      ONEGOODJUNE
    </motion.span>
  );
}
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  // Keep the server/client tree identical; CSS hides decorative progress for
  // reduced-motion users before hydration as well as after it.
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-forest motion-reduce:hidden"
    />
  );
}
export function HoverFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
