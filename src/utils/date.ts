/**
 * Date utility functions using date-fns
 */

import { addMonths, format, differenceInMonths } from 'date-fns';

/**
 * Add specified number of months to a date
 * 
 * @param date - Starting date
 * @param months - Number of months to add
 * @returns New date with months added
 */
export function addMonthsToDate(date: Date, months: number): Date {
  return addMonths(date, months);
}

/**
 * Format date as "MMM yyyy" (e.g., "Jun 2026")
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM yyyy');
}

/**
 * Format date as "dd MMM yyyy" (e.g., "10 Jun 2026")
 * 
 * @param date - Date to format
 * @returns Formatted date string with day
 */
export function formatFullDate(date: Date): string {
  return format(date, 'dd MMM yyyy');
}

/**
 * Calculate the difference in months between two dates
 * 
 * @param date1 - First date (later date for positive result)
 * @param date2 - Second date (earlier date for positive result)
 * @returns Number of months between the dates
 */
export function getMonthsDifference(date1: Date, date2: Date): number {
  return differenceInMonths(date1, date2);
}

// Made with Bob
