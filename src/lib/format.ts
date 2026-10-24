const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const DAY_MS = 24 * 60 * 60 * 1000;

const pad = (n: number) => String(n).padStart(2, "0");

/** 42 → "42ª" */
export const ordinal = (position: number) => `${position}ª`;

/** "***.****.****.4821" → "•••• 4821" (o CNS completo nunca aparece). */
export function maskCns(cnsMasked: string) {
  return `•••• ${cnsMasked.slice(-4)}`;
}

/** "2026-10-24T09:42:00-03:00" → "24 out" */
export function formatDay(iso: string) {
  const d = new Date(iso);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
}

/** "2026-10-24T09:42:00-03:00" → "09:42" */
export function formatTime(iso: string) {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "2026-03-17" → "17 mar 2026" */
export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${formatDay(iso)} ${d.getFullYear()}`;
}

/** Dias inteiros entre `from` e `now`. */
export function daysSince(from: string, now = new Date()) {
  return Math.max(
    0,
    Math.floor((now.getTime() - new Date(from).getTime()) / DAY_MS),
  );
}

/** "há 3 dias", "há 1 dia", "hoje" */
export function relativeDays(from: string, now = new Date()) {
  const days = daysSince(from, now);
  if (days === 0) return "hoje";
  return `há ${days} ${days === 1 ? "dia" : "dias"}`;
}
