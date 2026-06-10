/**
 * Amortization schedule and loan health calculation utilities
 */

import type { AmortizationRow, LoanHealth } from '../types/loan';
import { addMonthsToDate } from './date';

/** Number of months in a year */
const MONTHS_IN_YEAR = 12;

/**
 * Generate complete amortization schedule for a loan
 * 
 * Each month:
 * - Interest = Outstanding Balance × Monthly Rate
 * - Principal = EMI - Interest
 * - New Balance = Outstanding Balance - Principal
 * 
 * @param principal - Initial loan principal amount
 * @param annualRate - Annual interest rate (percentage)
 * @param emi - Monthly EMI amount
 * @param startMonth - Starting month number (default: 1)
 * @returns Array of amortization rows, one per month
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  emi: number,
  startMonth: number = 1
): AmortizationRow[] {
  // Handle edge cases
  if (principal <= 0 || emi <= 0) {
    return [];
  }
  
  // Convert annual rate to monthly rate (as decimal)
  const monthlyRate = annualRate / MONTHS_IN_YEAR / 100;
  
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let month = startMonth;
  
  // Generate schedule until balance is paid off
  // Add safety limit to prevent infinite loops
  const maxMonths = 1000;
  let iterations = 0;
  
  while (balance > 0.01 && iterations < maxMonths) {
    // Calculate interest for this month
    const interest = balance * monthlyRate;
    
    // Calculate principal component
    let principalPayment = emi - interest;
    
    // For the last payment, adjust to pay off remaining balance
    if (principalPayment > balance) {
      principalPayment = balance;
    }
    
    // Calculate new balance
    const newBalance = balance - principalPayment;
    
    // Actual EMI for this month (may be less than regular EMI for last payment)
    const actualEmi = principalPayment + interest;
    
    // Add row to schedule
    schedule.push({
      month,
      emi: Math.round(actualEmi * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(Math.max(0, newBalance) * 100) / 100,
    });
    
    // Update for next iteration
    balance = newBalance;
    month++;
    iterations++;
  }
  
  return schedule;
}

/**
 * Calculate comprehensive loan health metrics
 * 
 * Metrics include:
 * - Remaining principal and interest
 * - Total remaining payment
 * - Expected closure date
 * - Interest burden ratio
 * - Health score assessment
 * 
 * @param principal - Current outstanding principal
 * @param annualRate - Annual interest rate (percentage)
 * @param emi - Monthly EMI amount
 * @param remainingMonths - Number of months remaining
 * @param startDate - Current date or loan start date
 * @returns Complete loan health metrics
 */
export function calculateLoanHealth(
  principal: number,
  annualRate: number,
  emi: number,
  remainingMonths: number,
  startDate: Date
): LoanHealth {
  // Generate amortization schedule to get accurate calculations
  const schedule = generateAmortizationSchedule(principal, annualRate, emi);
  
  // Calculate total interest from schedule
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
  
  // Calculate total remaining payment
  const totalRemaining = principal + totalInterest;
  
  // Calculate closure date
  const actualMonths = schedule.length;
  const closureDate = addMonthsToDate(startDate, actualMonths);
  
  // Calculate interest burden ratio (interest / principal)
  const interestBurden = principal > 0 ? totalInterest / principal : 0;
  
  // Determine health score based on interest burden
  const healthScore = calculateHealthScore(interestBurden);
  
  return {
    remainingPrincipal: Math.round(principal * 100) / 100,
    remainingInterest: Math.round(totalInterest * 100) / 100,
    totalRemaining: Math.round(totalRemaining * 100) / 100,
    closureDate,
    interestBurden: Math.round(interestBurden * 1000) / 1000, // 3 decimal places
    healthScore,
  };
}

/**
 * Calculate health score description based on interest burden ratio
 * 
 * Scoring criteria:
 * - < 0.3 (30%): Excellent - Very low interest burden
 * - < 0.5 (50%): Good - Reasonable interest burden
 * - < 0.7 (70%): Average - Moderate interest burden
 * - >= 0.7 (70%): Needs Optimization - High interest burden
 * 
 * @param interestBurden - Interest to principal ratio
 * @returns Health score description
 */
export function calculateHealthScore(interestBurden: number): string {
  if (interestBurden < 0.3) {
    return 'Excellent';
  } else if (interestBurden < 0.5) {
    return 'Good';
  } else if (interestBurden < 0.7) {
    return 'Average';
  } else {
    return 'Needs Optimization';
  }
}

// Made with Bob
