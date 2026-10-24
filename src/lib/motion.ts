"use client";

import { useEffect, useState, type RefObject } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Calls `onFrame` with how far the page has scrolled through `ref`:
 * 0 when the section's top meets the viewport top, 1 when its bottom meets the
 * viewport bottom. Writes happen inside requestAnimationFrame and never touch
 * React state, so scrolling never re-renders.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onFrame: (progress: number, el: HTMLElement) => void,
  enabled = true,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let visible = true;

    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? -rect.top / travel : rect.top <= 0 ? 1 : 0;
      onFrame(Math.min(1, Math.max(0, p)), el);
    };
    const schedule = () => {
      if (!raf && visible) raf = requestAnimationFrame(measure);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, onFrame, enabled]);
}
