import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Accent } from "../types/accent.types";

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

const accentClasses: Record<
  Accent,
  {
    solid: string;
    text: string;
    faded: string;
  }
> = {
  primary: {
    solid: "bg-accent-primary text-background",
    text: "text-accent-primary",
    faded: "bg-accent-primary/10",
  },
  secondary: {
    solid: "bg-accent-secondary",
    text: "text-accent-secondary",
    faded: "bg-accent-secondary/10"
  },
  neutral: {
    solid: "bg-accent-neutral",
    text: "text-accent-neutral",
    faded: "bg-accent-neutral/10"
  },
  info: {
    solid: "bg-accent-info",
    text: "text-accent-info",
    faded: "bg-accent-info/10"
  },
  danger: {
    solid: "bg-accent-danger",
    text: "text-accent-danger",
    faded: "bg-accent-danger/10"
  }
}

export function accentSolidCn(accent: Accent) {
  return accentClasses[accent].solid;
}

export function accentTextCn(accent: Accent) {
  return accentClasses[accent].text;
}

export function accentFadedCn(accent: Accent) {
  return accentClasses[accent].faded;
}

const accents: Accent[] = [
  "primary",
  "secondary",
  "info",
]

function hashString(str: string) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }

  return Math.abs(hash)
}


export const accentFromName = (name: string): Accent =>
  accents[hashString(name) % accents.length]