import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { SectionCard, CurrencyInput, PercentageInput, NumberInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { AmortizationTable } from './AmortizationTable';
import { generateAmortizationSchedule } from '@/utils/amortization';
import type { AmortizationRow } from '@/types/loan';

/**
 * Amortization Schedule Calculator with Input Form
 * 
 * Allows users to input loan details and generate a complete amortization schedule
 */
export function AmortizationScheduleCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleCalculate = () => {
    const tenureMonths = tenureYears * 12;
    const generatedSchedule = generateAmortizationSchedule(
      loanAmount,
      interestRate,
      tenureMonths
    );
    setSchedule(generatedSchedule);
    setIsCalculated(true);
  };

  const handleReset = () => {
    setSchedule([]);
    setIsCalculated(false);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Generate Amortization Schedule"
        description="Enter your loan details to see a detailed month-by-month payment breakdown"
        icon={Calculator}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CurrencyInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            placeholder="Enter loan amount"
          />
          
          <PercentageInput
            label="Interest Rate (Annual)"
            value={interestRate}
            onChange={setInterestRate}
            placeholder="Enter interest rate"
          />
          
          <NumberInput
            label="Loan Tenure (Years)"
            value={tenureYears}
            onChange={setTenureYears}
            placeholder="Enter tenure in years"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button 
            onClick={handleCalculate}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
          >
            Generate Schedule
          </Button>
          
          {isCalculated && (
            <Button 
              onClick={handleReset}
              variant="outline"
            >
              Reset
            </Button>
          )}
        </div>
      </SectionCard>

      {isCalculated && (
        <AmortizationTable
          schedule={schedule}
          isLoading={false}
        />
      )}
    </div>
  );
}

// Made with Bob