/**
 * Rule-based recommendation engine
 * Analyzes loan health and optimization options to generate actionable recommendations
 */

import type { LoanHealth, BalanceTransferResult, PrepaymentResult } from '../types/loan';
import type { Recommendation } from '../types/recommendation';

/**
 * Generate a recommendation based on loan health and optimization results
 * 
 * Decision Rules (in priority order):
 * 1. If balance transfer net benefit > ₹50,000 → recommend BALANCE_TRANSFER
 * 2. If prepayment savings > transfer savings → recommend PREPAYMENT
 * 3. If tenure reduction saves more than EMI reduction → recommend REDUCE_TENURE
 * 4. If EMI reduction is beneficial → recommend REDUCE_EMI
 * 5. Otherwise → NO_ACTION needed
 * 
 * @param loanHealth - Current loan health metrics
 * @param balanceTransferResult - Balance transfer analysis (optional)
 * @param prepaymentResult - Prepayment analysis (optional)
 * @returns Recommendation with type, title, description, and confidence score
 */
export function generateRecommendation(
  loanHealth: LoanHealth,
  balanceTransferResult: BalanceTransferResult | null,
  prepaymentResult: PrepaymentResult | null
): Recommendation {
  // Rule 1: Check if balance transfer is highly beneficial
  if (balanceTransferResult && balanceTransferResult.netBenefit > 50000) {
    const confidenceScore = calculateConfidenceScore(balanceTransferResult.netBenefit);
    
    return {
      type: 'BALANCE_TRANSFER',
      title: 'Consider Balance Transfer',
      description: `Transferring your loan balance can save you ₹${Math.round(balanceTransferResult.interestSavings).toLocaleString('en-IN')} in interest. After accounting for transfer charges of ₹${Math.round(balanceTransferResult.currentInterest - balanceTransferResult.newInterest - balanceTransferResult.netBenefit).toLocaleString('en-IN')}, your net benefit would be ₹${Math.round(balanceTransferResult.netBenefit).toLocaleString('en-IN')}. You'll break even in ${balanceTransferResult.breakEvenMonths} months.`,
      estimatedSavings: balanceTransferResult.netBenefit,
      reason: `Your current interest burden is ${(loanHealth.interestBurden * 100).toFixed(1)}%. A balance transfer to a lower interest rate can significantly reduce your total interest payment.`,
      confidenceScore,
    };
  }
  
  // Rule 2: Check if prepayment is more beneficial than balance transfer
  if (prepaymentResult && prepaymentResult.interestSaved > 0) {
    // Compare with balance transfer if available
    const isMoreBeneficial = !balanceTransferResult || 
      prepaymentResult.interestSaved > balanceTransferResult.netBenefit;
    
    if (isMoreBeneficial) {
      const confidenceScore = calculateConfidenceScore(prepaymentResult.interestSaved);
      
      // Determine if tenure reduction or EMI reduction was used
      const isTenureReduction = prepaymentResult.monthsSaved > 0;
      
      return {
        type: 'PREPAYMENT',
        title: 'Make a Prepayment',
        description: `Making a prepayment can save you ₹${Math.round(prepaymentResult.interestSaved).toLocaleString('en-IN')} in interest. ${isTenureReduction ? `Your loan will close ${prepaymentResult.monthsSaved} months earlier.` : `Your monthly EMI will reduce to ₹${Math.round(prepaymentResult.newEMI).toLocaleString('en-IN')}.`}`,
        estimatedSavings: prepaymentResult.interestSaved,
        reason: `With your current interest burden at ${(loanHealth.interestBurden * 100).toFixed(1)}%, prepayment is an effective way to reduce your total interest cost.`,
        confidenceScore,
      };
    }
  }
  
  // Rule 3: Check if tenure reduction is beneficial (when prepayment data suggests it)
  if (prepaymentResult && prepaymentResult.monthsSaved > 12) {
    const confidenceScore = calculateConfidenceScore(prepaymentResult.interestSaved);
    
    return {
      type: 'REDUCE_TENURE',
      title: 'Focus on Reducing Loan Tenure',
      description: `By maintaining or increasing your EMI payments, you can close your loan ${prepaymentResult.monthsSaved} months earlier and save ₹${Math.round(prepaymentResult.interestSaved).toLocaleString('en-IN')} in interest.`,
      estimatedSavings: prepaymentResult.interestSaved,
      reason: `Reducing tenure is more beneficial than reducing EMI in your case, as it maximizes interest savings.`,
      confidenceScore,
    };
  }
  
  // Rule 4: Check if EMI reduction would be helpful (based on health score)
  if (loanHealth.healthScore === 'Needs Optimization' || loanHealth.healthScore === 'Average') {
    const estimatedSavings = loanHealth.remainingInterest * 0.1; // Estimate 10% potential savings
    const confidenceScore = calculateConfidenceScore(estimatedSavings);
    
    return {
      type: 'REDUCE_EMI',
      title: 'Consider Reducing Your EMI',
      description: `Your current loan health is "${loanHealth.healthScore}" with an interest burden of ${(loanHealth.interestBurden * 100).toFixed(1)}%. Consider refinancing or prepayment to reduce your monthly EMI burden.`,
      estimatedSavings,
      reason: `Reducing your EMI can improve cash flow and make the loan more manageable.`,
      confidenceScore,
    };
  }
  
  // Rule 5: No action needed - loan is in good shape
  return {
    type: 'NO_ACTION',
    title: 'Your Loan is Well Optimized',
    description: `Your loan health is "${loanHealth.healthScore}" with an interest burden of ${(loanHealth.interestBurden * 100).toFixed(1)}%. Continue with your current payment plan.`,
    estimatedSavings: 0,
    reason: `Your loan terms are already favorable, and no immediate optimization is needed.`,
    confidenceScore: 90,
  };
}

