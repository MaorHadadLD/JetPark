"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion, useScrollProgress } from "@/lib/motion";
import { photos } from "@/lib/photos";

/**
 * First screen: the terminal seen through an aircraft window.
 * As the page scrolls, only the opening grows until the picture fills the
 * screen. The photograph itself never moves, apart from a slow settle.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onFrame = useCallback((p: number) => {
    // The window opens over the first 75% of the held scroll, then rests full-bleed.
    const open = Math.min(1, p / 0.75);
    const eased = 1 - Math.pow(1 - open, 2);
    media.current?.style.setProperty("--p", eased.toFixed(4));
    if (img.current) img.current.style.transform = `scale(${(1.08 - 0.08 * eased).toFixed(4)})`;
    if (copy.current) {
      const fade = Math.min(1, open / 0.4);
      copy.current.style.opacity = String(1 - fade);
      copy.current.style.transform = `translateY(${(-48 * fade).toFixed(1)}px)`;
      copy.current.style.visibility = fade >= 1 ? "hidden" : "visible";
    }
  }, []);

  useScrollProgress(section, onFrame, !reduced);

  // Under reduced motion the picture is simply open: drop whatever the
  // scroll handler wrote before the preference was known.
  useEffect(() => {
    if (!reduced) return;
    media.current?.style.removeProperty("--p");
    if (img.current) img.current.style.transform = "";
    if (copy.current) {
      copy.current.style.opacity = "";
      copy.current.style.transform = "";
      copy.current.style.visibility = "";
    }
  }, [reduced]);

  const hero = photos.hero;

  return (
    <section
      id="top"
      ref={section}
      className="hero"
      data-reduced={reduced ? "true" : "false"}
      aria-labelledby="hero-title"
    >
      <div className="hero-stage">
        <div ref={media} className="hero-media">
          <div ref={img} className="hero-img">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: hero.position }}
            />
          </div>
          <div className="hero-scrim" aria-hidden="true" />
        </div>

        <div ref={copy} className="hero-copy">
          <h1 id="hero-title" className="hero-title display">
            <span>אתם לטיסה.</span>
            <span>אנחנו לרכב.</span>
          </h1>
          <div className="hero-aside">
            <p>
              נציג JetPark מקבל מכם את הרכב לפני הטיסה, ומחזיר לכם אותו כשאתם חוזרים. בטרמינל 1 ובטרמינל 3 בנתב״ג.
            </p>
            <a href="#booking" className="btn btn-primary">
              לתיאום מסירה וקבלה
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M15 9H3M7.5 4.5 3 9l4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
