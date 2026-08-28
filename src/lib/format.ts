/** Russian-locale formatting helpers used across all data views. */

const nf = new Intl.NumberFormat("ru-RU");

export function num(n: number): string {
  return nf.format(Math.round(n));
}

export function pct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function kd(n: number): string {
  return n.toFixed(2);
}

export function durationShort(sec: number): string {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} мин`;
  const h = Math.floor(m / 60);
  return `${h} ч ${m % 60} мин`;
}

export function clock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function countdown(msLeft: number): string {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function shortDate(iso: string): string {
  return dateFmt.format(new Date(iso)).replace(".", "");
}

export function dateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso)).replace(".", "");
}

export function relTime(iso: string, now = Date.now()): string {
  const diffMin = Math.max(1, Math.round((now - new Date(iso).getTime()) / 60000));
  if (diffMin < 60) return `${diffMin} мин назад`;
  const h = Math.round(diffMin / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.round(h / 24);
  return `${d} дн назад`;
}
