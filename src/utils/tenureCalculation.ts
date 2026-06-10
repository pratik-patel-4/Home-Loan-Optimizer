export interface TenureCalculationResult {
  tenureMonths: number;
  tenureYears: number;
  remainingMonths: number;
  totalPayable: number;
  totalInterest: number;
  closureDate: Date;
  interestToPrincipalRatio: number;
  minimumEMI: number;
  monthlyInterest: number;
}

/**
 * Calculate loan tenure based on principal, interest rate, and EMI
 * Uses the loan amortization formula solved for n (number of months):
 * n = log(EMI / (EMI - P*r)) / log(1 + r)
 * 
 * @param principal - Outstanding loan amount
 * @param annualRate - Annual interest rate (percentage)
 * @param emi - Monthly EMI amount
 * @returns TenureCalculationResult object with all calculated values
 * @throws Error if EMI is too low to repay the loan
 */
export function calculateLoanTenure(
  principal: number,
  annualRate: number,
  emi: number
): TenureCalculationResult {
  // Validate inputs
  if (!principal || principal <= 0) {
    throw new Error('Principal must be a positive number');
  }
  if (!annualRate || annualRate <= 0) {
    throw new Error('Interest rate must be a positive number');
  }
  if (!emi || emi <= 0) {
    throw new Error('EMI must be a positive number');
  }
  
  const monthlyRate = annualRate / 12 / 100;
  const monthlyInterest = principal * monthlyRate;
  
  // Minimum EMI is slightly more than monthly interest
  const minimumEMI = monthlyInterest * 1.01;
  
  if (emi <= monthlyInterest) {
    throw new Error(`EMI must be greater than monthly interest (₹${monthlyInterest.toFixed(2)})`);
  }
  
  // Calculate tenure using logarithmic formula
  const tenureMonths = Math.log(emi / (emi - principal * monthlyRate)) / Math.log(1 + monthlyRate);
  
  const tenureYears = Math.floor(tenureMonths / 12);
  const remainingMonths = Math.round(tenureMonths % 12);
  
  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;
  
  const closureDate = new Date();
  closureDate.setMonth(closureDate.getMonth() + Math.ceil(tenureMonths));
  
  const interestToPrincipalRatio = (totalInterest / principal) * 100;
  
  return {
    tenureMonths: Math.ceil(tenureMonths),
    tenureYears,
    remainingMonths,
    totalPayable,
    totalInterest,
    closureDate,
    interestToPrincipalRatio,
    minimumEMI,
    monthlyInterest
  };
}

/**
 * Calculate minimum EMI required to repay a loan
 * Minimum EMI is 1% more than the monthly interest
 * 
 * @param principal - Outstanding loan amount
 * @param annualRate - Annual interest rate (percentage)
 * @returns Minimum EMI amount
 */
export function calculateMinimumEMI(
  principal: number,
  annualRate: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  return principal * monthlyRate * 1.01; // 1% more than interest
}

/**
 * Format tenure in months to a human-readable string
 * Examples: "9 years 6 months", "18 months", "2 years"
 * 
 * @param months - Number of months
 * @returns Formatted tenure string
 */
export function formatTenure(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
  
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  
  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
}

// Made with Bob
