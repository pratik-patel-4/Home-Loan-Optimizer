/**
 * Loan Eligibility Calculator Component
 * 
 * Calculates maximum loan amount a user can get based on their income,
 * existing obligations, and other factors using FOIR methodology
 */

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput,
  NumberInput,
} from '@/components/shared';
import { calculateMaxLoanEligibility } from '@/utils/loanEligibility';
import { formatCurrency } from '@/utils/currency';

/**
 * LoanEligibilityCalculator Component
 * 
 * Helps users determine the maximum loan amount they are eligible for
 * based on their income and financial obligations
 */
export function LoanEligibilityCalculator() {
  // State for input values
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000);
  const [existingObligations, setExistingObligations] = useState<number>(15000);
  const [rate, setRate] = useState<number>(10.60);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [age, setAge] = useState<number>(30);

  // Calculate eligibility using useMemo for performance
  const eligibility = useMemo(() => {
    try {
      // Validate inputs
      if (
        monthlyIncome <= 0 ||
        rate <= 0 ||
        tenureYears <= 0 ||
        age <= 0 ||
        existingObligations < 0
      ) {
        return null;
      }

      return calculateMaxLoanEligibility(
        monthlyIncome,
        existingObligations,
        rate,
        tenureYears,
        age
      );
    } catch (error) {
      console.error('Error calculating loan eligibility:', error);
      return null;
    }
  }, [monthlyIncome, existingObligations, rate, tenureYears, age]);

  // Calculate FOIR percentage
  const foirPercentage = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return Math.round((existingObligations / monthlyIncome) * 100);
  }, [monthlyIncome, existingObligations]);

  // Determine if user is eligible
  const isEligible = eligibility && eligibility.maxLoanAmount > 0;

  return (
    <SectionCard
      title="Loan Eligibility Calculator"
      description="Calculate the maximum loan amount you can get based on your income and obligations"
      icon={Calculator}
    >
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CurrencyInput
          label="Monthly Gross Income"
          value={monthlyIncome}
          onChange={setMonthlyIncome}
          placeholder="Enter monthly income"
        />

        <CurrencyInput
          label="Monthly Obligations/EMIs"
          value={existingObligations}
          onChange={setExistingObligations}
          placeholder="Enter existing EMIs"
        />

        <PercentageInput
          label="Interest Rate"
          value={rate}
          onChange={setRate}
          placeholder="Enter interest rate"
        />

        <NumberInput
          label="Desired Loan Tenure (Years)"
          value={tenureYears}
          onChange={setTenureYears}
          placeholder="Enter tenure"
          min={1}
          max={30}
        />

        <NumberInput
          label="Your Current Age"
          value={age}
          onChange={setAge}
          placeholder="Enter age"
          min={18}
          max={65}
        />
      </div>

      {/* Results Section */}
      {eligibility && (
        <>
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Eligibility Results</h3>
            
            {isEligible ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ResultCard
                  title="Maximum Loan Eligible"
                  value={formatCurrency(eligibility.maxLoanAmount)}
                  subtitle="Based on 50% FOIR"
                  icon={DollarSign}
                  variant="success"
                />

                <ResultCard
                  title="Maximum EMI Affordable"
                  value={formatCurrency(eligibility.maxEMI)}
                  subtitle="Monthly payment capacity"
                  icon={TrendingUp}
                  variant="default"
                />

                <ResultCard
                  title="Effective Tenure"
                  value={`${eligibility.effectiveTenure} years`}
                  subtitle={`Until age ${age + eligibility.effectiveTenure}`}
                  icon={Calendar}
                  variant="default"
                />

                <ResultCard
                  title="FOIR Percentage"
                  value={`${Math.round(eligibility.foir * 100)}%`}
                  subtitle="Fixed Obligation to Income Ratio"
                  icon={Percent}
                  variant="default"
                />

                <ResultCard
                  title="Available Monthly Income"
                  value={formatCurrency(eligibility.availableIncome)}
                  subtitle="After existing obligations"
                  icon={DollarSign}
                  variant="default"
                />

                <ResultCard
                  title="Current Obligation Ratio"
                  value={`${foirPercentage}%`}
                  subtitle={
                    foirPercentage > 50
                      ? 'High - May affect eligibility'
                      : 'Within acceptable limits'
                  }
                  icon={Percent}
                  variant={foirPercentage > 50 ? 'warning' : 'success'}
                />
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-6 text-center">
                <p className="text-red-700 dark:text-red-300 font-medium mb-2">
                  Not Eligible for Loan
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {age >= 60
                    ? 'Age exceeds maximum lending age (60 years)'
                    : existingObligations >= monthlyIncome * 0.5
                    ? 'Existing obligations are too high. Consider reducing them before applying.'
                    : 'Please check your input values and try again.'}
                </p>
              </div>
            )}
          </div>

          {/* Information Box */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Understanding FOIR (Fixed Obligation to Income Ratio)
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Banks typically use 50% FOIR for home loan eligibility</li>
              <li>
                • This means your total monthly obligations (including the new loan EMI) should
                not exceed 50% of your gross monthly income
              </li>
              <li>
                • Lower existing obligations increase your loan eligibility
              </li>
              <li>
                • Maximum loan tenure is limited by retirement age (60 years)
              </li>
              <li>
                • Actual eligibility may vary based on bank policies and credit score
              </li>
            </ul>
          </div>
        </>
      )}
    </SectionCard>
  );
}

// Made with Bob