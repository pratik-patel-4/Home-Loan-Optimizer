/**
 * Amortization components index
 * 
 * Exports all amortization-related components and utilities for easy importing
 */

export { AmortizationTable } from './AmortizationTable';
export type { AmortizationTableProps } from './AmortizationTable';
export { AmortizationScheduleCalculator } from './AmortizationScheduleCalculator';

export {
  exportToCSV,
  formatScheduleForExport,
  formatScheduleForDisplay,
  calculateScheduleSummary,
} from './exportUtils';

// Made with Bob