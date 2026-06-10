import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/utils/currency';
import { ChartSkeleton } from '@/components/shared';

/**
 * Props for LoanComparisonBar component
 */
export interface LoanComparisonBarProps {
  /** Current loan total interest */
  currentInterest: number;
  /** New loan total interest */
  newInterest: number;
  /** Current loan total payment */
  currentTotal: number;
  /** New loan total payment */
  newTotal: number;
  /** Current loan monthly EMI */
  currentEMI: number;
  /** New loan monthly EMI */
  newEMI: number;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Loan Comparison Bar Chart
 * 
 * Compares current loan costs vs transferred loan costs across
 * three key metrics: Total Interest, Total Payment, and Monthly EMI.
 * 
 * Features:
 * - Grouped bar chart for easy comparison
 * - Color-coded bars (red for current, green for new)
 * - Interactive tooltips with currency formatting
 * - Abbreviated Y-axis labels (₹10L, ₹1Cr)
 * - Legend at the top
 * - Responsive sizing
 * - Grid lines for better readability
 * 
 * @example
 * ```tsx
 * <LoanComparisonBar
 *   currentInterest={1500000}
 *   newInterest={1200000}
 *   currentTotal={4000000}
 *   newTotal={3700000}
 *   currentEMI={45000}
 *   newEMI={42000}
 * />
 * ```
 */
export const LoanComparisonBar: React.FC<LoanComparisonBarProps> = ({
  currentInterest,
  newInterest,
  currentTotal,
  newTotal,
  currentEMI,
  newEMI,
  isLoading = false,
}) => {
  // Show loading skeleton
  if (isLoading) {
    return <ChartSkeleton height="h-[400px]" />;
  }

  // Handle no data case
  if (!currentInterest && !newInterest && !currentTotal && !newTotal && !currentEMI && !newEMI) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No data available
      </div>
    );
  }

  // Prepare chart data
  const data = [
    {
      category: 'Total Interest',
      'Current Loan': currentInterest,
      'Transferred Loan': newInterest,
    },
    {
      category: 'Total Payment',
      'Current Loan': currentTotal,
      'Transferred Loan': newTotal,
    },
    {
      category: 'Monthly EMI',
      'Current Loan': currentEMI,
      'Transferred Loan': newEMI,
    },
  ];

  // Chart colors
  const COLORS = {
    current: 'hsl(var(--destructive))',
    new: 'hsl(var(--chart-1))',
  };
  const FALLBACK_COLORS = {
    current: '#ef4444',
    new: '#10b981',
  };

  /**
   * Format Y-axis values as abbreviated currency
   */
  const formatYAxis = (value: number): string => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  /**
   * Custom tooltip component
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 mt-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}:
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          {payload.length === 2 && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Savings:{' '}
              </span>
              <span className="text-xs font-medium text-green-600">
                {formatCurrency(payload[0].value - payload[1].value)}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={10}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="category"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="rect"
            formatter={(value) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
          <Bar
            dataKey="Current Loan"
            fill={COLORS.current || FALLBACK_COLORS.current}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="Transferred Loan"
            fill={COLORS.new || FALLBACK_COLORS.new}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

LoanComparisonBar.displayName = 'LoanComparisonBar';

// Made with Bob