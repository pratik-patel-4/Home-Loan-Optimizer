import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrincipalInterestPie } from './PrincipalInterestPie';
import { LoanComparisonBar } from './LoanComparisonBar';
import { PrepaymentComparison } from './PrepaymentComparison';

/**
 * Chart Test Component
 * 
 * This component demonstrates all chart components with sample data.
 * Use this for testing and development purposes.
 * 
 * @example
 * ```tsx
 * import { ChartTest } from '@/components/charts/ChartTest';
 * 
 * function App() {
 *   return <ChartTest />;
 * }
 * ```
 */
export const ChartTest: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Chart Components Test</h1>
      
      {/* Principal vs Interest Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Principal vs Interest Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <PrincipalInterestPie
            remainingPrincipal={2500000}
            remainingInterest={1500000}
          />
        </CardContent>
      </Card>

      {/* Loan Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Current vs Transferred Loan Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <LoanComparisonBar
            currentInterest={1500000}
            newInterest={1200000}
            currentTotal={4000000}
            newTotal={3700000}
            currentEMI={45000}
            newEMI={42000}
          />
        </CardContent>
      </Card>

      {/* Prepayment Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Before vs After Prepayment</CardTitle>
        </CardHeader>
        <CardContent>
          <PrepaymentComparison
            beforeInterest={1500000}
            afterInterest={1200000}
            beforeTotal={4000000}
            afterTotal={3700000}
            beforeTenure={240}
            afterTenure={200}
          />
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-sm font-medium mb-4">Pie Chart Loading</h3>
            <PrincipalInterestPie
              remainingPrincipal={0}
              remainingInterest={0}
              isLoading={true}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Bar Chart Loading</h3>
            <LoanComparisonBar
              currentInterest={0}
              newInterest={0}
              currentTotal={0}
              newTotal={0}
              currentEMI={0}
              newEMI={0}
              isLoading={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty States */}
      <Card>
        <CardHeader>
          <CardTitle>Empty States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-sm font-medium mb-4">No Data - Pie Chart</h3>
            <PrincipalInterestPie
              remainingPrincipal={0}
              remainingInterest={0}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">No Data - Bar Chart</h3>
            <LoanComparisonBar
              currentInterest={0}
              newInterest={0}
              currentTotal={0}
              newTotal={0}
              currentEMI={0}
              newEMI={0}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ChartTest.displayName = 'ChartTest';

// Made with Bob