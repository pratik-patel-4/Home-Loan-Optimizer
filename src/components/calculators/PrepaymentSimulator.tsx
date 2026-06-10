/**
 * Prepayment Simulator Component
 * 
 * Simulates the impact of making a prepayment on the loan with:
 * - Two strategies: Reduce EMI or Reduce Tenure
 * - Quick preset buttons for common prepayment amounts
 * - Comparison of both strategies
 * - Interest savings and time savings calculations
 */

import { useState, useMemo } from 'react';
import {
  Wallet,
  Sparkles,
  Calendar,
  TrendingDown,
  Clock,
  CalendarCheck,
  PiggyBank
} from 'lucide-react';
import {
  SectionCard,
  ResultCard,
  CurrencyInput,
  PercentageInput,
  NumberInput
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PrepaymentComparison } from '@/components/charts/PrepaymentComparison';
import {
  calculatePrepaymentImpact,
  comparePrepaymentStrategies
} from '@/utils/prepayment';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

type PrepaymentStrategy = 'REDUCE_EMI' | 'REDUCE_TENURE';

/**
 * PrepaymentSimulator Component
 * 
 * Provides comprehensive prepayment impact analysis with strategy comparison
 */
export function PrepaymentSimulator() {
  // State for input values with defaults from requirements
  const [principal, setPrincipal] = useState<number>(1011566);
  const [rate, setRate] = useState<number>(10.60);
  const [emi, setEmi] = useState<number>(14098);
  const [remainingMonths, setRemainingMonths] = useState<number>(114);
  const [prepaymentAmount, setPrepaymentAmount] = useState<number>(200000);
  const [strategy, setStrategy] = useState<PrepaymentStrategy>('REDUCE_TENURE');

  // Preset amounts for quick selection
  const presetAmounts = [50000, 100000, 200000];

  // Calculate prepayment impact for selected strategy
  const prepaymentResult = useMemo(() => {
    try {
      // Validate inputs
      if (principal <= 0 || rate <= 0 || emi <= 0 || remainingMonths <= 0 || prepaymentAmount <= 0) {
        return null;
      }

      if (prepaymentAmount >= principal) {
        return null; // Prepayment exceeds principal
      }

      return calculatePrepaymentImpact(
        {
          principal,
          rate,
          emi,
          remainingMonths,
          startDate: new Date(),
        },
        {
          amount: prepaymentAmount,
          strategy,
        }
      );
    } catch (error) {
      console.error('Error calculating prepayment impact:', error);
      return null;
    }
  }, [principal, rate, emi, remainingMonths, prepaymentAmount, strategy]);

  // Compare both strategies
  const strategyComparison = useMemo(() => {
    try {
      // Validate inputs
      if (principal <= 0 || rate <= 0 || emi <= 0 || remainingMonths <= 0 || prepaymentAmount <= 0) {
        return null;
      }

      if (prepaymentAmount >= principal) {
        return null;
      }

      return comparePrepaymentStrategies(
        {
          principal,
          rate,
          emi,
          remainingMonths,
          startDate: new Date(),
        },
        prepaymentAmount
      );
    } catch (error) {
      console.error('Error comparing strategies:', error);
      return null;
    }
  }, [principal, rate, emi, remainingMonths, prepaymentAmount]);

  // Calculate total savings (interest saved)
  const totalSavings = prepaymentResult?.interestSaved || 0;

  return (
    <SectionCard
      title="Prepayment Simulator"
      description="Simulate the impact of making a prepayment on your loan"
      icon={Wallet}
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
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Prepayment Details</h3>
          
          {/* Preset Buttons */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Quick Select Amount</Label>
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={prepaymentAmount === amount ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPrepaymentAmount(amount)}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
              <Button
                variant={!presetAmounts.includes(prepaymentAmount) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPrepaymentAmount(0)}
              >
                Custom
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Prepayment Amount"
              value={prepaymentAmount}
              onChange={setPrepaymentAmount}
              placeholder="Enter prepayment amount"
            />

            {/* Strategy Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prepayment Strategy</Label>
              <RadioGroup
                value={strategy}
                onValueChange={(value) => setStrategy(value as PrepaymentStrategy)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="REDUCE_TENURE" id="reduce-tenure" />
                  <Label htmlFor="reduce-tenure" className="font-normal cursor-pointer">
                    Reduce Tenure (Keep EMI same)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="REDUCE_EMI" id="reduce-emi" />
                  <Label htmlFor="reduce-emi" className="font-normal cursor-pointer">
                    Reduce EMI (Keep tenure same)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {prepaymentResult && strategyComparison && (
        <>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Impact Analysis</h3>
              {strategyComparison.recommended === strategy && (
                <Badge variant="default">Recommended Strategy</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard
                title="Interest Saved"
                value={formatCurrency(prepaymentResult.interestSaved)}
                icon={Sparkles}
                variant="success"
                subtitle="Total interest savings"
              />
              
              {strategy === 'REDUCE_TENURE' ? (
                <>
                  <ResultCard
                    title="Months Saved"
                    value={`${prepaymentResult.monthsSaved} months`}
                    icon={Calendar}
                    variant="success"
                    subtitle="Reduction in loan tenure"
                  />
                  
                  <ResultCard
                    title="New Tenure"
                    value={`${prepaymentResult.newTenure} months`}
                    icon={Clock}
                    variant="default"
                    subtitle="Remaining loan period"
                  />
                </>
              ) : (
                <>
                  <ResultCard
                    title="New EMI"
                    value={formatCurrency(prepaymentResult.newEMI)}
                    icon={TrendingDown}
                    variant="success"
                    subtitle={`Reduced by ${formatCurrency(emi - prepaymentResult.newEMI)}`}
                  />
                  
                  <ResultCard
                    title="EMI Reduction"
                    value={formatCurrency(emi - prepaymentResult.newEMI)}
                    icon={TrendingDown}
                    variant="success"
                    subtitle="Monthly payment savings"
                  />
                </>
              )}
              
              <ResultCard
                title="New Closure Date"
                value={formatDate(prepaymentResult.newClosureDate)}
                icon={CalendarCheck}
                variant="default"
                subtitle="Expected completion"
              />
              
              <ResultCard
                title="Total Savings"
                value={formatCurrency(totalSavings)}
                icon={PiggyBank}
                variant="success"
                subtitle="Overall benefit"
              />
            </div>
          </div>

          {/* Strategy Comparison Tabs */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Strategy Comparison</h3>
            <Tabs defaultValue="reduce-tenure" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reduce-tenure">
                  Reduce Tenure
                  {strategyComparison.recommended === 'REDUCE_TENURE' && (
                    <Badge variant="secondary" className="ml-2">Best</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reduce-emi">
                  Reduce EMI
                  {strategyComparison.recommended === 'REDUCE_EMI' && (
                    <Badge variant="secondary" className="ml-2">Best</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="reduce-tenure" className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Keep your EMI at {formatCurrency(emi)} and finish the loan faster
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Saved</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(strategyComparison.reduceTenure.interestSaved)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Months Saved</p>
                      <p className="text-lg font-semibold">
                        {strategyComparison.reduceTenure.monthsSaved}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">New Tenure</p>
                      <p className="text-lg font-semibold">
                        {strategyComparison.reduceTenure.newTenure} months
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Closure Date</p>
                      <p className="text-lg font-semibold">
                        {formatDate(strategyComparison.reduceTenure.newClosureDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reduce-emi" className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Reduce your monthly payment and keep the same tenure
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Saved</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(strategyComparison.reduceEMI.interestSaved)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">New EMI</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(strategyComparison.reduceEMI.newEMI)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">EMI Reduction</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(emi - strategyComparison.reduceEMI.newEMI)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Closure Date</p>
                      <p className="text-lg font-semibold">
                        {formatDate(strategyComparison.reduceEMI.newClosureDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Recommendation */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                💡 Recommendation: {strategyComparison.reason}
              </p>
            </div>
          </div>

          {/* Prepayment Comparison Chart */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Before vs After Prepayment</h3>
            <PrepaymentComparison
              beforeInterest={principal * rate * remainingMonths / 1200}
              afterInterest={prepaymentResult.newPrincipal * rate * prepaymentResult.newTenure / 1200}
              beforeTotal={emi * remainingMonths}
              afterTotal={strategy === 'REDUCE_TENURE'
                ? emi * prepaymentResult.newTenure
                : prepaymentResult.newEMI * remainingMonths}
              beforeTenure={remainingMonths}
              afterTenure={prepaymentResult.newTenure}
            />
          </div>
        </>
      )}

      {/* Error state */}
      {!prepaymentResult && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {prepaymentAmount >= principal
              ? 'Prepayment amount cannot exceed or equal the outstanding principal.'
              : 'Please enter valid values for all fields to see the prepayment analysis.'}
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// Made with Bob
