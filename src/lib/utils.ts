import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function formatNumberCompact(number: number) {
  if (number < 1000) {
    return number.toString(); // Numbers less than 1000 remain as is
  } else if (number >= 1000 && number < 1000000) {
    const hundreds = Math.floor((number % 1000) / 100);

    return hundreds == 0
      ? (number / 1000).toFixed(0) + "K"
      : (number / 1000).toFixed(1) + "K";
  } else if (number >= 1000000) {
    const hundredthousands = Math.floor((number % 1000000) / 100000);

    return hundredthousands == 0
      ? (number / 1000000).toFixed(0) + "M"
      : (number / 1000000).toFixed(1) + "M";
  }
}

export function formatPercentage(number: number) {
  if (number % 1 === 0) {
    return number + "%";
  } else {
    return number.toFixed(1) + "%";
  }
}
