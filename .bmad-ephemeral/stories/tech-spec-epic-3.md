# Epic Technical Specification: Transaction Management

Date: 2025-11-15
Author: Deyvid
Epic ID: 3
Status: Draft

---

## Overview

Epic 3 delivers the core value proposition of SmartBudget: full CRUD (Create, Read, Update, Delete) functionality for financial transactions. This epic enables users to manage their income and expense records through an intuitive web interface, providing the foundational data that powers all dashboard analytics and visualizations.

The epic builds upon the data layer established in Epic 2, leveraging the existing transaction models, state management, and LocalStorage persistence. It implements five vertically-sliced user stories that progressively add transaction management capabilities: form creation, list viewing with sorting, editing, deletion with confirmation, and advanced filtering/search.

## Objectives and Scope

**In Scope:**
- Transaction form component with full validation (amount, type, category, date, description)
- Transaction list view with sorting capabilities (by date, amount, category)
- Edit functionality reusing the form component
- Delete functionality with user confirmation dialog
- Filtering by date range, category, type, and description search
- Real-time UI updates reflecting state changes
- Responsive design for desktop, tablet, and mobile devices
- Client-side validation and error handling
- Empty states and user-friendly messaging

**Out of Scope (deferred to future epics or post-MVP):**
- Bulk operations (multi-select delete, bulk edit)
- Transaction templates or recurring transactions
- Undo/redo functionality
- Export to CSV/PDF
- Receipt attachment uploads
- Advanced search with amount ranges or tags
- Pagination (only relevant if >50 transactions)

**Success Criteria:**
- Users can add a transaction in under 30 seconds
- All CRUD operations complete without errors (100% success rate)
- Form validation prevents invalid data entry
- List view sorts correctly and handles empty states gracefully
- Delete confirmation prevents accidental data loss
- Filters combine correctly with AND logic
- All changes persist to LocalStorage and survive page refresh

## System Architecture Alignment

Epic 3 directly implements the **Transaction Management** layer defined in the system architecture. It consumes services and state from Epic 2 and provides the data manipulation interface that Epic 4 (Dashboard) will visualize.

**Architectural Components Involved:**

**Components Layer:**
- `components/transactions/TransactionForm.tsx` - Create/edit form component
- `components/transactions/TransactionList.tsx` - List display component
- `components/transactions/TransactionListItem.tsx` - Individual transaction row/card
- `components/transactions/FilterPanel.tsx` - Filter controls component
- `components/common/ConfirmDialog.tsx` - Reusable confirmation dialog
- `pages/TransactionsList.tsx` - Main transactions page
- `pages/TransactionForm.tsx` - Add/edit transaction page (or modal)

**Services Layer (from Epic 2):**
- `services/storageService.ts` - LocalStorage CRUD operations
- `services/transactionService.ts` - Transaction business logic
- `utils/validators.ts` - Input validation functions
- `utils/formatters.ts` - Currency and date formatting

**State Management (from Epic 2):**
- `context/AppContext.tsx` - Global state provider
- Custom hooks: `useTransactions()`, `usePeriod()`

**Models (from Epic 2):**
- `models/Transaction.ts` - TypeScript interface defining transaction structure
- `models/Category.ts` - Category interface with type, color, icon

**Routing:**
- `/transactions` - List view
- `/transactions/new` - Add transaction form
- `/transactions/:id/edit` - Edit transaction form

