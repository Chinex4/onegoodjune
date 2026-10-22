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
      whileInView={reduced ? undefined : { y: [24, 0], opacity: [0.45, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function HeroWordmark() {
  const reduced = useReducedMotion();
  return (
    <span className="block text-[5.8vw] leading-[2] tracking-[-0.055em] sm:text-[5.9vw] xl:text-[76px]">
      <span className="sr-only">ONEGOODJUNE</span>
      {"ONEGOODJUNE".split("").map((letter, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={false}
          animate={
            reduced
              ? undefined
              : { y: [22, 0], opacity: [0.25, 1], rotate: [-2, 0] }
          }
          transition={{
            duration: 0.8,
            delay: i * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  return reduced ? null : (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-forest"
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
      whileHover={reduced ? undefined : { y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
