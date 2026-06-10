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
 * Props for InvestmentComparisonChart component
 */
export interface InvestmentComparisonChartProps {
  /** Total savings from prepayment */
  prepaymentSavings: number;
  /** Total returns from investment */
  investmentReturns: number;
  /** Interest paid on loan if investing instead */
  loanInterestPaid: number;
  /** Gain from investment */
  investmentGain: number;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Investment Comparison Chart
 * 
 * Compares prepayment savings vs investment returns to help users
 * decide between paying off their loan early or investing the money.
 * 
 * Features:
 * - Side-by-side bar comparison
 * - Highlights the better option with success color
 * - Shows net benefit for each option
 * - Interactive tooltips with detailed breakdown
 * - Abbreviated Y-axis labels (₹10L, ₹1Cr)
 * - Legend at the top
 * - Responsive sizing
 * - Grid lines for better readability
 * 
 * @example
 * ```tsx
 * <InvestmentComparisonChart
 *   prepaymentSavings={300000}
 *   investmentReturns={450000}
 *   loanInterestPaid={200000}
 *   investmentGain={450000}
 * />
 * ```
 */
export const InvestmentComparisonChart: React.FC<InvestmentComparisonChartProps> = ({
  prepaymentSavings,
  investmentReturns,
  loanInterestPaid,
  investmentGain,
  isLoading = false,
}) => {
  // Show loading skeleton
  if (isLoading) {
    return <ChartSkeleton height="h-[400px]" />;
  }

  // Handle no data case
  if (!prepaymentSavings && !investmentReturns) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No comparison data available
      </div>
    );
  }

  // Calculate net benefit for investment (returns minus loan interest)
  const investmentNetBenefit = investmentReturns - loanInterestPaid;
  
  // Determine which option is better
  const investmentIsBetter = investmentNetBenefit > prepaymentSavings;

  // Prepare chart data
  const data = [
    {
      name: 'Prepayment',
      value: prepaymentSavings,
      fill: investmentIsBetter ? 'hsl(var(--muted-foreground))' : 'hsl(var(--chart-1))',
      isBetter: !investmentIsBetter,
    },
    {
      name: 'Investment',
      value: investmentNetBenefit,
      fill: investmentIsBetter ? 'hsl(var(--chart-1))' : 'hsl(var(--muted-foreground))',
      isBetter: investmentIsBetter,
      grossReturns: investmentReturns,
      loanInterest: loanInterestPaid,
    },
  ];

  // Chart colors
  const COLORS = {
    better: 'hsl(var(--chart-1))',
    worse: 'hsl(var(--muted-foreground))',
  };
  const FALLBACK_COLORS = {
    better: '#10b981',
    worse: '#64748b',
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
      const data = payload[0].payload;
      const isInvestment = data.name === 'Investment';
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          
          {isInvestment ? (
            <>
              <div className="flex items-center justify-between gap-4 mt-1">
                <span className="text-sm text-muted-foreground">
                  Investment Returns:
                </span>
                <span className="text-sm font-medium">
                  {formatCurrency(data.grossReturns)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 mt-1">
                <span className="text-sm text-muted-foreground">
                  Loan Interest Paid:
                </span>
                <span className="text-sm font-medium text-destructive">
                  -{formatCurrency(data.loanInterest)}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    Net Benefit:
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(data.value)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-4 mt-1">
              <span className="text-sm text-muted-foreground">
                Interest Saved:
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(data.value)}
              </span>
            </div>
          )}
          
          {data.isBetter && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs font-medium text-green-600">
                ✓ Better Option
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
          barCategoryGap="30%"
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
            verticalAlign="top"
            height={36}
            iconType="rect"
            formatter={(value) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
          <Bar
            dataKey="value"
            fill={COLORS.better || FALLBACK_COLORS.better}
            radius={[4, 4, 0, 0]}
            maxBarSize={80}
          >
            {data.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="value"
                fill={entry.fill}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

InvestmentComparisonChart.displayName = 'InvestmentComparisonChart';

// Made with Bob