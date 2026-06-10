/**
 * Loan Tenure Calculator Component
 * 
 * Calculates how many months it will take to repay a loan given:
 * - Outstanding loan amount
 * - Interest rate
 * - Monthly EMI amount
 * 
 * Provides comprehensive tenure analysis with validation and helpful insights
 */

import { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  IndianRupee,
  Info
} from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput
} from '@/components/shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PrincipalInterestPie } from '@/components/charts/PrincipalInterestPie';
import {
  calculateLoanTenure,
  formatTenure
} from '@/utils/tenureCalculation';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

/**
 * LoanTenureCalculator Component
 * 
 * Calculates loan tenure based on outstanding amount, interest rate, and EMI
 */
export function LoanTenureCalculator() {
  // State for input values with defaults from requirements
  const [principal, setPrincipal] = useState<number>(1011566);
  const [rate, setRate] = useState<number>(10.60);
  const [emi, setEmi] = useState<number>(14098);

  // Validate and calculate result
  const result = useMemo(() => {
    // Check if inputs are valid
    if (!principal || principal <= 0 || !rate || rate <= 0 || !emi || emi <= 0) {
      return null;
    }
    
    try {
      return calculateLoanTenure(principal, rate, emi);
    } catch (error) {
      return null;
    }
  }, [principal, rate, emi]);

  // Calculate minimum EMI safely
  const minimumEMI = useMemo(() => {
    if (!principal || principal <= 0 || !rate || rate <= 0) {
      return 0;
    }
    const monthlyRate = rate / 12 / 100;
    return principal * monthlyRate * 1.01;
  }, [principal, rate]);

  // Determine if EMI is too low (only if inputs are valid)
  const isEMITooLow = !result && principal > 0 && rate > 0 && emi > 0 && emi <= minimumEMI;

  // Check if inputs are empty or invalid
  const hasInvalidInputs = !principal || principal <= 0 || !rate || rate <= 0 || !emi || emi <= 0;

  // Check if tenure is too long (> 20 years)
  const isTenureTooLong = result && result.tenureYears > 20;

  return (
    <SectionCard
      title="Loan Tenure Calculator"
      description="Calculate how long it will take to repay your loan based on your EMI"
      icon={Calculator}
    >
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CurrencyInput
          label="Outstanding Loan Amount"
          value={principal}
          onChange={setPrincipal}
          placeholder="Enter loan amount"
        />
        <PercentageInput
          label="Interest Rate (Annual)"
          value={rate}
          onChange={setRate}
          placeholder="Enter interest rate"
        />
        <CurrencyInput
          label="Monthly EMI"
          value={emi}
          onChange={setEmi}
          placeholder="Enter EMI amount"
        />
      </div>

      {/* Error Alert - EMI too low */}
      {isEMITooLow && minimumEMI > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            EMI is too low to repay this loan. Minimum EMI required: {formatCurrency(minimumEMI)}
          </AlertDescription>
        </Alert>
      )}

      {/* Info Alert - Invalid inputs */}
      {hasInvalidInputs && !isEMITooLow && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please enter valid positive values for all fields to calculate loan tenure.
          </AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {result && (
        <>
          {/* Primary Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <ResultCard
              title="Loan Tenure"
              value={formatTenure(result.tenureMonths)}
              subtitle={`${result.tenureMonths} months`}
              icon={Calendar}
              variant="default"
            />
            <ResultCard
              title="Total Amount Payable"
              value={formatCurrency(result.totalPayable)}
              subtitle="Principal + Interest"
              icon={TrendingUp}
              variant="default"
            />
            <ResultCard
              title="Total Interest"
              value={formatCurrency(result.totalInterest)}
              subtitle={`${result.interestToPrincipalRatio.toFixed(1)}% of principal`}
              icon={TrendingUp}
              variant={result.totalInterest > principal ? 'warning' : 'success'}
            />
          </div>

          {/* Secondary Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <ResultCard
              title="Loan Closure Date"
              value={formatDate(result.closureDate)}
              subtitle={`In ${result.tenureYears} years ${result.remainingMonths} months`}
              icon={CalendarCheck}
              variant="default"
            />
            <ResultCard
              title="Interest to Principal Ratio"
              value={`${result.interestToPrincipalRatio.toFixed(1)}%`}
              subtitle={result.interestToPrincipalRatio > 100 ? 'High interest burden' : 'Reasonable ratio'}
              icon={TrendingUp}
              variant={result.interestToPrincipalRatio > 100 ? 'danger' : 'success'}
            />
            <ResultCard
              title="Monthly Interest"
              value={formatCurrency(result.monthlyInterest)}
              subtitle={`${((result.monthlyInterest / emi) * 100).toFixed(1)}% of EMI`}
              icon={IndianRupee}
              variant="default"
            />
          </div>

          {/* Chart Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Principal vs Interest Breakdown
            </h3>
            <PrincipalInterestPie
              remainingPrincipal={principal}
              remainingInterest={result.totalInterest}
            />
          </div>

          {/* Information Box - Minimum EMI */}
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>Minimum EMI Required:</strong> {formatCurrency(result.minimumEMI)}
                </div>
                <div>
                  <strong>Monthly Interest Amount:</strong> {formatCurrency(result.monthlyInterest)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Your EMI must be higher than the monthly interest to reduce the principal amount.
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Warning - Tenure too long */}
          {isTenureTooLong && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Long Tenure Alert!</strong>
                <br />
                Your loan tenure is quite long ({formatTenure(result.tenureMonths)}).
                Consider increasing your EMI to reduce the tenure and save on interest.
                <br />
                <br />
                For example, increasing your EMI by just ₹1,000 could save you several months
                and lakhs in interest payments.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </SectionCard>
  );
}

// Import CalendarCheck icon
import { CalendarCheck } from 'lucide-react';

// Made with Bob
