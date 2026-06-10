/**
 * Loan Comparison Calculator Component
 * 
 * Compares up to 3 different loan offers side-by-side to help users
 * choose the best option based on total cost and other factors
 */

import { useState, useMemo } from 'react';
import { Scale, TrendingDown, DollarSign, Award } from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput,
  NumberInput,
} from '@/components/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoanOffer, LoanOfferComparison } from '@/types/loan';
import { calculateEMI, calculateRemainingInterest } from '@/utils/emi';
import { formatCurrency } from '@/utils/currency';
import { LoanComparisonBarChart } from '@/components/charts/LoanComparisonBarChart';

/**
 * Calculate loan offer comparison metrics
 */
function calculateLoanComparison(offer: LoanOffer): LoanOfferComparison {
  const months = offer.tenureYears * 12;
  const emi = calculateEMI(offer.loanAmount, offer.interestRate, months);
  const totalInterest = calculateRemainingInterest(emi, months, offer.loanAmount);
  const totalCost = offer.loanAmount + totalInterest + offer.processingFee + offer.otherCharges;
  
  // Calculate effective interest rate including fees
  const totalFees = offer.processingFee + offer.otherCharges;
  const effectivePrincipal = offer.loanAmount - totalFees;
  const effectiveRate = effectivePrincipal > 0
    ? (totalInterest / effectivePrincipal) * (12 / months) * 100
    : offer.interestRate;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalCost: Math.round(totalCost),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}

/**
 * LoanComparisonCalculator Component
 * 
 * Allows users to compare multiple loan offers and identify the best option
 */
