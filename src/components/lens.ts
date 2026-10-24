/**
 * The lens: the page's one drawing.
 *
 * Two arcs between two points. The upper arc is the traveller's trip, the lower
 * arc is the car's. The two points are the two meetings at the terminal.
 * Time runs from right to left, the way Hebrew reads.
 */
export const LENS = {
  viewBox: "0 0 1000 420",
  approach: "M 1000 210 L 860 210",
  upper: "M 860 210 C 700 26, 300 26, 140 210",
  lower: "M 860 210 C 700 394, 300 394, 140 210",
  handoff: { x: 860, y: 210 },
  apex: { x: 500, y: 72 },
  carApex: { x: 500, y: 348 },
  back: { x: 140, y: 210 },
  start: { x: 968, y: 210 },
} as const;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Maps a progress value inside [from, to] onto 0..1. */
export const span = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));
