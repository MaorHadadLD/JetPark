"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LENS, span } from "./lens";
import { useReducedMotion, useScrollProgress } from "@/lib/motion";

const STATIONS = [
  {
    id: "plan",
    title: "קודם, מתאמים.",
    body: "בוחרים בכרטיס התיאום מתי ובאיזה טרמינל למסור את הרכב ולקבל אותו בחזרה, ושולחים את פרטי הבקשה.",
    detail: "מה צריך: תאריך, שעה וטרמינל ליציאה ולחזרה.",
  },
  {
    id: "handoff",
    title: "בטרמינל, מוסרים.",
    body: "פוגשים את נציג JetPark בטרמינל לפני הטיסה, ומוסרים לו את הרכב.",
    detail: "השירות פועל בטרמינל 1 ובטרמינל 3 בנתב״ג.",
  },
  {
    id: "away",
    title: "בינתיים, חופשה.",
    body: "אתם בדרך לטיסה ולחופשה. הרכב ממשיך במסלול משלו, עם JetPark.",
    detail: "שני מסלולים נפרדים, עד שנפגשים שוב.",
  },
  {
    id: "return",
    title: "בחזרה, מקבלים.",
    body: "כשאתם חוזרים, נציג JetPark מחזיר לכם את הרכב בטרמינל.",
    detail: "מהטרמינל ממשיכים ברכב שלכם.",
  },
] as const;

type Refs = {
  approach: React.RefObject<SVGPathElement | null>;
  upper: React.RefObject<SVGPathElement | null>;
  lower: React.RefObject<SVGPathElement | null>;
};

/** The full lens. `stage` lights the points; drawing is driven from outside. */
function LensFigure({
  stage,
  refs,
  className,
  label,
}: {
  stage: number;
  refs?: Refs;
  className?: string;
  label?: string;
}) {
  return (
    <svg
      className={`lens ${className ?? ""}`}
      viewBox="0 0 1040 430"
      data-stage={stage}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={LENS.approach} className="lens-ghost" />
      <path d={LENS.upper} className="lens-ghost" />
      <path d={LENS.lower} className="lens-ghost" />
      <path ref={refs?.approach} d={LENS.approach} pathLength={1} className="lens-line lens-approach" />
      <path ref={refs?.upper} d={LENS.upper} pathLength={1} className="lens-line lens-upper" />
      <path ref={refs?.lower} d={LENS.lower} pathLength={1} className="lens-line lens-lower" />

      <circle cx={LENS.start.x} cy={LENS.start.y} r={10} className="lens-point" data-on={stage >= 0} />
      <circle cx={LENS.handoff.x} cy={LENS.handoff.y} r={16} className="lens-point lens-meet" data-on={stage >= 1} />
      <circle cx={LENS.apex.x} cy={LENS.apex.y} r={10} className="lens-point" data-on={stage >= 2} />
      <circle cx={LENS.back.x} cy={LENS.back.y} r={16} className="lens-point lens-meet" data-on={stage >= 3} />

      <text x={LENS.handoff.x + 82} y={LENS.handoff.y + 58} textAnchor="middle" className="lens-label" data-on={stage >= 1}>
        מסירה בטרמינל
      </text>
      <text x={LENS.apex.x} y={LENS.apex.y - 26} textAnchor="middle" className="lens-label" data-on={stage >= 2}>
        אתם · בחופשה
      </text>
      <text x={LENS.carApex.x} y={LENS.carApex.y + 46} textAnchor="middle" className="lens-label lens-label-car" data-on={stage >= 2}>
        הרכב · עם JetPark
      </text>
      <text x={LENS.back.x - 44} y={LENS.back.y + 58} textAnchor="middle" className="lens-label" data-on={stage >= 3}>
        קבלה בטרמינל
      </text>
    </svg>
  );
}

export function Route() {
  const list = useRef<HTMLOListElement>(null);
  const approach = useRef<SVGPathElement>(null);
  const upper = useRef<SVGPathElement>(null);
  const lower = useRef<SVGPathElement>(null);
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();

  const onFrame = useCallback((p: number) => {
    const set = (el: SVGPathElement | null, t: number) => {
      if (el) el.style.strokeDashoffset = String(1 - t);
    };
    set(approach.current, span(p, 0.02, 0.3));
    const arcs = span(p, 0.34, 0.86);
    set(upper.current, arcs);
    set(lower.current, arcs);
  }, []);

  useScrollProgress(list, onFrame, !reduced);

  useEffect(() => {
    if (reduced) onFrame(1);
  }, [reduced, onFrame]);

  // The station nearest the middle of the screen is the current one.
  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[data-station]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStage(Number((entry.target as HTMLElement).dataset.station));
          }
          entry.target.classList.toggle("is-seen", entry.isIntersecting || entry.target.classList.contains("is-seen"));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="route" className="route frame" data-reduced={reduced ? "true" : "false"} aria-labelledby="route-title">
      <div className="route-head">
        <h2 id="route-title" className="display route-title" data-reveal>
          ארבע תחנות. שתיים בטרמינל.
        </h2>
      </div>
      <div className="route-body">
        <ol ref={list} className="route-list">
          {STATIONS.map((s, i) => (
            <li key={s.id} data-station={i} className="station" data-current={i === stage ? "true" : "false"}>
              <LensFigure stage={i} className="lens-mini" />
              <h3 className="station-title display">{s.title}</h3>
              <p className="station-body">{s.body}</p>
              <p className="station-detail">{s.detail}</p>
            </li>
          ))}
        </ol>
        <div className="route-figure">
          <LensFigure
            stage={reduced ? 3 : stage}
            refs={{ approach, upper, lower }}
            label="מפת המסלול: תיאום, מסירת הרכב בטרמינל, חופשה, וקבלת הרכב בטרמינל."
          />
        </div>
      </div>
    </section>
  );
}
