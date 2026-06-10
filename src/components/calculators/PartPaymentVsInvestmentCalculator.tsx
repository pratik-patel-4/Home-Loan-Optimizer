/**
 * Part Payment vs Investment Calculator Component
 * 
 * Compares whether it's better to make a part payment on the loan
 * or invest the money elsewhere based on expected returns
 */

import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Target, AlertCircle, CheckCircle } from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput,
  NumberInput,
} from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { comparePartPaymentVsInvestment } from '@/utils/investment';
import { formatCurrency } from '@/utils/currency';
import { InvestmentComparisonChart } from '@/components/charts/InvestmentComparisonChart';

/**
 * PartPaymentVsInvestmentCalculator Component
 * 
 * Helps users decide whether to prepay their loan or invest the money
 * based on comparative analysis of both scenarios
 */
export function PartPaymentVsInvestmentCalculator() {
  // State for loan details
  const [outstandingLoan, setOutstandingLoan] = useState<number>(1011566);
  const [loanRate, setLoanRate] = useState<number>(10.60);
  const [remainingMonths, setRemainingMonths] = useState<number>(114);
  const [currentEMI, setCurrentEMI] = useState<number>(14098);

  // State for comparison parameters
  const [availableAmount, setAvailableAmount] = useState<number>(200000);
  const [investmentRate, setInvestmentRate] = useState<number>(12.0);
  const [investmentYears, setInvestmentYears] = useState<number>(5);

  // Calculate comparison using useMemo for performance
  const comparison = useMemo(() => {
    try {
      // Validate inputs
      if (
        outstandingLoan <= 0 ||
        loanRate <= 0 ||
        remainingMonths <= 0 ||
        currentEMI <= 0 ||
        availableAmount <= 0 ||
        investmentRate < 0 ||
        investmentYears <= 0
      ) {
        return null;
      }

      return comparePartPaymentVsInvestment(
        {
          principal: outstandingLoan,
          rate: loanRate,
          emi: currentEMI,
          remainingMonths: remainingMonths,
          startDate: new Date(),
        },
        availableAmount,
        investmentRate,
        investmentYears
      );
    } catch (error) {
      console.error('Error calculating comparison:', error);
      return null;
    }
  }, [
    outstandingLoan,
    loanRate,
    remainingMonths,
    currentEMI,
    availableAmount,
    investmentRate,
    investmentYears,
  ]);

  // Determine if investment is better
  const investmentIsBetter = comparison && comparison.recommendation === 'INVEST';

  // Calculate ROI percentages
  const prepaymentROI = useMemo(() => {
    if (!comparison || availableAmount === 0) return 0;
    return Math.round((comparison.prepaymentSavings / availableAmount) * 100);
  }, [comparison, availableAmount]);

  const investmentROI = useMemo(() => {
    if (!comparison || availableAmount === 0) return 0;
    return Math.round((comparison.investmentReturns / availableAmount) * 100);
  }, [comparison, availableAmount]);

  return (
    <SectionCard
      title="Part Payment vs Investment Calculator"
      description="Compare whether to prepay your loan or invest the money elsewhere"
      icon={TrendingUp}
    >
      {/* Loan Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Loan Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Outstanding Loan Amount"
            value={outstandingLoan}
            onChange={setOutstandingLoan}
            placeholder="Enter outstanding amount"
          />

          <PercentageInput
            label="Loan Interest Rate"
            value={loanRate}
            onChange={setLoanRate}
            placeholder="Enter interest rate"
          />

          <NumberInput
            label="Remaining Tenure (Months)"
            value={remainingMonths}
            onChange={setRemainingMonths}
            placeholder="Enter remaining months"
            min={1}
            max={360}
          />

          <CurrencyInput
            label="Current EMI"
            value={currentEMI}
            onChange={setCurrentEMI}
            placeholder="Enter current EMI"
          />
        </div>
      </div>

      {/* Comparison Parameters Section */}
      <div className="mt-6 pt-6 border-t space-y-4">
        <h3 className="text-lg font-semibold">Comparison Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Available Amount"
            value={availableAmount}
            onChange={setAvailableAmount}
            placeholder="Enter amount to prepay/invest"
          />

          <PercentageInput
            label="Expected Investment Return"
            value={investmentRate}
            onChange={setInvestmentRate}
            placeholder="Enter expected return"
          />

          <NumberInput
            label="Investment Tenure (Years)"
            value={investmentYears}
            onChange={setInvestmentYears}
            placeholder="Enter investment period"
            min={1}
            max={30}
          />
        </div>
      </div>

      {/* Results Section */}
      {comparison && (
        <>
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Comparison Results</h3>
              <Badge
                variant={investmentIsBetter ? 'default' : 'secondary'}
                className={investmentIsBetter ? 'bg-green-600' : 'bg-blue-600'}
              >
                {investmentIsBetter ? (
                  <>
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Invest
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-1 h-3 w-3" />
                    Prepay
                  </>
                )}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prepayment Scenario */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    Scenario 1: Prepayment
                  </h4>
                  {!investmentIsBetter && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>

                <div className="space-y-3">
                  <ResultCard
                    title="Interest Saved"
                    value={formatCurrency(comparison.prepaymentSavings)}
                    subtitle="By prepaying the loan"
                    icon={DollarSign}
                    variant={!investmentIsBetter ? 'success' : 'default'}
                  />

                  <ResultCard
                    title="Return on Investment"
                    value={`${prepaymentROI}%`}
                    subtitle="Effective ROI"
                    icon={Target}
                    variant="default"
                  />

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Benefits:</strong>
                    </p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                      <li>• Guaranteed savings</li>
                      <li>• Reduced loan tenure</li>
                      <li>• Lower EMI burden</li>
                      <li>• Peace of mind</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Investment Scenario */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    Scenario 2: Investment
                  </h4>
                  {investmentIsBetter && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>

                <div className="space-y-3">
                  <ResultCard
                    title="Investment Returns"
                    value={formatCurrency(comparison.investmentReturns)}
                    subtitle={`At ${investmentRate}% annual return`}
                    icon={TrendingUp}
                    variant={investmentIsBetter ? 'success' : 'default'}
                  />

                  <ResultCard
                    title="Return on Investment"
                    value={`${investmentROI}%`}
                    subtitle="Total ROI"
                    icon={Target}
                    variant="default"
                  />

                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Benefits:</strong>
                    </p>
                    <ul className="text-sm text-green-800 dark:text-green-200 mt-2 space-y-1">
                      <li>• Higher potential returns</li>
                      <li>• Liquidity maintained</li>
                      <li>• Wealth creation</li>
                      <li>• Tax benefits on investments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Comparison Chart */}
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-4">Visual Comparison</h4>
              <InvestmentComparisonChart
                prepaymentSavings={comparison.prepaymentSavings}
                investmentReturns={comparison.investmentReturns}
                loanInterestPaid={
                  // Calculate interest paid during investment period
                  Math.round(
                    (currentEMI * investmentYears * 12) -
                    (availableAmount * (investmentYears * 12) / remainingMonths)
                  )
                }
                investmentGain={comparison.investmentReturns}
              />
            </div>

            {/* Net Benefit */}
            <div className="mt-6">
              <ResultCard
                title={investmentIsBetter ? 'Net Benefit of Investing' : 'Net Benefit of Prepaying'}
                value={formatCurrency(comparison.netBenefit)}
                subtitle={
                  investmentIsBetter
                    ? 'Additional returns from investment'
                    : 'Additional savings from prepayment'
                }
                icon={DollarSign}
                variant="success"
              />
            </div>

            {/* Break-even Analysis */}
            {comparison.breakEvenMonths > 0 && (
              <div className="mt-4">
                <ResultCard
                  title="Break-even Period"
                  value={`${comparison.breakEvenMonths} months`}
                  subtitle="Time for investment to match prepayment savings"
                  icon={Target}
                  variant="default"
                />
              </div>
            )}
          </div>

          {/* Recommendation Box */}
          <div
            className={`mt-6 rounded-lg p-6 ${
              investmentIsBetter
                ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'
                : 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {investmentIsBetter ? (
                <TrendingUp className="h-6 w-6 text-green-600 mt-1" />
              ) : (
                <DollarSign className="h-6 w-6 text-blue-600 mt-1" />
              )}
              <div>
                <h4
                  className={`font-semibold mb-2 ${
                    investmentIsBetter
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-blue-900 dark:text-blue-100'
                  }`}
                >
                  Recommendation: {investmentIsBetter ? 'Invest the Money' : 'Prepay the Loan'}
                </h4>
                <p
                  className={`text-sm ${
                    investmentIsBetter
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-blue-800 dark:text-blue-200'
                  }`}
                >
                  {investmentIsBetter ? (
                    <>
                      Based on your expected investment return of {investmentRate}%, investing the
                      money would yield <strong>{formatCurrency(comparison.netBenefit)}</strong>{' '}
                      more than prepaying the loan. However, consider your risk tolerance and
                      investment expertise before making a decision.
                    </>
                  ) : (
                    <>
                      Prepaying the loan would save you{' '}
                      <strong>{formatCurrency(comparison.netBenefit)}</strong> more than investing
                      at {investmentRate}% return. This is a guaranteed saving with zero risk,
                      making it the safer and more beneficial option.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Important Considerations */}
          <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Important Considerations
                </h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <li>
                    • <strong>Risk Factor:</strong> Prepayment offers guaranteed savings, while
                    investment returns are subject to market risks
                  </li>
                  <li>
                    • <strong>Liquidity:</strong> Prepayment locks your money in the loan, while
                    investments can be liquidated if needed
                  </li>
                  <li>
                    • <strong>Tax Benefits:</strong> Consider tax deductions on home loan interest
                    (Section 24b) and investment returns
                  </li>
                  <li>
                    • <strong>Emergency Fund:</strong> Ensure you maintain adequate emergency funds
                    before prepaying
                  </li>
                  <li>
                    • <strong>Prepayment Charges:</strong> Check if your lender charges any
                    prepayment penalties
                  </li>
                  <li>
                    • <strong>Investment Expertise:</strong> Higher returns require better
                    investment knowledge and active management
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </SectionCard>
  );
}

// Made with Bob