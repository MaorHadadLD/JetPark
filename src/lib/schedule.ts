export type Schedule = {
  departDate: string; // YYYY-MM-DD
  departTime: string; // HH:MM
  returnDate: string;
  returnTime: string;
};

/** The terminals the service runs at, Ben Gurion Airport. */
export const TERMINALS = ["1", "3"] as const;
export type Terminal = (typeof TERMINALS)[number];
export type Terminals = { depart: Terminal | ""; return: Terminal | "" };

export const terminalName = (t: Terminal) => `טרמינל ${t}`;

export type ScheduleIssue = {
  field: "depart" | "return";
  message: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toTimeInput(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Local date from the two input values, or null while either is incomplete. */
export function combine(date: string, time: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const out = new Date(y, m - 1, d, hh, mm, 0, 0);
  return Number.isNaN(out.getTime()) ? null : out;
}

export function validate(s: Schedule, now: Date): ScheduleIssue[] {
  const issues: ScheduleIssue[] = [];
  const depart = combine(s.departDate, s.departTime);
  const ret = combine(s.returnDate, s.returnTime);

  if (depart && depart.getTime() <= now.getTime()) {
    issues.push({
      field: "depart",
      message: "מועד המסירה כבר עבר. בחרו מועד מאוחר יותר.",
    });
  }
  if (depart && ret && ret.getTime() <= depart.getTime()) {
    issues.push({
      field: "return",
      message: "מועד החזרה צריך להיות אחרי מועד המסירה.",
    });
  }
  return issues;
}

export function isComplete(s: Schedule): boolean {
  return Boolean(combine(s.departDate, s.departTime) && combine(s.returnDate, s.returnTime));
}

function plural(n: number, one: string, two: string, many: (n: number) => string) {
  if (n === 1) return one;
  if (n === 2) return two;
  return many(n);
}

export function durationParts(from: Date, to: Date) {
  const totalMinutes = Math.round((to.getTime() - from.getTime()) / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes, totalMinutes };
}

export function formatDuration(from: Date, to: Date): string {
  const { days, hours, minutes } = durationParts(from, to);
  const parts: string[] = [];
  if (days) parts.push(plural(days, "יום אחד", "יומיים", (n) => `${n} ימים`));
  if (hours) parts.push(plural(hours, "שעה אחת", "שעתיים", (n) => `${n} שעות`));
  if (minutes) parts.push(plural(minutes, "דקה אחת", "שתי דקות", (n) => `${n} דקות`));
  if (parts.length === 0) return "פחות מדקה";
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  // Hebrew joins "and" to a numeral with a maqaf: ו־15.
  const and = /^\d/.test(last) ? "ו־" : "ו";
  return `${parts.slice(0, -1).join(", ")} ${and}${last}`;
}

const dayFormat = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const yearFormat = new Intl.DateTimeFormat("he-IL", { year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("he-IL", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDay(d: Date, now: Date): string {
  const base = dayFormat.format(d);
  return d.getFullYear() === now.getFullYear() ? base : `${base} ${yearFormat.format(d)}`;
}

export function formatTime(d: Date): string {
  return timeFormat.format(d);
}

export function requestText(
  depart: Date,
  ret: Date,
  terminals: { depart: Terminal; return: Terminal },
  now: Date,
  price: string,
): string {
  return [
    "בקשת תיאום – JetPark",
    "",
    `מסירת הרכב: ${terminalName(terminals.depart)} בנתב״ג, ${formatDay(depart, now)}, ${formatTime(depart)}`,
    `קבלת הרכב: ${terminalName(terminals.return)} בנתב״ג, ${formatDay(ret, now)}, ${formatTime(ret)}`,
    `משך: ${formatDuration(depart, ret)}`,
    price,
    "",
    "זו בקשת תיאום ולא הזמנה מאושרת.",
  ].join("\n");
}