export function LoanComparisonCalculator() {
  // State for three loan offers
  const [loan1, setLoan1] = useState<LoanOffer>({
    loanAmount: 5000000,
    interestRate: 10.60,
    tenureYears: 20,
    processingFee: 25000,
    otherCharges: 5000,
  });

  const [loan2, setLoan2] = useState<LoanOffer>({
    loanAmount: 5000000,
    interestRate: 10.25,
    tenureYears: 20,
    processingFee: 50000,
    otherCharges: 10000,
  });

  const [loan3, setLoan3] = useState<LoanOffer>({
    loanAmount: 5000000,
    interestRate: 10.85,
    tenureYears: 20,
    processingFee: 15000,
    otherCharges: 3000,
  });

  // Calculate comparisons for all loans
  const comparison1 = useMemo(() => calculateLoanComparison(loan1), [loan1]);
  const comparison2 = useMemo(() => calculateLoanComparison(loan2), [loan2]);
  const comparison3 = useMemo(() => calculateLoanComparison(loan3), [loan3]);

  // Find the best loan (lowest total cost)
  const bestLoan = useMemo(() => {
    const costs = [
      { index: 1, cost: comparison1.totalCost },
      { index: 2, cost: comparison2.totalCost },
      { index: 3, cost: comparison3.totalCost },
    ];
    return costs.reduce((min, curr) => (curr.cost < min.cost ? curr : min));
  }, [comparison1, comparison2, comparison3]);

  // Calculate savings compared to most expensive option
  const maxCost = Math.max(comparison1.totalCost, comparison2.totalCost, comparison3.totalCost);
  const savings1 = maxCost - comparison1.totalCost;
  const savings2 = maxCost - comparison2.totalCost;
  const savings3 = maxCost - comparison3.totalCost;

  return (
    <SectionCard
      title="Loan Comparison Calculator"
      description="Compare up to 3 different loan offers side-by-side to find the best deal"
      icon={Scale}
    >
      <Tabs defaultValue="loan1" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="loan1">
            Loan 1
            {bestLoan.index === 1 && (
              <Award className="ml-1 h-3 w-3 text-green-600" />
            )}
          </TabsTrigger>
          <TabsTrigger value="loan2">
            Loan 2
            {bestLoan.index === 2 && (
              <Award className="ml-1 h-3 w-3 text-green-600" />
            )}
          </TabsTrigger>
          <TabsTrigger value="loan3">
            Loan 3
            {bestLoan.index === 3 && (
              <Award className="ml-1 h-3 w-3 text-green-600" />
            )}
          </TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Loan 1 Details */}
        <TabsContent value="loan1" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Loan Offer 1</h3>
            {bestLoan.index === 1 && (
              <Badge variant="default" className="bg-green-600">
                <Award className="mr-1 h-3 w-3" />
                Best Option
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Loan Amount"
              value={loan1.loanAmount}
              onChange={(val) => setLoan1({ ...loan1, loanAmount: val })}
              placeholder="Enter loan amount"
            />
            <PercentageInput
              label="Interest Rate"
              value={loan1.interestRate}
              onChange={(val) => setLoan1({ ...loan1, interestRate: val })}
              placeholder="Enter interest rate"
            />
            <NumberInput
              label="Tenure (Years)"
              value={loan1.tenureYears}
              onChange={(val) => setLoan1({ ...loan1, tenureYears: val })}
              placeholder="Enter tenure"
              min={1}
              max={30}
            />
            <CurrencyInput
              label="Processing Fee"
              value={loan1.processingFee}
              onChange={(val) => setLoan1({ ...loan1, processingFee: val })}
              placeholder="Enter processing fee"
            />
            <CurrencyInput
              label="Other Charges"
              value={loan1.otherCharges}
              onChange={(val) => setLoan1({ ...loan1, otherCharges: val })}
              placeholder="Enter other charges"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <ResultCard
              title="Monthly EMI"
              value={formatCurrency(comparison1.emi)}
              icon={DollarSign}
              variant="default"
            />
            <ResultCard
              title="Total Interest"
              value={formatCurrency(comparison1.totalInterest)}
              icon={TrendingDown}
              variant="warning"
            />
            <ResultCard
              title="Total Cost"
              value={formatCurrency(comparison1.totalCost)}
              icon={DollarSign}
              variant="danger"
            />
            <ResultCard
              title="Effective Rate"
              value={`${comparison1.effectiveRate}%`}
              subtitle="Including fees"
              variant="default"
            />
          </div>
        </TabsContent>

        {/* Loan 2 Details */}
        <TabsContent value="loan2" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Loan Offer 2</h3>
            {bestLoan.index === 2 && (
              <Badge variant="default" className="bg-green-600">
                <Award className="mr-1 h-3 w-3" />
                Best Option
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Loan Amount"
              value={loan2.loanAmount}
              onChange={(val) => setLoan2({ ...loan2, loanAmount: val })}
              placeholder="Enter loan amount"
            />
            <PercentageInput
              label="Interest Rate"
              value={loan2.interestRate}
              onChange={(val) => setLoan2({ ...loan2, interestRate: val })}
              placeholder="Enter interest rate"
            />
            <NumberInput
              label="Tenure (Years)"
              value={loan2.tenureYears}
              onChange={(val) => setLoan2({ ...loan2, tenureYears: val })}
              placeholder="Enter tenure"
              min={1}
              max={30}
            />
            <CurrencyInput
              label="Processing Fee"
              value={loan2.processingFee}
              onChange={(val) => setLoan2({ ...loan2, processingFee: val })}
              placeholder="Enter processing fee"
            />
            <CurrencyInput
              label="Other Charges"
              value={loan2.otherCharges}
              onChange={(val) => setLoan2({ ...loan2, otherCharges: val })}
              placeholder="Enter other charges"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <ResultCard
              title="Monthly EMI"
              value={formatCurrency(comparison2.emi)}
              icon={DollarSign}
              variant="default"
            />
            <ResultCard
              title="Total Interest"
              value={formatCurrency(comparison2.totalInterest)}
              icon={TrendingDown}
              variant="warning"
            />
            <ResultCard
              title="Total Cost"
              value={formatCurrency(comparison2.totalCost)}
              icon={DollarSign}
              variant="danger"
            />
            <ResultCard
              title="Effective Rate"
              value={`${comparison2.effectiveRate}%`}
              subtitle="Including fees"
              variant="default"
            />
          </div>
        </TabsContent>

        {/* Loan 3 Details */}
        <TabsContent value="loan3" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Loan Offer 3</h3>
            {bestLoan.index === 3 && (
              <Badge variant="default" className="bg-green-600">
                <Award className="mr-1 h-3 w-3" />
                Best Option
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Loan Amount"
              value={loan3.loanAmount}
              onChange={(val) => setLoan3({ ...loan3, loanAmount: val })}
              placeholder="Enter loan amount"
            />
            <PercentageInput
              label="Interest Rate"
              value={loan3.interestRate}
              onChange={(val) => setLoan3({ ...loan3, interestRate: val })}
              placeholder="Enter interest rate"
            />
            <NumberInput
              label="Tenure (Years)"
              value={loan3.tenureYears}
              onChange={(val) => setLoan3({ ...loan3, tenureYears: val })}
              placeholder="Enter tenure"
              min={1}
              max={30}
            />
            <CurrencyInput
              label="Processing Fee"
              value={loan3.processingFee}
              onChange={(val) => setLoan3({ ...loan3, processingFee: val })}
              placeholder="Enter processing fee"
            />
            <CurrencyInput
              label="Other Charges"
              value={loan3.otherCharges}
              onChange={(val) => setLoan3({ ...loan3, otherCharges: val })}
              placeholder="Enter other charges"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <ResultCard
              title="Monthly EMI"
              value={formatCurrency(comparison3.emi)}
              icon={DollarSign}
              variant="default"
            />
            <ResultCard
              title="Total Interest"
              value={formatCurrency(comparison3.totalInterest)}
              icon={TrendingDown}
              variant="warning"
            />
            <ResultCard
              title="Total Cost"
              value={formatCurrency(comparison3.totalCost)}
              icon={DollarSign}
              variant="danger"
            />
            <ResultCard
              title="Effective Rate"
              value={`${comparison3.effectiveRate}%`}
              subtitle="Including fees"
              variant="default"
            />
          </div>
        </TabsContent>

        {/* Comparison Summary */}
        <TabsContent value="comparison" className="space-y-6">
          <h3 className="text-lg font-semibold">Side-by-Side Comparison</h3>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Metric</th>
                  <th className="text-right p-3 font-semibold">
                    Loan 1
                    {bestLoan.index === 1 && (
                      <Award className="inline ml-1 h-4 w-4 text-green-600" />
                    )}
                  </th>
                  <th className="text-right p-3 font-semibold">
                    Loan 2
                    {bestLoan.index === 2 && (
                      <Award className="inline ml-1 h-4 w-4 text-green-600" />
                    )}
                  </th>
                  <th className="text-right p-3 font-semibold">
                    Loan 3
                    {bestLoan.index === 3 && (
                      <Award className="inline ml-1 h-4 w-4 text-green-600" />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Interest Rate</td>
                  <td className="text-right p-3">{loan1.interestRate}%</td>
                  <td className="text-right p-3">{loan2.interestRate}%</td>
                  <td className="text-right p-3">{loan3.interestRate}%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Monthly EMI</td>
                  <td className="text-right p-3">{formatCurrency(comparison1.emi)}</td>
                  <td className="text-right p-3">{formatCurrency(comparison2.emi)}</td>
                  <td className="text-right p-3">{formatCurrency(comparison3.emi)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Total Interest</td>
                  <td className="text-right p-3">{formatCurrency(comparison1.totalInterest)}</td>
                  <td className="text-right p-3">{formatCurrency(comparison2.totalInterest)}</td>
                  <td className="text-right p-3">{formatCurrency(comparison3.totalInterest)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Processing Fee</td>
                  <td className="text-right p-3">{formatCurrency(loan1.processingFee)}</td>
                  <td className="text-right p-3">{formatCurrency(loan2.processingFee)}</td>
                  <td className="text-right p-3">{formatCurrency(loan3.processingFee)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Other Charges</td>
                  <td className="text-right p-3">{formatCurrency(loan1.otherCharges)}</td>
                  <td className="text-right p-3">{formatCurrency(loan2.otherCharges)}</td>
                  <td className="text-right p-3">{formatCurrency(loan3.otherCharges)}</td>
                </tr>
                <tr className="border-b font-semibold bg-muted/50">
                  <td className="p-3">Total Cost</td>
                  <td className={`text-right p-3 ${bestLoan.index === 1 ? 'text-green-600' : ''}`}>
                    {formatCurrency(comparison1.totalCost)}
                  </td>
                  <td className={`text-right p-3 ${bestLoan.index === 2 ? 'text-green-600' : ''}`}>
                    {formatCurrency(comparison2.totalCost)}
                  </td>
                  <td className={`text-right p-3 ${bestLoan.index === 3 ? 'text-green-600' : ''}`}>
                    {formatCurrency(comparison3.totalCost)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Effective Rate</td>
                  <td className="text-right p-3">{comparison1.effectiveRate}%</td>
                  <td className="text-right p-3">{comparison2.effectiveRate}%</td>
                  <td className="text-right p-3">{comparison3.effectiveRate}%</td>
                </tr>
                <tr>
                  <td className="p-3 text-green-600">Savings vs Most Expensive</td>
                  <td className="text-right p-3 text-green-600">
                    {savings1 > 0 ? formatCurrency(savings1) : '-'}
                  </td>
                  <td className="text-right p-3 text-green-600">
                    {savings2 > 0 ? formatCurrency(savings2) : '-'}
                  </td>
                  <td className="text-right p-3 text-green-600">
                    {savings3 > 0 ? formatCurrency(savings3) : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual Comparison Chart */}
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-4">Visual Cost Breakdown</h4>
            <LoanComparisonBarChart
              loans={[
                {
                  name: 'Loan 1',
                  totalCost: comparison1.totalCost,
                  principal: loan1.loanAmount,
                  interest: comparison1.totalInterest,
                  fees: loan1.processingFee + loan1.otherCharges,
                },
                {
                  name: 'Loan 2',
                  totalCost: comparison2.totalCost,
                  principal: loan2.loanAmount,
                  interest: comparison2.totalInterest,
                  fees: loan2.processingFee + loan2.otherCharges,
                },
                {
                  name: 'Loan 3',
                  totalCost: comparison3.totalCost,
                  principal: loan3.loanAmount,
                  interest: comparison3.totalInterest,
                  fees: loan3.processingFee + loan3.otherCharges,
                },
              ]}
            />
          </div>

          {/* Recommendation */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Award className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Recommendation: Choose Loan {bestLoan.index}
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Loan {bestLoan.index} offers the lowest total cost of{' '}
                  <span className="font-semibold">{formatCurrency(bestLoan.cost)}</span>.
                  {bestLoan.index === 1 && savings1 === 0 && ' This is the most economical option.'}
                  {bestLoan.index === 2 && savings2 === 0 && ' This is the most economical option.'}
                  {bestLoan.index === 3 && savings3 === 0 && ' This is the most economical option.'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </SectionCard>
  );
}

// Made with Bob