/**
 * Balance Transfer Calculator Component
 * 
 * Calculates the benefits of transferring a loan to another bank with:
 * - Interest savings comparison
 * - Net benefit after transfer charges
 * - Break-even analysis
 * - Recommendation based on savings
 */

import { useState, useMemo } from 'react';
import {
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Receipt,
  CheckCircle,
  Clock,
  Calendar,
  CalendarCheck,
  AlertCircle,
  Info
} from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput,
  NumberInput
} from '@/components/shared';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoanComparisonBar } from '@/components/charts/LoanComparisonBar';
import { calculateBalanceTransferBenefit, isBalanceTransferWorthwhile } from '@/utils/balanceTransfer';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

/**
 * BalanceTransferCalculator Component
 * 
 * Provides comprehensive analysis of balance transfer benefits
 */
export function BalanceTransferCalculator() {
  // State for input values with defaults from requirements
  const [principal, setPrincipal] = useState<number>(1011566);
  const [currentRate, setCurrentRate] = useState<number>(10.60);
  const [emi, setEmi] = useState<number>(14098);
  const [remainingMonths, setRemainingMonths] = useState<number>(114);
  const [newRate, setNewRate] = useState<number>(7.65);
  const [transferCharges, setTransferCharges] = useState<number>(10000);

  // Calculate balance transfer benefits using useMemo for performance
  const transferResult = useMemo(() => {
    try {
      // Validate inputs
      if (principal <= 0 || currentRate <= 0 || emi <= 0 || remainingMonths <= 0 || newRate <= 0) {
        return null;
      }

      const result = calculateBalanceTransferBenefit(
        {
          principal,
          rate: currentRate,
          emi,
          remainingMonths,
          startDate: new Date(),
        },
        {
          currentRate,
          newRate,
          transferCharges,
        }
      );

      return result;
    } catch (error) {
      console.error('Error calculating balance transfer:', error);
      return null;
    }
  }, [principal, currentRate, emi, remainingMonths, newRate, transferCharges]);

  // Determine if transfer is worthwhile
  const recommendation = useMemo(() => {
    if (!transferResult) return null;
    return isBalanceTransferWorthwhile(transferResult);
  }, [transferResult]);

  // Determine alert variant based on net benefit
  const getAlertVariant = (netBenefit: number): 'default' | 'destructive' => {
    if (netBenefit < 0) return 'destructive';
    return 'default';
  };

  return (
    <SectionCard
      title="Balance Transfer Calculator"
      description="Compare your current loan with a new loan at a different interest rate"
      icon={ArrowRightLeft}
    >
      {/* Input Fields */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Current Loan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Outstanding Principal"
              value={principal}
              onChange={setPrincipal}
              placeholder="Enter outstanding principal"
            />
            
            <PercentageInput
              label="Current Interest Rate"
              value={currentRate}
              onChange={setCurrentRate}
              placeholder="Enter current rate"
            />
            
            <CurrencyInput
              label="Current EMI"
              value={emi}
              onChange={setEmi}
              placeholder="Enter monthly EMI"
            />
            
            <NumberInput
              label="Remaining Tenure (Months)"
              value={remainingMonths}
              onChange={setRemainingMonths}
              placeholder="Enter remaining months"
              min={1}
              max={360}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">New Loan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PercentageInput
              label="New Interest Rate"
              value={newRate}
              onChange={setNewRate}
              placeholder="Enter new rate"
            />
            
            <CurrencyInput
              label="Transfer Charges"
              value={transferCharges}
              onChange={setTransferCharges}
              placeholder="Enter transfer charges"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {transferResult && recommendation && (
        <>
          {/* Recommendation Alert */}
          <div className="mt-6">
            {transferResult.netBenefit > 50000 ? (
              <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Recommended</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  {recommendation.reason}
                </AlertDescription>
              </Alert>
            ) : transferResult.netBenefit < 0 ? (
              <Alert variant={getAlertVariant(transferResult.netBenefit)}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Recommended</AlertTitle>
                <AlertDescription>
                  Balance transfer may not be beneficial. The net benefit is negative after considering transfer charges.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Consider Carefully</AlertTitle>
                <AlertDescription>
                  Balance transfer shows moderate benefits. Evaluate other factors like service quality and processing time.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Comparison Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard
                title="Current Total Interest"
                value={formatCurrency(transferResult.currentInterest)}
                icon={TrendingUp}
                variant="danger"
                subtitle="Interest with current rate"
              />
              
              <ResultCard
                title="New Total Interest"
                value={formatCurrency(transferResult.newInterest)}
                icon={TrendingDown}
                variant="success"
                subtitle="Interest with new rate"
              />
              
              <ResultCard
                title="Interest Savings"
                value={formatCurrency(transferResult.interestSavings)}
                icon={Sparkles}
                variant="success"
                subtitle="Total interest saved"
              />
              
              <ResultCard
                title="Transfer Charges"
                value={formatCurrency(transferCharges)}
                icon={Receipt}
                variant="warning"
                subtitle="One-time processing fee"
              />
              
              <ResultCard
                title="Net Benefit"
                value={formatCurrency(transferResult.netBenefit)}
                icon={CheckCircle}
                variant={transferResult.netBenefit > 0 ? 'success' : 'danger'}
                subtitle="Savings after charges"
              />
              
              <ResultCard
                title="Break Even Period"
                value={`${transferResult.breakEvenMonths} months`}
                icon={Clock}
                variant="default"
                subtitle="Time to recover charges"
              />
              
              <ResultCard
                title="Months Saved"
                value={`${transferResult.monthsSaved} months`}
                icon={Calendar}
                variant="success"
                subtitle="Reduction in tenure"
              />
              
              <ResultCard
                title="New Closure Date"
                value={formatDate(transferResult.newClosureDate)}
                icon={CalendarCheck}
                variant="default"
                subtitle="Expected completion"
              />
            </div>
          </div>

          {/* Loan Comparison Chart */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Loan Comparison</h3>
            <LoanComparisonBar
              currentInterest={transferResult.currentInterest}
              newInterest={transferResult.newInterest}
              currentTotal={transferResult.currentInterest + principal}
              newTotal={transferResult.newInterest + principal}
              currentEMI={emi}
              newEMI={transferResult.newEMI}
            />
          </div>
        </>
      )}

      {/* Error state */}
      {!transferResult && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please enter valid values for all fields to see the balance transfer analysis.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// Made with Bob
