import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import { ChartSkeleton } from '@/components/shared';

/**
 * Props for TaxBenefitChart component
 */
export interface TaxBenefitChartProps {
  /** Section 80C deduction (principal repayment) */
  section80C: number;
  /** Section 24(b) deduction (interest payment) */
  section24b: number;
  /** Section 80EEA deduction (additional for first-time buyers) */
  section80EEA?: number;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Tax Benefit Breakdown Chart
 * 
 * Visualizes the breakdown of tax deductions available on home loans
 * across different sections of the Income Tax Act.
 * 
 * Features:
 * - Donut chart with percentage labels
 * - Color-coded segments for each section
 * - Interactive tooltips with amounts and percentages
 * - Legend at the bottom
 * - Responsive sizing
 * - Handles optional Section 80EEA
 * 
 * @example
 * ```tsx
 * <TaxBenefitChart
 *   section80C={150000}
 *   section24b={200000}
 *   section80EEA={50000}
 * />
 * ```
 */
export const TaxBenefitChart: React.FC<TaxBenefitChartProps> = ({
  section80C,
  section24b,
  section80EEA,
  isLoading = false,
}) => {
  // Show loading skeleton
  if (isLoading) {
    return <ChartSkeleton height="h-[400px]" />;
  }

  // Handle no data case
  if (!section80C && !section24b && !section80EEA) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No tax benefit data available
      </div>
    );
  }

  // Prepare chart data - only include sections with values
  const data = [
    section80C > 0 && {
      name: 'Section 80C (Principal)',
      value: section80C,
      description: 'Principal repayment deduction',
    },
    section24b > 0 && {
      name: 'Section 24(b) (Interest)',
      value: section24b,
      description: 'Interest payment deduction',
    },
    section80EEA && section80EEA > 0 && {
      name: 'Section 80EEA (Additional)',
      value: section80EEA,
      description: 'First-time buyer additional deduction',
    },
  ].filter(Boolean) as Array<{
    name: string;
    value: number;
    description: string;
  }>;

  // Chart colors
  const COLORS = [
    'hsl(var(--primary))',      // Section 80C - indigo
    'hsl(var(--chart-1))',      // Section 24(b) - green
    'hsl(var(--chart-2))',      // Section 80EEA - amber
  ];
  const FALLBACK_COLORS = ['#6366f1', '#10b981', '#f59e0b'];

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  /**
   * Custom tooltip component
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg max-w-xs">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.payload.description}
          </p>
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                Deduction:
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(data.value)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                Percentage:
              </span>
              <span className="text-xs font-medium">
                {percentage}% of total
              </span>
            </div>
          </div>
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
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
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
            height={60}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Summary below chart */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Total Tax Deduction:
          </span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(total)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Actual tax savings depend on your income tax slab rate
        </p>
      </div>
    </div>
  );
};

TaxBenefitChart.displayName = 'TaxBenefitChart';

// Made with Bob