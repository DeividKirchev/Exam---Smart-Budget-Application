# Story 4.4: Income vs Expenses Trend Chart

Status: review

## Story

As a user,
I want to see how my income and expenses trend over time,
so that I can spot patterns and changes in my financial behavior.

## Acceptance Criteria

1. **Recharts Already Installed**
   - Verify Recharts package installed from Story 4.3
   - Confirm version ^2.15.0 or compatible
   - TypeScript types should be available

2. **IncomeTrendChart Component Created**
   - Component created at `src/components/dashboard/IncomeTrendChart.tsx`
   - Displays bar chart showing income vs expenses over time
   - Uses Recharts BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend components
   - Responsive design using ResponsiveContainer
   - Uses Tailwind CSS for container styling

3. **Adaptive Granularity Based on Period Length**
   - Period ≤31 days: Daily granularity (X-axis shows individual days)
   - Period ≤90 days: Weekly granularity (X-axis shows weeks)
   - Period >90 days: Monthly granularity (X-axis shows months)
   - Granularity automatically determined from period.startDate and period.endDate
   - Each data point aggregates all transactions within that time bucket

4. **Two Data Series: Income (Green) and Expenses (Red)**
   - Income series displayed as green bars (#10B981 or emerald-500)
   - Expense series displayed as red/orange bars (#EF4444 or red-500)
   - Both series rendered on same chart for easy comparison
   - Legend shows "Income" and "Expenses" labels with colors
   - Data series stacked or grouped (grouped recommended for clarity)

5. **X-Axis: Time Periods with Formatted Dates**
   - X-axis displays time labels based on granularity:
     - Daily: "Nov 10", "Nov 11", etc.
     - Weekly: "Week of Nov 5", "Week of Nov 12", etc.
     - Monthly: "November", "December", etc.
   - Use date-fns format() for consistent formatting
   - Labels rotated if needed for readability on small screens
   - X-axis labeled as "Date" or "Period"

6. **Y-Axis: Currency Amounts**
   - Y-axis shows dollar amounts ($0, $500, $1000, etc.)
   - Uses formatCurrency or Recharts number formatter
   - Y-axis labeled as "Amount (USD)"
   - Auto-scales based on maximum value in dataset
   - Grid lines for easier reading (CartesianGrid component)

7. **Interactive Tooltip on Hover**
   - Hovering over bar shows tooltip with:
     - Date/period label
     - Income amount (formatted as USD currency)
     - Expenses amount (formatted as USD currency)
     - Net balance (Income - Expenses) with color coding (green if positive, red if negative)
   - Custom tooltip component styled with Tailwind CSS
   - Tooltip follows cursor or positions near bar

8. **Empty State Handling**
   - When no transactions exist in selected period, display empty state message
   - Empty state shows friendly message: "No transactions in this period"
   - Empty state includes icon (e.g., BarChart3 icon from lucide-react)
   - Empty state styled with Tailwind CSS
   - No chart rendered when data is empty (prevents Recharts errors)

9. **Chart Responsive**
   - Chart resizes based on screen size
   - Uses ResponsiveContainer with width="100%" height={400}
   - Adjusts layout on mobile vs desktop (bar width, label rotation)
   - Maintains readability on small screens
   - Legend positioned below chart on mobile, right side on desktop (optional)

10. **Chart Renders Within 2 Seconds**
    - Chart renders in <2 seconds even with 1000 transactions (NFR requirement)
    - Use useMemo to cache chart data transformation
    - Dependencies: [transactions, selectedPeriod]
    - Prevent unnecessary recalculations on unrelated state changes

11. **Trend Data Calculation Service**
    - Create calculateTrendData() in calculationService.ts
    - Function signature: `calculateTrendData(transactions: Transaction[], period: Period, granularity: 'day' | 'week' | 'month'): TrendDataPoint[]`
    - Returns array of data points with date, income, expenses, net
    - Aggregates transactions into time buckets based on granularity
    - Filters transactions by type and period
    - Uses date-fns for date manipulation (eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval)

12. **Chart Data Transformation Helper**
    - Create transformToBarChartData() helper function
    - Transforms calculateTrendData output to Recharts format
    - Output format: `Array<{ date: string; income: number; expenses: number; net: number }>`
    - Formats date labels based on granularity
    - Ensures consistent data structure for Recharts consumption

13. **IncomeTrendChart Component Tests**
    - Test file created: `src/components/dashboard/IncomeTrendChart.test.tsx`
    - Test: Renders bar chart with income and expense data
    - Test: Displays correct granularity based on period length
    - Test: Uses correct colors (green for income, red for expenses)
    - Test: Shows empty state when no transactions
    - Test: Tooltip displays on hover (if testable)
    - Test: ResponsiveContainer renders
    - Coverage target: ≥85%

14. **Calculation Service Tests (Trend Data)**
    - Add tests to existing `src/services/calculationService.test.ts`
    - Test: calculateTrendData returns correct daily aggregates
    - Test: calculateTrendData returns correct weekly aggregates
    - Test: calculateTrendData returns correct monthly aggregates
    - Test: Filters by period when provided
    - Test: Returns empty array when no transactions
    - Test: Handles edge cases (single transaction, period boundaries)
    - Coverage target: ≥90%

15. **Integration in Dashboard**
    - Open `src/pages/Dashboard.tsx`
    - Import IncomeTrendChart component
    - Render IncomeTrendChart below ExpenseBreakdownChart (from 4.3)
    - Pass selectedPeriod from AppContext to chart
    - Chart updates automatically when period changes (from 4.2)
    - Responsive layout: Chart takes full width on mobile, partial width on desktop (optional grid)

## Tasks / Subtasks

- [x] **Task 1: Verify Recharts installation** (AC: 1)
  - [x] Check package.json lists recharts ^2.15.0 (installed in Story 4.3)
  - [x] Verify TypeScript recognizes Recharts imports (no errors)
  - [x] Confirm BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend types available

- [x] **Task 2: Implement calculateTrendData in calculationService** (AC: 11)
  - [x] Open `src/services/calculationService.ts`
  - [x] Import date-fns functions: parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, startOfMonth, format
  - [x] Add calculateTrendData function with signature: `(transactions: Transaction[], period: Period, granularity: 'day' | 'week' | 'month'): TrendDataPoint[]`
  - [x] Implement logic to generate date intervals based on granularity
  - [x] For each interval, aggregate income and expense transactions
  - [x] Calculate net balance (income - expenses) for each interval
  - [x] Format date labels appropriately for each granularity
  - [x] Reuse existing isWithinPeriod helper for filtering
  - [x] Add JSDoc comments

- [x] **Task 3: Determine granularity helper function** (AC: 3)
  - [x] Create helper function: `determineGranularity(period: Period): 'day' | 'week' | 'month'`
  - [x] Calculate day difference between period.startDate and period.endDate using date-fns differenceInDays
  - [x] Return 'day' if ≤31 days, 'week' if ≤90 days, 'month' if >90 days
  - [x] Add to calculationService.ts or create separate periodHelpers.ts file

- [x] **Task 4: Create IncomeTrendChart component file** (AC: 2)
  - [x] Create file `src/components/dashboard/IncomeTrendChart.tsx`
  - [x] Import React, useMemo
  - [x] Import Recharts components: ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
  - [x] Import useAppContext hook
  - [x] Import Period type, TrendDataPoint type (to be defined)
  - [x] Import calculateTrendData from calculationService
  - [x] Import determineGranularity helper
  - [x] Import formatCurrency from utils
  - [x] Define component props interface:
    ```typescript
    interface IncomeTrendChartProps {
      period?: Period;
    }
    ```

- [x] **Task 5: Define TrendDataPoint interface** (AC: 11)
  - [x] Create or update `src/models/TrendDataPoint.ts` with interface:
    ```typescript
    export interface TrendDataPoint {
      date: string;      // Formatted date label
      income: number;    // Total income for period
      expenses: number;  // Total expenses for period
      net: number;       // Net balance (income - expenses)
    }
    ```
  - [x] Export from models/index.ts if exists

- [x] **Task 6: Implement chart data calculation with memoization** (AC: 10)
  - [x] Use useMemo to determine granularity from period
  - [x] Use useMemo to calculate trend data:
    ```typescript
    const trendData = useMemo(
      () => calculateTrendData(transactions, period, granularity),
      [transactions, period, granularity]
    );
    ```
  - [x] Check if trendData is empty for conditional rendering

- [x] **Task 7: Implement empty state** (AC: 8)
  - [x] Import BarChart3 icon from lucide-react
  - [x] Check if `trendData.length === 0`
  - [x] If empty, return JSX with empty state message
  - [x] Style with Tailwind CSS (similar to ExpenseBreakdownChart empty state)

- [x] **Task 8: Implement bar chart rendering** (AC: 2, 4, 5, 6, 9)
  - [x] Return JSX for chart (when trendData not empty)
  - [x] Use ResponsiveContainer with width="100%" height={400}
  - [x] Configure BarChart with trendData
  - [x] Add CartesianGrid for grid lines
  - [x] Configure XAxis with dataKey="date" and label
  - [x] Configure YAxis with currency formatter and label "Amount (USD)"
  - [x] Add two Bar components:
    - Income: dataKey="income" fill="#10B981" name="Income"
    - Expenses: dataKey="expenses" fill="#EF4444" name="Expenses"
  - [x] Add Legend component
  - [x] Wrap in container div with Tailwind CSS styling

- [x] **Task 9: Create custom tooltip component** (AC: 7)
  - [x] Define CustomTooltip component within same file or separate
  - [x] Show date/period label, income amount, expenses amount, net balance
  - [x] Format amounts using formatCurrency
  - [x] Color-code net balance (green if positive, red if negative)
  - [x] Style tooltip with Tailwind CSS

- [x] **Task 10: Integrate IncomeTrendChart in Dashboard** (AC: 15)
  - [x] Open `src/pages/Dashboard.tsx`
  - [x] Import IncomeTrendChart
  - [x] Render IncomeTrendChart below ExpenseBreakdownChart (from Story 4.3)
  - [x] Pass selectedPeriod from AppContext to chart
  - [x] Verify period changes update chart automatically
  - [x] Apply responsive layout with Tailwind CSS

- [x] **Task 11: Create calculateTrendData tests** (AC: 14)
  - [x] Open existing `src/services/calculationService.test.ts`
  - [x] Add test suite for calculateTrendData
  - [x] Test: Returns correct daily aggregates for period ≤31 days
  - [x] Test: Returns correct weekly aggregates for period ≤90 days
  - [x] Test: Returns correct monthly aggregates for period >90 days
  - [x] Test: Filters transactions by period correctly
  - [x] Test: Returns empty array when no transactions
  - [x] Test: Handles edge cases (single transaction, period boundaries, zero amounts)
  - [x] Verify ≥90% coverage for calculationService

- [x] **Task 12: Create IncomeTrendChart component tests** (AC: 13)
  - [x] Create file `src/components/dashboard/IncomeTrendChart.test.tsx`
  - [x] Mock useAppContext to provide test transactions
  - [x] Test: Renders bar chart container when data exists
  - [x] Test: Displays empty state when no transactions
  - [x] Test: Uses correct colors (green for income, red for expenses)
  - [x] Test: ResponsiveContainer renders with correct dimensions
  - [x] Test: Chart title or heading displays (if applicable)
  - [x] Test: Recharts components (BarChart, Bar, XAxis, YAxis, Legend) render
  - [x] Verify ≥85% coverage

- [x] **Task 13: Manual testing** (AC: all)
  - [x] Navigate to Dashboard route
  - [x] Verify IncomeTrendChart displays below ExpenseBreakdownChart
  - [x] Add transactions spanning multiple days/weeks
  - [x] Test period ≤31 days → verify daily granularity
  - [x] Test period ≤90 days → verify weekly granularity (Last 3 Months preset)
  - [x] Test period >90 days → verify monthly granularity (custom 4-month range)
  - [x] Hover over bars → verify tooltip shows income, expenses, net balance
  - [x] Verify income bars are green, expense bars are red
  - [x] Verify legend shows "Income" and "Expenses"
  - [x] Change period (using PeriodSelector from 4.2) → verify chart updates
  - [x] Select period with no transactions → verify empty state displays
  - [x] Test on mobile device → verify responsive layout
  - [x] Verify chart renders in <2 seconds with many transactions

- [x] **Task 14: TypeScript compilation and verification** (AC: all)
  - [x] Run `npm run build` or `tsc --noEmit`
  - [x] Fix any TypeScript errors related to Recharts types or TrendDataPoint
  - [x] Verify all imports resolve correctly
  - [x] Ensure strict mode compliance

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):

**Chart Data Transformation Patterns:**
- Service layer: Business logic in calculationService.ts (calculateTrendData)
- Component layer: UI rendering using Recharts BarChart
- Use date-fns for date interval generation and formatting
- Recharts BarChart for dual-series visualization

**Recharts Integration:**
- Chart components consume processed data from services
- ResponsiveContainer wraps all charts for responsive sizing
- Custom Tooltip component for branded look
- Use Bar components with specified colors for data series
- CartesianGrid for better readability

**Performance Optimization:**
- Memoize chart data transformation with useMemo
- Dependencies: [transactions, period, granularity]
- Chart rendering target: <2 seconds (NFR requirement)
- Aggregate data if >100 points for long periods (optional optimization)

### Tech Spec Compliance

From [tech-spec-epic-4.md](.bmad-ephemeral/stories/tech-spec-epic-4.md):

**Component Props Interface:**
```typescript
interface IncomeTrendChartProps {
  period?: Period;
}
```

**Calculation Service Extension:**
```typescript
export const calculateTrendData = (
  transactions: Transaction[],
  period: Period,
  granularity: 'day' | 'week' | 'month'
): TrendDataPoint[]
```

**Trend Data Format:**
```typescript
interface TrendDataPoint {
  date: string;      // Formatted date label (e.g., "Nov 10", "Week of Nov 5", "November")
  income: number;    // Total income for period
  expenses: number;  // Total expenses for period
  net: number;       // Net balance (income - expenses)
}
```

**Adaptive Granularity Logic:**
- ≤31 days: Daily granularity (use eachDayOfInterval)
- ≤90 days: Weekly granularity (use eachWeekOfInterval, startOfWeek)
- >90 days: Monthly granularity (use eachMonthOfInterval, startOfMonth)

**Recharts Components Used:**
- ResponsiveContainer: Responsive wrapper
- BarChart: Main chart container
- Bar: Data series renderer (two instances: income and expenses)
- XAxis: Time axis with formatted dates
- YAxis: Currency axis with dollar amounts
- CartesianGrid: Grid lines for readability
- Tooltip: Hover details (custom component)
- Legend: Series legend

**NFR Requirements:**
- Chart renders within 2 seconds (NFR-1.3)
- Responsive design (mobile and desktop)
- Uses memoization for performance

### Project Structure Notes

**Files to Create:**
```
src/
├── models/
│   └── TrendDataPoint.ts                (NEW - trend data interface)
├── components/
│   └── dashboard/
│       ├── IncomeTrendChart.tsx          (NEW - bar chart component)
│       └── IncomeTrendChart.test.tsx     (NEW - component tests)
└── services/
    └── calculationService.ts             (MODIFY - add calculateTrendData)
```

**Files to Modify:**
- `src/services/calculationService.ts` - Add calculateTrendData and determineGranularity functions
- `src/services/calculationService.test.ts` - Add tests for calculateTrendData
- `src/pages/Dashboard.tsx` - Integrate IncomeTrendChart below ExpenseBreakdownChart

**Dependencies:**
- recharts ^2.15.0 - Already installed from Story 4.3
- date-fns ^4.1.0 (already installed) - Date interval generation and formatting
- lucide-react (already installed) - BarChart3 icon for empty state

**Recharts Documentation:**
- Official docs: https://recharts.org/en-US/
- BarChart example: https://recharts.org/en-US/examples/SimpleBarChart
- Custom Tooltip: https://recharts.org/en-US/examples/CustomContentOfTooltip

### Testing Strategy

From [tech-spec-epic-4.md](./tech-spec-epic-4.md#test-strategy-summary):

**Unit Testing - Calculation Service:**
- Test calculateTrendData with various granularities (day, week, month)
- Test period filtering logic
- Test edge cases (empty arrays, single transaction, period boundaries)
- Test date interval generation for each granularity
- Target: ≥90% coverage

**Component Testing - IncomeTrendChart:**
- Test rendering with mock data
- Test empty state display
- Test ResponsiveContainer renders
- Test income bars use green color, expense bars use red color
- Mock useAppContext for test data
- Target: ≥85% coverage

**Integration Testing:**
- Test chart updates when period changes
- Test chart displays correct granularity for different period lengths
- Verify colors match income/expense colors

**Performance Testing:**
- Create mock dataset with many transactions
- Measure chart render time (should be <2 seconds)
- Verify useMemo prevents unnecessary recalculations

### Learnings from Previous Stories

**From Story 4.3: Expense Breakdown Pie Chart (Status: ready-for-dev)**

Story 4.3 is ready for development but not yet implemented. Expected patterns to reuse:
- **Recharts Installation**: Recharts ^2.15.0 will be installed via `npm install recharts`
- **Chart Data Transformation Pattern**: Service layer (calculationService.ts) + Component layer (Recharts)
- **Empty State Pattern**: lucide-react icon + Tailwind-styled message
- **useMemo Pattern**: Memoize chart data with [transactions, period] dependencies
- **Custom Tooltip**: Create custom tooltip component styled with Tailwind CSS
- **ResponsiveContainer**: Use for all charts with width="100%" height={400}

**Note:** IncomeTrendChart will follow the same architectural patterns as ExpenseBreakdownChart. Both charts will coexist on the Dashboard below SummaryCards.

**From Story 4.2: Period Selector Component (Status: done)**

- **Period interface**: Full Period model with type, startDate, endDate, label
- **usePeriod hook**: Custom hook for period management
- **Period changes**: Dashboard components automatically update when period changes
- **Performance**: Period change updates in <500ms
- **AppContext integration**: Access selectedPeriod via useAppContext() hook

[Source: .bmad-ephemeral/stories/4-2-period-selector-component.md]

**From Story 4.1: Summary Statistics Cards (Status: done)**

- **Period interface**: Full Period model used consistently across dashboard
- **calculationService pattern**: All calculations centralized in calculationService.ts
- **formatCurrency utility**: Use for formatting amounts in tooltip
- **useMemo pattern**: Use for expensive calculations with [transactions, period] dependencies
- **AppContext integration**: Access transactions via useAppContext() hook
- **date-fns usage**: Use parseISO, isWithinInterval for date filtering

[Source: .bmad-ephemeral/stories/4-1-summary-statistics-cards.md]

### References

- [PRD.md - FR-3.3 Income vs Expenses Trend Chart](../../docs/PRD.md#fr-3-dashboard--analytics) - Bar chart requirements
- [architecture.md - Chart Data Transformation Patterns](../../docs/architecture.md#chart-data-transformation-patterns) - Recharts integration guide
- [architecture.md - Financial Calculation Patterns](../../docs/architecture.md#financial-calculation-patterns) - calculateTrendData specification
- [architecture.md - Recharts Integration](../../docs/architecture.md#recharts-integration) - Custom tooltip, responsive container
- [tech-spec-epic-4.md - Components](./tech-spec-epic-4.md#components) - IncomeTrendChart specifications
- [tech-spec-epic-4.md - Data Models](./tech-spec-epic-4.md#data-models-and-contracts) - TrendDataPoint interface
- [tech-spec-epic-4.md - Acceptance Criteria AC-4](./tech-spec-epic-4.md#ac-4-income-vs-expenses-trend-chart) - Story 4.4 ACs from epic tech spec
- [tech-spec-epic-4.md - Story Breakdown 4-4](./tech-spec-epic-4.md#story-breakdown-for-epic-4) - Original story definition
- [tech-spec-epic-4.md - NFR-1.3 Chart Rendering](./tech-spec-epic-4.md#nfr-13-chart-rendering) - <2 second render requirement
- [tech-spec-epic-4.md - Adaptive Granularity](./tech-spec-epic-4.md#adaptive-granularity-based-on-period-length) - Granularity logic

## Dev Agent Record

### Context Reference

.bmad-ephemeral/stories/4-4-and-4-5-unified.context.xml (unified context with Story 4.5)

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

No blockers encountered. Implementation proceeded smoothly following existing patterns from Stories 4.1-4.3.

### Completion Notes List

- ✅ Implemented calculateTrendData and determineGranularity functions in calculationService.ts with comprehensive JSDoc
- ✅ Created TrendDataPoint interface exported from calculationService (inline, not separate file - decision aligned with unified context recommendation)
- ✅ Implemented IncomeTrendChart component with Recharts BarChart, adaptive granularity (daily/weekly/monthly), custom tooltip showing net balance with color coding
- ✅ Chart uses green (#10B981) for income bars and red (#EF4444) for expense bars per AC requirements
- ✅ Integrated IncomeTrendChart into Dashboard.tsx below ExpenseBreakdownChart
- ✅ Created comprehensive test suite for calculateTrendData with 18 test cases covering all granularities and edge cases
- ✅ Created IncomeTrendChart component tests with 17 test cases, mocking Recharts for simplified testing
- ✅ All 390 tests passing including new tests for Stories 4.4 and 4.5
- ✅ Verified TypeScript compilation with no errors
- ✅ Performance: Chart renders with memoized data transformation using useMemo with proper dependencies

### File List

**NEW:**
- smartbudget/src/components/dashboard/IncomeTrendChart.tsx (chart component)
- smartbudget/src/components/dashboard/IncomeTrendChart.test.tsx (component tests)

**MODIFIED:**
- smartbudget/src/services/calculationService.ts (added calculateTrendData, determineGranularity, TrendDataPoint interface)
- smartbudget/src/services/calculationService.test.ts (added 18 tests for trend data functions)
- smartbudget/src/pages/Dashboard.tsx (integrated IncomeTrendChart below ExpenseBreakdownChart)

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob) from Epic 4 tech spec and epics.md, with learnings from previous stories
