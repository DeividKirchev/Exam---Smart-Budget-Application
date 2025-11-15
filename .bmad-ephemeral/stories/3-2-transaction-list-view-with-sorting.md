# Story 3.2: Transaction List View with Sorting

Status: ready-for-dev

## Story

As a user,
I want to see all my transactions in a list,
so that I can review my financial history.

## Acceptance Criteria

1. **TransactionsList Page Component Created**
   - File created at `src/pages/TransactionsList.tsx`
   - Component fetches transactions from AppContext via `useAppContext()` hook
   - Displays all transactions in a structured list/table format
   - Includes navigation to add new transaction
   - All exports have comprehensive JSDoc comments

2. **Transaction Data Display**
   - Each transaction displays the following fields:
     - Date (formatted: MM/DD/YYYY or localized format)
     - Description (truncated if too long on mobile)
     - Category (with visual indicator: color badge/icon)
     - Amount (with currency symbol $, formatted to 2 decimals)
     - Type indicator (Income/Expense badge or icon)
   - Amounts are color-coded: Green for income, Red/Orange for expenses
   - Category colors match the category color scheme from Story 2.3

3. **Default Sorting**
   - Transactions sorted by date (most recent first) by default
   - Sort order is descending (newest → oldest)
   - Default sort applied automatically on component mount

4. **Column Header Sorting**
   - Clickable column headers for: Date, Amount, Category
   - First click on header: Sort ascending by that column
   - Second click on same header: Toggle to descending
   - Third click: Return to default sort (date descending)
   - Visual indicator shows current sort column and direction (arrow up/down icon)
   - Only one column sorted at a time

5. **Empty State Handling**
   - When no transactions exist (transactions.length === 0):
     - Display helpful message: "No transactions yet. Add your first transaction!"
     - Show prominent "Add Transaction" button/link
     - Use empty state illustration or icon (optional)
   - Empty state is visually centered and friendly

6. **Responsive Layout**
   - Desktop (≥768px): Table layout with columns for Date, Description, Category, Amount, Type
   - Tablet (768-1023px): Compact table or card layout
   - Mobile (<768px): Card-based layout, one transaction per card
   - All layouts show the same data, just formatted differently
   - Touch-friendly tap targets on mobile (min 44x44px)

7. **Transaction Actions**
   - Each transaction row/card has action buttons:
     - Edit button (pencil icon) - navigates to edit page (Story 3.3)
     - Delete button (trash icon) - triggers delete with confirmation (Story 3.4)
   - Action buttons are always visible on desktop
   - On mobile, actions may be in overflow menu or always visible
   - Icons use Lucide React icon library

8. **"Add Transaction" Button**
   - Prominent "Add Transaction" button at top of page
   - Button navigates to `/transactions/new` route (Story 3.1 form)
   - Button uses primary styling (prominent, calls to action)
   - Always visible and accessible

9. **Loading State**
   - Show loading spinner/skeleton while transactions are being fetched
   - Use AppContext `loading` state to determine loading status
   - Loading state appears on initial mount while data loads from localStorage
   - Graceful transition from loading to displaying data

10. **Error Handling**
    - If AppContext has error state, display error message
    - Error message is user-friendly: "Unable to load transactions. Please try again."
    - Provide "Retry" button that calls `refreshData()` from AppContext
    - Error state doesn't break the page layout

11. **Page Header and Navigation**
    - Page title: "Transactions"
    - Breadcrumb or back button (optional, depends on nav pattern)
    - Consistent with app layout from Story 1.4

12. **Unit Tests for TransactionsList**
    - Test file created at `src/pages/TransactionsList.test.tsx`
    - Test component renders with transaction data
    - Test empty state displays when no transactions
    - Test default sort by date descending
    - Test column header sorting (click to sort, toggle direction)
    - Test sort direction indicator updates
    - Test responsive layout classes applied
    - Test color coding for income (green) and expense (red)
    - Test "Add Transaction" button navigates to /transactions/new
    - Test loading state displays while loading=true
    - Test error state displays when error exists
    - Coverage target: ≥85% for TransactionsList.tsx

