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
 * Props for LoanComparisonBarChart component
 */
export interface LoanComparisonBarChartProps {
  /** Array of loan offers to compare (up to 3) */
  loans: Array<{
    name: string;
    totalCost: number;
    principal: number;
    interest: number;
    fees: number;
  }>;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Loan Comparison Bar Chart
 * 
 * Compares total costs of up to 3 loan offers side-by-side with stacked bars
 * showing Principal, Interest, and Fees breakdown.
 * 
 * Features:
 * - Stacked bar chart for cost breakdown
 * - Color-coded segments (indigo for principal, red for interest, amber for fees)
 * - Interactive tooltips with detailed breakdown
 * - Abbreviated Y-axis labels (₹10L, ₹1Cr)
 * - Legend at the bottom
 * - Responsive sizing
 * - Grid lines for better readability
 * 
 * @example
 * ```tsx
 * <LoanComparisonBarChart
 *   loans={[
 *     {
 *       name: 'Loan 1',
 *       totalCost: 4000000,
 *       principal: 2500000,
 *       interest: 1400000,
 *       fees: 100000
 *     },
 *     {
 *       name: 'Loan 2',
 *       totalCost: 3800000,
 *       principal: 2500000,
 *       interest: 1250000,
 *       fees: 50000
 *     }
 *   ]}
 * />
 * ```
 */
export const LoanComparisonBarChart: React.FC<LoanComparisonBarChartProps> = ({
  loans,
  isLoading = false,
}) => {
  // Show loading skeleton
  if (isLoading) {
    return <ChartSkeleton height="h-[400px]" />;
  }

  // Handle no data case
  if (!loans || loans.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No loan data available
      </div>
    );
  }

  // Prepare chart data - transform loans into chart format
  const data = loans.map(loan => ({
    name: loan.name,
    Principal: loan.principal,
    Interest: loan.interest,
    Fees: loan.fees,
    totalCost: loan.totalCost,
  }));

  // Chart colors
  const COLORS = {
    principal: 'hsl(var(--primary))',
    interest: 'hsl(var(--destructive))',
    fees: 'hsl(var(--chart-2))',
  };
  const FALLBACK_COLORS = {
    principal: '#6366f1',
    interest: '#ef4444',
    fees: '#f59e0b',
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
      const totalCost = payload[0].payload.totalCost;
      
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
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Total Cost:
              </span>
              <span className="text-xs font-bold text-foreground">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>
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
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
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
            verticalAlign="bottom"
            height={36}
            iconType="rect"
            formatter={(value) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
          <Bar
            dataKey="Principal"
            stackId="a"
            fill={COLORS.principal || FALLBACK_COLORS.principal}
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Interest"
            stackId="a"
            fill={COLORS.interest || FALLBACK_COLORS.interest}
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Fees"
            stackId="a"
            fill={COLORS.fees || FALLBACK_COLORS.fees}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

LoanComparisonBarChart.displayName = 'LoanComparisonBarChart';

// Made with Bob