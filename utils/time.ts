const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

export const minutes = (n: number) => n * minute;
export const hours = (n: number) => n * hour;
export const days = (n: number) => n * day;