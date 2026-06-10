import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Activity,
  Target,
  PiggyBank,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import {
  LoanHealthAnalyzer,
  BalanceTransferCalculator,
  PrepaymentSimulator,
  LoanTenureCalculator,
  LoanEligibilityCalculator,
  LoanComparisonCalculator,
  TaxBenefitCalculator,
  PartPaymentVsInvestmentCalculator,
} from '@/components/calculators';
import { AmortizationScheduleCalculator } from '@/components/amortization';

/**
 * Home Page Component - Modern Tabbed Interface
 * 
 * Features:
 * - Modern gradient hero section with glassmorphism
 * - Tabbed navigation organizing 8 calculators into 4 logical groups
 * - Quick access cards with hover effects
 * - Vibrant fintech-inspired color scheme
 * - Fully responsive design
 * - Smooth animations and transitions
 */
export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Home Loan Optimizer
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              Make smarter home loan decisions with 8 powerful calculators
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="h-4 w-4" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="h-4 w-4" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator Section */}
      <section className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Loan Analysis</CardTitle>
              <CardDescription>Check health & tenure</CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Optimization</CardTitle>
              <CardDescription>Transfer & prepay options</CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Planning</CardTitle>
              <CardDescription>Eligibility & comparison</CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Insights</CardTitle>
              <CardDescription>Amortization schedule</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <TabsTrigger 
              value="analysis" 
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Analysis</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="optimization"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Optimize</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="planning"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white"
            >
              <PiggyBank className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Planning</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="insights"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-600 data-[state=active]:to-rose-600 data-[state=active]:text-white"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="analysis" className="space-y-6 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Loan Analysis
              </h2>
              <p className="text-muted-foreground">
                Understand your current loan status and calculate optimal tenure
              </p>
            </div>
            <LoanHealthAnalyzer />
            <LoanTenureCalculator />
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Loan Optimization
              </h2>
              <p className="text-muted-foreground">
                Explore ways to reduce your loan burden and save money
              </p>
            </div>
            <BalanceTransferCalculator />
            <PrepaymentSimulator />
            <PartPaymentVsInvestmentCalculator />
          </TabsContent>

          <TabsContent value="planning" className="space-y-6 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Loan Planning
              </h2>
              <p className="text-muted-foreground">
                Plan your home loan with eligibility checks and comparisons
              </p>
            </div>
            <LoanEligibilityCalculator />
            <LoanComparisonCalculator />
            <TaxBenefitCalculator />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Loan Insights
              </h2>
              <p className="text-muted-foreground">
                Detailed breakdown of your loan payments over time
              </p>
            </div>
            <AmortizationScheduleCalculator />
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 mb-2">
            © {new Date().getFullYear()} Home Loan Optimizer. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This tool provides estimates based on the information you provide. 
            Actual loan terms, interest rates, and savings may vary. Please consult with financial advisors 
            or your lending institution for personalized advice and accurate calculations.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Made with Bob
