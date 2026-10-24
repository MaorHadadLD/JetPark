"use client";

import { useEffect } from "react";

/**
 * Opts the page into entrance motion. Without this script every element stays
 * visible: the hidden starting state only exists under `html.js`.
 */
export function RevealRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const vh = window.innerHeight;

    // Whatever is already on screen is shown as is, so nothing flashes.
    for (const el of items) {
      const top = el.getBoundingClientRect().top;
      if (top < vh * 0.9) el.classList.add("is-in");
    }
    root.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of items) if (!el.classList.contains("is-in")) io.observe(el);

    return () => io.disconnect();
  }, []);

  return null;
}
