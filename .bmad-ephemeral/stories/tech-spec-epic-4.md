# Epic Technical Specification: Dashboard and Analytics

Date: 2025-11-15
Author: Deyvid
Epic ID: 4
Status: Draft

---

## Overview

Epic 4 delivers the dashboard and analytics visualization layer for SmartBudget, transforming transaction data into actionable insights through interactive charts and real-time summary statistics. This epic implements the core value proposition: helping users understand where their money goes through instant visual clarity. Building upon the transaction management foundation (Epic 3) and data layer (Epic 2), Epic 4 creates the primary user interface that delivers the "aha!" moment users experience when seeing their spending patterns visualized.

## Objectives and Scope

**In Scope:**
- Summary statistic cards displaying Total Income, Total Expenses, and Net Balance for selected period
- Period selector component enabling filtering by preset periods (This Month, Last Month, Last 3 Months) and custom date ranges
- Pie/donut chart visualizing expense breakdown by category with percentage calculations
- Bar/line chart showing income vs. expenses trend over time with adaptive granularity
- Recent transactions widget displaying the last 5-10 transactions on the dashboard
- Real-time updates when period selection changes or transactions are added/edited/deleted
- Responsive chart rendering across all device sizes (mobile, tablet, desktop)

**Out of Scope:**
- Advanced analytics (anomaly detection, spending predictions, budget vs. actual comparisons)
- Export functionality (CSV, PDF, print reports)
- Custom chart configurations or user-defined metrics
- Comparison between multiple time periods side-by-side
- Income breakdown visualization (focus on expense analysis for MVP)

## System Architecture Alignment

Epic 4 aligns with the SmartBudget architecture through the following components:

