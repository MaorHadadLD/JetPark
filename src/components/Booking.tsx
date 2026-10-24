"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LENS } from "./lens";
import { site } from "@/config/site";
import { photos } from "@/lib/photos";
import { breakdown, formatShekels, priceLine, quote, rateLine } from "@/lib/pricing";
import {
  combine,
  formatDay,
  formatDuration,
  formatTime,
  requestText,
  terminalName,
  TERMINALS,
  toDateInput,
  toTimeInput,
  validate,
  type Schedule,
  type Terminal,
  type Terminals,
} from "@/lib/schedule";

type CopyState = "idle" | "copied" | "failed";

const EMPTY: Schedule = { departDate: "", departTime: "", returnDate: "", returnTime: "" };

export function Booking() {
  const [s, setS] = useState<Schedule>(EMPTY);
  const [terminals, setTerminals] = useState<Terminals>({ depart: "", return: "" });
  const [now, setNow] = useState<Date | null>(null);
  const [touched, setTouched] = useState({ depart: false, return: false });
  const [copy, setCopy] = useState<CopyState>("idle");
  const [canShare, setCanShare] = useState(false);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const passRef = useRef<HTMLDivElement>(null);
  const tearRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  // "Now" only exists in the browser; it is refreshed so a stale tab cannot
  // submit a handover time that has since passed.
  useEffect(() => {
    setNow(new Date());
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const depart = combine(s.departDate, s.departTime);
  const ret = combine(s.returnDate, s.returnTime);
  const issues = useMemo(() => (now ? validate(s, now) : []), [s, now]);
  const departIssue = issues.find((i) => i.field === "depart");
  const returnIssue = issues.find((i) => i.field === "return");
  const datesReady = Boolean(depart && ret && now && issues.length === 0);
  const ready = datesReady && Boolean(terminals.depart && terminals.return);
  const q = datesReady && depart && ret ? quote(depart, ret) : null;
  const text =
    ready && q && depart && ret && now && terminals.depart && terminals.return
      ? requestText(depart, ret, { depart: terminals.depart, return: terminals.return }, now, priceLine(q))
      : "";

  const today = now ? toDateInput(now) : undefined;
  const departTimeMin = now && s.departDate === today ? toTimeInput(now) : undefined;
  const returnDateMin = s.departDate && today && s.departDate > today ? s.departDate : today;
  const returnTimeMin = s.returnDate && s.returnDate === s.departDate ? s.departTime || undefined : undefined;

  const update = (key: keyof Schedule, value: string) => {
    setS((prev) => {
      const next = { ...prev, [key]: value };
      // Moving the handover past the chosen return clears the return date.
      if (key === "departDate" && next.returnDate && value && next.returnDate < value) {
        next.returnDate = "";
      }
      return next;
    });
    setCopy("idle");
    setTouched((t) => ({ ...t, [key.startsWith("depart") ? "depart" : "return"]: true }));
  };

  const pickTerminal = (key: keyof Terminals, value: Terminal) => {
    setTerminals((prev) => ({ ...prev, [key]: value }));
    setCopy("idle");
  };

  const onCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopy("copied");
    } catch {
      const area = fallbackRef.current;
      if (area) {
        area.value = text;
        area.select();
        const ok = document.execCommand?.("copy");
        setCopy(ok ? "copied" : "failed");
      } else {
        setCopy("failed");
      }
    }
  };

  const onShare = async () => {
    if (!text) return;
    try {
      await navigator.share({ title: "בקשת תיאום – JetPark", text });
    } catch {
      /* The visitor closed the share sheet. */
    }
  };

  // Keeps the punched notches centred on the tear line at every width.
  useEffect(() => {
    const pass = passRef.current;
    const tear = tearRef.current;
    if (!pass || !tear) return;
    const place = () => {
      const p = pass.getBoundingClientRect();
      const t = tear.getBoundingClientRect();
      pass.style.setProperty("--tear-x", `${t.left - p.left + t.width / 2}px`);
      pass.style.setProperty("--tear-y", `${t.top - p.top + t.height / 2}px`);
    };
    const ro = new ResizeObserver(place);
    ro.observe(pass);
    place();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (copy !== "copied") return;
    const t = window.setTimeout(() => setCopy("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [copy]);

  const ids = {
    dd: `${uid}-dd`,
    dt: `${uid}-dt`,
    rd: `${uid}-rd`,
    rt: `${uid}-rt`,
    de: `${uid}-de`,
    re: `${uid}-re`,
    note: `${uid}-note`,
  };
  const showDepartIssue = touched.depart && departIssue;
  const showReturnIssue = touched.return && returnIssue;
  const { whatsapp, email, phone } = site.contact;

  return (
    <section id="booking" className="booking" aria-labelledby="booking-title">
      <Image
        src={photos.sky.src}
        alt=""
        fill
        sizes="100vw"
        className="booking-photo"
        style={{ objectFit: "cover", objectPosition: photos.sky.position }}
      />
      <div className="booking-shade" aria-hidden="true" />

      <div className="frame booking-inner">
        <div className="booking-head">
          <h2 id="booking-title" className="display booking-title" data-reveal>
            תאמו מסירה וקבלה.
          </h2>
          <p className="booking-lead" data-reveal style={{ ["--i" as string]: 1 }}>
            בחרו מתי ובאיזה טרמינל למסור את הרכב ולקבל אותו בחזרה. הכרטיס מסכם את הבקשה, ואפשר להעתיק אותה בלחיצה.
          </p>
        </div>

        <div ref={passRef} className="pass" data-ready={ready ? "true" : "false"}>
          {/* The face of the pass: what was asked for, at a glance. */}
          <div className="pass-face" aria-live="polite" aria-atomic="false">
            <div className="pass-top">
              <span className="pass-brand">JetPark</span>
            </div>

            <div className="pass-route">
              <Endpoint
                label="מסירה"
                time={depart ? formatTime(depart) : null}
                day={depart && now ? formatDay(depart, now) : null}
                empty="בחרו מועד מסירה"
              />
              <div className="pass-mid">
                <svg className="pass-lens" viewBox="100 20 800 380" aria-hidden="true">
                  <path d={LENS.upper} className="pass-lens-line" />
                  <path d={LENS.lower} className="pass-lens-line pass-lens-car" />
                  <circle cx={LENS.handoff.x} cy={LENS.handoff.y} r={26} className="pass-lens-point" />
                  <circle cx={LENS.back.x} cy={LENS.back.y} r={26} className="pass-lens-point" />
                </svg>
                <p className="pass-duration">
                  <span className="pass-k">משך</span>
                  <Flip value={depart && ret && !returnIssue ? formatDuration(depart, ret).replace(/(\d) /g, "$1\u00A0") : "—"} />
                </p>
              </div>
              <Endpoint
                label="קבלה"
                time={ret ? formatTime(ret) : null}
                day={ret && now ? formatDay(ret, now) : null}
                empty="בחרו מועד חזרה"
              />
            </div>

            <div className="pass-price">
              <span className="pass-k">מחיר לפי המחירון</span>
              <span className="pass-price-total display num">
                <Flip value={q ? formatShekels(q.total) : "—"} />
              </span>
              <span className="pass-price-detail">
                <Flip value={q ? breakdown(q) : rateLine()} />
              </span>
            </div>

            <div className="pass-place">
              <p>
                <span className="pass-k">מקום המסירה</span>
                <Flip value={terminals.depart ? terminalName(terminals.depart) : "בחרו טרמינל"} />
              </p>
              <p className="pass-status">בקשת תיאום · טרם אושרה</p>
              <p>
                <span className="pass-k">מקום הקבלה</span>
                <Flip value={terminals.return ? terminalName(terminals.return) : "בחרו טרמינל"} />
              </p>
            </div>
          </div>

          <div ref={tearRef} className="pass-perforation" aria-hidden="true" />

          {/* The stub: where the dates are chosen. */}
          <form className="pass-stub" noValidate onSubmit={(e) => e.preventDefault()}>
            <fieldset className="pass-group">
              <legend>מסירת הרכב · לפני הטיסה</legend>
              <div className="pass-fields">
                <label htmlFor={ids.dd}>
                  <span>תאריך</span>
                  <input
                    id={ids.dd}
                    type="date"
                    value={s.departDate}
                    min={today}
                    onChange={(e) => update("departDate", e.target.value)}
                    aria-invalid={showDepartIssue ? true : undefined}
                    aria-describedby={showDepartIssue ? ids.de : undefined}
                    required
                  />
                </label>
                <label htmlFor={ids.dt}>
                  <span>שעה</span>
                  <input
                    id={ids.dt}
                    type="time"
                    value={s.departTime}
                    min={departTimeMin}
                    step={300}
                    onChange={(e) => update("departTime", e.target.value)}
                    aria-invalid={showDepartIssue ? true : undefined}
                    aria-describedby={showDepartIssue ? ids.de : undefined}
                    required
                  />
                </label>
              </div>
              <TerminalChoice
                name={`${uid}-dterm`}
                value={terminals.depart}
                onChange={(t) => pickTerminal("depart", t)}
              />
              <p id={ids.de} className="pass-error" role="alert">
                {showDepartIssue ? departIssue.message : ""}
              </p>
            </fieldset>

            <fieldset className="pass-group">
              <legend>קבלת הרכב · אחרי החזרה</legend>
              <div className="pass-fields">
                <label htmlFor={ids.rd}>
                  <span>תאריך</span>
                  <input
                    id={ids.rd}
                    type="date"
                    value={s.returnDate}
                    min={returnDateMin}
                    onChange={(e) => update("returnDate", e.target.value)}
                    aria-invalid={showReturnIssue ? true : undefined}
                    aria-describedby={showReturnIssue ? ids.re : undefined}
                    required
                  />
                </label>
                <label htmlFor={ids.rt}>
                  <span>שעה</span>
                  <input
                    id={ids.rt}
                    type="time"
                    value={s.returnTime}
                    min={returnTimeMin}
                    step={300}
                    onChange={(e) => update("returnTime", e.target.value)}
                    aria-invalid={showReturnIssue ? true : undefined}
                    aria-describedby={showReturnIssue ? ids.re : undefined}
                    required
                  />
                </label>
              </div>
              <TerminalChoice
                name={`${uid}-rterm`}
                value={terminals.return}
                onChange={(t) => pickTerminal("return", t)}
              />
              <p id={ids.re} className="pass-error" role="alert">
                {showReturnIssue ? returnIssue.message : ""}
              </p>
            </fieldset>

            <div className="pass-actions">
              <button
                type="button"
                className="btn btn-on-field pass-copy"
                onClick={onCopy}
                aria-disabled={!ready}
                aria-describedby={ids.note}
                data-state={copy}
              >
                <span className="pass-copy-label" data-show={copy !== "copied"}>
                  העתקת פרטי הבקשה
                </span>
                <span className="pass-copy-label" data-show={copy === "copied"} aria-hidden={copy !== "copied"}>
                  הפרטים הועתקו
                </span>
              </button>
              {canShare ? (
                <button type="button" className="btn pass-secondary" onClick={onShare} aria-disabled={!ready}>
                  שיתוף
                </button>
              ) : null}
              {whatsapp && ready ? (
                <a className="btn pass-secondary" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
                  שליחה ב-WhatsApp
                </a>
              ) : null}
              {email && ready ? (
                <a
                  className="btn pass-secondary"
                  href={`mailto:${email}?subject=${encodeURIComponent("בקשת תיאום – JetPark")}&body=${encodeURIComponent(text)}`}
                >
                  שליחה במייל
                </a>
              ) : null}
              {phone ? (
                <a className="btn pass-secondary" href={`tel:+${phone}`}>
                  התקשרו
                </a>
              ) : null}
            </div>

            <p className="pass-hint" aria-live="polite">
              {copy === "copied"
                ? "פרטי הבקשה הועתקו. אפשר להדביק אותם בכל הודעה."
                : copy === "failed"
                  ? "לא הצלחנו להעתיק אוטומטית. סמנו את הטקסט שבתיבה והעתיקו."
                  : !ready
                    ? !datesReady
                      ? "כדי להעתיק, בחרו תאריך, שעה וטרמינל למסירה ולחזרה."
                      : "כדי להעתיק, בחרו טרמינל למסירה ולקבלה."
                    : ""}
            </p>
            <textarea
              ref={fallbackRef}
              className="pass-fallback"
              data-show={copy === "failed"}
              readOnly
              aria-label="פרטי הבקשה"
              tabIndex={copy === "failed" ? 0 : -1}
              value={text}
            />

            <p id={ids.note} className="pass-note">
              זו בקשת תיאום ולא הזמנה מאושרת.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function TerminalChoice({
  name,
  value,
  onChange,
}: {
  name: string;
  value: Terminal | "";
  onChange: (t: Terminal) => void;
}) {
  return (
    <fieldset className="pass-terminal">
      <legend>טרמינל בנתב״ג</legend>
      <div className="pass-terminal-options">
        {TERMINALS.map((t) => (
          <label key={t}>
            <input
              type="radio"
              name={name}
              value={t}
              checked={value === t}
              onChange={() => onChange(t)}
              required
            />
            <span>{terminalName(t)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Endpoint({ label, time, day, empty }: { label: string; time: string | null; day: string | null; empty: string }) {
  return (
    <div className="pass-end">
      <span className="pass-time display num" data-empty={time ? "false" : "true"}>
        <Flip value={time ?? "—"} />
      </span>
      <span className="pass-day">
        <Flip value={day ?? empty} />
      </span>
      <span className="pass-label">{label}</span>
    </div>
  );
}

/** Each new value enters from below; the old one is simply replaced. */
function Flip({ value }: { value: string }) {
  return (
    <span className="flip" key={value}>
      {value}
    </span>
  );
}
