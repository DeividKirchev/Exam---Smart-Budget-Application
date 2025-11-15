# Story 3.3: Edit Transaction Functionality

Status: drafted

## Story

As a user,
I want to edit an existing transaction,
so that I can correct mistakes or update details.

## Acceptance Criteria

1. **Edit Button in Transaction List**
   - Each transaction in TransactionsList (Story 3.2) has an "Edit" button/icon
   - Edit button uses Lucide Edit icon (pencil icon)
   - Button is visually distinct and clearly indicates edit action
   - On click, navigates to `/transactions/:id/edit` route
   - Transaction ID is passed in URL parameter

2. **Edit Route Configuration**
   - Route `/transactions/:id/edit` added to App.tsx routing
   - Route renders TransactionFormPage component in edit mode
   - Route parameter `:id` is extracted and used to load transaction

3. **Transaction Loading by ID**
   - TransactionFormPage reads `:id` parameter from URL
   - Loads transaction from AppContext by ID using `transactions.find(t => t.id === id)`
   - If transaction found, passes to TransactionForm in edit mode
   - If transaction not found (invalid ID), shows error: "Transaction not found"
   - Error state includes "Back to Transactions" button

4. **TransactionForm in Edit Mode**
   - TransactionForm component (from Story 3.1) is reused
   - Component receives `mode='edit'` prop
   - Component receives `transaction={foundTransaction}` prop
   - All form fields pre-populate with existing transaction data:
     - Amount: transaction.amount (displayed as string for input)
     - Type: transaction.type ('income' or 'expense')
     - Category: transaction.category (category ID)
     - Date: transaction.date (ISO string YYYY-MM-DD)
     - Description: transaction.description

5. **Form Field Behavior in Edit Mode**
   - Submit button label changes to "Update Transaction" (not "Add Transaction")
   - All fields are editable (user can change any value)
   - Same validation rules apply as create mode (Story 3.1)
   - Category dropdown filters by selected type (same as create mode)
   - Date picker allows changing date (still prevents future dates)
   - Description field respects 200 character limit

6. **Update Transaction on Submit**
   - On submit, form validates all fields (same as create mode)
   - If validation passes, calls `updateTransaction(id, updates)` from AppContext
   - Updates object includes only modified fields (partial update)
   - Transaction ID never changes (preserved from original transaction)
   - `updatedAt` timestamp is updated automatically by AppContext

7. **Success Handling**
   - On successful update, success toast displays: "Transaction updated successfully"
   - User is navigated back to `/transactions` list
   - Updated transaction appears in list with new values
   - List automatically reflects changes (via AppContext state propagation)

8. **Cancel Action**
   - Cancel button discards all changes
   - Navigates back to `/transactions` list without saving
   - Original transaction remains unchanged

9. **Error Handling**
   - If `updateTransaction()` fails, error is caught and displayed
   - Error message: "Failed to update transaction. Please try again."
   - Form remains in edit state (user can retry)
   - Validation errors display inline (same as create mode)

10. **Immediate UI Update**
    - Updated transaction immediately reflects in list view (Story 3.2)
    - Dashboard (Epic 4) will automatically recalculate if implemented
    - No page refresh required due to AppContext state management

11. **Transaction ID Immutability**
    - Transaction ID is never changed during edit
    - ID is read-only and not displayed in form
    - Only amount, type, category, date, description are editable
    - `createdAt` timestamp is preserved from original transaction

12. **Integration Tests**
    - Test file created at `src/pages/TransactionFormPage.test.tsx` (if not exists from Story 3.1)
    - Test edit mode: component loads transaction by ID from URL
    - Test edit mode: form pre-populates with transaction data
    - Test edit mode: submit calls updateTransaction with correct ID
    - Test edit mode: success navigates to /transactions list
    - Test edit mode: transaction not found shows error
    - Test ID immutability: transaction ID unchanged after update
    - Coverage target: ≥85% for edit mode scenarios

## Tasks / Subtasks

- [ ] **Task 1: Add Edit button to TransactionsList** (AC: 1)
  - [ ] Open `src/pages/TransactionsList.tsx`
  - [ ] Import Edit icon from lucide-react
  - [ ] Add Edit button to each transaction row/card
  - [ ] Button onClick: `navigate(\`/transactions/${transaction.id}/edit\`)`
  - [ ] Style button: icon button with hover state
  - [ ] Ensure button is accessible (aria-label="Edit transaction")

