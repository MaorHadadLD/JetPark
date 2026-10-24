"use client";

import { useEffect, useRef } from "react";

/**
 * A muted clip that only plays while it is on screen, and never under
 * reduced motion: then the poster frame stands in for it.
 */
export function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && !mq.matches) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(video);
    mq.addEventListener("change", sync);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", sync);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="loop-video"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
