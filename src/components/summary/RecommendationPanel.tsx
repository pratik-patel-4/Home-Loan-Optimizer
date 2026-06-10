import { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from '@/components/shared';
import { generateRecommendation } from '@/utils/recommendation';
import { formatCurrency } from '@/utils/currency';
import type { LoanHealth, BalanceTransferResult, PrepaymentResult } from '@/types/loan';

/**
 * Props for RecommendationPanel component
 */
export interface RecommendationPanelProps {
  /** Current loan health metrics */
  loanHealth: LoanHealth;
  /** Balance transfer analysis result (optional) */
  balanceTransferResult: BalanceTransferResult | null;
  /** Prepayment analysis result (optional) */
  prepaymentResult: PrepaymentResult | null;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Display AI-powered recommendations based on loan analysis
 * 
 * Features:
 * - Generates recommendation using rule-based engine
 * - Shows recommendation title, description, and savings
 * - Displays confidence score with color-coded badge
 * - Visual hierarchy based on recommendation type
 * - Responsive design with proper spacing
 * 
 * @example
 * ```tsx
 * <RecommendationPanel
 *   loanHealth={loanHealth}
 *   balanceTransferResult={balanceTransferResult}
 *   prepaymentResult={prepaymentResult}
 * />
 * ```
 */
export function RecommendationPanel({
  loanHealth,
  balanceTransferResult,
  prepaymentResult,
  isLoading = false,
}: RecommendationPanelProps) {
  // Generate recommendation based on loan analysis
  const recommendation = useMemo(
    () => generateRecommendation(loanHealth, balanceTransferResult, prepaymentResult),
    [loanHealth, balanceTransferResult, prepaymentResult]
  );

  /**
   * Determine alert variant based on recommendation type
   * - BALANCE_TRANSFER, PREPAYMENT: default (informative)
   * - REDUCE_TENURE, REDUCE_EMI: default (informative)
   * - NO_ACTION: default (positive)
   */
  const getAlertVariant = (): 'default' | 'destructive' => {
    // All recommendations use default variant for consistency
    return 'default';
  };

  /**
   * Determine badge color based on confidence score
   * - High confidence (>85): success (green)
   * - Medium confidence (70-85): secondary (amber/yellow)
   * - Low confidence (<70): outline (slate)
   */
  const getBadgeVariant = (): 'default' | 'secondary' | 'outline' | 'destructive' => {
    if (recommendation.confidenceScore > 85) {
      return 'default'; // Green for high confidence
    } else if (recommendation.confidenceScore >= 70) {
      return 'secondary'; // Amber for medium confidence
    } else {
      return 'outline'; // Slate for low confidence
    }
  };

  /**
   * Get icon color based on recommendation type
   */
  const getIconColor = (): string => {
    const type = recommendation.type;
    if (type === 'BALANCE_TRANSFER' || type === 'PREPAYMENT') {
      return 'text-green-600 dark:text-green-400';
    } else if (type === 'REDUCE_TENURE' || type === 'REDUCE_EMI') {
      return 'text-blue-600 dark:text-blue-400';
    } else {
      return 'text-primary';
    }
  };

  if (isLoading) {
    return (
      <SectionCard
        title="Recommendation"
        description="AI-powered insights for your loan"
        icon={Lightbulb}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Recommendation"
      description="AI-powered insights for your loan"
      icon={Lightbulb}
    >
      <Alert variant={getAlertVariant()} className="border-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <Lightbulb className={`h-5 w-5 mt-0.5 ${getIconColor()}`} />
              <div className="flex-1">
                <AlertTitle className="text-xl font-bold mb-2">
                  {recommendation.title}
                </AlertTitle>
                <AlertDescription className="text-base mb-4 text-foreground">
                  {recommendation.description}
                </AlertDescription>
              </div>
            </div>
            
            {recommendation.estimatedSavings > 0 && (
              <div className="pl-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">
                    Potential Savings:
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(recommendation.estimatedSavings)}
                  </span>
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground pl-8 pt-2 border-t">
              <span className="font-medium">Why this recommendation: </span>
              {recommendation.reason}
            </p>
          </div>
          
          <Badge 
            variant={getBadgeVariant()} 
            className="shrink-0 text-xs font-semibold px-3 py-1"
          >
            {recommendation.confidenceScore}% Confidence
          </Badge>
        </div>
      </Alert>
    </SectionCard>
  );
}

// Made with Bob