# Story 4.1: Summary Statistics Cards

Status: ready-for-dev

## Story

As a user,
I want to see summary statistics for my finances,
so that I can quickly understand my financial position.

## Acceptance Criteria

1. **SummaryCards Component Created**
   - Component created at `src/components/dashboard/SummaryCards.tsx`
   - Component displays three cards in grid layout: Total Income, Total Expenses, Net Balance
   - Each card shows label, amount, and icon
   - Cards responsive (stacked vertically on mobile <768px, grid on desktop ≥768px)
   - Uses Tailwind CSS for styling and responsive layout

2. **Total Income Card**
   - Label: "Total Income"
   - Displays total income amount for selected period
   - Amount formatted as USD currency ($1,234.56)
   - Icon: TrendingUp or DollarSign from lucide-react
   - Green accent color (#10B981 or Tailwind green-500)
   - Amount accurate to 2 decimal places

3. **Total Expenses Card**
   - Label: "Total Expenses"
   - Displays total expenses amount for selected period
   - Amount formatted as USD currency ($1,234.56)
   - Icon: TrendingDown or ShoppingCart from lucide-react
   - Red/orange accent color (#EF4444 or Tailwind red-500)
   - Amount accurate to 2 decimal places

4. **Net Balance Card**
   - Label: "Net Balance"
   - Displays net balance (Total Income - Total Expenses)
   - Amount formatted as USD currency ($1,234.56)
   - Icon: Wallet or PiggyBank from lucide-react
   - Color changes based on balance:
     - Positive (>0): Green (#10B981)
     - Negative (<0): Red (#EF4444)
     - Zero (=0): Gray (#6B7280)
   - Amount accurate to 2 decimal places

5. **Calculation Service Created**
   - Service file created at `src/services/calculationService.ts`
   - Implements `calculateTotalIncome(transactions: Transaction[], period?: Period): number`
   - Implements `calculateTotalExpenses(transactions: Transaction[], period?: Period): number`
   - Implements `calculateNetBalance(transactions: Transaction[], period?: Period): number`
   - Functions filter by period if provided (period.startDate to period.endDate)
   - If no period provided, calculate across all transactions
   - Functions handle empty transaction arrays (return 0)
   - All calculations accurate (no floating-point errors)

6. **Currency Formatting Utility**
   - Utility created at `src/utils/formatCurrency.ts`
   - Function signature: `formatCurrency(amount: number): string`
   - Uses Intl.NumberFormat with USD currency
   - Format: $1,234.56 (dollar sign, comma thousands separator, 2 decimals)
   - Handles negative amounts: -$123.45
   - Handles zero: $0.00

7. **Period Integration (Simplified)**
   - SummaryCards accepts `period?: Period` prop for future integration
   - If period prop provided, calculations filter by date range
   - If no period prop, calculate across all transactions
   - Period filtering logic: transaction.date >= period.startDate AND transaction.date <= period.endDate
   - Note: Full Period model and PeriodSelector will be implemented in Story 4-2

8. **Real-Time Updates**
   - Summary cards update automatically when transactions change
   - Uses AppContext to access transactions array
   - Uses React useMemo to memoize calculations
   - Dependencies: [transactions, period]
   - No manual refresh required

9. **Edge Case Handling**
   - Zero transactions: All cards show $0.00
   - All income (no expenses): Total Expenses = $0.00, Net Balance = Total Income (green)
   - All expenses (no income): Total Income = $0.00, Net Balance = negative (red)
   - Large amounts (>$1,000,000): Format with commas correctly
   - Fractional cents (e.g., $10.999): Round to 2 decimals ($11.00)

10. **Component Tests**
    - Test file created: `src/components/dashboard/SummaryCards.test.tsx`
    - Test: Renders three cards with labels
    - Test: Displays correct amounts for sample transactions
    - Test: Formats amounts as USD currency
    - Test: Net Balance color changes based on positive/negative/zero
    - Test: Handles empty transactions array
    - Test: Updates when transactions change
    - Test: Filters by period when period prop provided
    - Coverage target: ≥85%

11. **Calculation Service Tests**
    - Test file created: `src/services/calculationService.test.ts`
    - Test: calculateTotalIncome sums income transactions
    - Test: calculateTotalExpenses sums expense transactions
    - Test: calculateNetBalance = income - expenses
    - Test: Period filtering excludes transactions outside date range
    - Test: Handles empty arrays (returns 0)
    - Test: Handles transactions with no matching period
    - Test: Accurate rounding to 2 decimal places
    - Coverage target: ≥90% (critical business logic)

## Tasks / Subtasks

- [ ] **Task 1: Create Period interface model (simplified for Story 4.1)** (AC: 7)
  - [ ] Create file `src/models/Period.ts`
  - [ ] Define Period type (simplified for this story, will be expanded in 4-2):
    ```typescript
    export interface Period {
      startDate: string;  // ISO 8601 format: "2025-11-01"
      endDate: string;    // ISO 8601 format: "2025-11-30"
    }
    ```
  - [ ] Note: Full PeriodType and additional fields will be added in Story 4-2

- [ ] **Task 2: Create calculationService with core functions** (AC: 5)
  - [ ] Create file `src/services/calculationService.ts`
  - [ ] Import Transaction from models
  - [ ] Import Period from models/Period
  - [ ] Implement `calculateTotalIncome`:
    ```typescript
    export const calculateTotalIncome = (
      transactions: Transaction[],
      period?: Period
    ): number => {
      const filtered = period
        ? transactions.filter(t => t.type === 'income' && isWithinPeriod(t.date, period))
        : transactions.filter(t => t.type === 'income');

      const total = filtered.reduce((sum, t) => sum + t.amount, 0);
      return Math.round(total * 100) / 100; // Round to 2 decimals
    };
    ```
  - [ ] Implement `calculateTotalExpenses` (same logic, filter type === 'expense')
  - [ ] Implement `calculateNetBalance`:
    ```typescript
    export const calculateNetBalance = (
      transactions: Transaction[],
      period?: Period
    ): number => {
      const income = calculateTotalIncome(transactions, period);
      const expenses = calculateTotalExpenses(transactions, period);
      return Math.round((income - expenses) * 100) / 100;
    };
    ```
  - [ ] Implement helper `isWithinPeriod(date: string, period: Period): boolean`
  - [ ] Use date-fns parseISO and isWithinInterval for date comparison

- [ ] **Task 3: Create formatCurrency utility** (AC: 6)
  - [ ] Create file `src/utils/formatCurrency.ts`
  - [ ] Implement formatCurrency function:
    ```typescript
    export const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    };
    ```
  - [ ] Export as named export

- [ ] **Task 4: Create SummaryCards component file and structure** (AC: 1)
  - [ ] Create directory `src/components/dashboard` if not exists
  - [ ] Create file `src/components/dashboard/SummaryCards.tsx`
  - [ ] Import React, useMemo from 'react'
  - [ ] Import useAppContext from context
  - [ ] Import Period from models/Period
  - [ ] Import calculation functions from services/calculationService
  - [ ] Import formatCurrency from utils
  - [ ] Import icons from lucide-react: TrendingUp, TrendingDown, Wallet
  - [ ] Define component props:
    ```typescript
    interface SummaryCardsProps {
      period?: Period;
    }

    export const SummaryCards: React.FC<SummaryCardsProps> = ({ period }) => {
      const { transactions } = useAppContext();
      // Component logic
      return (/* JSX */);
    };
    ```

- [ ] **Task 5: Implement calculation logic in component** (AC: 5, 8)
  - [ ] Get transactions from AppContext
  - [ ] Use useMemo to calculate totalIncome:
    ```typescript
    const totalIncome = useMemo(
      () => calculateTotalIncome(transactions, period),
      [transactions, period]
    );
    ```
  - [ ] Use useMemo for totalExpenses
  - [ ] Use useMemo for netBalance
  - [ ] Memoization dependencies: [transactions, period]

- [ ] **Task 6: Implement Total Income card** (AC: 2)
  - [ ] Create card div with Tailwind classes
  - [ ] Background: white, border, shadow, rounded corners
  - [ ] Display TrendingUp icon with green color
  - [ ] Label: "Total Income"
  - [ ] Amount: {formatCurrency(totalIncome)}
  - [ ] Green accent: text-green-600 or border-green-500
  - [ ] Padding, spacing consistent with other cards

- [ ] **Task 7: Implement Total Expenses card** (AC: 3)
  - [ ] Create card div (same structure as Income card)
  - [ ] Display TrendingDown icon with red color
  - [ ] Label: "Total Expenses"
  - [ ] Amount: {formatCurrency(totalExpenses)}
  - [ ] Red accent: text-red-600 or border-red-500

- [ ] **Task 8: Implement Net Balance card with conditional styling** (AC: 4)
  - [ ] Create card div
  - [ ] Display Wallet icon
  - [ ] Label: "Net Balance"
  - [ ] Amount: {formatCurrency(netBalance)}
  - [ ] Conditional text color based on netBalance:
    ```typescript
    const balanceColorClass =
      netBalance > 0 ? 'text-green-600' :
      netBalance < 0 ? 'text-red-600' :
      'text-gray-600';
    ```
  - [ ] Apply balanceColorClass to amount text
  - [ ] Icon color matches text color

- [ ] **Task 9: Implement responsive grid layout** (AC: 1)
  - [ ] Wrap three cards in container div
  - [ ] Tailwind grid classes:
    - Mobile: `grid grid-cols-1 gap-4` (stacked vertically)
    - Desktop: `md:grid-cols-3` (three columns)
  - [ ] Container padding and max-width
  - [ ] Test at 320px, 768px, 1024px widths

- [ ] **Task 10: Create SummaryCards tests** (AC: 10)
  - [ ] Create file `src/components/dashboard/SummaryCards.test.tsx`
  - [ ] Mock useAppContext to provide test transactions
  - [ ] Test: Renders three cards with correct labels
  - [ ] Test: Total Income displays sum of income transactions
  - [ ] Test: Total Expenses displays sum of expense transactions
  - [ ] Test: Net Balance = Income - Expenses
  - [ ] Test: Amounts formatted as USD currency
  - [ ] Test: Net Balance is green when positive
  - [ ] Test: Net Balance is red when negative
  - [ ] Test: Net Balance is gray when zero
  - [ ] Test: Handles empty transactions array (shows $0.00)
  - [ ] Test: Updates when transactions prop changes
  - [ ] Test: Filters by period when period prop provided
  - [ ] Run tests: npm run test

- [ ] **Task 11: Create calculationService tests** (AC: 11)
  - [ ] Create file `src/services/calculationService.test.ts`
  - [ ] Create test transaction fixtures (mix of income and expenses)
  - [ ] Test calculateTotalIncome:
    - [ ] Returns sum of income transactions
    - [ ] Returns 0 for empty array
    - [ ] Filters by period when provided
    - [ ] Excludes expense transactions
  - [ ] Test calculateTotalExpenses:
    - [ ] Returns sum of expense transactions
    - [ ] Returns 0 for empty array
    - [ ] Filters by period when provided
    - [ ] Excludes income transactions
  - [ ] Test calculateNetBalance:
    - [ ] Returns income - expenses
    - [ ] Handles positive balance
    - [ ] Handles negative balance
    - [ ] Handles zero balance
    - [ ] Filters by period when provided
  - [ ] Test period filtering:
    - [ ] Includes transactions within period
    - [ ] Excludes transactions before period.startDate
    - [ ] Excludes transactions after period.endDate
    - [ ] Handles edge case: transaction on start date (should include)
    - [ ] Handles edge case: transaction on end date (should include)
  - [ ] Test rounding:
    - [ ] Amounts rounded to 2 decimal places
    - [ ] Test with 10.999 → 11.00
    - [ ] Test with 10.001 → 10.00
  - [ ] Verify ≥90% coverage

- [ ] **Task 12: Create formatCurrency tests** (AC: 6)
  - [ ] Create file `src/utils/formatCurrency.test.ts`
  - [ ] Test: formatCurrency(1234.56) returns "$1,234.56"
  - [ ] Test: formatCurrency(0) returns "$0.00"
  - [ ] Test: formatCurrency(-123.45) returns "-$123.45"
  - [ ] Test: formatCurrency(1000000) returns "$1,000,000.00"
  - [ ] Test: formatCurrency(10.1) returns "$10.10" (trailing zero)
  - [ ] Test: formatCurrency(10.999) rounds correctly

- [ ] **Task 13: Integrate SummaryCards in Dashboard page** (AC: 8)
  - [ ] Open or create `src/pages/Dashboard.tsx`
  - [ ] Import SummaryCards component
  - [ ] Render SummaryCards at top of dashboard
  - [ ] Pass period prop if period state exists (undefined for now)
  - [ ] Note: Full period selector integration in Story 4-2

- [ ] **Task 14: Manual testing** (AC: all)
  - [ ] Navigate to Dashboard route
  - [ ] Verify three cards display
  - [ ] Verify amounts match transaction data
  - [ ] Add a new income transaction → verify Total Income updates
  - [ ] Add a new expense transaction → verify Total Expenses updates
  - [ ] Verify Net Balance updates
  - [ ] Test with zero transactions
  - [ ] Test with only income (no expenses)
  - [ ] Test with only expenses (no income)
  - [ ] Verify Net Balance color:
    - [ ] Green when positive
    - [ ] Red when negative
    - [ ] Gray when zero
  - [ ] Test responsive layout:
    - [ ] Mobile (320px): Cards stacked vertically
    - [ ] Desktop (1024px): Cards in 3-column grid

- [ ] **Task 15: TypeScript compilation and verification** (AC: all)
  - [ ] Run `npm run build` or `tsc --noEmit`
  - [ ] Fix any TypeScript errors
  - [ ] Verify all imports resolve correctly
  - [ ] Ensure strict mode compliance
  - [ ] Verify Period interface used correctly

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):
- **Financial Calculations**: All calculations centralized in calculationService.ts
- **Period Filtering**: Use date-fns for date comparisons (isWithinInterval)
- **State Management**: Access transactions via AppContext
- **Performance**: useMemo for expensive calculations
- **Currency Formatting**: Intl.NumberFormat for consistent USD formatting

### Tech Spec Compliance

From [tech-spec-epic-4.md](./tech-spec-epic-4.md):

**Services and Modules:**
| Module | Responsibilities |
|--------|------------------|
| calculationService.ts | Financial calculations and aggregations |
| SummaryCards.tsx | Display financial summary metrics |

**Calculation Service Contracts:**
```typescript
calculateTotalIncome(transactions: Transaction[], period?: Period): number
calculateTotalExpenses(transactions: Transaction[], period?: Period): number
calculateNetBalance(transactions: Transaction[], period?: Period): number
```

**Component Props Interface:**
```typescript
interface SummaryCardsProps {
  period?: Period;  // Optional for Story 4.1, required in future stories
}
```

**Period Interface (Simplified for Story 4.1):**
```typescript
interface Period {
  startDate: string;  // ISO 8601: "2025-11-01"
  endDate: string;    // ISO 8601: "2025-11-30"
}
```

Note: Full Period model with `type` and `label` fields will be added in Story 4-2.

**Workflows and Sequencing:**
1. Dashboard.tsx mounts
2. SummaryCards renders
3. useContext retrieves transactions[]
4. useMemo calculates: totalIncome, totalExpenses, netBalance
5. formatCurrency formats amounts for display
6. Cards render with formatted values

**Performance Requirements:**
- Calculations complete in <50ms for up to 1000 transactions
- useMemo prevents recalculation on unrelated state changes
- Component re-renders only when transactions or period changes

### Project Structure Notes

**Files to Create:**
```
src/
├── models/
│   └── Period.ts                          (NEW - simplified Period interface)
├── services/
│   ├── calculationService.ts              (NEW - financial calculations)
│   └── calculationService.test.ts         (NEW - service tests)
├── utils/
│   ├── formatCurrency.ts                  (NEW - currency formatting)
│   └── formatCurrency.test.ts             (NEW - utility tests)
├── components/
│   └── dashboard/
│       ├── SummaryCards.tsx               (NEW - summary cards component)
│       └── SummaryCards.test.tsx          (NEW - component tests)
└── pages/
    └── Dashboard.tsx                      (NEW or MODIFIED - dashboard page)
```

**Dependencies:**
- date-fns (already installed): For period date filtering
- lucide-react (already installed): For icons (TrendingUp, TrendingDown, Wallet)
- React Context: Access transactions from AppContext

**Currency Formatting:**
```typescript
// Use Intl.NumberFormat for consistent formatting
const formatted = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(1234.56);
// Result: "$1,234.56"
```

**Date Filtering Logic:**
```typescript
import { parseISO, isWithinInterval } from 'date-fns';

const isWithinPeriod = (date: string, period: Period): boolean => {
  const transactionDate = parseISO(date);
  const start = parseISO(period.startDate);
  const end = parseISO(period.endDate);

  return isWithinInterval(transactionDate, { start, end });
};
```

### Testing Strategy

From [tech-spec-epic-4.md](./tech-spec-epic-4.md#test-strategy-summary):

**Unit Testing - calculationService:**
- Test all calculation functions with various transaction datasets
- Test period filtering with different date ranges
- Test edge cases: empty arrays, zero amounts, large numbers
- Test rounding accuracy
- Target: ≥90% coverage

**Component Testing - SummaryCards:**
- Test rendering with mock transaction data
- Test currency formatting display
- Test Net Balance color changes
- Test period prop filtering
- Test real-time updates on transaction changes
- Target: ≥85% coverage

**Integration Testing:**
- Test SummaryCards integration with AppContext
- Test memoization prevents unnecessary recalculations
- Test updates when transactions change in context

**Testing Tools:**
- Vitest for test runner
- React Testing Library for component tests
- vi.mock() for mocking AppContext

### Learnings from Previous Stories

**From Story 3.5: Transaction Filtering & Search (Status: drafted)**

- **AppContext Pattern**: Add new state fields to AppContext interface and reducer
- **localStorage Sync**: Follow pattern for persisting state across sessions
- **useMemo Optimization**: Use useMemo for expensive calculations with proper dependencies
- **Utility Functions**: Extract reusable logic to utils/ directory
- **Test Coverage**: Aim for ≥85% component coverage, ≥90% for critical services

**Implementation Pattern from 3.5:**
```typescript
// AppContext already has transactions array
const { transactions } = useAppContext();

// Use useMemo for calculations
const totalIncome = useMemo(
  () => calculateTotalIncome(transactions, period),
  [transactions, period]
);
```

[Source: .bmad-ephemeral/stories/3-5-transaction-filtering-search.md#Dev-Notes]

**From Story 2.4: Set Up Global State Management (Status: done)**

- **AppContext Structure**: Use existing AppContext to access transactions
- **State Access**: Components consume context via useAppContext hook
- **Performance**: Context changes trigger re-renders in consuming components
- **Type Safety**: AppContext is fully typed with TypeScript interfaces

[Source: Previous Epic 2 learnings]

### References

- [PRD.md - FR-3.1 Summary Statistics](../../docs/PRD.md#fr-3-dashboard--analytics) - Summary statistics requirements
- [architecture.md - Financial Calculation Patterns](../../docs/architecture.md#financial-calculation-patterns) - Calculation formulas and standards
- [tech-spec-epic-4.md - Services and Modules](./tech-spec-epic-4.md#services-and-modules) - calculationService and SummaryCards specifications
- [tech-spec-epic-4.md - Data Models](./tech-spec-epic-4.md#data-models-and-contracts) - Period interface definition
- [tech-spec-epic-4.md - Acceptance Criteria AC-1](./tech-spec-epic-4.md#ac-1-summary-statistics-display) - Story 4.1 ACs from epic tech spec
- [tech-spec-epic-4.md - Story Breakdown 4-1](./tech-spec-epic-4.md#story-breakdown-for-epic-4) - Original story definition from tech spec

## Dev Agent Record

### Context Reference

- `.bmad-ephemeral/stories/4-1-summary-statistics-cards.context.xml` (Generated: 2025-11-15)

### Agent Model Used

Claude Sonnet 4.5 (model ID: claude-sonnet-4-5-20250929)

### Debug Log References

No critical issues encountered. Minor test adjustments made to handle multiple elements with same text content using `getAllByText()` instead of `getByText()` when testing formatted amounts.

### Completion Notes List

**calculationService Implementation:**
- Implemented three core functions: `calculateTotalIncome`, `calculateTotalExpenses`, `calculateNetBalance`
- Used `date-fns` (parseISO, isWithinInterval) for period date filtering
- All calculations round to 2 decimal places using `Math.round(value * 100) / 100` formula
- Helper function `isWithinPeriod` encapsulates date comparison logic
- Handles empty arrays correctly (returns 0)
- Type-only imports for Transaction and Period interfaces

**Currency Formatting:**
- Used `Intl.NumberFormat` with 'en-US' locale and USD currency
- Format: $1,234.56 (dollar sign, comma thousands separator, 2 decimals)
- Handles negative amounts (-$123.45), zero ($0.00), and large numbers ($1,000,000.00)
- Single utility function exported from `src/utils/formatCurrency.ts`

**SummaryCards Component:**
- Three cards layout: Total Income (green/TrendingUp), Total Expenses (red/TrendingDown), Net Balance (conditional/Wallet)
- Responsive grid: `grid-cols-1` mobile, `md:grid-cols-3` desktop (≥768px)
- useMemo for all calculations with dependencies `[transactions, period]`
- Conditional styling for Net Balance: green (>0), red (<0), gray (=0)
- Accepts optional `period?: Period` prop for future period filtering integration
- Consumes transactions via `useAppContext()` hook

**Testing Results:**
- All 50 tests pass (223 total across project)
- SummaryCards.tsx: 100% coverage (exceeds ≥85% target)
- calculationService.ts: 100% coverage (exceeds ≥90% target)
- formatCurrency.ts: 100% coverage
- Tests cover: rendering, currency formatting, color changes, period filtering, edge cases, real-time updates
- Test adjustments: Used `getAllByText()` for amounts appearing in multiple cards

**Integration:**
- Dashboard.tsx updated to import and render SummaryCards component
- Dev server running successfully on http://localhost:5175
- All TypeScript type-only imports used correctly (verbatimModuleSyntax compliance)
- No blocking TypeScript errors in new files

### File List

**NEW:**
- `smartbudget/src/models/Period.ts` - Period interface (already existed with full model, not simplified version)
- `smartbudget/src/services/calculationService.ts` - Financial calculation service with three core functions
- `smartbudget/src/services/calculationService.test.ts` - 25 comprehensive tests for calculation service (100% coverage)
- `smartbudget/src/utils/formatCurrency.ts` - Currency formatting utility using Intl.NumberFormat
- `smartbudget/src/utils/formatCurrency.test.ts` - 12 tests for currency formatting (100% coverage)
- `smartbudget/src/components/dashboard/SummaryCards.tsx` - SummaryCards component with responsive grid layout (100% coverage)
- `smartbudget/src/components/dashboard/SummaryCards.test.tsx` - 13 component tests covering all acceptance criteria

**MODIFIED:**
- `smartbudget/src/pages/Dashboard.tsx` - Added SummaryCards import and rendering

**DELETED:**
- (None)

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob) with Epic 4 tech spec context and learnings from Story 3.5 (AppContext patterns, useMemo optimization, testing standards)
- 2025-11-15: Story implemented by Dev agent (Amelia). All 11 acceptance criteria satisfied. 50 tests passing with 100% coverage on all new files. Dev server running successfully. Ready for code review.
