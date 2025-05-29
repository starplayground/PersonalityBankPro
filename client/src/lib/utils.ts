import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function calculateProgress(current: number, total: number): number {
  return Math.round((current / total) * 100);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getPersonalityColor(trait: string): string {
  const colors = {
    openness: 'hsl(var(--primary))',
    conscientiousness: 'hsl(var(--accent))',
    extraversion: 'hsl(var(--secondary))',
    agreeableness: 'rgb(59, 130, 246)', // blue-500
    neuroticism: 'rgb(239, 68, 68)', // red-500
  };
  return colors[trait as keyof typeof colors] || 'hsl(var(--muted))';
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