## Tasks / Subtasks

- [ ] **Task 1: Create page component file and imports** (AC: 1)
  - [ ] Create file `src/pages/TransactionsList.tsx`
  - [ ] Import React, useState, useEffect, useMemo
  - [ ] Import useAppContext from context/AppContext
  - [ ] Import useNavigate from react-router-dom
  - [ ] Import Transaction type from models
  - [ ] Import Lucide icons: Plus, Edit, Trash2, ArrowUp, ArrowDown
  - [ ] Add JSDoc module comment

- [ ] **Task 2: Set up component state and context** (AC: 1, 9)
  - [ ] Get transactions, loading, error, refreshData from useAppContext()
  - [ ] Create state for sortColumn: 'date' | 'amount' | 'category'
  - [ ] Create state for sortDirection: 'asc' | 'desc'
  - [ ] Initialize sortColumn='date', sortDirection='desc' (default sort)

- [ ] **Task 3: Implement sorting logic** (AC: 3, 4)
  - [ ] Create sortTransactions(transactions, column, direction) function
  - [ ] Handle date sorting: compare date strings or parse to Date objects
  - [ ] Handle amount sorting: compare numeric values
  - [ ] Handle category sorting: alphabetical by category name
  - [ ] Use useMemo to compute sorted transactions: `const sortedTransactions = useMemo(() => sortTransactions(transactions, sortColumn, sortDirection), [transactions, sortColumn, sortDirection]);`
  - [ ] Ensure sort is stable (maintains relative order for equal elements)

- [ ] **Task 4: Implement column header click handler** (AC: 4)
  - [ ] Create handleSort(column) function
  - [ ] If column === sortColumn: toggle direction (asc ↔ desc)
  - [ ] If column !== sortColumn: set sortColumn=column, sortDirection='asc'
  - [ ] Update state with new sort column and direction

- [ ] **Task 5: Render page header** (AC: 1, 8, 11)
  - [ ] Render page title "Transactions"
  - [ ] Add "Add Transaction" button with Plus icon
  - [ ] Button onClick: navigate('/transactions/new')
  - [ ] Style button as primary call-to-action
  - [ ] Position button in header (right side, prominent)

