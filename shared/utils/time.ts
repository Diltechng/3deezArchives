import dayjs from "dayjs";

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

export const minutes = (n: number) => n * minute;
export const hours = (n: number) => n * hour;
export const days = (n: number) => n * day;

export function getTimeAgo(date: string | Date) {
  const d = dayjs(date);

  const minutes = dayjs().diff(d, "minute");
  if (minutes < 60) return `${minutes}min ago`;

  const hours = dayjs().diff(d, "hour");
  if (hours < 24) return `${hours}h ago`;

  const days = dayjs().diff(d, "day");
  if (days < 7) return `${days}d ago`;

  const weeks = dayjs().diff(d, "week");
  if (weeks < 7) return `${weeks}w ago`;

  const months = dayjs().diff(d, "month");
  if (months < 12) return `${months}m ago`;

  const years = dayjs().diff(d, "year");
  return `${years}y ago`;
}