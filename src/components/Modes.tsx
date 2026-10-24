"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { LENS } from "./lens";
import { photos } from "@/lib/photos";

const MODES = [
  {
    id: "depart",
    tab: "ממריאים",
    photo: photos.wingTakeoff,
    title: "מסירה בטרמינל.",
    body: "לפני הטיסה, נציג JetPark פוגש אתכם בטרמינל ומקבל מכם את הרכב. אתם ממשיכים לטיסה עם המזוודות, והרכב ממשיך עם הנציג.",
    points: ["המפגש: טרמינל 1 או טרמינל 3", "המועד: לפני הטיסה, כפי שביקשתם בתיאום", "אתם: ממשיכים ישר לטיסה"],
    lit: LENS.handoff,
  },
  {
    id: "return",
    tab: "חוזרים",
    photo: photos.wingLanding,
    title: "קבלה בטרמינל.",
    body: "כשאתם חוזרים, נציג JetPark מחזיר לכם את הרכב בטרמינל. מהטרמינל ממשיכים הביתה ברכב שלכם.",
    points: ["המפגש: טרמינל 1 או טרמינל 3", "המועד: אחרי החזרה, כפי שביקשתם בתיאום", "אתם: ממשיכים הביתה ברכב"],
    lit: LENS.back,
  },
] as const;

export function Modes() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    if (e.key === "Home") return select(0, true);
    if (e.key === "End") return select(MODES.length - 1, true);
    // Two tabs: either arrow moves to the other one.
    select(active === 0 ? 1 : 0, true);
  };

  return (
    <section id="modes" className="modes" data-mode={MODES[active].id} aria-labelledby="modes-title">
      <div className="frame modes-head">
        <h2 id="modes-title" className="display modes-title" data-reveal>
          שתי פגישות. שתיהן בטרמינל.
        </h2>
        <div className="switch" role="tablist" aria-label="בחרו חלק במסע" onKeyDown={onKey} data-reveal style={{ ["--i" as string]: 1 }}>
          <span className="switch-thumb" aria-hidden="true" />
          {MODES.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${m.id}`}
              role="tab"
              type="button"
              aria-selected={active === i}
              aria-controls={`panel-${m.id}`}
              tabIndex={active === i ? 0 : -1}
              className="switch-tab"
              onClick={() => select(i)}
            >
              {m.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="modes-stage">
        {MODES.map((m, i) => {
          const on = active === i;
          return (
            <div
              key={m.id}
              id={`panel-${m.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${m.id}`}
              className="mode-panel"
              data-mode={m.id}
              data-on={on ? "true" : "false"}
              inert={!on}
              aria-hidden={!on}
            >
              <div className="mode-photo">
                <Image
                  src={m.photo.src}
                  alt={m.photo.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 58vw"
                  style={{ objectFit: "cover", objectPosition: m.photo.position }}
                />
              </div>
              <div className="mode-copy frame">
                <svg className="mode-lens" viewBox="40 0 980 420" aria-hidden="true">
                  <path d={LENS.upper} className="mode-lens-line" />
                  <path d={LENS.lower} className="mode-lens-line mode-lens-car" />
                  <circle cx={LENS.handoff.x} cy={LENS.handoff.y} r={20} className="mode-lens-point" />
                  <circle cx={LENS.back.x} cy={LENS.back.y} r={20} className="mode-lens-point" />
                  <circle cx={m.lit.x} cy={m.lit.y} r={34} className="mode-lens-lit" />
                </svg>
                <h3 className="display mode-title">{m.title}</h3>
                <p className="mode-body">{m.body}</p>
                <ul className="mode-points">
                  {m.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <a href="#booking" className="btn btn-primary" tabIndex={on ? 0 : -1}>
                  {i === 0 ? "בחירת מועד מסירה" : "בחירת מועד חזרה"}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