- [ ] **Task 6: Render loading state** (AC: 9)
  - [ ] Check if loading === true
  - [ ] If loading, render loading spinner or skeleton UI
  - [ ] Use Tailwind spinner classes or custom spinner component
  - [ ] Show "Loading transactions..." message
  - [ ] Return early from render (don't show list while loading)

- [ ] **Task 7: Render error state** (AC: 10)
  - [ ] Check if error !== null
  - [ ] If error, render error message: "Unable to load transactions. Please try again."
  - [ ] Add "Retry" button that calls refreshData()
  - [ ] Style error message clearly (red text, warning icon)
  - [ ] Return early from render (don't show list if error)

- [ ] **Task 8: Render empty state** (AC: 5)
  - [ ] Check if sortedTransactions.length === 0 (after loading complete, no error)
  - [ ] If empty, render:
    - [ ] Message: "No transactions yet. Add your first transaction!"
    - [ ] "Add Transaction" button navigating to /transactions/new
    - [ ] Optional: Empty state icon or illustration
  - [ ] Center empty state content
  - [ ] Return early from render (don't show table if empty)

- [ ] **Task 9: Render desktop table layout** (AC: 2, 6)
  - [ ] Create table element with proper semantic HTML
  - [ ] Table headers: Date, Description, Category, Amount, Type, Actions
  - [ ] Make headers clickable for Date, Amount, Category
  - [ ] Add sort direction indicator (ArrowUp/ArrowDown icon) to active sort column
  - [ ] Map over sortedTransactions to render table rows
  - [ ] Apply responsive classes: `hidden md:table` (hide on mobile, show on desktop)

- [ ] **Task 10: Render table rows (desktop)** (AC: 2, 7)
  - [ ] For each transaction, render table row with:
    - [ ] Date cell: format date as MM/DD/YYYY using date-fns format()
    - [ ] Description cell: transaction.description
    - [ ] Category cell: category name with color badge (use category.color)
    - [ ] Amount cell: format as $XX.XX, color green if income, red if expense
    - [ ] Type cell: badge "Income" or "Expense" with appropriate color
    - [ ] Actions cell: Edit button (Edit icon), Delete button (Trash icon)
  - [ ] Edit button onClick: navigate(`/transactions/${transaction.id}/edit`)
  - [ ] Delete button onClick: trigger delete handler (placeholder for Story 3.4)

- [ ] **Task 11: Render mobile card layout** (AC: 2, 6)
  - [ ] Create card-based layout for mobile: `<div className="md:hidden">`
  - [ ] Map over sortedTransactions to render cards
  - [ ] Each card displays:
    - [ ] Date at top
    - [ ] Description (bold or prominent)
    - [ ] Category badge with color
    - [ ] Amount (large, color-coded)
    - [ ] Type badge
    - [ ] Action buttons (Edit, Delete)
  - [ ] Use Tailwind card styling: border, padding, shadow, rounded corners
  - [ ] Stack cards vertically with spacing

- [ ] **Task 12: Implement color coding** (AC: 2)
  - [ ] Create helper function getAmountColor(type): returns 'text-green-600' if income, 'text-red-600' if expense
  - [ ] Apply to amount display in both table and card layouts
  - [ ] Ensure sufficient contrast for accessibility (WCAG AA)

- [ ] **Task 13: Integrate category visuals** (AC: 2)
  - [ ] Import getCategoryById from constants/categories
  - [ ] For each transaction, look up category: `const category = getCategoryById(transaction.category)`
  - [ ] Render category badge with:
    - [ ] Background color: category.color (lighter shade)
    - [ ] Text: category.name
    - [ ] Optional icon: category.icon
  - [ ] Use Tailwind for badge styling: `px-2 py-1 rounded-full text-xs`

- [ ] **Task 14: Style with Tailwind CSS** (AC: 6)
  - [ ] Apply responsive table styles for desktop
  - [ ] Apply card styles for mobile
  - [ ] Use Tailwind breakpoints: `md:` for tablet/desktop, default for mobile
  - [ ] Ensure touch targets min 44x44px on mobile (buttons, headers)
  - [ ] Add hover states for clickable elements
  - [ ] Use consistent spacing and typography

- [ ] **Task 15: Add route in App.tsx** (AC: 1)
  - [ ] Open `src/App.tsx`
  - [ ] Add route: `<Route path="/transactions" element={<TransactionsList />} />`
  - [ ] Import TransactionsList component
  - [ ] Verify route works by navigating to /transactions

- [ ] **Task 16: Create unit tests** (AC: 12)
  - [ ] Create file `src/pages/TransactionsList.test.tsx`
  - [ ] Mock useAppContext hook with test data
  - [ ] Mock useNavigate hook
  - [ ] Test: Component renders with transaction data
  - [ ] Test: Displays all transaction fields correctly
  - [ ] Test: Empty state renders when transactions array is empty
  - [ ] Test: Loading state renders when loading=true
  - [ ] Test: Error state renders when error is set
  - [ ] Test: Default sort is date descending
  - [ ] Test: Clicking date header sorts by date
  - [ ] Test: Clicking amount header sorts by amount
  - [ ] Test: Clicking category header sorts by category
  - [ ] Test: Toggling sort direction on repeated header clicks
  - [ ] Test: Sort direction indicator displays correctly
  - [ ] Test: Income amounts display in green
  - [ ] Test: Expense amounts display in red
  - [ ] Test: "Add Transaction" button navigates to /transactions/new
  - [ ] Test: Edit button navigates to /transactions/:id/edit
  - [ ] Test: Category badge displays with correct color
  - [ ] Test: Responsive classes applied (table on desktop, cards on mobile)
  - [ ] Run tests: npm run test
  - [ ] Verify ≥85% coverage

- [ ] **Task 17: Manual testing** (AC: all)
  - [ ] Test with no transactions (empty state)
  - [ ] Test with 1 transaction
  - [ ] Test with 10+ transactions
  - [ ] Test sorting by each column
  - [ ] Test toggling sort direction
  - [ ] Test on desktop viewport (≥768px)
  - [ ] Test on mobile viewport (<768px)
  - [ ] Test "Add Transaction" button navigation
  - [ ] Test Edit button navigation (placeholder)
  - [ ] Verify colors match design (income green, expense red)
  - [ ] Verify category badges use correct colors

- [ ] **Task 18: TypeScript compilation and verification** (AC: 1)
  - [ ] Run `npm run build` or `tsc --noEmit`
  - [ ] Fix any TypeScript errors
  - [ ] Verify all imports resolve correctly
  - [ ] Ensure strict mode compliance

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):
- **Page Component Pattern**: TransactionsList is a page component in src/pages/
- **State Management**: Uses AppContext via useAppContext() hook for transaction data
- **Routing**: React Router route /transactions
- **Styling**: Tailwind CSS for responsive design
- **Responsive Strategy**: Mobile-first, card layout on mobile, table on desktop

### Tech Spec Compliance

From [tech-spec-epic-3.md](../tech-spec-epic-3.md):

**TransactionList Component Specification:**
- Fetches transactions from global state (AppContext)
- Implements client-side sorting with toggle functionality
- Responsive layout: table on desktop, cards on mobile
- Color-coded amounts: green for income, red for expenses
- Empty state with helpful messaging
- Loading and error states
- Integration with category visual system (Story 2.3)

**Sorting Implementation:**
- Default: Date descending (most recent first)
- Sortable columns: Date, Amount, Category
- Toggle behavior: First click asc, second click desc, third click default
- Visual indicator (arrow icon) shows active sort column and direction

**Responsive Breakpoints (from architecture):**
- Mobile: <768px (card layout)
- Tablet: 768-1023px (compact table or cards)
- Desktop: ≥1024px (full table layout)

### Project Structure Notes

**Files to Create:**
```
src/
├── pages/
│   ├── TransactionsList.tsx           (NEW - main list page)
│   └── TransactionsList.test.tsx      (NEW - unit tests)
```

**Files to Modify:**
```
src/
└── App.tsx                             (MODIFIED - add /transactions route)
```

**Dependencies from Previous Stories:**
- `src/models/Transaction.ts` - Transaction type (Story 2.1)
- `src/models/Category.ts` - Category type (Story 2.1)
- `src/context/AppContext.tsx` - useAppContext hook, transactions state (Story 2.4)
- `src/constants/categories.ts` - getCategoryById, category colors (Story 2.3)

**Route Structure:**
- `/transactions` - This story (list view)
- `/transactions/new` - Add form (Story 3.1)
- `/transactions/:id/edit` - Edit form (Story 3.3)

### Testing Strategy

From [tech-spec-epic-3.md](../tech-spec-epic-3.md#test-strategy-summary):

**Component Testing:**
- Use React Testing Library to render TransactionsList
- Mock useAppContext to provide test transaction data
- Mock useNavigate to verify navigation calls
- Test rendering with various data scenarios (empty, single, multiple)
- Test sorting logic and UI updates
- Test responsive layout rendering
- Test color coding and visual elements

**Test Coverage Focus:**
- List rendering with transaction data
- Empty state rendering
- Loading state rendering
- Error state rendering
- Default sort application
- Sort column toggling
- Sort direction toggling
- Color coding (income green, expense red)
- Category badge rendering
- Navigation button functionality
- Responsive layout classes

**Testing Tools:**
- Vitest for test runner
- React Testing Library for component testing
- @testing-library/user-event for click interactions
- vi.mock() for mocking hooks

### Learnings from Previous Stories

**From Story 3.1: Create Transaction Form Component (Status: ready-for-dev)**

- **Route for Adding**: `/transactions/new` route exists for TransactionForm
- **Navigation Pattern**: Use `useNavigate()` from react-router-dom to navigate to form
- **Integration Point**: "Add Transaction" button in list should navigate to /transactions/new
- **Form Success Flow**: After adding transaction, user typically returns to list (implement in Story 3.1 parent component or via navigation)

[Source: .bmad-ephemeral/stories/3-1-create-transaction-form-component.md]

**From Story 2.4: Set Up Global State Management (Status: done)**

- **AppContext Available**: Use `useAppContext()` hook to access transactions array
- **State Properties**:
  - `transactions: Transaction[]` - All transactions for display
  - `loading: boolean` - Show loading state while data loads
  - `error: string | null` - Display error if data load fails
  - `refreshData(): Promise<void>` - Reload transactions (use in error retry)
- **Real-time Updates**: Context automatically propagates changes, so list will update when transactions are added/edited/deleted
- **No Direct LocalStorage Access**: Always use AppContext, never call storageService directly

**Implementation Notes:**
```typescript
import { useAppContext } from '../context/AppContext';

const { transactions, loading, error, refreshData } = useAppContext();

// Transactions are already loaded from localStorage on app mount
// Just display them, no need to fetch
```

[Source: .bmad-ephemeral/stories/2-4-set-up-global-state-management.md#Dev-Agent-Record]

**From Story 2.3: Seed Predefined Categories (Status: done)**

- **Category Helpers Available**:
  - `getCategoryById(id)` - Use to look up category details for each transaction
  - Returns Category object with: id, name, type, color, icon
- **Category Colors**: Each category has a color property (hex code)
  - Use for badge background: Apply lighter shade of category color
  - Income categories: Green tones
  - Expense categories: Red/orange tones
- **Category Visual System**: Badges should use category.color and category.name
- **Integration**: Import from `src/constants/categories.ts`

[Source: .bmad-ephemeral/stories/2-3-seed-predefined-categories.md#Dev-Agent-Record]

**From Story 2.1: Define Data Models & TypeScript Interfaces (Status: done)**

- **Transaction Interface**: All fields defined in `src/models/Transaction.ts`
  - id, amount, type, category, date, description, createdAt, updatedAt
- **Date Field**: Stored as ISO 8601 string (YYYY-MM-DD)
  - Use date-fns `format()` to display as MM/DD/YYYY
  - Example: `format(parseISO(transaction.date), 'MM/dd/yyyy')`

[Source: .bmad-ephemeral/stories/2-1-define-data-models-typescript-interfaces.md#Dev-Agent-Record]

### References

- [PRD.md - FR-1.2 View Transactions](../../docs/PRD.md#fr-1-transaction-management) - Transaction list requirements
- [architecture.md - Pages Structure](../../docs/architecture.md#project-structure) - Page component organization
- [architecture.md - Responsive Design](../../docs/architecture.md#ui--styling) - Breakpoints and responsive patterns
- [tech-spec-epic-3.md - TransactionList Component](../tech-spec-epic-3.md#services-and-modules) - Detailed component specification
- [tech-spec-epic-3.md - Acceptance Criteria AC-3.2](../tech-spec-epic-3.md#acceptance-criteria-authoritative) - Story 3.2 ACs from epic tech spec
- [epics.md - Story 3.2](../../docs/epics.md#story-32-transaction-list-view-with-sorting) - Original story definition

## Dev Agent Record

### Context Reference

- [3-2-transaction-list-view-with-sorting.context.xml](.bmad-ephemeral/stories/3-2-transaction-list-view-with-sorting.context.xml)

### Agent Model Used

<!-- Will be filled by dev agent -->

### Debug Log References

<!-- Dev agent will document any issues encountered -->

### Completion Notes List

<!-- Dev agent will document:
- Sorting approach used (client-side, useMemo optimization)
- Responsive layout decisions (table vs cards)
- Category visual integration
- Navigation implementation
- Testing results
-->

### File List

<!-- Dev agent will list files created/modified:
NEW:
- src/pages/TransactionsList.tsx
- src/pages/TransactionsList.test.tsx

MODIFIED:
- src/App.tsx (add route)

DELETED:
- None
-->

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob) with Epic 3 tech spec context and previous story learnings
