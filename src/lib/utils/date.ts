import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Standard date formats used across the application
 */
export const DATE_FORMATS = {
  display: 'DD MMM YYYY', // 20 Jan 2025
  displayTime: 'DD MMM YYYY, h:mm A', // 20 Jan 2025, 3:30 PM
  api: 'YYYY-MM-DD', // 2025-01-20 (for date-only fields)
  apiDateTime: 'YYYY-MM-DDTHH:mm:ss[Z]', // 2025-01-20T15:30:00Z (ISO 8601 UTC)
  input: 'YYYY-MM-DD', // HTML date input format
} as const;

/**
 * Format a date for display (date only)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return dayjs(date).format(DATE_FORMATS.display);
}

/**
 * Format a date with time for display
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return dayjs(date).format(DATE_FORMATS.displayTime);
}

/**
 * Format a date range for display
 */
export function formatDateRange(startDate: Date | string | null, endDate: Date | string | null): string {
  if (!startDate || !endDate) return '—';
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return dayjs(date).fromNow();
}

/**
 * Convert a date to API format (date only as YYYY-MM-DD)
 */
export function toApiDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return dayjs(date).format(DATE_FORMATS.api);
}

/**
 * Convert a datetime to API format (ISO 8601 UTC)
 */
export function toApiDateTime(date: Date | null | undefined): string | null {
  if (!date) return null;
  return dayjs(date).utc().format();
}

/**
 * Parse a date string from API to Date object
 */
export function fromApiDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  const parsed = dayjs(dateString, DATE_FORMATS.api);
  return parsed.isValid() ? parsed.toDate() : null;
}

/**
 * Parse a datetime string from API to Date object
 */
export function fromApiDateTime(dateTimeString: string | null | undefined): Date | null {
  if (!dateTimeString) return null;
  const parsed = dayjs(dateTimeString);
  return parsed.isValid() ? parsed.toDate() : null;
}

/**
 * Get today's date at start of day
 */
export function getToday(): Date {
  return dayjs().startOf('day').toDate();
}

/**
 * Get tomorrow's date at start of day
 */
export function getTomorrow(): Date {
  return dayjs().add(1, 'day').startOf('day').toDate();
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  return dayjs(date).isBefore(dayjs(), 'day');
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  return dayjs(date).isAfter(dayjs(), 'day');
}

/**
 * Check if end date is after start date
 */
export function isValidDateRange(startDate: Date | string | null, endDate: Date | string | null): boolean {
  if (!startDate || !endDate) return true; // Allow empty values
  return dayjs(endDate).isAfter(dayjs(startDate), 'day') || dayjs(endDate).isSame(dayjs(startDate), 'day');
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

/**
 * Get the difference in days between two dates
 */
export function getDaysDifference(startDate: Date | string, endDate: Date | string): number {
  return dayjs(endDate).diff(dayjs(startDate), 'day');
}