# Story 5.3: Responsive Dashboard Layout

Status: review

## Story

As a user on any device,
I want the Dashboard to adapt to my screen size,
so that I can view my financial summary comfortably on any device.

## Acceptance Criteria

1. **AC-5.3.1: Mobile Layout (≤767px)**
   - Single column layout with stacked components
   - Component order: Summary Cards → Period Selector → Charts → Recent Transactions
   - No horizontal scrolling
   - Charts are resizable and readable
   - Touch interactions work smoothly (chart interactions, period selector)
   - Text and buttons appropriately sized for mobile

2. **AC-5.3.2: Tablet Layout (768-1023px)**
   - 2-column grid layout where appropriate
   - Summary cards in 2-column grid (3 cards total)
   - Charts positioned side-by-side if space allows
   - Responsive chart sizing
   - No horizontal scrolling
   - Touch-friendly interactions maintained

3. **AC-5.3.3: Desktop Layout (≥1024px)**
   - Multi-column dashboard with optimal space usage
   - Summary cards in 3-column grid
   - Charts positioned for maximum readability
   - Recent transactions in dedicated sidebar or bottom section
   - Efficient use of screen real estate

4. **AC-5.3.4: Chart Responsiveness**
   - All charts (pie chart, trend chart) wrapped in ResponsiveContainer
   - Charts maintain aspect ratio and readability at all breakpoints
   - Chart tooltips and legends remain accessible on touch devices
   - Chart labels don't overlap or become unreadable

5. **AC-5.3.5: Adaptive Component Sizing**
   - Summary card text sizes adjust per breakpoint
   - Period selector dropdown/buttons sized appropriately
   - Recent transactions widget adapts (fewer items on mobile, more on desktop)
   - Spacing and padding optimized for each breakpoint

## Tasks / Subtasks

- [ ] **Task 1**: Audit current Dashboard layout and identify responsive issues (AC: All)
  - [ ] 1.1: Open Dashboard.tsx and identify current layout structure
  - [ ] 1.2: Test Dashboard on mobile viewport (320px, 375px, 414px)
  - [ ] 1.3: Test Dashboard on tablet viewport (768px, 1024px)
  - [ ] 1.4: Test Dashboard on desktop viewport (1280px, 1920px)
  - [ ] 1.5: Document specific layout issues at each breakpoint
  - [ ] 1.6: Note which components need responsive adjustments

