/**
 * Utility functions for exporting amortization schedule data
 */

import type { AmortizationRow } from '@/types/loan';
import { formatCurrency } from '@/utils/currency';

/**
 * Format amortization data for CSV export
 * 
 * Converts amortization schedule to CSV format with proper headers
 * and includes a totals row at the bottom
 * 
 * @param schedule - Array of amortization rows
 * @returns CSV string with headers and data
 */
export function formatScheduleForExport(schedule: AmortizationRow[]): string {
  // CSV headers
  const headers = ['Month', 'EMI', 'Principal', 'Interest', 'Balance'];
  
  // Convert rows to CSV format
  const rows = schedule.map((row) => [
    row.month.toString(),
    row.emi.toFixed(2),
    row.principal.toFixed(2),
    row.interest.toFixed(2),
    row.balance.toFixed(2),
  ]);
  
  // Calculate totals
  const totalEMI = schedule.reduce((sum, row) => sum + row.emi, 0);
  const totalPrincipal = schedule.reduce((sum, row) => sum + row.principal, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
  
  // Add totals row
  const totalsRow = [
    'Total',
    totalEMI.toFixed(2),
    totalPrincipal.toFixed(2),
    totalInterest.toFixed(2),
    '-',
  ];
  
  // Combine all rows
  const allRows = [headers, ...rows, totalsRow];
  
  // Convert to CSV string
  return allRows.map((row) => row.join(',')).join('\n');
}

/**
 * Export amortization schedule to CSV file
 * 
 * Creates a CSV file from the amortization schedule and triggers
 * a browser download
 * 
 * @param schedule - Array of amortization rows
 * @param filename - Optional custom filename (defaults to date-based name)
 */
export function exportToCSV(
  schedule: AmortizationRow[],
  filename?: string
): void {
  // Generate CSV content
  const csvContent = formatScheduleForExport(schedule);
  
  // Create blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Set filename
  const defaultFilename = `loan-amortization-schedule-${new Date().toISOString().split('T')[0]}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename || defaultFilename);
  
  // Trigger download
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Format amortization data for display in table
 * 
 * Converts numeric values to formatted currency strings
 * for display purposes
 * 
 * @param schedule - Array of amortization rows
 * @returns Array of formatted rows with currency strings
 */
export function formatScheduleForDisplay(schedule: AmortizationRow[]): Array<{
  month: number;
  emi: string;
  principal: string;
  interest: string;
  balance: string;
}> {
  return schedule.map((row) => ({
    month: row.month,
    emi: formatCurrency(row.emi),
    principal: formatCurrency(row.principal),
    interest: formatCurrency(row.interest),
    balance: formatCurrency(row.balance),
  }));
}

/**
 * Calculate summary statistics from amortization schedule
 * 
 * @param schedule - Array of amortization rows
 * @returns Summary statistics object
 */
export function calculateScheduleSummary(schedule: AmortizationRow[]): {
  totalEMI: number;
  totalPrincipal: number;
  totalInterest: number;
  averageEMI: number;
  averagePrincipal: number;
  averageInterest: number;
} {
  const totalEMI = schedule.reduce((sum, row) => sum + row.emi, 0);
  const totalPrincipal = schedule.reduce((sum, row) => sum + row.principal, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
  const count = schedule.length;
  
  return {
    totalEMI,
    totalPrincipal,
    totalInterest,
    averageEMI: count > 0 ? totalEMI / count : 0,
    averagePrincipal: count > 0 ? totalPrincipal / count : 0,
    averageInterest: count > 0 ? totalInterest / count : 0,
  };
}

// Made with Bob