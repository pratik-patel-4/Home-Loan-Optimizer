import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

/**
 * Color variants for ResultCard
 */
export type ResultCardVariant = 'default' | 'success' | 'warning' | 'danger';

/**
 * Props for ResultCard component
 */
export interface ResultCardProps {
  /** Card title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional icon from lucide-react */
  icon?: LucideIcon;
  /** Color variant */
  variant?: ResultCardVariant;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show loading state */
  loading?: boolean;
}

/**
 * Variant styles mapping
 */
const variantStyles: Record<ResultCardVariant, {
  card: string;
  icon: string;
  value: string;
}> = {
  default: {
    card: 'border-border',
    icon: 'text-muted-foreground',
    value: 'text-foreground',
  },
  success: {
    card: 'border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20',
    icon: 'text-green-600 dark:text-green-400',
    value: 'text-green-700 dark:text-green-300',
  },
  warning: {
    card: 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20',
    icon: 'text-amber-600 dark:text-amber-400',
    value: 'text-amber-700 dark:text-amber-300',
  },
  danger: {
    card: 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20',
    icon: 'text-red-600 dark:text-red-400',
    value: 'text-red-700 dark:text-red-300',
  },
};

/**
 * A card component for displaying calculation results
 * 
 * Features:
 * - Title and value display
 * - Optional subtitle/description
 * - Optional icon (from lucide-react)
 * - Color variants (default, success, warning, danger)
 * - Responsive layout
 * - Loading state support
 * 
 * @example
 * ```tsx
 * import { TrendingDown } from 'lucide-react';
 * 
 * <ResultCard
 *   title="Remaining Principal"
 *   value={formatCurrency(remainingPrincipal)}
 *   subtitle="Amount left to pay"
 *   icon={TrendingDown}
 *   variant="success"
 * />
 * ```
 */
export const ResultCard = React.forwardRef<HTMLDivElement, ResultCardProps>(
  (
    {
      title,
      value,
      subtitle,
      icon: Icon,
      variant = 'default',
      className,
      loading = false,
    },
    ref
  ) => {
    const styles = variantStyles[variant];

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all hover:shadow-md',
          styles.card,
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {Icon && (
              <Icon 
                className={cn('h-4 w-4', styles.icon)} 
                aria-hidden="true"
              />
            )}
          </div>
          {subtitle && (
            <CardDescription className="text-xs">
              {subtitle}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              {subtitle && (
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              )}
            </div>
          ) : (
            <div className={cn(
              'text-2xl font-bold tracking-tight',
              styles.value
            )}>
              {value}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ResultCard.displayName = 'ResultCard';

// Made with Bob
