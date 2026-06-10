# Architecture Overview

## Application Architecture

The Home Loan Optimizer follows a modern React architecture with a component-based design pattern. The application is built using a single-page application (SPA) model with client-side rendering, leveraging React 19's latest features and TypeScript for type safety.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React Application (SPA)                 │   │
│  │                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │   UI Layer   │  │ Logic Layer  │  │ Data Layer│ │   │
│  │  │              │  │              │  │           │ │   │
│  │  │ Components   │→ │ Utilities    │→ │ Types     │ │   │
│  │  │ Pages        │  │ Calculations │  │ State     │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (Root Component)
│
└── Home (Main Page)
    │
    ├── Hero Section
    │   ├── Title & Description
    │   └── Hero Image
    │
    ├── LoanHealthAnalyzer
    │   ├── SectionCard (Container)
    │   ├── Input Components
    │   │   ├── CurrencyInput (Outstanding Principal)
    │   │   ├── PercentageInput (Interest Rate)
    │   │   ├── CurrencyInput (Current EMI)
    │   │   └── NumberInput (Remaining Tenure)
    │   ├── Result Cards
    │   │   ├── ResultCard (Total Interest)
    │   │   ├── ResultCard (Total Amount)
    │   │   └── ResultCard (Principal vs Interest)
    │   └── PrincipalInterestPie (Chart)
    │       └── Recharts Components
    │
    ├── BalanceTransferCalculator
    │   ├── SectionCard (Container)
    │   ├── Tabs (Current Loan / Transfer Details)
    │   ├── Input Components
    │   │   ├── CurrencyInput (Principal)
    │   │   ├── PercentageInput (Rates)
    │   │   ├── CurrencyInput (EMI)
    │   │   ├── NumberInput (Tenure)
    │   │   └── CurrencyInput (Transfer Charges)
    │   ├── Result Cards
    │   │   ├── ResultCard (EMI Savings)
    │   │   ├── ResultCard (Interest Savings)
    │   │   ├── ResultCard (Break-even Period)
    │   │   └── ResultCard (Net Savings)
    │   └── LoanComparisonBar (Chart)
    │       └── Recharts Components
    │
    ├── PrepaymentSimulator
    │   ├── SectionCard (Container)
    │   ├── Input Components
    │   │   ├── CurrencyInput (Principal)
    │   │   ├── PercentageInput (Interest Rate)
    │   │   ├── CurrencyInput (EMI)
    │   │   ├── NumberInput (Tenure)
    │   │   └── CurrencyInput (Prepayment Amount)
    │   ├── Strategy Selection
    │   │   └── RadioGroup (Reduce EMI / Reduce Tenure)
    │   ├── Result Cards
    │   │   ├── ResultCard (New EMI/Tenure)
    │   │   ├── ResultCard (Interest Savings)
    │   │   └── ResultCard (Total Savings)
    │   └── PrepaymentComparison (Chart)
    │       └── Recharts Components
    │
    ├── RecommendationPanel
    │   ├── SectionCard (Container)
    │   ├── Alert Components
    │   │   ├── High Priority Recommendations
    │   │   ├── Medium Priority Recommendations
    │   │   └── Low Priority Recommendations
    │   └── Badge (Priority Indicators)
    │
    └── AmortizationTable
        ├── SectionCard (Container)
        ├── Search/Filter Controls
        │   ├── Input (Search)
        │   └── Select (Items per page)
        ├── Table Display
        │   ├── Table Header
        │   ├── Table Body (Rows)
        │   └── Table Footer
        ├── Pagination Controls
        │   └── Button Group
        └── Export Functionality
            ├── Button (Export CSV)
            └── Button (Copy to Clipboard)
```

## Data Flow

### 1. User Input Flow

```
User Input
    ↓
Input Component (CurrencyInput/PercentageInput/NumberInput)
    ↓
Local State Update (useState)
    ↓
Validation & Formatting
    ↓
Parent Component State
    ↓
Calculation Utilities
    ↓
Results Display
```

### 2. Calculation Flow

```
Input Parameters
    ↓
Utility Functions (utils/)
    ├── emi.ts (EMI calculations)
    ├── amortization.ts (Schedule generation)
    ├── balanceTransfer.ts (Transfer analysis)
    ├── prepayment.ts (Prepayment simulations)
    └── recommendation.ts (AI recommendations)
    ↓
Calculated Results
    ↓
Result Cards & Charts
    ↓
