import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props for skeleton components
 */
export interface SkeletonProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading skeleton for result cards
 * 
 * Mimics the structure of ResultCard component
 * 
 * @example
 * ```tsx
 * <CardSkeleton />
 * ```
 */
export const CardSkeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-3 w-24 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-40" />
      </CardContent>
    </Card>
  );
};

CardSkeleton.displayName = 'CardSkeleton';

/**
 * Loading skeleton for amortization table
 * 
 * Shows multiple rows with columns
 * 
 * @example
 * ```tsx
 * <TableSkeleton rows={5} />
 * ```
 */
export interface TableSkeletonProps extends SkeletonProps {
  /** Number of rows to display */
  rows?: number;
  /** Number of columns to display */
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  className,
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Table header */}
      <div className="flex gap-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton 
            key={`header-${i}`} 
            className={cn(
              'h-4',
              i === 0 ? 'w-16' : 'flex-1'
            )} 
          />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn(
                'h-4',
                colIndex === 0 ? 'w-16' : 'flex-1'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

TableSkeleton.displayName = 'TableSkeleton';

/**
 * Loading skeleton for charts
 * 
 * Shows a placeholder for chart area
 * 
 * @example
 * ```tsx
 * <ChartSkeleton height="h-64" />
 * ```
 */
export interface ChartSkeletonProps extends SkeletonProps {
  /** Height class (Tailwind) */
  height?: string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ 
  className,
  height = 'h-80',
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Chart title */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      
      {/* Chart area */}
      <div className={cn('relative', height)}>
        <Skeleton className="absolute inset-0" />
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`y-${i}`} className="h-3 w-12" />
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute left-16 right-0 bottom-0 flex justify-between px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`x-${i}`} className="h-3 w-12" />
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 justify-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`legend-${i}`} className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

ChartSkeleton.displayName = 'ChartSkeleton';

/**
 * Loading skeleton for form inputs
 * 
 * Mimics the structure of input components
 * 
 * @example
 * ```tsx
 * <InputSkeleton count={3} />
 * ```
 */
export interface InputSkeletonProps extends SkeletonProps {
  /** Number of input fields to display */
  count?: number;
}

export const InputSkeleton: React.FC<InputSkeletonProps> = ({ 
  className,
  count = 1,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`input-${i}`} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
};

InputSkeleton.displayName = 'InputSkeleton';

/**
 * Loading skeleton for a full section
 * 
 * Combines multiple skeleton types for a complete section
 * 
 * @example
 * ```tsx
 * <SectionSkeleton />
 * ```
 */
export const SectionSkeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputSkeleton count={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </CardContent>
    </Card>
  );
};

SectionSkeleton.displayName = 'SectionSkeleton';

/**
 * Loading skeleton for grid of cards
 * 
 * Shows a grid layout of card skeletons
 * 
 * @example
 * ```tsx
 * <CardGridSkeleton count={6} columns={3} />
 * ```
 */
export interface CardGridSkeletonProps extends SkeletonProps {
  /** Number of cards to display */
  count?: number;
  /** Number of columns (responsive) */
  columns?: 2 | 3 | 4;
}

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({ 
  className,
  count = 6,
  columns = 3,
}) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={cn('grid gap-4', gridClass, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={`card-${i}`} />
      ))}
    </div>
  );
};

CardGridSkeleton.displayName = 'CardGridSkeleton';

// Made with Bob