**Constraints:**
- Must use React Context API for state management (per Epic 2)
- Must integrate with existing LocalStorage service
- Must follow TypeScript strict mode
- Must use Tailwind CSS for styling (per Epic 1)
- Must be mobile-first responsive design
- Client-side validation before submission

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs | Outputs | Owner/Epic |
|----------------|------------------|--------|---------|------------|
| **TransactionForm Component** | Render form, handle input changes, validate, submit | Transaction (optional for edit mode), onSave callback, onCancel callback | Validated transaction object | Epic 3 |
| **TransactionList Component** | Display transactions, handle sorting, render empty states | transactions[], sortBy, sortOrder | Rendered list/table | Epic 3 |
| **FilterPanel Component** | Render filter controls, handle filter changes | currentFilters, onFilterChange callback | Filter criteria object | Epic 3 |
| **ConfirmDialog Component** | Reusable modal for confirmations | message, onConfirm, onCancel callbacks | User decision (confirm/cancel) | Epic 3 |
| **Transaction Service** | Business logic for transactions | Transaction objects, filter criteria | Filtered/sorted transaction arrays | Epic 2 (enhanced in Epic 3) |
| **Validation Utils** | Input validation functions | Form field values | Validation results (valid/invalid, error messages) | Epic 2 (enhanced in Epic 3) |

**Module Interactions:**
1. User navigates to `/transactions` → TransactionsList page loads
2. Page fetches transactions from AppContext
3. FilterPanel allows user to set filters → updates AppContext
4. TransactionList renders filtered/sorted data
5. User clicks "Add Transaction" → Navigate to `/transactions/new`
6. TransactionForm validates inputs → calls transactionService.addTransaction()
7. Service updates AppContext → LocalStorage persists → UI re-renders

### Data Models and Contracts

**Transaction Model (defined in Epic 2, used here):**

```typescript
interface Transaction {
  id: string;                    // UUID v4
  amount: number;                // Positive number, max 2 decimals
  type: 'income' | 'expense';    // Transaction type
  category: string;              // Category ID (references Category.id)
  date: string;                  // ISO 8601 date string (YYYY-MM-DD)
  description: string;           // Optional, max 200 characters
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

**Category Model (defined in Epic 2):**

```typescript
interface Category {
  id: string;                    // Unique category ID
  name: string;                  // Display name (e.g., "Food/Groceries")
  type: 'income' | 'expense';    // Category type
  color: string;                 // Hex color code
  icon: string;                  // Lucide icon name or emoji
}
```

**Filter Criteria Model (new for Epic 3.5):**

```typescript
interface FilterCriteria {
  dateRange: {
    start: string | null;        // ISO date or null (all time)
    end: string | null;          // ISO date or null (all time)
    preset: 'all' | 'thisMonth' | 'lastMonth' | 'custom';
  };
  categories: string[];          // Array of category IDs (empty = all)
  type: 'all' | 'income' | 'expense';
  searchText: string;            // Substring search in description
}
```

**Form Validation Rules:**
- `amount`: Required, must be positive number, max 2 decimals, regex: `/^\d+(\.\d{1,2})?$/`
- `type`: Required, must be 'income' or 'expense'
- `category`: Required, must be valid category ID from predefined list
- `date`: Required, must be valid date, cannot be future date
- `description`: Optional, max 200 characters

**Data Relationships:**
- Transaction.category → Category.id (lookup relationship)
- Transaction.type must match Category.type for selected category
- All transactions stored in single array in AppContext and LocalStorage

### APIs and Interfaces

**AppContext API (from Epic 2, extended in Epic 3):**

```typescript
interface AppContextType {
  // State
  transactions: Transaction[];
  categories: Category[];
  filters: FilterCriteria;
  isLoading: boolean;
  error: string | null;

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: FilterCriteria) => void;
  clearFilters: () => void;
}
```

**TransactionForm Props Interface:**

```typescript
interface TransactionFormProps {
  mode: 'create' | 'edit';
  transaction?: Transaction;      // Required if mode='edit'
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
}
```

**ConfirmDialog Props Interface:**

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;          // Default: "Confirm"
  cancelLabel?: string;           // Default: "Cancel"
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';  // Styling variant
}
```

**Validation Function Signatures:**

