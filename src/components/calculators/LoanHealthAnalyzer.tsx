/**
 * Loan Health Analyzer Component
 * 
 * Analyzes the current state of the user's home loan and displays:
 * - Remaining principal and interest
 * - Total remaining payment
 * - Loan closure date
 * - Loan health score
 */

import { useState, useMemo } from 'react';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput,
  NumberInput
} from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { PrincipalInterestPie } from '@/components/charts/PrincipalInterestPie';
import { calculateLoanHealth } from '@/utils/amortization';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

/**
 * LoanHealthAnalyzer Component
 * 
 * Provides real-time analysis of loan health based on current loan parameters
 */
export function LoanHealthAnalyzer() {
  // State for input values with defaults from requirements
  const [principal, setPrincipal] = useState<number>(1011566);
  const [rate, setRate] = useState<number>(10.60);
  const [emi, setEmi] = useState<number>(14098);
  const [remainingMonths, setRemainingMonths] = useState<number>(114);

  // Calculate loan health metrics using useMemo for performance
  const loanHealth = useMemo(() => {
    try {
      // Validate inputs
      if (principal <= 0 || rate <= 0 || emi <= 0 || remainingMonths <= 0) {
        return null;
      }

      return calculateLoanHealth(
        principal,
        rate,
        emi,
        remainingMonths,
        new Date()
      );
    } catch (error) {
      console.error('Error calculating loan health:', error);
      return null;
    }
  }, [principal, rate, emi, remainingMonths]);

  // Determine badge color based on health score
  const getHealthScoreBadgeVariant = (score: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (score) {
      case 'Excellent':
        return 'default';
      case 'Good':
        return 'secondary';
      case 'Average':
        return 'outline';
      case 'Needs Optimization':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <SectionCard
      title="Loan Health Analyzer"
      description="Analyze your current loan status and understand your financial position"
      icon={Activity}
    >
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CurrencyInput
          label="Outstanding Principal"
          value={principal}
          onChange={setPrincipal}
          placeholder="Enter outstanding principal"
        />
        
        <PercentageInput
          label="Current Interest Rate"
          value={rate}
          onChange={setRate}
          placeholder="Enter interest rate"
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

      {/* Results Section */}
      {loanHealth && (
        <>
          <div className="mt-8 mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Loan Health Analysis</h3>
            <Badge variant={getHealthScoreBadgeVariant(loanHealth.healthScore)}>
              {loanHealth.healthScore}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              title="Remaining Principal"
              value={formatCurrency(loanHealth.remainingPrincipal)}
              icon={TrendingDown}
              variant="success"
              subtitle="Outstanding loan amount"
            />
            
            <ResultCard
              title="Remaining Interest"
              value={formatCurrency(loanHealth.remainingInterest)}
              icon={TrendingUp}
              variant="warning"
              subtitle="Total interest to be paid"
            />
            
            <ResultCard
              title="Total Remaining Payment"
              value={formatCurrency(loanHealth.totalRemaining)}
              icon={DollarSign}
              variant="default"
              subtitle="Principal + Interest"
            />
            
            <ResultCard
              title="Loan Closure Date"
              value={formatDate(loanHealth.closureDate)}
              icon={Calendar}
              variant="default"
              subtitle="Expected completion date"
            />
          </div>

          {/* Principal vs Interest Chart */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Principal vs Interest Breakdown</h3>
            <PrincipalInterestPie
              remainingPrincipal={loanHealth.remainingPrincipal}
              remainingInterest={loanHealth.remainingInterest}
            />
          </div>
        </>
      )}

      {/* Error state */}
      {!loanHealth && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please enter valid values for all fields to see the loan health analysis.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// Made with Bob