- [ ] **Task 2: Add edit route to App.tsx** (AC: 2)
  - [ ] Open `src/App.tsx`
  - [ ] Add route: `<Route path="/transactions/:id/edit" element={<TransactionFormPage />} />`
  - [ ] Verify TransactionFormPage is imported
  - [ ] Test route works by navigating to /transactions/123/edit (with test ID)

- [ ] **Task 3: Update TransactionFormPage to handle edit mode** (AC: 3, 4)
  - [ ] Open `src/pages/TransactionFormPage.tsx` (created in Story 3.1)
  - [ ] Import useParams from react-router-dom
  - [ ] Import useAppContext hook
  - [ ] Extract `:id` parameter: `const { id } = useParams();`
  - [ ] Get transactions from AppContext: `const { transactions } = useAppContext();`
  - [ ] Find transaction: `const transaction = transactions.find(t => t.id === id);`
  - [ ] Determine mode: `const mode = id ? 'edit' : 'create';`

- [ ] **Task 4: Handle transaction not found** (AC: 3)
  - [ ] If `id` exists but `transaction` is undefined (not found):
    - [ ] Render error state: "Transaction not found"
    - [ ] Show message: "The transaction you're looking for doesn't exist or has been deleted."
    - [ ] Add "Back to Transactions" button navigating to /transactions
    - [ ] Style error state clearly
  - [ ] Return early from render if not found (don't render form)

- [ ] **Task 5: Pass props to TransactionForm for edit mode** (AC: 4, 5)
  - [ ] When transaction found and mode='edit':
    - [ ] Pass `mode='edit'` prop to TransactionForm
    - [ ] Pass `transaction={transaction}` prop to TransactionForm
  - [ ] When mode='create':
    - [ ] Pass `mode='create'` prop to TransactionForm
    - [ ] Don't pass transaction prop
  - [ ] Ensure TransactionForm component handles both modes (already implemented in Story 3.1)

- [ ] **Task 6: Verify TransactionForm edit mode behavior** (AC: 5, 6)
  - [ ] Review TransactionForm.tsx (from Story 3.1)
  - [ ] Confirm form pre-populates fields when mode='edit' and transaction prop provided
  - [ ] Confirm submit button label changes to "Update Transaction"
  - [ ] Confirm form calls updateTransaction() instead of addTransaction() in edit mode
  - [ ] If not implemented, add edit mode logic to TransactionForm

- [ ] **Task 7: Implement updateTransaction call** (AC: 6)
  - [ ] In TransactionForm component (Story 3.1):
  - [ ] On submit, check if mode === 'edit'
  - [ ] If edit mode, call: `await updateTransaction(transaction.id, formData)`
  - [ ] formData should include: { amount, type, category, date, description }
  - [ ] Don't include id, createdAt, updatedAt (handled by AppContext)
  - [ ] Wrap in try-catch for error handling

- [ ] **Task 8: Handle success in edit mode** (AC: 7)
  - [ ] After successful updateTransaction:
    - [ ] Show success toast: "Transaction updated successfully"
    - [ ] Call onSave callback with updated transaction
    - [ ] In TransactionFormPage, onSave navigates to /transactions
  - [ ] Verify updated transaction appears in list with new values

- [ ] **Task 9: Implement cancel action** (AC: 8)
  - [ ] Cancel button already exists from Story 3.1
  - [ ] Verify onCancel callback navigates to /transactions
  - [ ] Confirm no changes are saved when cancel is clicked
  - [ ] Test that original transaction remains unchanged

- [ ] **Task 10: Add error handling** (AC: 9)
  - [ ] In TransactionForm, wrap updateTransaction in try-catch
  - [ ] On error, set error state: "Failed to update transaction. Please try again."
  - [ ] Display error message above form
  - [ ] Keep form in edit state (don't navigate away)
  - [ ] User can retry submission

- [ ] **Task 11: Verify transaction ID immutability** (AC: 11)
  - [ ] Confirm updateTransaction in AppContext does NOT change transaction ID
  - [ ] Confirm createdAt timestamp is preserved
  - [ ] Only updatedAt timestamp changes
  - [ ] Review AppContext.tsx updateTransaction implementation from Story 2.4

- [ ] **Task 12: Test immediate UI updates** (AC: 10)
  - [ ] After updating a transaction, navigate back to /transactions list
  - [ ] Verify updated transaction shows new values immediately
  - [ ] Confirm no page refresh required
  - [ ] Test with various field changes (amount, category, date, etc.)

- [ ] **Task 13: Create/update integration tests** (AC: 12)
  - [ ] Open or create `src/pages/TransactionFormPage.test.tsx`
  - [ ] Mock useParams to return test transaction ID
  - [ ] Mock useAppContext to return test transactions array
  - [ ] Mock useNavigate
  - [ ] Test: Edit mode loads transaction by ID from URL
  - [ ] Test: Form pre-populates with transaction data in edit mode
  - [ ] Test: Submit calls updateTransaction with correct ID and data
  - [ ] Test: Successful update navigates to /transactions
  - [ ] Test: Transaction not found shows error message
  - [ ] Test: Error message has "Back to Transactions" button
  - [ ] Test: Transaction ID is preserved after update
  - [ ] Test: createdAt timestamp is preserved
  - [ ] Run tests: npm run test
  - [ ] Verify ≥85% coverage for edit mode scenarios

- [ ] **Task 14: Manual end-to-end testing** (AC: all)
  - [ ] Navigate to /transactions list
  - [ ] Click Edit button on a transaction
  - [ ] Verify form opens with pre-populated data
  - [ ] Verify URL is /transactions/:id/edit with correct ID
  - [ ] Change amount value
  - [ ] Change category
  - [ ] Change date
  - [ ] Update description
  - [ ] Click "Update Transaction"
  - [ ] Verify success toast appears
  - [ ] Verify navigation to /transactions list
  - [ ] Verify transaction shows updated values in list
  - [ ] Test cancel button (discard changes)
  - [ ] Test with invalid ID in URL (transaction not found)

- [ ] **Task 15: TypeScript compilation and verification** (AC: all)
  - [ ] Run `npm run build` or `tsc --noEmit`
  - [ ] Fix any TypeScript errors
  - [ ] Verify all imports resolve correctly
  - [ ] Ensure strict mode compliance

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):
- **Component Reuse**: TransactionForm component from Story 3.1 is reused for edit mode
- **Routing**: React Router with dynamic `:id` parameter for edit route
- **State Management**: AppContext provides updateTransaction() method and automatic state propagation
- **Page Components**: TransactionFormPage wrapper handles routing and transaction loading

### Tech Spec Compliance

From [tech-spec-epic-3.md](../tech-spec-epic-3.md):

**Edit Transaction Workflow:**
1. User on /transactions list
2. Click "Edit" on transaction
3. Navigate to /transactions/:id/edit
4. Load transaction by ID from AppContext
5. TransactionForm renders in edit mode with pre-populated data
6. User modifies fields → validation
7. User clicks "Update Transaction"
8. Validate, call `updateTransaction(id, updates)`
9. Success message, navigate back to list
10. Updated transaction appears in list immediately

**TransactionForm Edit Mode (from Story 3.1):**
- Component already supports edit mode via `mode` prop
- Pre-populates fields when `transaction` prop provided
- Calls `updateTransaction()` instead of `addTransaction()`
- Submit button label: "Update Transaction"
- Transaction ID preserved (immutable)

**AppContext updateTransaction API (from Story 2.4):**
```typescript
updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction>
```
- Accepts transaction ID and partial updates
- Returns updated transaction
- Preserves id and createdAt
- Updates updatedAt timestamp
- Validates before saving

### Project Structure Notes

**Files to Modify:**
```
src/
├── pages/
│   ├── TransactionsList.tsx           (MODIFIED - add Edit button)
│   ├── TransactionFormPage.tsx        (MODIFIED - add edit mode logic)
│   └── TransactionFormPage.test.tsx   (MODIFIED - add edit mode tests)
└── App.tsx                             (MODIFIED - add edit route)
```

**Files Already Exist (from previous stories):**
- `src/components/transactions/TransactionForm.tsx` (Story 3.1 - supports edit mode)
- `src/pages/TransactionFormPage.tsx` (Story 3.1 - wrapper for form)

**Routes:**
- `/transactions` - List view (Story 3.2)
- `/transactions/new` - Add form (Story 3.1)
- `/transactions/:id/edit` - Edit form (this story)

### Testing Strategy

From [tech-spec-epic-3.md](../tech-spec-epic-3.md#test-strategy-summary):

**Integration Testing:**
- Test complete edit flow: list → edit → update → back to list
- Test transaction loading by ID from URL parameter
- Test form pre-population with transaction data
- Test updateTransaction call with correct parameters
- Test navigation after success
- Test error handling (not found, update failure)
- Test ID immutability

**Component Testing:**
- TransactionFormPage in edit mode
- Edit button in TransactionsList
- Transaction not found error state

**Testing Tools:**
- Vitest for test runner
- React Testing Library for component rendering
- @testing-library/user-event for interactions
- Mock useParams, useNavigate, useAppContext

### Learnings from Previous Stories

**From Story 3.1: Create Transaction Form Component (Status: done)**

- **TransactionForm Component Available**: Fully implemented with edit mode support
- **Edit Mode Props**:
  - `mode='edit'` - Triggers edit behavior
  - `transaction={transactionObject}` - Pre-populates form
- **Edit Mode Behavior Already Implemented**:
  - Form pre-populates all fields from transaction prop
  - Submit button changes to "Update Transaction"
  - Calls `updateTransaction(id, updates)` on submit
  - Transaction ID preserved (never changes)
- **Wrapper Page Pattern**: TransactionFormPage handles routing and navigation
  - Located at `src/pages/TransactionFormPage.tsx`
  - Currently only handles create mode
  - Needs modification to support edit mode
- **Success Flow**: onSave callback navigates to /transactions list

**Implementation Notes:**
```typescript
// TransactionFormPage needs to:
import { useParams } from 'react-router-dom';
const { id } = useParams();
const { transactions } = useAppContext();
const transaction = transactions.find(t => t.id === id);
const mode = id ? 'edit' : 'create';

// Then pass to TransactionForm:
<TransactionForm
  mode={mode}
  transaction={transaction} // only if mode='edit'
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

[Source: .bmad-ephemeral/stories/3-1-create-transaction-form-component.md#Dev-Agent-Record]

**From Story 3.2: Transaction List View with Sorting (Status: ready-for-dev)**

- **Edit Button Pattern**: Add Edit button to each transaction row/card
- **Navigation**: Use `useNavigate()` to navigate to edit route
- **Button Styling**: Lucide Edit icon, icon button styling
- **Integration Point**: Edit button in list triggers navigation to /transactions/:id/edit

[Source: .bmad-ephemeral/stories/3-2-transaction-list-view-with-sorting.md]

**From Story 2.4: Set Up Global State Management (Status: done)**

- **updateTransaction Available**: `updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction>`
- **Signature**:
  - Accepts transaction ID (string) and partial updates object
  - Returns Promise with updated Transaction
  - Preserves id and createdAt
  - Updates updatedAt automatically
- **Validation**: updateTransaction validates updates before saving
- **State Propagation**: Changes automatically propagate to all components via AppContext
- **Error Handling**: Throws error if update fails, sets error state

**Implementation Notes:**
```typescript
import { useAppContext } from '../context/AppContext';
const { updateTransaction } = useAppContext();

// On submit (edit mode)
const updatedTransaction = await updateTransaction(transaction.id, {
  amount: parseFloat(amount),
  type,
  category,
  date,
  description: description.trim(),
});
```

[Source: .bmad-ephemeral/stories/2-4-set-up-global-state-management.md#Dev-Agent-Record]

### References

- [PRD.md - FR-1.3 Edit Transaction](../../docs/PRD.md#fr-1-transaction-management) - Edit transaction requirements
- [architecture.md - Routing](../../docs/architecture.md#core-technologies) - React Router patterns with parameters
- [tech-spec-epic-3.md - Edit Transaction Workflow](../tech-spec-epic-3.md#workflows-and-sequencing) - Complete workflow definition
- [tech-spec-epic-3.md - Acceptance Criteria AC-3.3](../tech-spec-epic-3.md#acceptance-criteria-authoritative) - Story 3.3 ACs from epic tech spec
- [epics.md - Story 3.3](../../docs/epics.md#story-33-edit-transaction-functionality) - Original story definition

## Dev Agent Record

### Context Reference

<!-- Path to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Will be filled by dev agent -->

### Debug Log References

<!-- Dev agent will document any issues encountered -->

### Completion Notes List

<!-- Dev agent will document:
- Edit route implementation
- TransactionFormPage edit mode modifications
- Edit button integration in list
- Transaction loading and error handling
- Testing approach and results
-->

### File List

<!-- Dev agent will list files created/modified:
NEW:
- None (reuses existing components)

MODIFIED:
- src/pages/TransactionsList.tsx (add Edit button)
- src/pages/TransactionFormPage.tsx (add edit mode logic)
- src/pages/TransactionFormPage.test.tsx (add edit mode tests)
- src/App.tsx (add edit route)

DELETED:
- None
-->

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob) with Epic 3 tech spec context and learnings from Stories 3.1 (form component) and 3.2 (list view)