User Interface Display
```

### 3. Chart Rendering Flow

```
Calculated Data
    ↓
Chart Component (PrincipalInterestPie/LoanComparisonBar/PrepaymentComparison)
    ↓
Data Transformation
    ↓
Recharts Library
    ↓
SVG Rendering
    ↓
Interactive Visualization
```

## State Management

The application uses React's built-in state management with hooks:

### Local State (useState)
- **Component-level state**: Each calculator maintains its own input state
- **Form inputs**: Controlled components with local state
- **UI state**: Loading states, visibility toggles, pagination

### Derived State (useMemo)
- **Expensive calculations**: EMI, amortization schedules, savings calculations
- **Chart data**: Transformed data for visualizations
- **Filtered data**: Search and filter results in amortization table

### Callback Optimization (useCallback)
- **Event handlers**: Input change handlers, button clicks
- **Memoized functions**: Prevent unnecessary re-renders

### State Structure Example

```typescript
// LoanHealthAnalyzer State
{
  principal: number;        // Outstanding principal amount
  interestRate: number;     // Annual interest rate
  emi: number;             // Current EMI
  tenure: number;          // Remaining tenure in months
}

// Derived Calculations (useMemo)
{
  totalInterest: number;
  totalAmount: number;
  principalPaid: number;
  interestPaid: number;
  chartData: Array<{name: string, value: number}>;
}
```

## Calculation Engine

### Core Calculation Modules

#### 1. EMI Calculator (`utils/emi.ts`)
```typescript
calculateEMI(principal, rate, tenure) → EMI
calculatePrincipal(emi, rate, tenure) → Principal
calculateTenure(principal, emi, rate) → Tenure
calculateRate(principal, emi, tenure) → Rate
```

#### 2. Amortization Generator (`utils/amortization.ts`)
```typescript
generateAmortizationSchedule(principal, rate, tenure, startDate) → Schedule[]
// Returns array of monthly payments with:
// - Month number
// - Payment date
// - EMI amount
// - Principal component
// - Interest component
// - Outstanding balance
```

#### 3. Balance Transfer Analyzer (`utils/balanceTransfer.ts`)
```typescript
calculateBalanceTransfer(currentLoan, newLoan, charges) → Analysis
// Returns:
// - EMI savings
// - Interest savings
// - Break-even period
// - Net savings
```

#### 4. Prepayment Simulator (`utils/prepayment.ts`)
```typescript
simulatePrepayment(loan, prepaymentAmount, strategy) → Simulation
// Strategies:
// - REDUCE_EMI: Lower monthly payment
// - REDUCE_TENURE: Shorter loan period
```

#### 5. Recommendation Engine (`utils/recommendation.ts`)
```typescript
generateRecommendations(loanData, transferData, prepaymentData) → Recommendations[]
// Returns prioritized recommendations:
// - High priority (immediate action)
// - Medium priority (consider soon)
// - Low priority (optional optimization)
```

## Component Design Patterns

### 1. Container/Presentational Pattern

**Container Components** (Smart Components)
- Manage state and business logic
- Handle data fetching and calculations
- Examples: `LoanHealthAnalyzer`, `BalanceTransferCalculator`

**Presentational Components** (Dumb Components)
- Receive data via props
- Focus on UI rendering
- Examples: `ResultCard`, `CurrencyInput`, `SectionCard`

### 2. Composition Pattern

Components are composed together to build complex UIs:

```typescript
<SectionCard title="Loan Health Analyzer">
  <div className="grid gap-4">
    <CurrencyInput label="Principal" value={principal} onChange={setPrincipal} />
    <PercentageInput label="Rate" value={rate} onChange={setRate} />
  </div>
  <div className="grid gap-4">
    <ResultCard title="Total Interest" value={totalInterest} />
    <ResultCard title="Total Amount" value={totalAmount} />
  </div>
</SectionCard>
```

### 3. Custom Hooks Pattern

Reusable logic extracted into custom hooks:

```typescript
// Example: useAmortization hook (potential)
const useAmortization = (principal, rate, tenure) => {
  return useMemo(() => 
    generateAmortizationSchedule(principal, rate, tenure),
    [principal, rate, tenure]
  );
};
```

### 4. Render Props Pattern

Used in chart components for customization:

```typescript
<PieChart>
  <Pie
    data={data}
    label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
  />