**Component Integration:**
- **components/dashboard/**: New components including SummaryCards, PeriodSelector, RecentTransactionsWidget
- **components/charts/**: Chart wrapper components utilizing Recharts library (ExpenseBreakdownChart, IncomeTrendChart)
- **pages/Dashboard.tsx**: Primary orchestration page consuming all dashboard components
- **services/calculationService.ts**: Centralized financial calculation logic ensuring consistency across all visualizations
- **context/AppContext.tsx**: Global state management for transactions, categories, and selected period

**Technology Stack:**
- **Recharts 2.x**: SVG-based, React-native charting library for all visualizations
- **date-fns 4.x**: Date manipulation for period calculations and chart data transformation
- **Tailwind CSS 4.0**: Responsive styling and layout system
- **React Context API**: State management for period selection and data flow

**Architectural Constraints:**
- All calculations must use standardized formulas from calculationService.ts (defined in Architecture doc)
- Charts must render within 2 seconds (NFR-1.3 performance requirement)
- Period filters must update views in <500ms (NFR-1.4 performance requirement)
- All components must be fully responsive following mobile-first design principles

## Detailed Design

### Services and Modules

| Module/Component | Responsibilities | Inputs | Outputs | Owner |
|------------------|------------------|--------|---------|-------|
| **calculationService.ts** | Financial calculations and aggregations | transactions[], period | totalIncome, totalExpenses, netBalance, expensesByCategory, trendData | Service Layer |
| **SummaryCards.tsx** | Display financial summary metrics | totalIncome, totalExpenses, netBalance | Rendered summary card grid | Dashboard Components |
| **PeriodSelector.tsx** | Period selection UI and logic | currentPeriod, onPeriodChange callback | Period selection events | Dashboard Components |
| **ExpenseBreakdownChart.tsx** | Pie/donut chart for expense categories | expensesByCategory data | Recharts PieChart component | Chart Components |
| **IncomeTrendChart.tsx** | Bar/line chart for income vs expenses | trendData array | Recharts BarChart component | Chart Components |
| **RecentTransactionsWidget.tsx** | Display last N transactions | transactions[], limit | Transaction list UI | Dashboard Components |
| **Dashboard.tsx** | Orchestrate all dashboard components | Global context (transactions, categories, period) | Complete dashboard page | Pages |
| **usePeriod.ts** | Custom hook for period management | N/A | selectedPeriod, setPeriod, periodOptions | Hooks |

### Data Models and Contracts

**Period Interface:**
```typescript
type PeriodType = 'this-month' | 'last-month' | 'last-3-months' | 'custom';

interface Period {
  type: PeriodType;
  startDate: string;      // ISO 8601 format: "2025-11-01"
  endDate: string;        // ISO 8601 format: "2025-11-30"
  label: string;          // Display label: "This Month"
}
```

**Chart Data Models:**
```typescript
// Pie Chart Data Format (Expense Breakdown)
interface PieChartDataPoint {
  name: string;           // Category name: "Food/Groceries"
  value: number;          // Amount: 150.50
  fill: string;           // Hex color: "#EF4444"
  percentage: number;     // Calculated percentage: 25
}

// Bar Chart Data Format (Income vs Expenses Trend)
interface TrendDataPoint {
  date: string;           // Formatted date: "Nov 10"
  income: number;         // Total income for period: 1000
  expenses: number;       // Total expenses for period: 750
  net: number;            // Net balance: 250
}
```

**Calculation Service Contracts:**
```typescript
// All functions defined in Architecture Financial Calculation Patterns section

calculateTotalIncome(transactions: Transaction[], period?: Period): number
calculateTotalExpenses(transactions: Transaction[], period?: Period): number
calculateNetBalance(transactions: Transaction[], period?: Period): number
calculateExpensesByCategory(transactions: Transaction[], period?: Period): Record<string, number>
calculateIncomeByCategory(transactions: Transaction[], period?: Period): Record<string, number>
calculateTrendData(transactions: Transaction[], period: Period, granularity: 'day' | 'week' | 'month'): TrendDataPoint[]
calculateCategoryPercentage(categoryAmount: number, totalAmount: number): number
```

**Data Relationships:**
- Period → Filter applied to all calculations
- Transaction[] → Source data for all calculations
- Category metadata → Used for chart colors and labels
- Calculations → Memoized in components to prevent unnecessary recalculations

### APIs and Interfaces

**Component Props Interfaces:**

```typescript
// SummaryCards.tsx
interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  isLoading?: boolean;
}

// PeriodSelector.tsx
interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  className?: string;
}

// ExpenseBreakdownChart.tsx
interface ExpenseBreakdownChartProps {
  data: PieChartDataPoint[];
  height?: number;
  showLegend?: boolean;
  isLoading?: boolean;
}

// IncomeTrendChart.tsx
interface IncomeTrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  showLegend?: boolean;
  isLoading?: boolean;
}

// RecentTransactionsWidget.tsx
interface RecentTransactionsWidgetProps {
  transactions: Transaction[];
  limit?: number;          // Default: 5
  onViewAll?: () => void;  // Navigate to full transactions list
}
```

**Custom Hook Interface:**

```typescript
// usePeriod.ts
interface UsePeriodReturn {
  selectedPeriod: Period;
  setPeriod: (period: Period) => void;
  periodOptions: Period[];  // Preset options: This Month, Last Month, etc.
  isCustomPeriod: boolean;
}

function usePeriod(): UsePeriodReturn;
```

**Context Extensions:**

```typescript
// AppContext.tsx additions for Epic 4
interface AppContextType {
  // ... existing transaction and category state
  selectedPeriod: Period;
  setPeriod: (period: Period) => void;
}
```

### Workflows and Sequencing

**User Flow 1: Dashboard Load**
```
1. User navigates to Dashboard route
2. Dashboard.tsx mounts
3. useContext(AppContext) retrieves transactions[], categories[], selectedPeriod
4. useMemo calculates metrics:
   - calculateTotalIncome(transactions, selectedPeriod)
   - calculateTotalExpenses(transactions, selectedPeriod)
   - calculateNetBalance(transactions, selectedPeriod)
   - calculateExpensesByCategory(transactions, selectedPeriod)
   - calculateTrendData(transactions, selectedPeriod, 'day')
5. SummaryCards renders with calculated metrics
6. Charts render with transformed data
7. RecentTransactionsWidget displays last 5 transactions
Total time: <2 seconds (NFR requirement)
```

**User Flow 2: Period Change**
```
1. User selects "Last Month" from PeriodSelector dropdown
2. PeriodSelector calls onPeriodChange(newPeriod) callback
3. Context setPeriod(newPeriod) updates global state
4. All consumers (Dashboard, charts) re-render
5. useMemo dependencies change → recalculate metrics with new period filter
6. Charts update with filtered data
7. RecentTransactionsWidget updates with filtered transactions
Total time: <500ms (NFR requirement)
```

**User Flow 3: Custom Period Selection**
```
1. User selects "Custom Range" from PeriodSelector
2. Date range picker modal/dropdown appears
3. User selects start date and end date
4. PeriodSelector validates date range (end >= start, not in future)
5. Creates custom Period object: { type: 'custom', startDate, endDate, label: "Nov 1 - Nov 15" }
6. Calls onPeriodChange(customPeriod)
7. Workflow same as Flow 2 (period change)
```

**User Flow 4: Transaction Added (Dashboard Update)**
```
1. User adds new transaction via TransactionForm
2. Context addTransaction() updates transactions[] state
3. All components consuming transactions re-render (including Dashboard)
4. Dashboard useMemo recalculates metrics (new transaction included)
5. Charts update automatically with new data point
6. Summary cards update with new totals
7. RecentTransactionsWidget shows newly added transaction
Total time: Immediate (<100ms visual feedback)
```

**Data Flow Diagram:**
```
[LocalStorage] → [storageService] → [AppContext]
                                         ↓
                    [Dashboard.tsx consumes context]
                                         ↓
              [calculationService transforms data]
                                         ↓
        ┌────────────────┬───────────────┴─────────────┬──────────────┐
        ↓                ↓                             ↓              ↓
  [SummaryCards]  [ExpenseBreakdownChart]  [IncomeTrendChart]  [RecentTransactionsWidget]
```

## Non-Functional Requirements

### Performance

**NFR-1.3: Chart Rendering Performance**
- **Target:** Charts render within 2 seconds of data availability
- **Measurement:** Time from component mount to complete chart display
- **Implementation:**
  - Use Recharts ResponsiveContainer for efficient sizing
  - Limit data points in trend charts (aggregate if >100 points for long periods)
  - Memoize chart data transformations using useMemo
  - Lazy load chart components only when Dashboard route is active
- **Testing:** Measure with up to 1000 transactions in dataset

**NFR-1.4: Filter Performance**
- **Target:** Period filter updates complete in <500ms
- **Measurement:** Time from period selection to all dashboard components displaying filtered data
- **Implementation:**
  - Memoize all calculation results with proper dependencies
  - Use efficient date filtering (ISO string comparison)
  - Batch state updates to prevent multiple re-renders
  - Optimize Recharts rendering with stable data references
- **Testing:** Verify filter changes trigger exactly one re-render cycle

**NFR-1.2: UI Responsiveness**
- **Target:** All user actions (period selection, navigation) provide feedback within 100ms
- **Implementation:**
  - Immediate visual feedback on button/dropdown interactions
  - Loading skeletons for charts during data recalculation
  - Optimistic UI updates where applicable
  - Debounce custom date range inputs (300ms)

**Performance Optimization Patterns:**
```typescript
// Memoization Pattern
const totalIncome = useMemo(
  () => calculateTotalIncome(transactions, selectedPeriod),
  [transactions, selectedPeriod]
);

// Lazy Loading Pattern
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Chart Data Stability Pattern
const chartData = useMemo(
  () => transformToPieChartData(transactions, selectedPeriod),
  [transactions, selectedPeriod]
);
```

### Security

**Input Validation:**
- **Period Dates:** Validate custom date ranges (end >= start, dates not in future)
- **Chart Data:** Sanitize category names and transaction descriptions before rendering
- **XSS Prevention:** All user-generated content (descriptions) sanitized before display in charts

**Data Integrity:**
- **Calculation Accuracy:** All financial calculations use exact arithmetic (no floating-point errors)
- **Rounding Consistency:** All amounts rounded to 2 decimal places consistently
- **Data Validation:** Verify transactions array is valid before calculations

**Client-Side Security:**
- **No Sensitive Data Exposure:** Charts do not expose raw transaction IDs or internal keys
- **Category Access Control:** Only use predefined categories from constants (no user-injected categories in MVP)

**Security Patterns:**
```typescript
// Date Validation
const validateCustomPeriod = (start: string, end: string): boolean => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();

  return (
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime()) &&
    endDate >= startDate &&
    endDate <= today
  );
};

// Amount Formatting (Prevent Injection)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
```

### Reliability/Availability

**Error Handling:**
- **Empty State Management:** Gracefully handle scenarios with zero transactions
- **Invalid Data Detection:** Display user-friendly messages if calculations fail
- **Chart Rendering Failures:** Fallback to data tables if chart library fails to render
- **Network Independence:** All calculations client-side (no API dependency for MVP)

**Edge Case Handling:**
```typescript
// Empty Data
if (transactions.length === 0) {
  return <EmptyState message="No transactions yet. Add your first transaction to see insights!" />;
}

// Zero Expenses (Pie Chart)
if (totalExpenses === 0) {
  return <EmptyState message="No expenses in this period." />;
}

// Division by Zero Protection
const calculatePercentage = (amount: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((amount / total) * 100);
};

// Invalid Period Handling
if (!selectedPeriod || !selectedPeriod.startDate || !selectedPeriod.endDate) {
  console.error('Invalid period selected, defaulting to This Month');
  setPeriod(getDefaultPeriod());
}
```

**Graceful Degradation:**
- If LocalStorage fails to load, display error message with retry option
- If chart rendering fails, display summary tables as fallback
- If date-fns fails to parse dates, use fallback date formatting

**Component Resilience:**
- Use React Error Boundaries to catch component rendering errors
- Implement loading states for all async operations
- Prevent dashboard from crashing if single chart component fails

### Observability

**Logging Strategy:**
- **Calculation Logs:** Log when expensive calculations are performed (development only)
- **Performance Logs:** Track chart rendering times in development mode
- **Error Logs:** Log all calculation errors, invalid data, and edge cases to console
- **User Actions:** Log period changes and filter applications (for debugging)

**Development Logging Examples:**
```typescript
// Performance Monitoring
const start = performance.now();
const result = calculateTrendData(transactions, period);
const duration = performance.now() - start;
console.log(`Trend calculation took ${duration.toFixed(2)}ms`);

// Data Quality Logging
if (transactions.some(t => t.amount <= 0)) {
  console.warn('Found transactions with invalid amounts');
}

// Chart Rendering Events
console.log('Dashboard mounted with', transactions.length, 'transactions');
console.log('Period changed to:', selectedPeriod.label);
```

**Metrics to Track (Development):**
- Number of transactions in filtered dataset
- Time to calculate all metrics
- Time to render each chart component
- Memory usage for large datasets (>500 transactions)
- Re-render frequency on period changes

**Production Considerations (Future):**
- Add error tracking service (e.g., Sentry) for production errors
- Performance monitoring via Web Vitals (LCP, FID, CLS)
- User analytics for dashboard usage patterns
- A/B testing framework for chart visualizations

## Dependencies and Integrations

### External Dependencies

| Dependency | Version | Purpose | Epic 4 Usage | Installation Status |
|------------|---------|---------|--------------|---------------------|
| **recharts** | Not installed | React charting library | Pie chart and bar chart rendering | ⚠️ **NEEDS INSTALLATION** |
| **react** | ^18.3.1 | Core framework | Component rendering | ✅ Installed |
| **react-dom** | ^18.3.1 | React DOM renderer | Component mounting | ✅ Installed |
| **date-fns** | ^4.1.0 | Date manipulation | Period calculations, date formatting | ✅ Installed |
| **lucide-react** | ^0.553.0 | Icon library | Icons for summary cards, widgets | ✅ Installed |
| **react-router-dom** | ^6.30.2 | Routing | Dashboard navigation | ✅ Installed |

**Installation Required:**
```bash
npm install recharts
```

**Version Constraint:**
- Recharts: `^2.15.0` or higher (must be compatible with React 18)

### Internal Module Dependencies

**Epic 4 Depends On:**
1. **Epic 2: Data Layer & State Management**
   - `models/Transaction.ts` - Transaction interface
   - `models/Category.ts` - Category interface
   - `context/AppContext.tsx` - Global state (transactions[], categories[])
   - `constants/categories.ts` - Predefined categories with colors
   - **Status:** ✅ Complete (Epic 2 done)

2. **Epic 1: Project Foundation**
   - Vite build configuration
   - React Router setup
   - Tailwind CSS configuration
   - TypeScript configuration
   - **Status:** ✅ Complete (Epic 1 done)

**Epic 4 Provides To:**
- **Epic 5: Responsive UI & Polish**
  - Dashboard layout that needs responsive styling
  - Chart components that need mobile optimization
  - **Status:** ⏳ Pending (Epic 5 not started)

- **Epic 6: Testing & Deployment**
  - Components requiring test coverage
  - Calculation logic requiring unit tests
  - **Status:** ⏳ Pending (Epic 6 not started)

### Integration Points

**1. Context Integration (AppContext.tsx)**
```typescript
// Epic 4 extends AppContext with period management
interface AppContextType {
  // Existing from Epic 2
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: TransactionInput) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // NEW: Added by Epic 4
  selectedPeriod: Period;
  setPeriod: (period: Period) => void;
}
```

**2. Service Layer Integration**
- **New Service:** `calculationService.ts` - Provides all financial calculations
- **Existing Service:** `storageService.ts` - No changes required (read-only consumption)
- **No Breaking Changes:** All new functionality, no modifications to Epic 2/3 services

**3. Routing Integration**
- Dashboard route already defined in Epic 1: `/` (home route)
- No new routes required for Epic 4
- Dashboard.tsx replaces placeholder home page

**4. Styling Integration**
- Uses Tailwind CSS classes from Epic 1 configuration
- Follows existing color scheme from constants/colors.ts
- Maintains responsive breakpoints from Epic 1 setup

**5. Component Reuse**
- **No components reused from Epic 3** (transaction components are separate)
- **Shared utilities:** date formatters, currency formatters from utils/
- **Shared constants:** CATEGORIES array with color mappings

### Data Flow Dependencies

```
Epic 2 (Data Layer)
  ↓
  transactions[] stored in LocalStorage
  ↓
  loaded by storageService
  ↓
  provided by AppContext
  ↓
Epic 4 (Dashboard)
  ↓
  calculationService transforms data
  ↓
  Chart components render visualizations
```

**Critical Path:**
1. LocalStorage → storageService → AppContext (Epic 2)
2. AppContext → Dashboard → calculationService (Epic 4)
3. calculationService → Chart components → Recharts (Epic 4)

### Breaking Changes & Migration

**No Breaking Changes Expected:**
- Epic 4 only adds new components and services
- No modifications to existing Epic 2 or Epic 3 interfaces
- Context extension is backward-compatible (new optional fields)

**Potential Conflicts:**
- None identified (Epic 4 is purely additive)

### Testing Dependencies

**Unit Testing:**
- Vitest (already installed in Epic 1)
- @testing-library/react (already installed)
- @testing-library/jest-dom (already installed)

**Test Coverage Requirements:**
- `calculationService.ts`: ≥90% coverage (critical business logic)
- Chart components: ≥70% coverage
- Dashboard.tsx: ≥70% coverage

## Acceptance Criteria (Authoritative)

### AC-1: Summary Statistics Display
**Source:** FR-3.1 (PRD)
- ✅ Dashboard displays three summary cards: Total Income, Total Expenses, Net Balance
- ✅ All calculations accurate to 2 decimal places
- ✅ Metrics update in real-time when period changes
- ✅ Metrics update automatically when transactions are added/edited/deleted
- ✅ Handles edge cases: zero transactions, all income, all expenses
- ✅ Currency formatted consistently (USD with $ symbol)
- ✅ Net Balance shows positive (green) or negative (red) visual indicator

### AC-2: Period Selector Functionality
**Source:** FR-3.4 (PRD)
- ✅ Preset period options available: This Month, Last Month, Last 3 Months
- ✅ Custom Range option allows user to select start and end dates
- ✅ Default period on app load: This Month
- ✅ Selected period persists across page refresh (LocalStorage)
- ✅ All dashboard components (cards, charts, widget) update when period changes
- ✅ Clear visual indication of currently selected period
- ✅ Custom date range validates: end >= start, dates not in future
- ✅ Period change triggers dashboard update in <500ms

### AC-3: Expense Breakdown Pie Chart
**Source:** FR-3.2 (PRD)
- ✅ Pie or donut chart displays expenses grouped by category
- ✅ Only categories with transactions in selected period are shown
- ✅ Each category slice uses predefined color from constants
- ✅ Hover/click displays percentage and/or dollar amount
- ✅ Legend shows all displayed categories with values
- ✅ Chart responsive: resizes based on screen size
- ✅ Empty state shown when no expenses exist in period
- ✅ Percentages sum to 100% (rounding handled correctly)
- ✅ Chart renders within 2 seconds

### AC-4: Income vs Expenses Trend Chart
**Source:** FR-3.3 (PRD)
- ✅ Bar or line chart shows income and expenses over time
- ✅ X-axis: Time periods (days for <=31 days, weeks for <=90 days, months for >90 days)
- ✅ Y-axis: Amount in USD currency
- ✅ Two data series: Income (green), Expenses (red/orange)
- ✅ Chart responsive and interactive (hover shows details)
- ✅ Displays trend for currently selected period
- ✅ Adaptive granularity based on period length
- ✅ Handles periods with no data (empty state or zero values)
- ✅ Chart renders within 2 seconds

### AC-5: Recent Transactions Widget
**Source:** FR-3.5 (PRD)
- ✅ Displays last 5-10 transactions (configurable, default 5)
- ✅ Compact format showing: Date, Description, Category, Amount
- ✅ "View All" link navigates to full transactions list page
- ✅ Updates automatically when new transaction is added
- ✅ Respects currently selected period (shows recent within period)
- ✅ Empty state when no transactions in period
- ✅ Transaction type indicated visually (color or icon)

### AC-6: Performance Requirements
**Source:** NFR-1.2, NFR-1.3, NFR-1.4 (PRD)
- ✅ Dashboard initial load completes in <3 seconds (3G connection)
- ✅ Charts render within 2 seconds of data availability
- ✅ Period filter updates complete in <500ms
- ✅ All user interactions provide feedback within 100ms
- ✅ Tested with dataset of up to 1000 transactions

### AC-7: Responsive Design
**Source:** FR-5.1 (PRD)
- ✅ Dashboard fully functional on screens ≥320px wide
- ✅ Summary cards stack vertically on mobile, grid on tablet/desktop
- ✅ Charts resize appropriately for viewport
- ✅ Touch-friendly interactions on mobile devices
- ✅ No horizontal scrolling required on any screen size
- ✅ Readable chart labels and tooltips on small screens

### AC-8: Data Integrity
**Source:** NFR-2 (PRD)
- ✅ All financial calculations accurate (no floating-point errors)
- ✅ Calculations consistent across all components (use calculationService)
- ✅ Invalid data handled gracefully (empty arrays, null values)
- ✅ Period date validation prevents invalid ranges
- ✅ Zero division handled in percentage calculations

## Traceability Mapping

| Acceptance Criteria | Tech Spec Section | Component/API | Test Strategy |
|---------------------|-------------------|---------------|---------------|
| **AC-1: Summary Statistics** | Detailed Design → SummaryCards.tsx | SummaryCards component, calculationService (calculateTotalIncome, calculateTotalExpenses, calculateNetBalance) | Unit test calculations with various transaction datasets; integration test with context; visual test for formatting |
| **AC-2: Period Selector** | Detailed Design → PeriodSelector.tsx | PeriodSelector component, usePeriod hook, AppContext | Unit test period validation; integration test period persistence (LocalStorage); E2E test period changes update dashboard |
| **AC-3: Expense Breakdown Chart** | Detailed Design → ExpenseBreakdownChart.tsx | ExpenseBreakdownChart component, transformToPieChartData helper, calculateExpensesByCategory | Unit test data transformation; visual regression test for chart rendering; test empty state and edge cases |
| **AC-4: Income Trend Chart** | Detailed Design → IncomeTrendChart.tsx | IncomeTrendChart component, transformToBarChartData helper, calculateTrendData | Unit test adaptive granularity logic; test with various period lengths; verify correct data series rendering |
| **AC-5: Recent Transactions** | Detailed Design → RecentTransactionsWidget.tsx | RecentTransactionsWidget component, transaction filtering logic | Unit test transaction limit; test "View All" navigation; verify updates on transaction add/edit/delete |
| **AC-6: Performance** | NFR → Performance section | All dashboard components, useMemo optimizations | Performance profiling with Chrome DevTools; load testing with 1000 transactions; measure re-render counts |
| **AC-7: Responsive Design** | NFR → Reliability section | All components with Tailwind responsive classes | Manual testing on physical devices; browser DevTools responsive mode; screenshot tests at multiple breakpoints |
| **AC-8: Data Integrity** | NFR → Security section | calculationService validation functions | Unit tests with edge cases (zero amounts, empty arrays, null values); fuzz testing with random datasets |

### Requirements → Implementation Matrix

| PRD Requirement | Epic 4 Story | Component Implementation | Status |
|-----------------|--------------|--------------------------|--------|
| FR-3.1: Summary Statistics | Story 4-1 | SummaryCards.tsx, calculationService.ts | 📋 Planned |
| FR-3.2: Expense Breakdown Chart | Story 4-3 | ExpenseBreakdownChart.tsx | 📋 Planned |
| FR-3.3: Income vs Expenses Trend | Story 4-4 | IncomeTrendChart.tsx | 📋 Planned |
| FR-3.4: Period Selection | Story 4-2 | PeriodSelector.tsx, usePeriod.ts | 📋 Planned |
| FR-3.5: Recent Transactions | Story 4-5 | RecentTransactionsWidget.tsx | 📋 Planned |
| NFR-1.2: UI Responsiveness | All stories | Performance optimizations, loading states | 📋 Planned |
| NFR-1.3: Chart Rendering | Stories 4-3, 4-4 | Recharts integration, memoization | 📋 Planned |
| NFR-1.4: Filter Performance | Story 4-2 | useMemo, efficient filtering | 📋 Planned |

### Story Breakdown for Epic 4

**Story 4-1: Summary Statistics Cards**
- Implement SummaryCards component
- Create calculation functions in calculationService
- Integrate with AppContext for reactive updates
- Add currency formatting utility
- Handle edge cases (zero transactions, all income, all expenses)

**Story 4-2: Period Selector Component**
- Implement PeriodSelector UI component
- Create usePeriod custom hook
- Add period state to AppContext
- Implement preset period calculations (This Month, Last Month, Last 3 Months)
- Implement custom date range picker
- Add period persistence to LocalStorage
- Validate custom date ranges

**Story 4-3: Expense Breakdown Pie Chart**
- Install Recharts dependency
- Implement ExpenseBreakdownChart component
- Create data transformation helper (calculateExpensesByCategory → PieChart data)
- Add chart tooltip and legend
- Implement responsive container
- Add empty state handling
- Ensure color consistency with category definitions

**Story 4-4: Income vs Expenses Trend Chart**
- Implement IncomeTrendChart component
- Create trend data calculation with adaptive granularity
- Transform data for Recharts BarChart format
- Implement custom tooltip
- Add responsive sizing
- Handle edge cases (no data, single data point)

**Story 4-5: Recent Transactions Widget**
- Implement RecentTransactionsWidget component
- Add transaction filtering by period
- Implement "View All" navigation
- Add empty state
- Style compact transaction list view

## Risks, Assumptions, Open Questions

### Risks

**RISK-1: Recharts Performance with Large Datasets**
- **Type:** Performance Risk
- **Description:** Recharts may struggle with rendering >100 data points in trend charts, causing slow renders or UI freezes
- **Likelihood:** Medium (depends on user data volume)
- **Impact:** High (violates NFR-1.3: 2-second chart rendering)
- **Mitigation:**
  - Aggregate data points for periods longer than 90 days (use monthly granularity)
  - Implement data sampling if transactions exceed 1000 records
  - Add loading states to indicate processing
  - Consider lazy loading charts (render only when scrolled into view)
- **Contingency:** If Recharts proves inadequate, evaluate lightweight alternatives (e.g., Chart.js via react-chartjs-2)

**RISK-2: Period State Management Complexity**
- **Type:** Technical Risk
- **Description:** Managing period state across multiple components could lead to inconsistent filtering or stale data
- **Likelihood:** Low (well-defined Context pattern)
- **Impact:** High (breaks core dashboard functionality)
- **Mitigation:**
  - Centralize period state in AppContext
  - Use single source of truth for selectedPeriod
  - Memoize all calculations with period as dependency
  - Unit test period changes thoroughly
- **Contingency:** Simplify period selector to preset options only (remove custom range)

**RISK-3: Responsive Chart Rendering on Mobile**
- **Type:** UX/Technical Risk
- **Description:** Charts may be difficult to read or interact with on small mobile screens (<375px)
- **Likelihood:** Medium
- **Impact:** Medium (affects mobile UX quality)
- **Mitigation:**
  - Use ResponsiveContainer with minimum height constraints
  - Simplify chart tooltips on mobile (larger touch targets)
  - Test on physical devices early in development
  - Consider alternative visualizations for mobile (e.g., stacked bars instead of pie)
- **Contingency:** Hide complex charts on mobile, show data tables instead

**RISK-4: Calculation Errors Due to Floating-Point Precision**
- **Type:** Data Integrity Risk
- **Description:** JavaScript floating-point arithmetic could cause rounding errors in financial calculations
- **Likelihood:** Low (JavaScript handles cents reasonably well)
- **Impact:** Critical (financial data must be accurate)
- **Mitigation:**
  - Use `toFixed(2)` consistently for all currency amounts
  - Round intermediate calculations only at display time
  - Comprehensive unit tests with edge cases (0.01, 0.99, large numbers)
  - Consider using a decimal library (e.g., decimal.js) if issues arise
- **Contingency:** Store amounts as integers (cents) and convert for display

### Assumptions

**ASSUMPTION-1: Recharts Bundle Size Acceptable**
- **Assumption:** Recharts library will not significantly increase bundle size beyond acceptable limits
- **Validation:** Measure production build size after Recharts installation (target: <500KB total bundle)
- **If Wrong:** Evaluate tree-shaking effectiveness; consider code-splitting charts into separate bundles

**ASSUMPTION-2: LocalStorage Sufficient for Period Persistence**
- **Assumption:** Storing selected period in LocalStorage is acceptable for MVP (no backend sync needed)
- **Validation:** User acceptance testing confirms period persistence is valuable
- **If Wrong:** Period defaults to "This Month" on each visit (minimal impact)

**ASSUMPTION-3: Preset Periods Cover Most Use Cases**
- **Assumption:** This Month, Last Month, Last 3 Months, and Custom Range cover 95% of user needs
- **Validation:** User feedback during manual testing
- **If Wrong:** Add more preset options (e.g., "This Year", "Last 6 Months")

**ASSUMPTION-4: date-fns Handles All Date Logic**
- **Assumption:** date-fns provides all required date manipulation functions (no custom date logic needed)
- **Validation:** Verify date-fns supports period calculations, formatting, and interval generation
- **If Wrong:** Supplement with custom date utilities or switch to alternative library

**ASSUMPTION-5: Single Currency (USD) Sufficient**
- **Assumption:** MVP only needs to support USD (no multi-currency formatting)
- **Validation:** PRD explicitly states "single currency (USD)" for MVP
- **If Wrong:** Update formatCurrency utility to accept currency parameter

### Open Questions

**QUESTION-1: Donut Chart vs. Pie Chart**
- **Question:** Should expense breakdown use donut chart (hole in center) or traditional pie chart?
- **Options:**
  - Donut: More modern, space for total in center
  - Pie: More familiar, maximizes data density
- **Decision Needed By:** Story 4-3 implementation
- **Proposed Decision:** Donut chart with total expenses displayed in center (better UX)

**QUESTION-2: Default Number of Recent Transactions**
- **Question:** Should Recent Transactions widget show 5 or 10 transactions by default?
- **Impact:** Affects widget height and scroll behavior
- **Proposed Decision:** Start with 5, make configurable via prop (test both during implementation)

**QUESTION-3: Trend Chart Type**
- **Question:** Should income vs expenses trend use bar chart or line chart?
- **Options:**
  - Bar: Better for comparing two series, clearer for discrete time periods
  - Line: Better for showing trends, less visual clutter
- **Proposed Decision:** Bar chart (aligns with PRD FR-3.3: "Bar or line chart")

**QUESTION-4: Empty State Messaging**
- **Question:** What message should display when no transactions exist in selected period?
- **Options:**
  - Generic: "No data for this period"
  - Actionable: "No transactions in [Period]. Try selecting a different period or add your first transaction."
- **Proposed Decision:** Actionable message with link to change period or add transaction

**QUESTION-5: Chart Animation**
- **Question:** Should charts animate on initial render and data changes?
- **Considerations:**
  - Pros: More engaging UX, feels polished
  - Cons: May slow rendering, violates NFR-1.3 if >2 seconds
- **Proposed Decision:** Enable animations, but disable if performance testing shows >2s render time

## Test Strategy Summary

### Testing Levels

**Level 1: Unit Testing (Vitest)**
- **Scope:** Individual functions and pure logic
- **Coverage Target:** ≥90% for services, ≥70% for components
- **Focus Areas:**
  - `calculationService.ts`: All financial calculation functions
  - Period date validation logic
  - Chart data transformation helpers
  - Currency and date formatting utilities
- **Test Data:** Mock transaction arrays with various scenarios (empty, single, many, edge cases)

**Level 2: Component Testing (React Testing Library)**
- **Scope:** Individual React components in isolation
- **Coverage Target:** ≥70% for all Epic 4 components
- **Focus Areas:**
  - SummaryCards rendering with different metric values
  - PeriodSelector UI interactions and callbacks
  - Chart components with mock data (verify rendering, not Recharts internals)
  - RecentTransactionsWidget with various transaction counts
- **Test Patterns:** Render, query, assert, user interaction simulation

**Level 3: Integration Testing**
- **Scope:** Components interacting with Context and services
- **Coverage Target:** Critical user flows (period change, transaction add)
- **Focus Areas:**
  - Dashboard consuming AppContext and updating on state changes
  - Period changes triggering recalculations in all components
  - Transaction add/edit/delete reflecting in dashboard metrics
- **Tools:** React Testing Library with custom wrapper (AppContext provider)

**Level 4: Manual Testing**
- **Scope:** Visual QA, responsive design, browser compatibility
- **Focus Areas:**
  - Chart rendering accuracy on different browsers
  - Responsive behavior at various breakpoints (320px, 768px, 1024px, 1440px)
  - Performance testing with large datasets (500, 1000 transactions)
  - Accessibility: keyboard navigation, screen reader compatibility
- **Devices:** Chrome DevTools responsive mode + 2 physical devices (mobile, tablet)

### Test Cases by Acceptance Criteria

**AC-1: Summary Statistics**
1. Calculate total income with 0, 1, multiple income transactions
2. Calculate total expenses with 0, 1, multiple expense transactions
3. Calculate net balance: positive, negative, zero
4. Verify currency formatting ($1,234.56)
5. Verify real-time updates when period changes
6. Verify updates when transaction added/edited/deleted

**AC-2: Period Selector**
1. Select "This Month" → verify correct date range
2. Select "Last Month" → verify correct date range
3. Select "Last 3 Months" → verify correct date range
4. Select custom range with valid dates → verify accepted
5. Select custom range with end < start → verify error
6. Select custom range with future date → verify error
7. Refresh page → verify period persists from LocalStorage
8. Change period → verify dashboard updates in <500ms

**AC-3: Expense Breakdown Chart**
1. Render with 0 expenses → verify empty state
2. Render with 1 expense category → verify single slice
3. Render with multiple categories → verify all slices with correct colors
4. Verify percentages sum to 100%
5. Hover on slice → verify tooltip shows amount and percentage
6. Resize window → verify chart resizes responsively
7. Test with 1000 transactions → verify renders in <2 seconds

**AC-4: Income Trend Chart**
1. Render with period ≤31 days → verify daily granularity
2. Render with period ≤90 days → verify weekly granularity
3. Render with period >90 days → verify monthly granularity
4. Verify income series (green) and expense series (red) display
5. Hover on bar → verify tooltip shows date and amounts
6. Test with sparse data (gaps in dates) → verify handles gracefully
7. Test with 1000 transactions → verify renders in <2 seconds

**AC-5: Recent Transactions Widget**
1. Render with 0 transactions → verify empty state
2. Render with <5 transactions → verify all shown
3. Render with >5 transactions → verify only 5 shown
4. Click "View All" → verify navigates to transactions page
5. Add new transaction → verify widget updates
6. Change period → verify widget shows transactions from period

**AC-6: Performance**
1. Load dashboard with 100 transactions → measure load time (<3s)
2. Load dashboard with 1000 transactions → measure load time (<3s)
3. Change period with 1000 transactions → measure update time (<500ms)
4. Click period selector → measure feedback time (<100ms)
5. Profile re-render count on period change (should be 1)

**AC-7: Responsive Design**
1. Test at 320px width → verify all components functional
2. Test at 768px width → verify layout adapts (tablet)
3. Test at 1024px width → verify full desktop layout
4. Test at 1440px width → verify no layout breaks
5. Test on physical mobile device → verify touch interactions
6. Verify no horizontal scrolling at any breakpoint

**AC-8: Data Integrity**
1. Calculate 100.10 + 200.20 → verify 300.30 (not 300.29999...)
2. Divide by zero in percentage → verify returns 0
3. Pass empty array to calculations → verify returns 0
4. Pass null period to calculations → verify uses all transactions
5. Pass invalid transaction data → verify handles gracefully

### Coverage Reports

**Generate Coverage:**
```bash
npm run test:coverage
```

**Coverage Targets:**
- **calculationService.ts:** ≥90%
- **All dashboard components:** ≥70%
- **Overall Epic 4 code:** ≥80%

### Performance Testing

**Tools:**
- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse audit

**Benchmarks:**
- Chart rendering with 100 transactions: <1 second
- Chart rendering with 1000 transactions: <2 seconds
- Period filter update: <500ms
- Dashboard initial load: <3 seconds (simulated 3G)

### Regression Testing

**Key Scenarios to Test After Changes:**
1. Period change updates all dashboard components
2. Transaction CRUD operations update dashboard
3. Browser refresh preserves selected period
4. Charts render correctly with edge case data
5. Responsive layout works at all breakpoints

**Automated Regression:** Vitest tests run on every commit via Husky pre-commit hook
