/**
 * EMI (Equated Monthly Installment) calculation utilities
 * All calculations use standard financial formulas
 */

/** Number of months in a year */
const MONTHS_IN_YEAR = 12;

/**
 * Calculate EMI using the standard loan formula
 * 
 * Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * Where:
 * - P = Principal loan amount
 * - r = Monthly interest rate (annual rate / 12 / 100)
 * - n = Number of months
 * 
 * @param principal - Loan principal amount
 * @param annualRate - Annual interest rate (percentage, e.g., 8.5 for 8.5%)
 * @param months - Loan tenure in months
 * @returns Monthly EMI amount
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  months: number
): number {
  // Handle edge cases
  if (principal <= 0 || months <= 0) {
    return 0;
  }
  
  // If interest rate is 0, EMI is simply principal divided by months
  if (annualRate === 0) {
    return principal / months;
  }
  
  // Convert annual rate to monthly rate (as decimal)
  const monthlyRate = annualRate / MONTHS_IN_YEAR / 100;
  
  // Calculate (1 + r)^n
  const onePlusRPowerN = Math.pow(1 + monthlyRate, months);
  
  // Apply EMI formula
  const emi = (principal * monthlyRate * onePlusRPowerN) / (onePlusRPowerN - 1);
  
  // Round to 2 decimal places
  return Math.round(emi * 100) / 100;
}

/**
 * Calculate total interest to be paid over the loan tenure
 * 
 * Formula: Total Interest = (EMI × months) - Principal
 * 
 * @param emi - Monthly EMI amount
 * @param months - Number of months remaining
 * @param principal - Principal amount
 * @returns Total interest amount
 */
export function calculateRemainingInterest(
  emi: number,
  months: number,
  principal: number
): number {
  const totalPayment = emi * months;
  const interest = totalPayment - principal;
  
  // Round to 2 decimal places
  return Math.round(interest * 100) / 100;
}

/**
 * Calculate principal amount from EMI, rate, and tenure
 * This is the reverse of the EMI formula
 * 
 * Formula: P = EMI × ((1+r)^n - 1) / (r × (1+r)^n)
 * 
 * @param emi - Monthly EMI amount
 * @param annualRate - Annual interest rate (percentage)
 * @param months - Loan tenure in months
 * @returns Principal loan amount
 */
export function calculatePrincipal(
  emi: number,
  annualRate: number,
  months: number
): number {
  // Handle edge cases
  if (emi <= 0 || months <= 0) {
    return 0;
  }
  
  // If interest rate is 0, principal is EMI × months
  if (annualRate === 0) {
    return emi * months;
  }
  
  // Convert annual rate to monthly rate (as decimal)
  const monthlyRate = annualRate / MONTHS_IN_YEAR / 100;
  
  // Calculate (1 + r)^n
  const onePlusRPowerN = Math.pow(1 + monthlyRate, months);
  
  // Apply reverse EMI formula
  const principal = (emi * (onePlusRPowerN - 1)) / (monthlyRate * onePlusRPowerN);
  
  // Round to 2 decimal places
  return Math.round(principal * 100) / 100;
}

/**
 * Calculate loan tenure (in months) from principal, EMI, and rate
 * Uses logarithmic formula derived from EMI equation
 * 
 * Formula: n = log(EMI / (EMI - P×r)) / log(1 + r)
 * 
 * @param principal - Loan principal amount
 * @param emi - Monthly EMI amount
 * @param annualRate - Annual interest rate (percentage)
 * @returns Number of months (tenure)
 */
export function calculateTenure(
  principal: number,
  emi: number,
  annualRate: number
): number {
  // Handle edge cases
  if (principal <= 0 || emi <= 0) {
    return 0;
  }
  
  // If interest rate is 0, tenure is principal / EMI
  if (annualRate === 0) {
    return Math.ceil(principal / emi);
  }
  
  // Convert annual rate to monthly rate (as decimal)
  const monthlyRate = annualRate / MONTHS_IN_YEAR / 100;
  
  // Calculate monthly interest on principal
  const monthlyInterest = principal * monthlyRate;
  
  // EMI must be greater than monthly interest for loan to be payable
  if (emi <= monthlyInterest) {
    // Return a very large number to indicate loan cannot be paid off
    return 999999;
  }
  
  // Apply tenure formula using logarithms
  const numerator = Math.log(emi / (emi - monthlyInterest));
  const denominator = Math.log(1 + monthlyRate);
  const months = numerator / denominator;
  
  // Round up to nearest whole month
  return Math.ceil(months);
}

// Made with Bob
