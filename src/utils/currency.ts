/**
 * Currency formatting utilities for Indian Rupee
 */

/**
 * Format a number according to Indian numbering system
 * Example: 1011566 -> "10,11,566"
 * 
 * Indian system uses:
 * - Last 3 digits grouped
 * - Then groups of 2 digits
 * 
 * @param num - Number to format
 * @returns Formatted string with Indian comma placement
 */
export function formatIndianNumber(num: number): string {
  // Handle negative numbers
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  
  // Convert to string and split into integer and decimal parts
  const parts = absNum.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Handle numbers less than 1000 (no commas needed)
  if (integerPart.length <= 3) {
    return `${isNegative ? '-' : ''}${integerPart}.${decimalPart}`;
  }
  
  // Get last 3 digits
  const lastThree = integerPart.slice(-3);
  const remaining = integerPart.slice(0, -3);
  
  // Add commas every 2 digits for the remaining part
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  // Combine parts
  const formatted = `${formattedRemaining},${lastThree}.${decimalPart}`;
  
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format amount as Indian Rupee currency
 * Example: 1011566 -> "₹10,11,566"
 * 
 * @param amount - Amount to format
 * @returns Formatted currency string with ₹ symbol
 */
export function formatCurrency(amount: number): string {
  // Round to 2 decimal places
  const rounded = Math.round(amount * 100) / 100;
  
  // Handle negative amounts
  const isNegative = rounded < 0;
  const absAmount = Math.abs(rounded);
  
  // Format with Indian numbering
  const formatted = formatIndianNumber(absAmount);
  
  // Remove decimal part if it's .00
  const withoutTrailingZeros = formatted.replace(/\.00$/, '');
  
  return isNegative ? `-₹${withoutTrailingZeros}` : `₹${withoutTrailingZeros}`;
}

/**
 * Parse a formatted currency string back to number
 * Handles various formats:
 * - "₹10,11,566" -> 1011566
 * - "10,11,566" -> 1011566
 * - "1011566" -> 1011566
 * - "-₹10,000" -> -10000
 * 
 * @param value - Formatted currency string
 * @returns Parsed number value
 */
export function parseCurrency(value: string): number {
  if (!value || typeof value !== 'string') {
    return 0;
  }
  
  // Remove currency symbol, commas, and spaces
  const cleaned = value
    .replace(/₹/g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
  
  // Parse as float
  const parsed = parseFloat(cleaned);
  
  // Return 0 if invalid
  return isNaN(parsed) ? 0 : parsed;
}

// Made with Bob
