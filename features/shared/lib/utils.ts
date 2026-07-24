import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: unknown,
  fallback="Something went wrong. Please try again"
) {
  const message = (axios.isAxiosError(error))
    ? error.response?.data?.error?.message
    : error instanceof Error
      ? error.message
      : fallback;

  return message;
}

export function getInitials(fullName: string) {
  const fullNameArr = fullName.split(" ");
  const initials = `${fullNameArr[0][0]}${fullNameArr[fullNameArr.length-1][0]}`;

  return initials;
}