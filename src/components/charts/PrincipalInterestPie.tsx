import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import { ChartSkeleton } from '@/components/shared';

/**
 * Props for PrincipalInterestPie component
 */
export interface PrincipalInterestPieProps {
  /** Remaining principal amount */
  remainingPrincipal: number;
  /** Remaining interest amount */
  remainingInterest: number;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Principal vs Interest Pie Chart
 * 
 * Visualizes the breakdown of remaining principal vs remaining interest
 * using a donut chart style with interactive tooltips.
 * 
 * Features:
 * - Donut chart with percentage labels
 * - Interactive tooltips with currency formatting
 * - Legend at the bottom
 * - Responsive sizing
 * - Loading state support
 * 
 * @example
 * ```tsx
 * <PrincipalInterestPie
 *   remainingPrincipal={2500000}
 *   remainingInterest={1500000}
 * />
 * ```
 */
export const PrincipalInterestPie: React.FC<PrincipalInterestPieProps> = ({
  remainingPrincipal,
  remainingInterest,
  isLoading = false,
}) => {
  // Show loading skeleton
  if (isLoading) {
    return <ChartSkeleton height="h-[300px]" />;
  }

  // Handle no data case
  if (!remainingPrincipal && !remainingInterest) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available
      </div>
    );
  }

  // Prepare chart data
  const data = [
    { name: 'Remaining Principal', value: remainingPrincipal },
    { name: 'Remaining Interest', value: remainingInterest },
  ];

  // Chart colors - green for principal, amber for interest
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];
  const FALLBACK_COLORS = ['#10b981', '#f59e0b'];

  // Calculate total for percentage
  const total = remainingPrincipal + remainingInterest;

  /**
   * Custom tooltip component
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  /**
   * Custom label renderer for pie segments
   */
  const renderLabel = (entry: any) => {
    const percentage = ((entry.value / total) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={renderLabel}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index] || FALLBACK_COLORS[index]}
                className="stroke-background stroke-2"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

PrincipalInterestPie.displayName = 'PrincipalInterestPie';

// Made with Bob