```typescript
// Validates amount field
validateAmount(value: string): { valid: boolean; error?: string };

// Validates date field
validateDate(value: string): { valid: boolean; error?: string };

// Validates description length
validateDescription(value: string): { valid: boolean; error?: string };

// Validates entire transaction object
validateTransaction(transaction: Partial<Transaction>): {
  valid: boolean;
  errors: Record<string, string>;
};
```

### Workflows and Sequencing

**Add Transaction Flow:**

1. User navigates to `/transactions` page
2. User clicks "Add Transaction" button
3. Navigate to `/transactions/new` (or open modal)
4. TransactionForm component renders in 'create' mode
5. Form initializes with:
   - Amount: empty (autofocus)
   - Type: 'expense' (default)
   - Category: empty dropdown (filtered by type)
   - Date: today's date
   - Description: empty
6. User selects Type (income/expense) → Category dropdown filters accordingly
7. User fills form fields → real-time validation on blur
8. User clicks "Save" button
9. Form validates all fields:
   - If invalid → show inline errors, prevent submission
   - If valid → proceed
10. Call `addTransaction()` from AppContext
11. AppContext generates ID, timestamps → adds to state
12. State change triggers LocalStorage persistence
13. Show success toast: "Transaction added successfully"
14. Navigate back to `/transactions` list
15. New transaction appears at top of list (sorted by date descending)

**Edit Transaction Flow:**

1. User on `/transactions` list page
2. User clicks "Edit" icon on a transaction row
3. Navigate to `/transactions/:id/edit`
4. Load transaction by ID from AppContext
5. TransactionForm renders in 'edit' mode with pre-populated fields
6. User modifies fields → validation on blur
7. User clicks "Save"
8. Validate changes
9. Call `updateTransaction(id, updates)` from AppContext
10. AppContext merges updates, updates `updatedAt` timestamp
11. LocalStorage persists changes
12. Success message: "Transaction updated"
13. Navigate back to list
14. Updated transaction reflects changes (sorted back into list)

**Delete Transaction Flow:**

1. User on transactions list
2. User clicks "Delete" icon on a transaction
3. ConfirmDialog opens with message: "Are you sure you want to delete this transaction? This action cannot be undone."
4. User clicks "Cancel" → dialog closes, no action
5. User clicks "Delete":
   - Call `deleteTransaction(id)` from AppContext
   - AppContext removes transaction from array
   - LocalStorage persists updated array
   - Dialog closes
   - Transaction removed from list (with optional fade-out animation)
   - Success toast: "Transaction deleted"
6. If transaction was being viewed/edited → navigate to list

**Filter Transactions Flow:**

1. User on `/transactions` list page
2. FilterPanel component displays:
   - Date range selector (This Month, Last Month, Custom)
   - Category multi-select dropdown
   - Type toggle (All, Income, Expense)
   - Search input for description
3. User selects "Last Month" → `setFilters()` called
4. AppContext updates filters state
5. TransactionList re-renders with filtered data
6. User adds category filter "Food/Groceries" → filters combine (AND logic)
7. List shows only Food/Groceries transactions from last month
8. Active filters indicated with badges/pills
9. User clicks "Clear Filters" → all filters reset → show all transactions

**Sort Transactions Flow:**

1. User on list page
2. Default sort: Date descending (most recent first)
3. User clicks "Amount" column header
4. List re-sorts by amount ascending
5. Column header shows sort indicator (arrow up)
6. User clicks "Amount" again → toggles to descending
7. Arrow flips to indicate sort direction

## Non-Functional Requirements

### Performance

**Page Load Times:**
- Transactions list page must render within 2 seconds (NFR-1.3 from PRD)
- Initial data load from LocalStorage: <100ms for up to 1000 transactions
- Filter/sort operations: <200ms for client-side processing

**Interaction Responsiveness:**
- Form input validation feedback: <50ms
- Add/Edit/Delete operations: <300ms total (including LocalStorage write)
- Filter updates: <100ms for re-rendering filtered list