</PieChart>
```

## Performance Optimizations

### 1. Memoization
- **useMemo**: Cache expensive calculations
- **useCallback**: Prevent function recreation
- **React.memo**: Prevent unnecessary component re-renders

### 2. Code Splitting
- Lazy loading of components (if needed)
- Dynamic imports for large dependencies

### 3. Calculation Optimization
- Efficient algorithms for amortization schedule generation
- Minimal recalculations using dependency arrays
- Debouncing for input changes (if needed)

### 4. Chart Rendering
- Recharts library handles efficient SVG rendering
- Data transformation done once with useMemo
- Responsive charts with proper aspect ratios

## Accessibility Features

### 1. Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Semantic elements (section, article, nav)
- Form labels associated with inputs

### 2. ARIA Attributes
- aria-label for icon buttons
- aria-describedby for input descriptions
- role attributes where needed

### 3. Keyboard Navigation
- Tab order follows logical flow
- Focus indicators visible
- All interactive elements keyboard accessible

### 4. Screen Reader Support
- Descriptive labels for all inputs
- Status messages announced
- Chart data accessible via tables

### 5. Color Contrast
- WCAG AA compliant color combinations
- Text readable on all backgrounds
- Focus indicators clearly visible

## Responsive Design

### Breakpoint Strategy

```css
/* Mobile First Approach */
Base: 0px - 639px (Mobile)
sm: 640px+ (Large Mobile)
md: 768px+ (Tablet)
lg: 1024px+ (Desktop)
xl: 1280px+ (Large Desktop)
2xl: 1536px+ (Extra Large)
```

### Layout Patterns

1. **Mobile (< 768px)**
   - Single column layout
   - Stacked components
   - Full-width inputs and cards
   - Collapsible sections

2. **Tablet (768px - 1023px)**
   - Two-column grid for result cards
   - Side-by-side input groups
   - Responsive charts

3. **Desktop (1024px+)**
   - Multi-column layouts
   - Optimized chart sizes
   - Enhanced spacing
   - Side-by-side comparisons

### Responsive Components

```typescript
// Example: Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <ResultCard />
  <ResultCard />
  <ResultCard />
</div>
```

## Type Safety

### TypeScript Integration

All components and utilities are fully typed:

```typescript
// Type Definitions (types/loan.ts)
interface LoanDetails {
  principal: number;
  interestRate: number;
  emi: number;
  tenure: number;
}

interface AmortizationEntry {
  month: number;
  date: Date;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

// Type Definitions (types/recommendation.ts)
type RecommendationPriority = 'high' | 'medium' | 'low';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  category: string;
}
```

## Error Handling

### Input Validation
- Minimum/maximum value checks
- Type validation (numbers only)
- Required field validation
- Real-time feedback

### Calculation Safety
- Division by zero checks
- Invalid input handling
- Fallback values for edge cases
- Error boundaries (if needed)

### User Feedback
- Clear error messages
- Validation hints
- Success confirmations
- Loading states

## Testing Strategy

### Unit Tests (Recommended)
- Utility functions (EMI, amortization, etc.)
- Calculation accuracy
- Edge cases and boundary conditions

### Component Tests (Recommended)
- Input component behavior
- Result card rendering
- Chart data transformation

### Integration Tests (Recommended)
- End-to-end calculator flows
- Data flow between components
- User interaction scenarios

## Build and Bundle Optimization

### Vite Configuration
- Fast HMR (Hot Module Replacement)
- Optimized production builds
- Tree shaking for unused code
- CSS code splitting

### Bundle Analysis
- Recharts: ~400KB (largest dependency)
- React + React DOM: ~140KB
- Other dependencies: ~200KB
- Total bundle size: ~740KB (gzipped: ~250KB)

## Security Considerations

### Client-Side Security
- No sensitive data storage
- Input sanitization
- XSS prevention (React's built-in protection)
- No external API calls (all calculations client-side)

### Data Privacy
- All calculations performed locally
- No data sent to servers
- No cookies or tracking
- No personal information collected

## Future Architecture Enhancements

### Potential Improvements
1. **State Management Library**: Redux or Zustand for complex state
2. **API Integration**: Backend for saving loan scenarios
3. **PWA Features**: Offline support, installability
4. **Web Workers**: Heavy calculations in background threads
5. **Server-Side Rendering**: Next.js for SEO and performance
6. **Database Integration**: Save and retrieve user scenarios
7. **Authentication**: User accounts for personalized experience
8. **Real-time Updates**: WebSocket for live interest rate updates

---

**Architecture Version**: 1.0.0  
**Last Updated**: June 10, 2026  
**Maintained By**: Development Team