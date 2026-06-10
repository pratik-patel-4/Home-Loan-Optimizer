/**
 * Shared UI Components
 * 
 * This module exports all reusable shared components used across the application.
 * These components provide the foundation for calculator interfaces and data display.
 */

// Input Components
export { CurrencyInput } from './CurrencyInput';
export type { CurrencyInputProps } from './CurrencyInput';

export { NumberInput } from './NumberInput';
export type { NumberInputProps } from './NumberInput';

export { PercentageInput } from './PercentageInput';
export type { PercentageInputProps } from './PercentageInput';

// Card Components
export { ResultCard } from './ResultCard';
export type { ResultCardProps, ResultCardVariant } from './ResultCard';

export { SectionCard } from './SectionCard';
export type { SectionCardProps } from './SectionCard';

// Loading Components
export {
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  InputSkeleton,
  SectionSkeleton,
  CardGridSkeleton,
} from './LoadingSkeleton';
export type {
  SkeletonProps,
  TableSkeletonProps,
  ChartSkeletonProps,
  InputSkeletonProps,
  CardGridSkeletonProps,
} from './LoadingSkeleton';

// Made with Bob
