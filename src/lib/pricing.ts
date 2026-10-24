import { pricing } from "@/config/pricing";

export type Quote = {
  days: number;
  extraDays: number;
  total: number;
};

/** Every started 24 hours counts as a day, with a minimum of one. */
export function parkingDays(from: Date, to: Date): number {
  const minutes = Math.round((to.getTime() - from.getTime()) / 60000);
  return Math.max(1, Math.ceil(minutes / 1440));
}

export function quote(from: Date, to: Date): Quote {
  const days = parkingDays(from, to);
  const extraDays = Math.max(0, days - pricing.includedDays);
  return { days, extraDays, total: pricing.basePrice + extraDays * pricing.extraDayPrice };
}

const shekels = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

export const formatShekels = (n: number) => shekels.format(n);

export function daysLabel(n: number): string {
  if (n === 1) return "יום אחד";
  if (n === 2) return "יומיים";
  return `${n} ימים`;
}

export function parkingDaysLabel(n: number): string {
  if (n === 1) return "יום חניה אחד";
  if (n === 2) return "שני ימי חניה";
  return `${n} ימי חניה`;
}

/** The price list in one line, shown before dates are chosen. */
export function rateLine(separator = " · "): string {
  return `עד ${pricing.includedDays} ימים: ${formatShekels(pricing.basePrice)}${separator}כל יום נוסף: ${formatShekels(pricing.extraDayPrice)}`;
}

export function breakdown(q: Quote): string {
  if (q.extraDays === 0) {
    return `${parkingDaysLabel(q.days)} · עד ${pricing.includedDays} ימים: ${formatShekels(pricing.basePrice)}`;
  }
  return `${parkingDaysLabel(q.days)} · ${formatShekels(pricing.basePrice)} ל־${pricing.includedDays} הימים הראשונים + ${daysLabel(q.extraDays)} × ${formatShekels(pricing.extraDayPrice)}`;
}

export function priceLine(q: Quote): string {
  return `מחיר לפי המחירון: ${formatShekels(q.total)} (${parkingDaysLabel(q.days)})`;
}
