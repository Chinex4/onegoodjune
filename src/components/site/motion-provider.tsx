"use client";
import { MotionConfig } from "motion/react";
// Reduced-motion users get opacity-only transitions everywhere. Doing this once
// here keeps server and client markup identical (no per-component branching).
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