**Optimization Strategies:**
- Use React.memo() for TransactionListItem to prevent unnecessary re-renders
- Debounce search input (300ms delay) to avoid excessive filtering
- Virtual scrolling if transaction count exceeds 100 (future optimization)
- Lazy load transaction form modal if using modal pattern

### Security

**Input Validation:**
- All form inputs validated client-side before submission (prevent XSS)
- Amount input sanitized to prevent injection: strip non-numeric characters except decimal
- Description field HTML-escaped before rendering
- Date input constrained to valid dates only (prevent injection)

**Data Handling:**
- No sensitive financial data (no bank account numbers, SSNs, etc. in MVP)
- LocalStorage data not encrypted (acceptable for MVP educational project)
- No user authentication in MVP (single-user, local data only)
- Future: Consider encryption for multi-user version

**Error Handling:**
- Never expose stack traces or technical errors to users
- Graceful degradation if LocalStorage quota exceeded
- Catch and log errors, show user-friendly messages

### Reliability/Availability

**Data Integrity:**
- LocalStorage writes wrapped in try-catch to handle quota errors
- Schema validation on data load (detect corruption)
- Atomic updates: read-modify-write pattern for concurrent safety
- Data migration strategy for future schema changes (version field in storage)

**Error Recovery:**
- If LocalStorage corrupted → alert user, offer to reset data
- If individual transaction fails validation → log error, skip that item, load rest
- Optimistic UI updates with rollback on failure

**Browser Compatibility:**
- Support modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Graceful degradation if LocalStorage unavailable (rare but possible)

### Observability

**Logging:**
- Console.log for development debugging (removed or disabled in production)
- Log all LocalStorage operations (read, write, delete) in dev mode
- Log validation failures with details

**Error Tracking:**
- React Error Boundaries to catch component errors
- Log errors to console with context (which component, action, data)
- Future: Integrate with error tracking service (Sentry, etc.)

**Metrics (future):**
- Track transaction counts, categories used
- Monitor performance: form submission time, list render time
- User behavior: most used features, common errors

## Dependencies and Integrations

