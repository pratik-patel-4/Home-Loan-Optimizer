# Home Loan Optimizer

A comprehensive web application designed to help homeowners make informed decisions about their home loans. The Home Loan Optimizer provides powerful tools to analyze loan health, evaluate balance transfer options, simulate prepayment strategies, and receive AI-powered recommendations for optimal loan management.

## Features

- **Loan Health Analyzer** - Assess your current loan status with detailed metrics and visualizations
- **Balance Transfer Calculator** - Compare your current loan with potential balance transfer options
- **Prepayment Simulator** - Explore different prepayment strategies and their long-term impact
- **AI-Powered Recommendations** - Get intelligent suggestions based on your loan parameters
- **Detailed Amortization Schedule** - View complete payment breakdown with search and export capabilities
- **Interactive Charts and Visualizations** - Understand your loan data through intuitive visual representations

## Tech Stack

- **React 19** - Modern UI library with latest features
- **TypeScript 6** - Type-safe development
- **Vite 8** - Lightning-fast build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS framework
- **ShadCN UI** - High-quality, accessible component library
- **Recharts 3.8** - Composable charting library
- **Lucide Icons** - Beautiful, consistent icon set
- **date-fns 4.4** - Modern date utility library

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd home-loan-optimizer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
home-loan-optimizer/
├── public/                      # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                  # Images and media files
│   ├── components/
│   │   ├── amortization/        # Amortization table components
│   │   │   ├── AmortizationTable.tsx
│   │   │   ├── exportUtils.ts
│   │   │   └── index.ts
│   │   ├── calculators/         # Main calculator components
│   │   │   ├── LoanHealthAnalyzer.tsx
│   │   │   ├── BalanceTransferCalculator.tsx
│   │   │   ├── PrepaymentSimulator.tsx
│   │   │   └── index.ts
│   │   ├── charts/              # Chart components
│   │   │   ├── PrincipalInterestPie.tsx
│   │   │   ├── LoanComparisonBar.tsx
│   │   │   ├── PrepaymentComparison.tsx
│   │   │   └── index.ts
│   │   ├── shared/              # Reusable components
│   │   │   ├── CurrencyInput.tsx
│   │   │   ├── NumberInput.tsx
│   │   │   ├── PercentageInput.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── SectionCard.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   └── index.ts
│   │   ├── summary/             # Summary and recommendation components
│   │   │   ├── RecommendationPanel.tsx
│   │   │   └── index.ts
│   │   └── ui/                  # ShadCN UI components
│   ├── pages/
│   │   ├── Home.tsx             # Main page component
│   │   └── index.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── loan.ts
│   │   └── recommendation.ts
│   ├── utils/                   # Utility functions
│   │   ├── amortization.ts      # Amortization calculations
│   │   ├── balanceTransfer.ts   # Balance transfer logic
│   │   ├── currency.ts          # Currency formatting
│   │   ├── date.ts              # Date utilities
│   │   ├── emi.ts               # EMI calculations
│   │   ├── prepayment.ts        # Prepayment simulations
│   │   ├── recommendation.ts    # Recommendation engine
│   │   └── index.ts
│   ├── lib/
│   │   └── utils.ts             # General utilities
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── components.json              # ShadCN UI configuration
├── tailwind.config.js           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── package.json                 # Project dependencies
```

## Usage

### Loan Health Analyzer

1. Enter your current loan details:
   - Outstanding Principal Amount
   - Current Interest Rate
   - Current EMI
   - Remaining Tenure (in months)

2. View comprehensive analysis including:
   - Total interest payable
   - Total amount payable
   - Principal vs Interest breakdown
   - Interactive pie chart visualization

### Balance Transfer Calculator

1. Input your current loan parameters
2. Enter proposed balance transfer details:
   - New interest rate
   - Transfer charges
   - Processing fees

3. Compare side-by-side:
   - Monthly EMI savings
   - Total interest savings
   - Break-even period
   - Net savings after charges

### Prepayment Simulator

1. Enter loan details and prepayment amount
2. Choose prepayment strategy:
   - **Reduce EMI**: Lower monthly payments, same tenure
   - **Reduce Tenure**: Same EMI, shorter loan period

3. Analyze results:
   - New EMI or tenure
   - Interest savings
   - Total savings
   - Comparative charts

### Amortization Schedule

- View complete payment schedule
- Search by month or year
- Filter by date range
- Export to CSV or copy to clipboard
- Pagination for easy navigation

## Financial Calculations

The application uses industry-standard financial formulas:

### EMI Calculation
```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```
Where:
- P = Principal loan amount
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Loan tenure in months

### Balance Transfer Savings
```
Savings = (Current Total Payment - New Total Payment) - Transfer Charges
```

### Prepayment Impact
- **Reduce EMI**: Recalculates EMI with reduced principal
- **Reduce Tenure**: Calculates new tenure with same EMI

## Default Values

The application comes pre-configured with sample values for quick testing:

- **Outstanding Principal**: ₹10,11,566
- **Current Interest Rate**: 10.60%
- **Current EMI**: ₹14,098
- **Remaining Tenure**: 114 months (9.5 years)
- **Transfer Rate**: 7.65%
- **Transfer Charges**: ₹10,000
- **Prepayment Amount**: ₹2,00,000

## Features in Detail

### Loan Health Analyzer

Provides a comprehensive overview of your current loan status:
- Calculates total interest and amount payable
- Shows principal vs interest breakdown
- Visual pie chart representation
- Helps understand the true cost of your loan

### Balance Transfer Calculator

Evaluates whether transferring your loan to another lender is beneficial:
- Compares current vs new loan terms
- Calculates break-even period
- Accounts for all transfer charges
- Provides clear savings metrics
- Visual bar chart comparison

### Prepayment Simulator

Helps plan prepayment strategies:
- Two strategy options (Reduce EMI or Reduce Tenure)
- Shows immediate and long-term impact
- Calculates total interest savings
- Comparative visualization of scenarios
- Helps make informed prepayment decisions

### Recommendation Engine

AI-powered analysis that provides:
- Personalized recommendations based on loan parameters
- Priority-based suggestions (High/Medium/Low)
- Actionable insights for loan optimization
- Considers multiple factors including interest rates, tenure, and savings potential

### Amortization Schedule

Detailed payment breakdown:
- Month-by-month payment schedule
- Principal and interest components
- Running balance tracking
- Search and filter capabilities
- Export functionality (CSV/Clipboard)
- Pagination for large datasets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

**Important**: This tool provides estimates and projections based on the input data. Actual loan terms, interest calculations, and savings may vary based on lender policies, market conditions, and individual circumstances. 

Always consult with qualified financial advisors, loan officers, or banking professionals before making any financial decisions regarding your home loan. This tool is for informational and educational purposes only and should not be considered as financial advice.

## Future Enhancements

- [ ] Export reports as PDF with detailed analysis
- [ ] Save and load multiple loan scenarios
- [ ] Compare multiple loans side-by-side
- [ ] Tax benefit calculator for home loan interest
- [ ] Dark mode toggle for better user experience
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Mobile app version (React Native)
- [ ] Integration with bank APIs for real-time rates
- [ ] Email notifications for rate changes
- [ ] Loan refinancing optimizer

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Made with ❤️ for homeowners seeking financial clarity**
