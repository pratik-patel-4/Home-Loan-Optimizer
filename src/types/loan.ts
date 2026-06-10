/**
 * Core loan-related TypeScript type definitions
 */

/**
 * Basic loan details provided by the user
 */
export interface LoanDetails {
  /** Principal amount remaining */
  principal: number;
  /** Annual interest rate (percentage) */
  rate: number;
  /** Monthly EMI amount */
  emi: number;
  /** Number of months remaining in the loan */
  remainingMonths: number;
  /** Loan start date or current date */
  startDate: Date;
}

/**
 * Comprehensive loan health metrics
 */
export interface LoanHealth {
  /** Remaining principal amount */
  remainingPrincipal: number;
  /** Total interest to be paid over remaining tenure */
  remainingInterest: number;
  /** Total amount remaining (principal + interest) */
  totalRemaining: number;
  /** Expected loan closure date */
  closureDate: Date;
  /** Interest burden ratio (interest/principal) */
  interestBurden: number;
  /** Health score description (Excellent, Good, Average, Needs Optimization) */
  healthScore: string;
}

/**
 * Balance transfer scenario details
 */
export interface BalanceTransferDetails {
  /** Current loan interest rate (percentage) */
  currentRate: number;
  /** New loan interest rate after transfer (percentage) */
  newRate: number;
  /** One-time charges for balance transfer */
  transferCharges: number;
}

/**
 * Balance transfer calculation results
 */
export interface BalanceTransferResult {
  /** Total interest with current loan */
  currentInterest: number;
  /** Total interest with new loan */
  newInterest: number;
  /** Gross interest savings */
  interestSavings: number;
  /** Net benefit after deducting transfer charges */
  netBenefit: number;
  /** Number of months to recover transfer charges */
  breakEvenMonths: number;
  /** Number of months saved in loan tenure */
  monthsSaved: number;
  /** New expected closure date */
  newClosureDate: Date;
}

/**
 * Prepayment strategy types
 */
export type PrepaymentStrategy = 'REDUCE_EMI' | 'REDUCE_TENURE';

/**
 * Prepayment scenario details
 */
export interface PrepaymentDetails {
  /** Prepayment amount */
  amount: number;
  /** Strategy to apply after prepayment */
  strategy: PrepaymentStrategy;
}

/**
 * Prepayment calculation results
 */
export interface PrepaymentResult {
  /** Total interest saved due to prepayment */
  interestSaved: number;
  /** Number of months saved in tenure */
  monthsSaved: number;
  /** New EMI amount (for REDUCE_EMI strategy) */
  newEMI: number;
  /** New tenure in months (for REDUCE_TENURE strategy) */
  newTenure: number;
  /** New expected closure date */
  newClosureDate: Date;
}

/**
 * Single row in amortization schedule
 */
export interface AmortizationRow {
  /** Month number (1-based) */
  month: number;
  /** EMI amount for this month */
  emi: number;
  /** Principal component of EMI */
  principal: number;
  /** Interest component of EMI */
  interest: number;
  /** Outstanding balance after this payment */
  balance: number;
}

/**
 * Loan eligibility calculation result
 */
export interface LoanEligibilityResult {
  /** Maximum loan amount eligible */
  maxLoanAmount: number;
  /** Maximum EMI affordable */
  maxEMI: number;
  /** Effective tenure in years */
  effectiveTenure: number;
  /** Fixed Obligation to Income Ratio */
  foir: number;
  /** Available monthly income for EMI */
  availableIncome: number;
}

/**
 * Tax benefit calculation result
 */
export interface TaxBenefitResult {
  /** Principal deduction under Section 80C */
  principalDeduction: number;
  /** Interest deduction under Section 24(b) */
  interestDeduction: number;
  /** Total tax deduction */
  totalDeduction: number;
  /** Tax saved in rupees */
  taxSaved: number;
  /** Effective interest rate after tax benefit */
  effectiveRate: number;
  /** Monthly savings from tax benefit */
  monthlySavings: number;
}

/**
 * Single loan offer details for comparison
 */
export interface LoanOffer {
  /** Loan amount */
  loanAmount: number;
  /** Interest rate (percentage) */
  interestRate: number;
  /** Tenure in years */
  tenureYears: number;
  /** Processing fee */
  processingFee: number;
  /** Other charges */
  otherCharges: number;
}

/**
 * Loan offer comparison result
 */
export interface LoanOfferComparison {
  /** Monthly EMI */
  emi: number;
  /** Total interest payable */
  totalInterest: number;
  /** Total cost (principal + interest + fees) */
  totalCost: number;
  /** Effective interest rate including fees */
  effectiveRate: number;
}

/**
 * Part payment vs investment comparison result
 */
export interface ComparisonResult {
  /** Interest saved by prepaying */
  prepaymentSavings: number;
  /** Returns from investment */
  investmentReturns: number;
  /** Net benefit (investment - prepayment) */
  netBenefit: number;
  /** Recommendation: PREPAY or INVEST */
  recommendation: 'PREPAY' | 'INVEST';
  /** Break-even point in months */
  breakEvenMonths: number;
}

/**
 * Loan tenure calculation result
 */
export interface TenureCalculationResult {
  /** Loan tenure in months */
  tenureMonths: number;
  /** Loan tenure in years */
  tenureYears: number;
  /** Remaining months after years */
  remainingMonths: number;
  /** Total amount payable */
  totalPayable: number;
  /** Total interest payable */
  totalInterest: number;
  /** Expected loan closure date */
  closureDate: Date;
  /** Interest to principal ratio (percentage) */
  interestToPrincipalRatio: number;
  /** Minimum EMI required to repay the loan */
  minimumEMI: number;
  /** Monthly interest amount */
  monthlyInterest: number;
}

// Made with Bob
