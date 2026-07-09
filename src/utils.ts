export function getDaysBetween(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);

  while (current <= last) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function parseISODate(iso: string): Date {
  if (!iso) return new Date(0);
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function differenceInDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(timeDiff / (1000 * 3600 * 24));
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function differenceInDaysSigned(target: Date, current: Date): number {
  const d1 = new Date(current);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(target);
  d2.setHours(0, 0, 0, 0);
  const timeDiff = d2.getTime() - d1.getTime();
  return Math.round(timeDiff / (1000 * 3600 * 24));
}
