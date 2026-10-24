"use client";

import { useEffect, useRef } from "react";

export function Header() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    const hero = document.getElementById("top");
    if (!header || !hero) return;
    let raf = 0;
    // The bar turns solid once the hero picture has scrolled away beneath it.
    const update = () => {
      raf = 0;
      const solid = hero.getBoundingClientRect().bottom <= header.offsetHeight;
      header.setAttribute("data-solid", String(solid));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header ref={ref} className="site-header" data-solid="false">
      <a href="#top" className="wordmark" aria-label="JetPark, לראש העמוד">
        JetPark
      </a>
      <nav aria-label="ניווט ראשי" className="flex items-center gap-5 md:gap-8">
        <a href="#route" className="hidden md:inline">
          איך זה עובד
        </a>
        <a href="#modes" className="hidden md:inline">
          ממריאים וחוזרים
        </a>
        <a href="#questions" className="hidden md:inline">
          שאלות
        </a>
        <a href="#booking" className="btn btn-primary">
          תיאום
        </a>
      </nav>
    </header>
  );
}
