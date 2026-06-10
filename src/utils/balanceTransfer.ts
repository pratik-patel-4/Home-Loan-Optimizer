/**
 * Balance transfer calculation utilities
 * Compares current loan with a new loan at different interest rate
 */

import type { LoanDetails, BalanceTransferDetails, BalanceTransferResult } from '../types/loan';
import { calculateEMI } from './emi';
import { generateAmortizationSchedule } from './amortization';
import { addMonthsToDate } from './date';

/**
 * Calculate the benefit of transferring loan balance to a new lender
 * 
 * Compares:
 * - Current loan: existing rate and tenure
 * - New loan: new rate with same tenure
 * 
 * Calculates:
 * - Interest savings
 * - Net benefit after transfer charges
 * - Break-even period
 * - Months saved
 * 
 * @param loanDetails - Current loan details
 * @param transferDetails - Balance transfer scenario details
 * @returns Balance transfer benefit analysis
 */
export function calculateBalanceTransferBenefit(
  loanDetails: LoanDetails,
  transferDetails: BalanceTransferDetails
): BalanceTransferResult {
  const { principal, rate, emi, remainingMonths, startDate } = loanDetails;
  const { currentRate, newRate, transferCharges } = transferDetails;
  
  // Use provided current rate or fall back to loan details rate
  const effectiveCurrentRate = currentRate || rate;
  
  // Calculate current loan metrics
  const currentSchedule = generateAmortizationSchedule(principal, effectiveCurrentRate, emi);
  const currentInterest = currentSchedule.reduce((sum, row) => sum + row.interest, 0);
  const currentTenure = currentSchedule.length;
  
  // Calculate new loan metrics with new interest rate
  const newEMI = calculateEMI(principal, newRate, remainingMonths);
  const newSchedule = generateAmortizationSchedule(principal, newRate, newEMI);
  const newInterest = newSchedule.reduce((sum, row) => sum + row.interest, 0);
  const newTenure = newSchedule.length;
  
  // Calculate savings
  const interestSavings = currentInterest - newInterest;
  const netBenefit = interestSavings - transferCharges;
  
  // Calculate monthly savings (difference in EMI)
  const monthlySavings = emi - newEMI;
  
  // Calculate break-even months
  // Break-even is when cumulative monthly savings equals transfer charges
  let breakEvenMonths = 0;
  if (monthlySavings > 0) {
    breakEvenMonths = Math.ceil(transferCharges / monthlySavings);
  } else {
    // If new EMI is higher, break-even is not achievable through EMI savings
    // Set to a high number to indicate it's not beneficial
    breakEvenMonths = 999999;
  }
  
  // Calculate months saved in tenure
  const monthsSaved = currentTenure - newTenure;
  
  // Calculate new closure date
  const newClosureDate = addMonthsToDate(startDate, newTenure);
  
  return {
    currentInterest: Math.round(currentInterest * 100) / 100,
    newInterest: Math.round(newInterest * 100) / 100,
    interestSavings: Math.round(interestSavings * 100) / 100,
    netBenefit: Math.round(netBenefit * 100) / 100,
    breakEvenMonths: Math.min(breakEvenMonths, 999999),
    monthsSaved: Math.max(0, monthsSaved),
    newClosureDate,
    newEMI: Math.round(newEMI * 100) / 100,
  };
}

/**
 * Determine if balance transfer is worth it based on various criteria
 * 
 * Criteria:
 * - Net benefit should be positive and significant (> ₹50,000)
 * - Break-even period should be reasonable (< 24 months)
 * - Interest rate difference should be meaningful (> 0.5%)
 * 
 * @param transferResult - Balance transfer calculation result
 * @param minBenefit - Minimum net benefit to consider worthwhile (default: 50000)
 * @param maxBreakEvenMonths - Maximum acceptable break-even period (default: 24)
 * @returns Object with recommendation and reason
 */
export function isBalanceTransferWorthwhile(
  transferResult: BalanceTransferResult,
  minBenefit: number = 50000,
  maxBreakEvenMonths: number = 24
): {
  worthwhile: boolean;
  reason: string;
  score: number; // 0-100
} {
  const { netBenefit, breakEvenMonths, interestSavings } = transferResult;
  
  // Check if net benefit is positive and significant
  if (netBenefit < minBenefit) {
    return {
      worthwhile: false,
      reason: `Net benefit of ₹${Math.round(netBenefit).toLocaleString('en-IN')} is below the recommended minimum of ₹${minBenefit.toLocaleString('en-IN')}.`,
      score: Math.max(0, Math.round((netBenefit / minBenefit) * 50)),
    };
  }
  
  // Check if break-even period is reasonable
  if (breakEvenMonths > maxBreakEvenMonths) {
    return {
      worthwhile: false,
      reason: `Break-even period of ${breakEvenMonths} months exceeds the recommended maximum of ${maxBreakEvenMonths} months.`,
      score: Math.max(0, Math.round((maxBreakEvenMonths / breakEvenMonths) * 50)),
    };
  }
  
  // Calculate worthwhile score (0-100)
  // Based on net benefit and break-even period
  const benefitScore = Math.min(100, (netBenefit / 200000) * 50); // Max 50 points for ₹2L+ benefit
  const breakEvenScore = Math.max(0, 50 - (breakEvenMonths / maxBreakEvenMonths) * 50); // Max 50 points for immediate break-even
  const score = Math.round(benefitScore + breakEvenScore);
  
  return {
    worthwhile: true,
    reason: `Balance transfer will save ₹${Math.round(interestSavings).toLocaleString('en-IN')} in interest with a net benefit of ₹${Math.round(netBenefit).toLocaleString('en-IN')} after charges. Break-even in ${breakEvenMonths} months.`,
    score,
  };
}

// Made with Bob