**Dependencies from package.json:**

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.30.0",
    "lucide-react": "^0.469.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "typescript": "~5.6.2",
    "vite": "^6.0.1",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.15.0",
    "prettier": "^3.4.1"
  }
}
```

**External Integrations:**
- None in MVP (no third-party APIs, no backend services)

**Browser APIs:**
- LocalStorage API (window.localStorage)
- Date API (new Date(), date-fns wraps this)

**Internal Dependencies (from Epic 2):**

| Dependency | Version/Location | Purpose |
|------------|------------------|---------|
| AppContext | src/context/AppContext.tsx | Global state access |
| Transaction Model | src/models/Transaction.ts | TypeScript type definitions |
| Category Model | src/models/Category.ts | Category type definitions |
| storageService | src/services/storageService.ts | LocalStorage operations |
| Validators | src/utils/validators.ts | Input validation |
| Formatters | src/utils/formatters.ts | Currency/date formatting |
| Categories constant | src/constants/categories.ts | Predefined category list |

**Component Library:**
- Lucide React for icons: Trash2, Edit, Plus, Search, Filter, X (close)
- Tailwind CSS for all styling

## Acceptance Criteria (Authoritative)

Epic 3 is considered complete when all five stories pass their acceptance criteria:

### Story 3.1: Create Transaction Form Component

**AC-3.1.1**: Form displays with required fields: Amount (autofocus), Type (toggle), Category (dropdown), Date (picker, defaults to today), Description (optional, max 200 chars)

**AC-3.1.2**: Type selection filters Category dropdown to show only matching categories (income categories when Type=Income)

**AC-3.1.3**: Form validates all inputs before submission:
- Amount: positive number, max 2 decimals
- Type: required
- Category: required, valid ID
- Date: required, valid date, not future
- Description: max 200 characters

**AC-3.1.4**: Validation errors shown inline with clear messages (e.g., "Amount must be a positive number")

**AC-3.1.5**: On successful submission, transaction is saved to AppContext and LocalStorage

**AC-3.1.6**: User sees success confirmation message

**AC-3.1.7**: User is redirected to transactions list after save

### Story 3.2: Transaction List View with Sorting

**AC-3.2.1**: List displays all transactions with columns/fields: Date, Description, Category (with color/icon), Amount (with currency symbol, color-coded), Type indicator

**AC-3.2.2**: Transactions sorted by date (most recent first) by default

**AC-3.2.3**: User can sort by clicking column headers (Date, Amount, Category)

**AC-3.2.4**: Sort toggles between ascending and descending on repeated clicks

**AC-3.2.5**: Empty state displays helpful message: "No transactions yet. Add your first transaction!" with "Add Transaction" button

**AC-3.2.6**: List is responsive: table layout on desktop (≥768px), card layout on mobile (<768px)

**AC-3.2.7**: Income amounts display in green, expense amounts in red/orange

### Story 3.3: Edit Transaction Functionality

**AC-3.3.1**: User can click "Edit" button on any transaction in list

**AC-3.3.2**: TransactionForm opens in edit mode with all fields pre-populated with current values

**AC-3.3.3**: User can modify any field

**AC-3.3.4**: Same validation rules apply as create mode

**AC-3.3.5**: On save, transaction updates in AppContext and LocalStorage

**AC-3.3.6**: Transaction ID remains unchanged (no delete/recreate)

**AC-3.3.7**: Changes immediately reflected in list view and dashboard (if implemented)

**AC-3.3.8**: Success message: "Transaction updated"

### Story 3.4: Delete Transaction with Confirmation

**AC-3.4.1**: User can click "Delete" button on any transaction

**AC-3.4.2**: Confirmation dialog appears with message: "Are you sure you want to delete this transaction? This action cannot be undone."

**AC-3.4.3**: Dialog has "Cancel" and "Delete" buttons

**AC-3.4.4**: Clicking "Cancel" closes dialog, nothing deleted

**AC-3.4.5**: Clicking "Delete" removes transaction from AppContext and LocalStorage

**AC-3.4.6**: Transaction removed from list immediately

**AC-3.4.7**: Dashboard recalculates automatically (when Epic 4 implemented)

**AC-3.4.8**: Success message: "Transaction deleted"

### Story 3.5: Transaction Filtering & Search

**AC-3.5.1**: FilterPanel displays controls for: Date range (preset options: All Time, This Month, Last Month, Custom Range), Category (multi-select), Type (All/Income/Expense), Search by description

**AC-3.5.2**: Filters combine with AND logic (all conditions must be met)

**AC-3.5.3**: Filtered results update in real-time as user types or selects

**AC-3.5.4**: "Clear Filters" button resets all filters to defaults

**AC-3.5.5**: Active filters are visually indicated (badges, highlights, etc.)

**AC-3.5.6**: Filter state persists when navigating away and returning (stored in AppContext or URL params)

**AC-3.5.7**: Search is case-insensitive substring match on description field

## Traceability Mapping

| AC ID | Spec Section | Component/API | Test Idea |
|-------|--------------|---------------|-----------|
| AC-3.1.1 | Detailed Design → TransactionForm | TransactionForm.tsx | Render test: verify all fields present, autofocus on amount |
| AC-3.1.2 | Workflows → Add Transaction Flow | TransactionForm.tsx | Interaction test: select Income type → verify category dropdown shows only income categories |
| AC-3.1.3 | Data Models → Validation Rules | utils/validators.ts | Unit tests for each validation function (amount, date, description) |
| AC-3.1.4 | APIs → validateTransaction() | TransactionForm.tsx | Submit invalid form → verify inline error messages appear |
| AC-3.1.5 | Workflows → Add Transaction Flow | AppContext.addTransaction() | Integration test: submit form → verify transaction in LocalStorage |
| AC-3.1.6 | NFR → Reliability | TransactionForm.tsx | UI test: successful save → verify success toast appears |
| AC-3.1.7 | Workflows → Add Transaction Flow | react-router-dom navigation | Navigation test: save → verify redirect to /transactions |
| AC-3.2.1 | Detailed Design → TransactionList | TransactionList.tsx, TransactionListItem.tsx | Render test: verify columns display with correct data |
| AC-3.2.2 | Workflows → Sort Flow | TransactionList.tsx sorting logic | Sort test: load list → verify default sort by date desc |
| AC-3.2.3 | Workflows → Sort Flow | TransactionList.tsx | Click column header → verify sort changes |
| AC-3.2.4 | Workflows → Sort Flow | TransactionList.tsx | Click same header twice → verify toggle asc/desc |
| AC-3.2.5 | Detailed Design → Empty States | TransactionList.tsx | Edge case test: load with 0 transactions → verify empty state message |
| AC-3.2.6 | NFR → Responsive Design | TransactionList.tsx + Tailwind | Responsive test: resize viewport → verify layout changes at 768px breakpoint |
| AC-3.2.7 | Data Models → Category colors | TransactionListItem.tsx, formatters.ts | Visual test: verify income=green, expense=red |
| AC-3.3.1 | Workflows → Edit Flow | TransactionListItem.tsx | Click "Edit" button → verify form opens |
| AC-3.3.2 | Workflows → Edit Flow | TransactionForm.tsx (edit mode) | Form pre-population test: verify all fields match transaction data |
| AC-3.3.3 | Workflows → Edit Flow | TransactionForm.tsx | Edit field values → verify changes allowed |
| AC-3.3.4 | Data Models → Validation Rules | utils/validators.ts | Same validation tests as create mode |
| AC-3.3.5 | Workflows → Edit Flow | AppContext.updateTransaction() | Integration test: edit → verify LocalStorage updated |
| AC-3.3.6 | Data Models → Transaction.id | AppContext.updateTransaction() | ID immutability test: verify ID unchanged after edit |
| AC-3.3.7 | Workflows → Edit Flow | AppContext state propagation | Re-render test: edit → verify list updates immediately |
| AC-3.3.8 | NFR → Reliability | TransactionForm.tsx | Success message test: verify "Transaction updated" toast |
| AC-3.4.1 | Workflows → Delete Flow | TransactionListItem.tsx | Click "Delete" button → verify dialog opens |
| AC-3.4.2 | Detailed Design → ConfirmDialog | ConfirmDialog.tsx | Dialog content test: verify message text |
| AC-3.4.3 | APIs → ConfirmDialog Props | ConfirmDialog.tsx | Button test: verify Cancel and Delete buttons present |
| AC-3.4.4 | Workflows → Delete Flow | ConfirmDialog.tsx | Click Cancel → verify dialog closes, no deletion |
| AC-3.4.5 | Workflows → Delete Flow | AppContext.deleteTransaction() | Integration test: confirm delete → verify removed from LocalStorage |
| AC-3.4.6 | Workflows → Delete Flow | TransactionList.tsx | UI update test: delete → verify item removed from list |
| AC-3.4.7 | System Arch Alignment | AppContext → Epic 4 Dashboard | Integration test: delete → verify dashboard totals recalculate |
| AC-3.4.8 | NFR → Reliability | ConfirmDialog.tsx | Success message test: verify "Transaction deleted" toast |
| AC-3.5.1 | Detailed Design → FilterPanel | FilterPanel.tsx | Render test: verify all filter controls present |
| AC-3.5.2 | Workflows → Filter Flow | transactionService filtering logic | Filter logic test: apply multiple filters → verify AND combination |
| AC-3.5.3 | NFR → Performance | FilterPanel.tsx onChange handlers | Real-time update test: change filter → verify list updates <200ms |
| AC-3.5.4 | APIs → clearFilters() | AppContext.clearFilters() | Clear filters test: click button → verify all filters reset |
| AC-3.5.5 | Detailed Design → Active filter indicators | FilterPanel.tsx | Visual test: apply filter → verify badge/highlight appears |
| AC-3.5.6 | Data Models → FilterCriteria | AppContext filter state | State persistence test: navigate away and back → verify filters retained |
| AC-3.5.7 | Workflows → Filter Flow | transactionService search logic | Search test: enter text → verify case-insensitive substring match |

## Risks, Assumptions, Open Questions

### Risks

**Risk-1: LocalStorage Quota Exceeded**
- **Description**: Users with many transactions may exceed browser LocalStorage limit (~5-10MB)
- **Probability**: Low (would require ~10,000+ transactions)
- **Impact**: High (data loss if quota exceeded and not handled)
- **Mitigation**:
  - Implement quota detection and graceful error handling
  - Warn user when approaching limit (e.g., >1000 transactions)
  - Future: Migrate to IndexedDB for larger storage capacity

**Risk-2: Browser Compatibility Issues**
- **Description**: LocalStorage or modern JavaScript features may not work in older browsers
- **Probability**: Medium (some users may use IE 11 or old mobile browsers)
- **Impact**: Medium (app won't function)
- **Mitigation**:
  - Document supported browsers in README
  - Add browser detection and warning message for unsupported browsers
  - Use Vite's built-in polyfills for most features

**Risk-3: Form UX Complexity on Mobile**
- **Description**: Date pickers and dropdowns can be cumbersome on mobile devices
- **Probability**: Medium
- **Impact**: Medium (poor UX, longer transaction entry time)
- **Mitigation**:
  - Use native HTML5 input types (type="date", type="number") for better mobile keyboards
  - Test extensively on actual mobile devices
  - Consider simplified mobile form flow (fewer fields initially)

**Risk-4: Performance Degradation with Large Datasets**
- **Description**: Rendering and filtering 1000+ transactions may cause lag
- **Probability**: Medium (depends on user adoption)
- **Impact**: Medium (sluggish UI)
- **Mitigation**:
  - Implement debouncing on search input
  - Use React.memo() to prevent unnecessary re-renders
  - Future: Add pagination or virtual scrolling for large lists

### Assumptions

**Assumption-1**: Users will enter accurate data manually
- No automated bank import in MVP, relying on user honesty/accuracy
- Validation only prevents invalid formats, not logical errors (e.g., $10,000 for "Coffee")

**Assumption-2**: Single-user, single-device usage
- No multi-device sync or cloud storage in MVP
- Data lives only in browser LocalStorage on one device

**Assumption-3**: Modern browser with JavaScript enabled
- Assume users have Chrome, Firefox, Safari, or Edge from last 2 years
- No fallback for JavaScript-disabled browsers

**Assumption-4**: USD currency only
- No currency conversion or multi-currency support in MVP
- Hardcode "$" symbol in displays

**Assumption-5**: Predefined categories are sufficient
- Users cannot add custom categories in MVP
- The 12 predefined categories cover common use cases

### Open Questions

**Question-1**: Should transaction form be a modal or full page?
- **Options**:
  - A) Full page route (/transactions/new)
  - B) Modal overlay on /transactions
- **Decision Needed**: Before Story 3.1 implementation
- **Recommendation**: Full page for simplicity, better mobile UX

**Question-2**: Should we implement optimistic UI updates or wait for confirmation?
- **Options**:
  - A) Optimistic: Update UI immediately, rollback if fails
  - B) Pessimistic: Show loading, update only after success
- **Decision Needed**: Before Story 3.1
- **Recommendation**: Optimistic for better perceived performance (LocalStorage is synchronous and reliable)

**Question-3**: How should we handle transaction editing while dashboard is open?
- **Options**:
  - A) Automatically recalculate dashboard when transactions change
  - B) Require manual refresh
- **Decision Needed**: Before Story 3.3
- **Recommendation**: Automatic (React Context will propagate changes automatically)

**Question-4**: Should delete action have undo functionality?
- **Options**:
  - A) No undo (current MVP scope)
  - B) Temporary undo with toast notification (5-second window)
  - C) Full undo history
- **Decision Needed**: Story 3.4 scope decision
- **Recommendation**: No undo for MVP (defer to post-MVP), include strong confirmation dialog instead

**Question-5**: Should filters persist in URL query params or only in state?
- **Options**:
  - A) URL query params (shareable, bookmarkable)
  - B) Context state only (simpler, no URL clutter)
  - C) LocalStorage persistence
- **Decision Needed**: Before Story 3.5
- **Recommendation**: Context state + LocalStorage for persistence across sessions, simpler than URL management

## Test Strategy Summary

### Unit Testing

**Components to Unit Test:**
- Validation functions (validators.ts): Test each rule independently
- Formatting functions (formatters.ts): Test currency, date formatting
- Calculation functions: Test sorting, filtering logic
- Utility functions: Test date helpers, data transformers

**Approach:**
- Jest for unit test runner (comes with Vite)
- Test each validation function with valid/invalid inputs
- Test edge cases: empty strings, negative numbers, future dates, special characters
- Aim for >80% code coverage on utility functions

### Component Testing

**Components to Test:**
- TransactionForm: Render, validation, submission, edit mode
- TransactionList: Render with data, empty state, sorting
- FilterPanel: Filter controls, multi-select, search
- ConfirmDialog: Open/close, button actions

**Approach:**
- React Testing Library for component tests
- Test user interactions (click, type, submit)
- Test props and state changes
- Verify correct rendering based on props

### Integration Testing

**Flows to Test:**
- Complete add transaction flow (form → context → storage → list)
- Edit transaction flow (list → form → update → list refresh)
- Delete transaction flow (list → confirm → delete → list update)
- Filter flow (filter panel → context → list re-render)

**Approach:**
- Test with actual AppContext provider
- Mock LocalStorage for controlled testing
- Verify state propagation across components
- Test error scenarios (quota exceeded, corrupted data)

### Manual Testing

**Scenarios:**
- Add 10 transactions of varying types
- Edit transactions and verify changes
- Delete transactions with confirmation
- Apply multiple filters in combination
- Test on desktop, tablet, mobile viewports
- Test on Chrome, Firefox, Safari
- Test edge cases: empty list, single transaction, 100+ transactions
- Test error states: invalid inputs, LocalStorage errors

**Acceptance Criteria Verification:**
- Manual walkthrough of all AC items listed above
- Create checklist from AC table
- Execute each test scenario, document pass/fail

### Performance Testing

**Metrics to Measure:**
- Form submission time (target: <300ms)
- List render time with 100 transactions (target: <500ms)
- Filter update time (target: <200ms)
- LocalStorage read/write time (target: <100ms)

**Tools:**
- Browser DevTools Performance tab
- React DevTools Profiler
- Manual stopwatch for user-perceived timing

### Regression Testing

**After Each Story:**
- Re-run all previous story acceptance criteria
- Verify no existing functionality broken
- Check that Epic 2 data layer still works correctly

**Before Epic Completion:**
- Full manual regression test of all five stories
- Verify all Epic 3 acceptance criteria pass
- Test integration with Epic 1 (routing, layout) and Epic 2 (data, state)

---

**Epic 3 Technical Specification Complete**

This specification provides the blueprint for implementing all five stories in Epic 3. Each story should reference this spec for technical details, constraints, and acceptance criteria. Update this document if architectural decisions change during implementation.

**Next Steps:**
1. Load SM agent and run `create-story` to draft Story 3.1
2. Implement stories sequentially (3.1 → 3.2 → 3.3 → 3.4 → 3.5)
3. Test each story against its acceptance criteria before moving to next
4. Update sprint-status.yaml as stories progress
