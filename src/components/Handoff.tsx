"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LENS, span } from "./lens";
import { useReducedMotion, useScrollProgress } from "@/lib/motion";
import { photos } from "@/lib/photos";

const STEPS = [
  {
    title: "מגיעים לטרמינל עם הרכב",
    body: "אתם והרכב באותו מסלול, עד הטרמינל.",
  },
  {
    title: "פוגשים את נציג JetPark ומוסרים את המפתח",
    body: "המסירה נעשית בטרמינל, לפני הטיסה.",
  },
  {
    title: "אתם לטיסה. הרכב במסלול משלו.",
    body: "מכאן אתם ממשיכים לחופשה, והרכב ממשיך עם JetPark.",
  },
] as const;

// Two strands arrive side by side, touch at the terminal, and part.
const YOU_IN = "M 1010 196 L 892 196 C 876 196 868 202 860 210";
const CAR_IN = "M 1010 224 L 892 224 C 876 224 868 218 860 210";

export function Handoff() {
  const section = useRef<HTMLElement>(null);
  const youIn = useRef<SVGPathElement>(null);
  const carIn = useRef<SVGPathElement>(null);
  const youOut = useRef<SVGPathElement>(null);
  const carOut = useRef<SVGPathElement>(null);
  const you = useRef<SVGGElement>(null);
  const car = useRef<SVGGElement>(null);
  const key = useRef<SVGGElement>(null);
  const node = useRef<SVGCircleElement>(null);
  const labels = useRef<SVGGElement>(null);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const reduced = useReducedMotion();

  const onFrame = useCallback((p: number) => {
    const arrive = span(p, 0.04, 0.32);
    const meet = span(p, 0.36, 0.56);

    const draw = (el: SVGPathElement | null, t: number) => {
      if (el) el.style.strokeDashoffset = String(1 - t);
    };
    draw(youIn.current, arrive);
    draw(carIn.current, arrive);
    // The arcs only run to their crown here; the full lens comes later on the page.
    const out = span(p, 0.66, 0.92) * 0.5;
    draw(youOut.current, out);
    draw(carOut.current, out);

    const at = (path: SVGPathElement | null, t: number) => {
      if (!path) return { x: 0, y: 0 };
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(len * t);
      return { x: pt.x, y: pt.y };
    };
    // The two markers wait side by side just before the terminal while the key
    // changes hands, then pass through it and part.
    const inT = arrive * 0.78 + span(p, 0.58, 0.66) * 0.22;
    const youPt = out > 0 ? at(youOut.current, out) : at(youIn.current, inT);
    const carPt = out > 0 ? at(carOut.current, out) : at(carIn.current, inT);
    you.current?.setAttribute("transform", `translate(${youPt.x} ${youPt.y})`);
    car.current?.setAttribute("transform", `translate(${carPt.x} ${carPt.y})`);

    // The key leaves the traveller and travels on with the car, swinging
    // around the markers rather than through them.
    if (key.current) {
      const kx = youPt.x + (carPt.x - youPt.x) * meet + 40 * Math.sin(Math.PI * meet);
      const ky = youPt.y - 24 + (carPt.y - youPt.y + 48) * meet;
      key.current.setAttribute("transform", `translate(${kx} ${ky})`);
    }
    if (node.current) {
      node.current.style.transform = `scale(${0.6 + 0.4 * span(p, 0.26, 0.4)})`;
      node.current.style.opacity = String(span(p, 0.2, 0.32));
    }
    if (labels.current) labels.current.style.opacity = String(span(p, 0.84, 0.95));

    const next = p < 0.34 ? 0 : p < 0.6 ? 1 : 2;
    if (next !== stepRef.current) {
      stepRef.current = next;
      setStep(next);
    }
  }, []);

  useScrollProgress(section, onFrame, !reduced);

  // Reduced motion shows the finished drawing, still.
  useEffect(() => {
    if (reduced) onFrame(1);
  }, [reduced, onFrame]);

  return (
    <section
      ref={section}
      id="handoff"
      className="handoff"
      data-reduced={reduced ? "true" : "false"}
      aria-labelledby="handoff-title"
    >
      <div className="handoff-stage">
        <Image
          src={photos.apron.src}
          alt=""
          fill
          sizes="100vw"
          className="handoff-photo"
          style={{ objectFit: "cover", objectPosition: photos.apron.position }}
        />
        <div className="handoff-shade" aria-hidden="true" />

        <h2 id="handoff-title" className="handoff-title display">
          בטרמינל, המסלולים נפרדים.
        </h2>

        <svg
          className="handoff-route"
          viewBox="430 30 590 400"
          role="img"
          aria-label="שני קווים מגיעים יחד לטרמינל ונפרדים: אחד ממשיך לטיסה, השני ממשיך עם הרכב."
        >
          <path ref={youIn} d={YOU_IN} pathLength={1} className="strand strand-you" />
          <path ref={carIn} d={CAR_IN} pathLength={1} className="strand strand-car" />
          <path ref={youOut} d={LENS.upper} pathLength={1} className="strand strand-you" />
          <path ref={carOut} d={LENS.lower} pathLength={1} className="strand strand-car" />

          <circle
            ref={node}
            cx={LENS.handoff.x}
            cy={LENS.handoff.y}
            r={18}
            className="terminal-node"
          />
          <text x={LENS.handoff.x - 70} y={LENS.handoff.y + 8} className="route-label" textAnchor="middle">
            טרמינל
          </text>

          <g ref={labels} className="route-ends">
            <text x={LENS.apex.x} y={LENS.apex.y - 26} textAnchor="middle" className="route-label">
              אתם · לטיסה
            </text>
            <text x={LENS.carApex.x} y={LENS.carApex.y + 66} textAnchor="middle" className="route-label">
              הרכב · עם JetPark
            </text>
          </g>

          <g ref={you} transform={`translate(1010 196)`}>
            <circle r={9} className="marker-you" />
          </g>
          <g ref={car} transform={`translate(1010 224)`}>
            <rect x={-9} y={-9} width={18} height={18} rx={4} className="marker-car" />
          </g>
          <g ref={key} transform={`translate(1010 170)`} className="key">
            <circle cx={-7} cy={0} r={6} />
            <path d="M -1 0 H 13 M 8 0 V 5 M 12 0 V 4" />
          </g>
        </svg>

        {reduced ? null : <p className="sr-only">{STEPS.map((x) => x.title).join(". ")}.</p>}
        <ol className="handoff-steps" aria-hidden={reduced ? undefined : true}>
          {STEPS.map((s, i) => (
            <li key={s.title} data-active={i === step ? "true" : "false"} aria-current={i === step ? "step" : undefined}>
              <p className="handoff-step-title">{s.title}</p>
              <p className="handoff-step-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