/**
 * Calculate confidence score based on estimated savings
 * 
 * Scoring criteria:
 * - > ₹2,00,000: 95 (Very High Confidence)
 * - > ₹1,00,000: 85 (High Confidence)
 * - > ₹50,000: 75 (Good Confidence)
 * - Otherwise: 60 (Moderate Confidence)
 * 
 * @param savings - Estimated savings amount
 * @returns Confidence score (0-100)
 */
export function calculateConfidenceScore(savings: number): number {
  if (savings > 200000) {
    return 95;
  } else if (savings > 100000) {
    return 85;
  } else if (savings > 50000) {
    return 75;
  } else {
    return 60;
  }
}

/**
 * Calculate health score description based on interest burden ratio
 * 
 * Scoring criteria:
 * - < 0.3 (30%): "Excellent" - Very low interest burden
 * - < 0.5 (50%): "Good" - Reasonable interest burden
 * - < 0.7 (70%): "Average" - Moderate interest burden
 * - >= 0.7 (70%): "Needs Optimization" - High interest burden
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

/**
 * Generate multiple recommendations and rank them by potential savings
 * 
 * @param loanHealth - Current loan health metrics
 * @param balanceTransferResult - Balance transfer analysis (optional)
 * @param prepaymentResult - Prepayment analysis (optional)
 * @returns Array of recommendations sorted by estimated savings (highest first)
 */
export function generateAllRecommendations(
  _loanHealth: LoanHealth,
  balanceTransferResult: BalanceTransferResult | null,
  prepaymentResult: PrepaymentResult | null
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Add balance transfer recommendation if beneficial
  if (balanceTransferResult && balanceTransferResult.netBenefit > 0) {
    recommendations.push({
      type: 'BALANCE_TRANSFER',
      title: 'Balance Transfer Option',
      description: `Save ₹${Math.round(balanceTransferResult.netBenefit).toLocaleString('en-IN')} by transferring to a lower interest rate.`,
      estimatedSavings: balanceTransferResult.netBenefit,
      reason: `Net benefit after transfer charges. Break-even in ${balanceTransferResult.breakEvenMonths} months.`,
      confidenceScore: calculateConfidenceScore(balanceTransferResult.netBenefit),
    });
  }
  
  // Add prepayment recommendation if beneficial
  if (prepaymentResult && prepaymentResult.interestSaved > 0) {
    recommendations.push({
      type: 'PREPAYMENT',
      title: 'Prepayment Option',
      description: `Save ₹${Math.round(prepaymentResult.interestSaved).toLocaleString('en-IN')} through prepayment.`,
      estimatedSavings: prepaymentResult.interestSaved,
      reason: `${prepaymentResult.monthsSaved > 0 ? `Close loan ${prepaymentResult.monthsSaved} months earlier` : `Reduce EMI to ₹${Math.round(prepaymentResult.newEMI).toLocaleString('en-IN')}`}.`,
      confidenceScore: calculateConfidenceScore(prepaymentResult.interestSaved),
    });
  }
  
  // Sort by estimated savings (highest first)
  recommendations.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
  
  return recommendations;
}

// Made with Bob
