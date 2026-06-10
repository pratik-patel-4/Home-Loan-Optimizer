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
 * Props for PrepaymentComparison component
 */
export interface PrepaymentComparisonProps {
  /** Total interest before prepayment */
  beforeInterest: number;
  /** Total interest after prepayment */
  afterInterest: number;
  /** Total payment before prepayment */
  beforeTotal: number;
  /** Total payment after prepayment */
  afterTotal: number;
  /** Tenure in months before prepayment */
  beforeTenure: number;
  /** Tenure in months after prepayment */
  afterTenure: number;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Prepayment Comparison Chart
 * 
 * Compares loan status before and after prepayment across
 * three key metrics: Total Interest, Total Payment, and Tenure.
 * 
 * Features:
 * - Grouped bar chart for easy comparison
 * - Color-coded bars (slate for before, green for after)
 * - Interactive tooltips with contextual formatting
 * - Mixed Y-axis formatting (currency for amounts, number for tenure)
 * - Savings highlighted in tooltips
 * - Legend at the top
 * - Responsive sizing
 * - Grid lines for better readability
 * 
 * @example
 * ```tsx
 * <PrepaymentComparison
 *   beforeInterest={1500000}
 *   afterInterest={1200000}
 *   beforeTotal={4000000}
 *   afterTotal={3700000}
 *   beforeTenure={240}
 *   afterTenure={200}
 * />
 * ```
 */
export const PrepaymentComparison: React.FC<PrepaymentComparisonProps> = ({
  beforeInterest,
  afterInterest,
  beforeTotal,
  afterTotal,
  beforeTenure,
  afterTenure,
  isLoading = false,
}) => {
  // Show loading skeleton
  if (isLoading) {
    return <ChartSkeleton height="h-[400px]" />;
  }

  // Handle no data case
  if (!beforeInterest && !afterInterest && !beforeTotal && !afterTotal && !beforeTenure && !afterTenure) {
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
      'Before Prepayment': beforeInterest,
      'After Prepayment': afterInterest,
      type: 'currency',
    },
    {
      category: 'Total Payment',
      'Before Prepayment': beforeTotal,
      'After Prepayment': afterTotal,
      type: 'currency',
    },
    {
      category: 'Tenure (Months)',
      'Before Prepayment': beforeTenure,
      'After Prepayment': afterTenure,
      type: 'number',
    },
  ];

  // Chart colors
  const COLORS = {
    before: 'hsl(var(--muted-foreground))',
    after: 'hsl(var(--chart-1))',
  };
  const FALLBACK_COLORS = {
    before: '#64748b',
    after: '#10b981',
  };

  /**
   * Format Y-axis values based on data type
   */
  const formatYAxis = (value: number, index: number): string => {
    // For tenure (third category), show as number
    if (index === 2 || value < 1000) {
      return value.toString();
    }
    
    // For currency values
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
      const isCurrency = payload[0].payload.type === 'currency';
      const beforeValue = payload[0].value;
      const afterValue = payload[1].value;
      const savings = beforeValue - afterValue;
      const savingsPercent = ((savings / beforeValue) * 100).toFixed(1);

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
                {isCurrency ? formatCurrency(entry.value) : `${entry.value} months`}
              </span>
            </div>
          ))}
          {savings > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Savings:
                </span>
                <span className="text-xs font-medium text-green-600">
                  {isCurrency ? formatCurrency(savings) : `${savings} months`}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  Reduction:
                </span>
                <span className="text-xs font-medium text-green-600">
                  {savingsPercent}%
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  /**
   * Custom Y-axis tick component to handle mixed formatting
   */
  const CustomYAxisTick = ({ x, y, payload, index }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fill="hsl(var(--muted-foreground))"
          fontSize={12}
        >
          {formatYAxis(payload.value, index)}
        </text>
      </g>
    );
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
            tick={<CustomYAxisTick />}
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
            dataKey="Before Prepayment"
            fill={COLORS.before || FALLBACK_COLORS.before}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="After Prepayment"
            fill={COLORS.after || FALLBACK_COLORS.after}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

PrepaymentComparison.displayName = 'PrepaymentComparison';

// Made with Bob