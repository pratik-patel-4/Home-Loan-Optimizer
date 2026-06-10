/**
 * Investment and Part Payment Comparison Utilities
 * 
 * Compares the financial benefit of making a part payment on a loan
 * versus investing the same amount elsewhere
 */

import { ComparisonResult, LoanDetails } from '@/types/loan';
import { calculateTenure, calculateRemainingInterest } from './emi';

/** Number of months in a year */
const MONTHS_IN_YEAR = 12;

/**
 * Calculate future value of an investment
 * 
 * Formula: FV = P × (1 + r)^n
 * Where:
 * - P = Principal amount
 * - r = Monthly interest rate
 * - n = Number of months
 * 
 * @param principal - Initial investment amount
 * @param annualRate - Annual interest rate (percentage)
 * @param years - Investment period in years
 * @returns Future value of the investment
 */
export function calculateFutureValue(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) {
    return 0;
  }

  if (annualRate === 0) {
    return principal;
  }

  const monthlyRate = annualRate / MONTHS_IN_YEAR / 100;
  const months = years * MONTHS_IN_YEAR;
  
  const futureValue = principal * Math.pow(1 + monthlyRate, months);
  
  return Math.round(futureValue * 100) / 100;
}

/**
 * Calculate interest saved by making a part payment
 * 
 * @param loanAmount - Outstanding loan amount
 * @param rate - Annual interest rate (percentage)
 * @param remainingMonths - Remaining tenure in months
 * @param emi - Current EMI
 * @param prepaymentAmount - Amount to prepay
 * @returns Interest saved by prepaying
 */
function calculatePrepaymentSavings(
  loanAmount: number,
  rate: number,
  remainingMonths: number,
  emi: number,
  prepaymentAmount: number
): number {
  // Calculate current total interest
  const currentInterest = calculateRemainingInterest(emi, remainingMonths, loanAmount);
  
  // Calculate new loan amount after prepayment
  const newLoanAmount = loanAmount - prepaymentAmount;
  
  if (newLoanAmount <= 0) {
    // Loan fully paid off
    return currentInterest;
  }
  
  // Calculate new tenure with same EMI
  const newTenure = calculateTenure(newLoanAmount, emi, rate);
  
  // Calculate new total interest
  const newInterest = calculateRemainingInterest(emi, newTenure, newLoanAmount);
  
  // Interest saved
  return currentInterest - newInterest;
}

/**
 * Calculate total interest paid on loan over investment period
 * 
 * @param loanAmount - Outstanding loan amount
 * @param rate - Annual interest rate (percentage)
 * @param emi - Monthly EMI
 * @param months - Number of months
 * @returns Total interest paid over the period
 */
function calculateInterestPaidOverPeriod(
  loanAmount: number,
  rate: number,
  emi: number,
  months: number
): number {
  const monthlyRate = rate / MONTHS_IN_YEAR / 100;
  let remainingPrincipal = loanAmount;
  let totalInterest = 0;
  
  for (let month = 1; month <= months; month++) {
    if (remainingPrincipal <= 0) break;
    
    const interestComponent = remainingPrincipal * monthlyRate;
    const principalComponent = emi - interestComponent;
    
    totalInterest += interestComponent;
    remainingPrincipal -= principalComponent;
  }
  
  return Math.round(totalInterest);
}

/**
 * Calculate break-even point for investment vs prepayment
 * 
 * @param loanRate - Loan interest rate (percentage)
 * @param investmentRate - Investment return rate (percentage)
 * @param amount - Amount to invest or prepay
 * @returns Number of months to break even
 */
function calculateBreakEvenMonths(
  loanRate: number,
  investmentRate: number,
  _amount: number
): number {
  if (investmentRate <= loanRate) {
    // Investment rate is lower, prepayment is always better
    return 0;
  }
  
  // Simplified break-even calculation
  // This is an approximation
  const rateDifference = (investmentRate - loanRate) / 100 / MONTHS_IN_YEAR;
  
  if (rateDifference <= 0) {
    return 0;
  }
  
  // Approximate months needed for investment to overcome loan interest
  const months = Math.log(1.1) / Math.log(1 + rateDifference);
  
  return Math.round(months);
}

/**
 * Compare part payment vs investment scenarios
 * 
 * Analyzes whether it's better to:
 * 1. Make a part payment on the loan, or
 * 2. Invest the money elsewhere
 * 
 * @param loanDetails - Current loan details
 * @param amount - Amount available for prepayment or investment
 * @param investmentRate - Expected annual return on investment (percentage)
 * @param investmentYears - Investment period in years
 * @returns Comparison result with recommendation
 */
export function comparePartPaymentVsInvestment(
  loanDetails: LoanDetails,
  amount: number,
  investmentRate: number,
  investmentYears: number
): ComparisonResult {
  // Validate inputs
  if (
    amount <= 0 ||
    loanDetails.principal <= 0 ||
    loanDetails.rate <= 0 ||
    loanDetails.emi <= 0 ||
    loanDetails.remainingMonths <= 0 ||
    investmentRate < 0 ||
    investmentYears <= 0
  ) {
    return {
      prepaymentSavings: 0,
      investmentReturns: 0,
      netBenefit: 0,
      recommendation: 'PREPAY',
      breakEvenMonths: 0,
    };
  }

  // Scenario 1: Prepayment
  const prepaymentSavings = calculatePrepaymentSavings(
    loanDetails.principal,
    loanDetails.rate,
    loanDetails.remainingMonths,
    loanDetails.emi,
    amount
  );

  // Scenario 2: Investment
  const investmentMonths = Math.min(
    investmentYears * MONTHS_IN_YEAR,
    loanDetails.remainingMonths
  );
  
  const futureValue = calculateFutureValue(amount, investmentRate, investmentYears);
  const investmentReturns = futureValue - amount;
  
  // Calculate interest paid on loan during investment period
  const interestPaidDuringInvestment = calculateInterestPaidOverPeriod(
    loanDetails.principal,
    loanDetails.rate,
    loanDetails.emi,
    investmentMonths
  );

  // Net benefit of investment after accounting for loan interest
  const netInvestmentBenefit = investmentReturns - interestPaidDuringInvestment;

  // Compare scenarios
  const netBenefit = netInvestmentBenefit - prepaymentSavings;
  const recommendation = netBenefit > 0 ? 'INVEST' : 'PREPAY';

  // Calculate break-even point
  const breakEvenMonths = calculateBreakEvenMonths(
    loanDetails.rate,
    investmentRate,
    amount
  );

  return {
    prepaymentSavings: Math.round(prepaymentSavings),
    investmentReturns: Math.round(investmentReturns),
    netBenefit: Math.round(Math.abs(netBenefit)),
    recommendation,
    breakEvenMonths,
  };
}

/**
 * Calculate effective return rate needed to beat prepayment
 * 
 * @param loanRate - Current loan interest rate (percentage)
 * @returns Minimum investment return rate to beat prepayment
 */
export function calculateMinimumInvestmentRate(loanRate: number): number {
  // Investment needs to beat loan rate after considering tax implications
  // Adding a small buffer for safety
  return Math.round((loanRate + 0.5) * 100) / 100;
}

// Made with Bob