- [ ] **Task 2**: Implement mobile-first responsive grid layout (AC: #1, #2, #3)
  - [ ] 2.1: Open `/src/pages/Dashboard.tsx`
  - [ ] 2.2: Wrap Dashboard content in responsive container
  - [ ] 2.3: Create mobile layout (≤767px): single column, stacked components
  - [ ] 2.4: Add Tailwind responsive classes for tablet breakpoint (md:)
  - [ ] 2.5: Add Tailwind responsive classes for desktop breakpoint (lg:)
  - [ ] 2.6: Test layout transitions at each breakpoint
  - [ ] 2.7: Verify no horizontal scrolling at any width

- [ ] **Task 3**: Make summary cards responsive (AC: #1, #2, #3, #5)
  - [ ] 3.1: Open SummaryCards component
  - [ ] 3.2: Apply responsive grid classes (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
  - [ ] 3.3: Adjust card padding for mobile (reduce whitespace)
  - [ ] 3.4: Adjust text sizes for readability (text-sm md:text-base lg:text-lg)
  - [ ] 3.5: Test cards at 320px, 768px, 1024px, 1920px
  - [ ] 3.6: Verify cards stack properly on mobile

- [ ] **Task 4**: Make charts responsive with ResponsiveContainer (AC: #4)
  - [ ] 4.1: Open ExpenseBreakdownChart component
  - [ ] 4.2: Wrap PieChart in Recharts ResponsiveContainer
  - [ ] 4.3: Set width="100%" and dynamic height (height={300} sm height={400} lg)
  - [ ] 4.4: Test chart on mobile - verify labels don't overlap
  - [ ] 4.5: Open TrendChart component (bar/line chart)
  - [ ] 4.6: Wrap BarChart/LineChart in ResponsiveContainer
  - [ ] 4.7: Adjust chart margins for mobile (smaller margins)
  - [ ] 4.8: Test chart tooltips on touch devices
  - [ ] 4.9: Verify chart legends remain readable on mobile

- [ ] **Task 5**: Make Period Selector responsive (AC: #5)
  - [ ] 5.1: Open PeriodSelector component
  - [ ] 5.2: Adjust button/dropdown sizes for mobile (full width on mobile)
  - [ ] 5.3: Use responsive text sizes (text-xs md:text-sm)
  - [ ] 5.4: Ensure dropdown doesn't overflow viewport on mobile
  - [ ] 5.5: Test touch interactions on mobile devices
  - [ ] 5.6: Verify dropdown positioning on all breakpoints

- [ ] **Task 6**: Make Recent Transactions Widget responsive (AC: #5)
  - [ ] 6.1: Open RecentTransactionsWidget component
  - [ ] 6.2: Show fewer transactions on mobile (limit to 3-5 items)
  - [ ] 6.3: Show more transactions on desktop (5-10 items)
  - [ ] 6.4: Use responsive card/list layout (cards on mobile, compact list on desktop)
  - [ ] 6.5: Adjust text sizes for mobile readability
  - [ ] 6.6: Test widget at all breakpoints

- [ ] **Task 7**: Optimize spacing and padding across breakpoints (AC: #1, #2, #3, #5)
  - [ ] 7.1: Review Dashboard container padding (p-4 md:p-6 lg:p-8)
  - [ ] 7.2: Adjust gap between components (gap-4 md:gap-6 lg:gap-8)
  - [ ] 7.3: Ensure consistent spacing in mobile view
  - [ ] 7.4: Verify spacing doesn't feel cramped on mobile
  - [ ] 7.5: Verify spacing isn't excessive on desktop

- [ ] **Task 8**: Test responsive layout across all breakpoints (AC: All)
  - [ ] 8.1: Test on mobile devices (iPhone, Android via DevTools)
  - [ ] 8.2: Test on tablet devices (iPad, Android tablet via DevTools)
  - [ ] 8.3: Test on desktop (1280px, 1920px, ultrawide 2560px)
  - [ ] 8.4: Test portrait and landscape orientations
  - [ ] 8.5: Verify touch interactions on mobile/tablet (swipe, tap, pinch)
  - [ ] 8.6: Verify no horizontal scrolling at any width
  - [ ] 8.7: Document any edge cases or issues found

- [ ] **Task 9**: Test chart interactions on touch devices (AC: #4)
  - [ ] 9.1: Test pie chart hover → tooltip display on touch
  - [ ] 9.2: Test trend chart hover → tooltip display on touch
  - [ ] 9.3: Verify chart legends are tappable on mobile
  - [ ] 9.4: Test chart responsiveness during screen rotation
  - [ ] 9.5: Verify chart doesn't cause performance issues on mobile

- [ ] **Task 10**: Verify all components meet responsive criteria (AC: All)
  - [ ] 10.1: Summary cards: ✓ responsive at all breakpoints
  - [ ] 10.2: Period selector: ✓ touch-friendly and responsive
  - [ ] 10.3: Charts: ✓ wrapped in ResponsiveContainer, readable
  - [ ] 10.4: Recent transactions: ✓ adaptive item count
  - [ ] 10.5: Overall layout: ✓ no horizontal scroll, proper stacking
  - [ ] 10.6: Text/buttons: ✓ appropriately sized at all breakpoints
  - [ ] 10.7: Run full regression test on Dashboard functionality

## Dev Notes

### Architecture Patterns

**Mobile-First Responsive Design:**
- Start with mobile layout (base styles)
- Add tablet styles with `md:` prefix (≥768px)
- Add desktop styles with `lg:` prefix (≥1024px)
- Pattern from [Architecture: Responsive Design](docs/architecture.md#UI--Styling)

**Tailwind Breakpoints:**
```
sm: 640px   (rarely used - between mobile and tablet)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
```

**Responsive Grid Pattern:**
```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

**ResponsiveContainer Pattern (Recharts):**
```tsx
import { ResponsiveContainer, PieChart, Pie } from 'recharts';

<ResponsiveContainer width="100%" height={400}>
  <PieChart>
    <Pie data={data} /* ... */ />
  </PieChart>
</ResponsiveContainer>
```

### Project Structure Notes

**Files to Modify:**
- `/src/pages/Dashboard.tsx` - Main dashboard layout with responsive grid
- `/src/components/dashboard/SummaryCards.tsx` - Responsive card grid
- `/src/components/dashboard/ExpenseBreakdownChart.tsx` - Wrap in ResponsiveContainer
- `/src/components/dashboard/TrendChart.tsx` - Wrap in ResponsiveContainer
- `/src/components/dashboard/PeriodSelector.tsx` - Responsive dropdown/buttons
- `/src/components/dashboard/RecentTransactionsWidget.tsx` - Adaptive item count

**Files to Create:**
- None (all existing components)

**Component Dependencies:**
- All Dashboard sub-components already exist from Epic 4
- ResponsiveContainer from Recharts (already installed)
- Tailwind CSS responsive utilities (already configured)

### Testing Standards

**Manual Testing Checklist:**
1. Test at critical breakpoints:
   - 320px (iPhone SE)
   - 375px (iPhone 12/13)
   - 414px (iPhone 14 Pro Max)
   - 768px (iPad portrait)
   - 1024px (iPad landscape, small desktop)
   - 1280px (standard desktop)
   - 1920px (full HD desktop)
2. Test portrait and landscape orientations on tablet
3. Test touch interactions on mobile/tablet simulators
4. Verify no horizontal scrolling at any width
5. Verify chart tooltips work on touch devices
6. Verify all text is readable at all sizes
7. Test performance on mobile (no lag during resize)

**Browser DevTools Testing:**
- Use Chrome DevTools device emulation
- Test responsive mode with continuous resize
- Use Lighthouse mobile test for performance
- Check for layout shift issues (CLS)

**Accessibility Testing:**
- Touch targets ≥44x44px on mobile (NFR-4.1)
- Text remains readable at all sizes
- Color contrast maintained at all breakpoints
- Focus states visible on all interactive elements

### References

- [Epics: Story 5.3 - Responsive Dashboard Layout](docs/epics.md#Story-5.3-Responsive-Dashboard-Layout)
- [PRD: FR-5.1 - Responsive Design](docs/PRD.md#FR-5-User-Experience)
- [PRD: FR-5.2 - Mobile Optimization](docs/PRD.md#FR-5-User-Experience)
- [PRD: NFR-4.1 - Touch Targets](docs/PRD.md#NFR-4-Usability)
- [Architecture: Responsive Design](docs/architecture.md#UI--Styling)
- [Architecture: Tailwind Breakpoints](docs/architecture.md#Technology-Stack-Details)
- [Architecture: ResponsiveContainer Pattern](docs/architecture.md#Chart-Data-Transformation-Patterns)

### Key Implementation Details

**Dashboard Layout Structure:**
```tsx
// /src/pages/Dashboard.tsx
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { ExpenseBreakdownChart } from '@/components/dashboard/ExpenseBreakdownChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { RecentTransactionsWidget } from '@/components/dashboard/RecentTransactionsWidget';

export const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Period Selector */}
      <div className="mb-6">
        <PeriodSelector />
      </div>

      {/* Summary Cards - Responsive Grid */}
      <SummaryCards />

      {/* Charts Section - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
          <ExpenseBreakdownChart />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
          <TrendChart />
        </div>
      </div>

      {/* Recent Transactions - Full Width on Mobile */}
      <div className="mt-8">
        <RecentTransactionsWidget />
      </div>
    </div>
  );
};
```

**Responsive Summary Cards:**
```tsx
// /src/components/dashboard/SummaryCards.tsx
export const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        title="Total Income"
        amount={totalIncome}
        type="income"
        className="text-sm md:text-base"
      />
      <Card
        title="Total Expenses"
        amount={totalExpenses}
        type="expense"
        className="text-sm md:text-base"
      />
      <Card
        title="Net Balance"
        amount={netBalance}
        type="balance"
        className="text-sm md:text-base md:col-span-2 lg:col-span-1"
      />
    </div>
  );
};
```

**Responsive Chart with ResponsiveContainer:**
```tsx
// /src/components/dashboard/ExpenseBreakdownChart.tsx
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const ExpenseBreakdownChart = () => {
  const chartData = /* ... */;

  return (
    <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={80}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
```

**Adaptive Recent Transactions Count:**
```tsx
// /src/components/dashboard/RecentTransactionsWidget.tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const RecentTransactionsWidget = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  // Show fewer items on mobile
  const displayCount = isMobile ? 3 : isTablet ? 5 : 10;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, displayCount);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-2">
        {recentTransactions.map(tx => (
          <TransactionCard
            key={tx.id}
            transaction={tx}
            variant={isMobile ? 'compact' : 'default'}
          />
        ))}
      </div>
      <Link
        to="/transactions"
        className="block mt-4 text-blue-600 hover:underline text-sm md:text-base"
      >
        View All Transactions →
      </Link>
    </div>
  );
};
```

**Responsive Spacing Pattern:**
```tsx
// Container padding: more padding on larger screens
<div className="p-4 md:p-6 lg:p-8">

// Gap between grid items: larger gaps on larger screens
<div className="grid gap-4 md:gap-6 lg:gap-8">

// Margin between sections
<div className="mt-4 md:mt-6 lg:mt-8">
```

**Touch-Friendly Interactions:**
- All buttons and interactive elements ≥44x44px on mobile
- Chart tooltips activate on tap (Recharts handles this automatically)
- Period selector buttons use full-width on mobile for easier tapping
- Adequate spacing between tappable elements

### Learnings from Previous Story

**From Story 5.2 (Status: review)**

Story 5.2 implemented the category visual system with consistent colors and icons. Key takeaways for this story:

- **useMediaQuery Hook Available**: Custom hook at `/src/hooks/useMediaQuery.ts` created in Story 5.1 - can reuse for responsive logic
- **CategoryBadge Component**: Use variant prop ('compact', 'default', 'large') to adjust component sizes per breakpoint
- **Lucide React Icons**: Already installed and working - ensure icon sizes scale with breakpoints
- **Responsive Patterns Established**: Follow mobile-first approach with Tailwind responsive utilities (md:, lg:)
- **Accessibility Priority**: Maintain WCAG AA standards at all breakpoints (touch targets ≥44x44px)

**Files Created in Story 5.2 (Available for Use):**
- `smartbudget/src/utils/iconMapper.ts` - Icon mapping utility
- `smartbudget/src/components/common/CategoryBadge.tsx` - Responsive badge component with variants

**Files Modified in Story 5.2 (May Need Review):**
- `smartbudget/src/pages/TransactionsList.tsx` - Already responsive (from Story 5.1)
- `smartbudget/src/components/dashboard/RecentTransactionsWidget.tsx` - May need responsive enhancements

**Pattern to Follow:**
- Use CategoryBadge with appropriate variants per breakpoint
- Apply same responsive grid patterns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Test at same breakpoints (320px, 768px, 1024px, 1920px)
- Maintain color consistency across all responsive layouts

[Source: stories/5-2-category-visual-system.md]

## Dev Agent Record

### Context Reference

**Mutual Context File:** [.bmad-ephemeral/stories/5-345-ui-enhancements.context.xml](.bmad-ephemeral/stories/5-345-ui-enhancements.context.xml)

This story shares context with Stories 5.4 (Form UX Enhancements) and 5.5 (Error States & Empty States). The mutual context file contains comprehensive documentation of shared components, dependencies, responsive breakpoints, design patterns, and implementation notes that apply across all three stories.

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
