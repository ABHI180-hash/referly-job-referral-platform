import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryDisplay(salary?: string, min?: number, max?: number): string {
  if (min && max) {
    const formatL = (val: number) => {
      if (val >= 100000) {
        const inL = val / 100000;
        return `${Number.isInteger(inL) ? inL : inL.toFixed(1)}L`;
      }
      return val.toLocaleString('en-IN');
    };
    return `₹${formatL(min)} – ₹${formatL(max)} / yr`;
  }
  if (!salary) return 'Competitive';
  
  // Clean raw AI-style strings like "₹40,00,000 - ₹58,00,000 / yr" or "?40,00,000 - ?58,00,000 / yr"
  let clean = salary.replace(/\?/g, '₹');
  clean = clean.replace(/₹?(\d+),00,000/g, '₹$1L');
  clean = clean.replace(/\s*-\s*/, ' – ');
  return clean;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
