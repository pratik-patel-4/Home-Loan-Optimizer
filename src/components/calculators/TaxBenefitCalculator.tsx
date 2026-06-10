/**
 * Tax Benefit Calculator Component
 * 
 * Calculates tax benefits on home loans under Indian Income Tax Act
 * - Section 80C: Principal repayment deduction
 * - Section 24(b): Interest payment deduction
 */

import { useState, useMemo } from 'react';
import { PiggyBank, TrendingDown, DollarSign, Percent, FileText } from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput,
  NumberInput,
} from '@/components/shared';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { calculateTaxBenefit } from '@/utils/taxBenefit';
import { formatCurrency } from '@/utils/currency';
import { TaxBenefitChart } from '@/components/charts/TaxBenefitChart';

/**
 * TaxBenefitCalculator Component
 * 
 * Helps users understand tax benefits available on their home loan
 * under various sections of the Indian Income Tax Act
 */
export function TaxBenefitCalculator() {
  // State for input values
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [rate, setRate] = useState<number>(10.60);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [annualIncome, setAnnualIncome] = useState<number>(1200000);
  const [propertyType, setPropertyType] = useState<'SELF_OCCUPIED' | 'LET_OUT'>('SELF_OCCUPIED');
  const [hasCoApplicant, setHasCoApplicant] = useState<boolean>(false);

  // Calculate tax benefits using useMemo for performance
  const taxBenefit = useMemo(() => {
    try {
      // Validate inputs
      if (
        loanAmount <= 0 ||
        rate <= 0 ||
        tenureYears <= 0 ||
        annualIncome <= 0
      ) {
        return null;
      }

      return calculateTaxBenefit(
        loanAmount,
        rate,
        tenureYears,
        annualIncome,
        propertyType,
        hasCoApplicant
      );
    } catch (error) {
      console.error('Error calculating tax benefit:', error);
      return null;
    }
  }, [loanAmount, rate, tenureYears, annualIncome, propertyType, hasCoApplicant]);

  // Calculate percentage of interest saved
  const interestSavingsPercent = useMemo(() => {
    if (!taxBenefit || rate === 0) return 0;
    return Math.round(((rate - taxBenefit.effectiveRate) / rate) * 100);
  }, [taxBenefit, rate]);

  return (
    <SectionCard
      title="Tax Benefit Calculator"
      description="Calculate tax benefits on your home loan under Indian Income Tax Act"
      icon={PiggyBank}
    >
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CurrencyInput
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="Enter loan amount"
        />

        <PercentageInput
          label="Interest Rate"
          value={rate}
          onChange={setRate}
          placeholder="Enter interest rate"
        />

        <NumberInput
          label="Loan Tenure (Years)"
          value={tenureYears}
          onChange={setTenureYears}
          placeholder="Enter tenure"
          min={1}
          max={30}
        />

        <CurrencyInput
          label="Annual Income"
          value={annualIncome}
          onChange={setAnnualIncome}
          placeholder="Enter annual income"
        />

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <RadioGroup
            value={propertyType}
            onValueChange={(value) => setPropertyType(value as 'SELF_OCCUPIED' | 'LET_OUT')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SELF_OCCUPIED" id="self-occupied" />
              <Label htmlFor="self-occupied" className="font-normal cursor-pointer">
                Self-Occupied
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LET_OUT" id="let-out" />
              <Label htmlFor="let-out" className="font-normal cursor-pointer">
                Let Out (Rented)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Co-applicant */}
        <div className="space-y-2">
          <Label>Co-applicant</Label>
          <RadioGroup
            value={hasCoApplicant ? 'yes' : 'no'}
            onValueChange={(value) => setHasCoApplicant(value === 'yes')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-coapplicant" />
              <Label htmlFor="no-coapplicant" className="font-normal cursor-pointer">
                No
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-coapplicant" />
              <Label htmlFor="yes-coapplicant" className="font-normal cursor-pointer">
                Yes (Doubles the limits)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Results Section */}
      {taxBenefit && (
        <>
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Tax Benefits (First Year)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ResultCard
                title="Principal Deduction (80C)"
                value={formatCurrency(taxBenefit.principalDeduction)}
                subtitle={`Max: ${formatCurrency(hasCoApplicant ? 300000 : 150000)}`}
                icon={FileText}
                variant="success"
              />

              <ResultCard
                title="Interest Deduction (24b)"
                value={formatCurrency(taxBenefit.interestDeduction)}
                subtitle={
                  propertyType === 'SELF_OCCUPIED'
                    ? `Max: ${formatCurrency(hasCoApplicant ? 400000 : 200000)}`
                    : 'No limit for let-out'
                }
                icon={FileText}
                variant="success"
              />

              <ResultCard
                title="Total Tax Deduction"
                value={formatCurrency(taxBenefit.totalDeduction)}
                subtitle="Combined deductions"
                icon={TrendingDown}
                variant="default"
              />

              <ResultCard
                title="Tax Saved"
                value={formatCurrency(taxBenefit.taxSaved)}
                subtitle="At 30% tax bracket"
                icon={DollarSign}
                variant="success"
              />

              <ResultCard
                title="Effective Interest Rate"
                value={`${taxBenefit.effectiveRate}%`}
                subtitle={`${interestSavingsPercent}% lower than actual`}
                icon={Percent}
                variant="success"
              />

              <ResultCard
                title="Monthly Savings"
                value={formatCurrency(taxBenefit.monthlySavings)}
                subtitle="Average per month"
                icon={DollarSign}
                variant="default"
              />
            </div>
          </div>

          {/* Visual Breakdown Chart */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Tax Deduction Breakdown</h3>
            <TaxBenefitChart
              section80C={taxBenefit.principalDeduction}
              section24b={taxBenefit.interestDeduction}
            />
          </div>

          {/* Information Boxes */}
          <div className="mt-6 space-y-4">
            {/* Section 80C Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Section 80C - Principal Repayment
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • Maximum deduction: ₹1,50,000 per person (₹3,00,000 with co-applicant)
                </li>
                <li>• Applies to principal repayment only</li>
                <li>• Part of overall 80C limit (includes PPF, ELSS, etc.)</li>
                <li>• Available from the year loan is sanctioned</li>
              </ul>
            </div>

            {/* Section 24(b) Info */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Section 24(b) - Interest Payment
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>
                  • Self-Occupied: ₹2,00,000 per person (₹4,00,000 with co-applicant)
                </li>
                <li>• Let-Out Property: No upper limit on deduction</li>
                <li>• Applies to interest component of EMI</li>
                <li>• Available after construction is complete</li>
                <li>
                  • Pre-construction interest can be claimed in 5 equal installments
                </li>
              </ul>
            </div>

            {/* Additional Info */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Important Notes
              </h4>
              <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <li>
                  • Tax calculations assume 30% tax bracket (highest slab)
                </li>
                <li>
                  • Actual tax benefit depends on your total taxable income
                </li>
                <li>
                  • Section 80EEA: Additional ₹1,50,000 for first-time buyers (affordable housing)
                </li>
                <li>
                  • Property should not be sold within 5 years to retain 80C benefits
                </li>
                <li>
                  • Co-applicant must be co-owner to claim separate deductions
                </li>
                <li>
                  • Consult a tax advisor for personalized advice
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </SectionCard>
  );
}

// Made with Bob