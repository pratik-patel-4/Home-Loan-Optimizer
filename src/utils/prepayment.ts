/**
 * Prepayment calculation utilities
 * Handles both EMI reduction and tenure reduction strategies
 */

import type { LoanDetails, PrepaymentDetails, PrepaymentResult } from '../types/loan';
import { calculateEMI, calculateTenure } from './emi';
import { generateAmortizationSchedule, calculateLoanHealth } from './amortization';
import { addMonthsToDate } from './date';

/**
 * Calculate the impact of a prepayment on the loan
 * 
 * Two strategies:
 * 1. REDUCE_EMI: Keep tenure same, reduce monthly EMI
 * 2. REDUCE_TENURE: Keep EMI same, reduce loan tenure
 * 
 * @param loanDetails - Current loan details
 * @param prepaymentDetails - Prepayment amount and strategy
 * @returns Prepayment impact results
 */
export function calculatePrepaymentImpact(
  loanDetails: LoanDetails,
  prepaymentDetails: PrepaymentDetails
): PrepaymentResult {
  const { principal, rate, emi, remainingMonths, startDate } = loanDetails;
  const { amount, strategy } = prepaymentDetails;
  
  // Validate prepayment amount
  if (amount <= 0 || amount >= principal) {
    // If prepayment is invalid or pays off entire loan
    return {
      interestSaved: 0,
      monthsSaved: 0,
      newEMI: emi,
      newTenure: remainingMonths,
      newClosureDate: addMonthsToDate(startDate, remainingMonths),
    };
  }
  
  // Calculate new principal after prepayment
  const newPrincipal = principal - amount;
  
  // Calculate current loan metrics
  const currentSchedule = generateAmortizationSchedule(principal, rate, emi);
  const currentInterest = currentSchedule.reduce((sum, row) => sum + row.interest, 0);
  
  let newEMI: number;
  let newTenure: number;
  let newInterest: number;
  
  if (strategy === 'REDUCE_EMI') {
    // Strategy 1: Reduce EMI, keep tenure same
    newTenure = remainingMonths;
    newEMI = calculateEMI(newPrincipal, rate, newTenure);
    
    // Calculate new interest with reduced EMI
    const newSchedule = generateAmortizationSchedule(newPrincipal, rate, newEMI);
    newInterest = newSchedule.reduce((sum, row) => sum + row.interest, 0);
    
  } else {
    // Strategy 2: Reduce tenure, keep EMI same
    newEMI = emi;
    newTenure = calculateTenure(newPrincipal, emi, rate);
    
    // Calculate new interest with reduced tenure
    const newSchedule = generateAmortizationSchedule(newPrincipal, rate, emi);
    newInterest = newSchedule.reduce((sum, row) => sum + row.interest, 0);
  }
  
  // Calculate savings
  const interestSaved = currentInterest - newInterest;
  const monthsSaved = remainingMonths - newTenure;
  
  // Calculate new closure date
  const newClosureDate = addMonthsToDate(startDate, newTenure);
  
  return {
    interestSaved: Math.round(interestSaved * 100) / 100,
    monthsSaved: Math.max(0, monthsSaved),
    newEMI: Math.round(newEMI * 100) / 100,
    newTenure,
    newClosureDate,
  };
}

/**
 * Compare both prepayment strategies and return the better option
 * 
 * @param loanDetails - Current loan details
 * @param prepaymentAmount - Amount to prepay
 * @returns Object with both strategy results and recommendation
 */
export function comparePrepaymentStrategies(
  loanDetails: LoanDetails,
  prepaymentAmount: number
): {
  reduceEMI: PrepaymentResult;
  reduceTenure: PrepaymentResult;
  recommended: 'REDUCE_EMI' | 'REDUCE_TENURE';
  reason: string;
} {
  // Calculate impact for both strategies
  const reduceEMI = calculatePrepaymentImpact(loanDetails, {
    amount: prepaymentAmount,
    strategy: 'REDUCE_EMI',
  });
  
  const reduceTenure = calculatePrepaymentImpact(loanDetails, {
    amount: prepaymentAmount,
    strategy: 'REDUCE_TENURE',
  });
  
  // Determine which strategy saves more interest
  let recommended: 'REDUCE_EMI' | 'REDUCE_TENURE';
  let reason: string;
  
  if (reduceTenure.interestSaved > reduceEMI.interestSaved) {
    recommended = 'REDUCE_TENURE';
    const additionalSavings = reduceTenure.interestSaved - reduceEMI.interestSaved;
    reason = `Reducing tenure saves ₹${Math.round(additionalSavings).toLocaleString('en-IN')} more in interest and closes the loan ${reduceTenure.monthsSaved} months earlier.`;
  } else {
    recommended = 'REDUCE_EMI';
    const additionalSavings = reduceEMI.interestSaved - reduceTenure.interestSaved;
    const emiReduction = loanDetails.emi - reduceEMI.newEMI;
    reason = `Reducing EMI saves ₹${Math.round(additionalSavings).toLocaleString('en-IN')} more in interest and reduces monthly payment by ₹${Math.round(emiReduction).toLocaleString('en-IN')}.`;
  }
  
  return {
    reduceEMI,
    reduceTenure,
    recommended,
    reason,
  };
}

// Made with Bob
