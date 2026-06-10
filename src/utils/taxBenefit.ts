/**
 * Tax Benefit Calculation Utilities
 * 
 * Calculates tax benefits on home loans under Indian Income Tax Act
 * - Section 80C: Principal repayment deduction
 * - Section 24(b): Interest payment deduction
 * - Section 80EEA: Additional deduction for first-time buyers
 */

import { TaxBenefitResult } from '@/types/loan';
import { calculateEMI } from './emi';

/** Maximum deduction under Section 80C */
const SECTION_80C_LIMIT = 150000;

/** Maximum deduction under Section 24(b) for self-occupied property */
const SECTION_24B_SELF_OCCUPIED_LIMIT = 200000;

/** Section 24(b) has no limit for let-out property */
const SECTION_24B_LET_OUT_UNLIMITED = true;

/** Additional deduction under Section 80EEA for first-time buyers */
const SECTION_80EEA_LIMIT = 150000;

/** Standard tax bracket assumption (30%) */
const TAX_RATE = 0.30;

/** Number of months in a year */
const MONTHS_IN_YEAR = 12;

/**
 * Calculate principal deduction under Section 80C
 * 
 * @param principalPaid - Annual principal repayment
 * @param hasCoApplicant - Whether there is a co-applicant
 * @returns Deduction amount under Section 80C
 */
export function calculateSection80C(
  principalPaid: number,
  hasCoApplicant: boolean
): number {
  const limit = hasCoApplicant ? SECTION_80C_LIMIT * 2 : SECTION_80C_LIMIT;
  return Math.min(principalPaid, limit);
}

/**
 * Calculate interest deduction under Section 24(b)
 * 
 * @param interestPaid - Annual interest payment
 * @param propertyType - Type of property (SELF_OCCUPIED or LET_OUT)
 * @param hasCoApplicant - Whether there is a co-applicant
 * @returns Deduction amount under Section 24(b)
 */
export function calculateSection24b(
  interestPaid: number,
  propertyType: 'SELF_OCCUPIED' | 'LET_OUT',
  hasCoApplicant: boolean
): number {
  if (propertyType === 'LET_OUT') {
    // No limit for let-out property
    return interestPaid;
  }
  
  // Self-occupied property has a limit
  const limit = hasCoApplicant 
    ? SECTION_24B_SELF_OCCUPIED_LIMIT * 2 
    : SECTION_24B_SELF_OCCUPIED_LIMIT;
  
  return Math.min(interestPaid, limit);
}

/**
 * Calculate first year principal and interest components
 * 
 * @param loanAmount - Total loan amount
 * @param rate - Annual interest rate (percentage)
 * @param tenureYears - Loan tenure in years
 * @returns Object with first year principal and interest
 */
function calculateFirstYearComponents(
  loanAmount: number,
  rate: number,
  tenureYears: number
): { principal: number; interest: number } {
  const emi = calculateEMI(loanAmount, rate, tenureYears * MONTHS_IN_YEAR);
  const monthlyRate = rate / MONTHS_IN_YEAR / 100;
  
  let remainingPrincipal = loanAmount;
  let totalPrincipal = 0;
  let totalInterest = 0;
  
  // Calculate for first 12 months
  for (let month = 1; month <= MONTHS_IN_YEAR; month++) {
    const interestComponent = remainingPrincipal * monthlyRate;
    const principalComponent = emi - interestComponent;
    
    totalInterest += interestComponent;
    totalPrincipal += principalComponent;
    remainingPrincipal -= principalComponent;
  }
  
  return {
    principal: Math.round(totalPrincipal),
    interest: Math.round(totalInterest),
  };
}

/**
 * Calculate comprehensive tax benefits on home loan
 * 
 * @param loanAmount - Total loan amount
 * @param rate - Annual interest rate (percentage)
 * @param tenureYears - Loan tenure in years
 * @param annualIncome - Annual gross income
 * @param propertyType - Type of property (SELF_OCCUPIED or LET_OUT)
 * @param hasCoApplicant - Whether there is a co-applicant
 * @returns Complete tax benefit calculation result
 */
export function calculateTaxBenefit(
  loanAmount: number,
  rate: number,
  tenureYears: number,
  annualIncome: number,
  propertyType: 'SELF_OCCUPIED' | 'LET_OUT',
  hasCoApplicant: boolean
): TaxBenefitResult {
  // Validate inputs
  if (loanAmount <= 0 || rate <= 0 || tenureYears <= 0 || annualIncome <= 0) {
    return {
      principalDeduction: 0,
      interestDeduction: 0,
      totalDeduction: 0,
      taxSaved: 0,
      effectiveRate: rate,
      monthlySavings: 0,
    };
  }

  // Calculate first year principal and interest
  const { principal: firstYearPrincipal, interest: firstYearInterest } = 
    calculateFirstYearComponents(loanAmount, rate, tenureYears);

  // Calculate deductions
  const principalDeduction = calculateSection80C(firstYearPrincipal, hasCoApplicant);
  const interestDeduction = calculateSection24b(
    firstYearInterest,
    propertyType,
    hasCoApplicant
  );

  // Total deduction
  const totalDeduction = principalDeduction + interestDeduction;

  // Tax saved (assuming 30% tax bracket)
  const taxSaved = Math.round(totalDeduction * TAX_RATE);

  // Monthly savings
  const monthlySavings = Math.round(taxSaved / MONTHS_IN_YEAR);

  // Calculate effective interest rate after tax benefit
  const emi = calculateEMI(loanAmount, rate, tenureYears * MONTHS_IN_YEAR);
  const annualEMI = emi * MONTHS_IN_YEAR;
  const effectiveAnnualCost = annualEMI - taxSaved;
  const effectiveInterestCost = effectiveAnnualCost - firstYearPrincipal;
  const effectiveRate = (effectiveInterestCost / loanAmount) * 100;

  return {
    principalDeduction: Math.round(principalDeduction),
    interestDeduction: Math.round(interestDeduction),
    totalDeduction: Math.round(totalDeduction),
    taxSaved,
    effectiveRate: Math.max(0, Math.round(effectiveRate * 100) / 100),
    monthlySavings,
  };
}

/**
 * Calculate maximum tax benefit possible
 * 
 * @param hasCoApplicant - Whether there is a co-applicant
 * @param propertyType - Type of property
 * @returns Maximum possible tax benefit
 */
export function calculateMaxTaxBenefit(
  hasCoApplicant: boolean,
  propertyType: 'SELF_OCCUPIED' | 'LET_OUT'
): number {
  const maxPrincipalDeduction = hasCoApplicant 
    ? SECTION_80C_LIMIT * 2 
    : SECTION_80C_LIMIT;
  
  const maxInterestDeduction = propertyType === 'LET_OUT'
    ? Infinity
    : (hasCoApplicant ? SECTION_24B_SELF_OCCUPIED_LIMIT * 2 : SECTION_24B_SELF_OCCUPIED_LIMIT);

  if (maxInterestDeduction === Infinity) {
    return Infinity;
  }

  return (maxPrincipalDeduction + maxInterestDeduction) * TAX_RATE;
}

// Made with Bob