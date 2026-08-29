/**
 * Safe Mathematical and Data Utilities for FARMFIT
 * Guarantees arithmetic safety, prevents NaN, Infinity, divide-by-zero, and null/undefined exceptions.
 */

export function safeNumber(val: any, fallback: number = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') {
    return isNaN(val) || !isFinite(val) ? fallback : val;
  }
  const parsed = parseFloat(String(val));
  return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
}

export function safeDivide(numerator: any, denominator: any, fallback: number = 0): number {
  const num = safeNumber(numerator, 0);
  const den = safeNumber(denominator, 0);
  if (den === 0) return fallback;
  const result = num / den;
  return isNaN(result) || !isFinite(result) ? fallback : result;
}

export function safeRound(val: any, decimals: number = 0, fallback: number = 0): number {
  const num = safeNumber(val, fallback);
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function safeToLocaleString(val: any, locale: string = 'en-IN', fallback: string = '0'): string {
  const num = safeNumber(val, null as any);
  if (num === null) return fallback;
  try {
    return num.toLocaleString(locale);
  } catch {
    return String(num);
  }
}

export function safeToFixed(val: any, fractionDigits: number = 1, fallback: string = '0.0'): string {
  const num = safeNumber(val, null as any);
  if (num === null) return fallback;
  try {
    return num.toFixed(fractionDigits);
  } catch {
    return fallback;
  }
}

export function safeArray<T>(val: any): T[] {
  if (Array.isArray(val)) return val;
  return [];
}

export function safeString(val: any, fallback: string = ''): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}
