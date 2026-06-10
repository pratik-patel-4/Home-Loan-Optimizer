/**
 * Loan Eligibility Calculation Utilities
 * 
 * Calculates maximum loan eligibility based on income and obligations
 * using FOIR (Fixed Obligation to Income Ratio) methodology
 */

import { LoanEligibilityResult } from '@/types/loan';
import { calculatePrincipal } from './emi';

/** Standard FOIR percentage used by banks (50%) */
const STANDARD_FOIR = 0.5;

/** Standard retirement age */
const RETIREMENT_AGE = 60;

/**
 * Calculate Fixed Obligation to Income Ratio
 * 
 * @param monthlyIncome - Gross monthly income
 * @param existingObligations - Existing monthly EMIs and obligations
 * @returns FOIR as a decimal (e.g., 0.5 for 50%)
 */
export function calculateFOIR(
  monthlyIncome: number,
  existingObligations: number
): number {
  if (monthlyIncome <= 0) {
    return 0;
  }
  
  return existingObligations / monthlyIncome;
}

/**
 * Calculate maximum loan eligibility based on income and obligations
 * 
 * Uses FOIR methodology:
 * - Available Income = (Monthly Income - Existing Obligations) × FOIR
 * - Maximum Loan = Calculated using reverse EMI formula
 * 
 * @param monthlyIncome - Gross monthly income
 * @param existingObligations - Existing monthly EMIs and obligations
 * @param rate - Annual interest rate (percentage)
 * @param tenureYears - Desired loan tenure in years
 * @param age - Current age of applicant
 * @returns Loan eligibility calculation result
 */
export function calculateMaxLoanEligibility(
  monthlyIncome: number,
  existingObligations: number,
  rate: number,
  tenureYears: number,
  age: number
): LoanEligibilityResult {
  // Validate inputs
  if (monthlyIncome <= 0 || rate <= 0 || tenureYears <= 0 || age <= 0) {
    return {
      maxLoanAmount: 0,
      maxEMI: 0,
      effectiveTenure: 0,
      foir: 0,
      availableIncome: 0,
    };
  }

  // Calculate maximum tenure based on retirement age
  const maxTenureYears = Math.min(tenureYears, RETIREMENT_AGE - age);
  
  // If already past retirement age or no tenure available
  if (maxTenureYears <= 0) {
    return {
      maxLoanAmount: 0,
      maxEMI: 0,
      effectiveTenure: 0,
      foir: calculateFOIR(monthlyIncome, existingObligations),
      availableIncome: 0,
    };
  }

  // Calculate available income for EMI using FOIR
  const availableIncome = (monthlyIncome - existingObligations) * STANDARD_FOIR;
  
  // If no income available after obligations
  if (availableIncome <= 0) {
    return {
      maxLoanAmount: 0,
      maxEMI: 0,
      effectiveTenure: maxTenureYears,
      foir: calculateFOIR(monthlyIncome, existingObligations),
      availableIncome: 0,
    };
  }

  // Calculate maximum loan amount using reverse EMI formula
  const maxLoanAmount = calculatePrincipal(
    availableIncome,
    rate,
    maxTenureYears * 12
  );

  return {
    maxLoanAmount: Math.round(maxLoanAmount),
    maxEMI: Math.round(availableIncome),
    effectiveTenure: maxTenureYears,
    foir: STANDARD_FOIR,
    availableIncome: Math.round(availableIncome),
  };
}

/**
 * Calculate available monthly income after obligations
 * 
 * @param monthlyIncome - Gross monthly income
 * @param existingObligations - Existing monthly EMIs and obligations
 * @returns Available income for new EMI
 */
export function calculateAvailableIncome(
  monthlyIncome: number,
  existingObligations: number
): number {
  const available = monthlyIncome - existingObligations;
  return Math.max(0, available);
}

// Made with Bob