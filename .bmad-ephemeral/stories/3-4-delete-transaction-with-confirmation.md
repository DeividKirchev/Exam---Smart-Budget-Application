# Story 3.4: Delete Transaction with Confirmation

Status: drafted

## Story

As a user,
I want to delete a transaction with confirmation,
so that I can remove mistakes without accidental deletions.

## Acceptance Criteria

1. **Delete Button in Transaction List**
   - Each transaction in TransactionsList (Story 3.2) has a "Delete" button/icon
   - Delete button uses Lucide Trash2 icon (trash can icon)
   - Button is visually distinct with danger styling (red/warning color)
   - Button has aria-label for accessibility: "Delete transaction"
   - On click, opens confirmation dialog (does not delete immediately)

2. **ConfirmDialog Component Created**
   - Reusable component created at `src/components/common/ConfirmDialog.tsx`
   - Component is modal/dialog overlay that blocks background interaction
   - Props interface: `isOpen`, `title`, `message`, `onConfirm`, `onCancel`, `variant`
   - Supports variants: 'danger' (red), 'warning' (yellow), 'info' (blue)
   - Component uses semantic HTML dialog or div with role="dialog"
   - Accessible with proper ARIA attributes and focus management

3. **Confirmation Dialog Display**
   - Dialog opens when Delete button clicked
   - Dialog displays over transaction list with backdrop/overlay
   - Backdrop is semi-transparent dark overlay that dims background
   - Title: "Delete Transaction"
   - Message: "Are you sure you want to delete this transaction? This action cannot be undone."
   - Two buttons: "Cancel" (secondary) and "Delete" (danger/red primary)
   - Dialog is centered on screen
   - Clicking backdrop closes dialog without deleting (same as Cancel)

4. **Cancel Action**
   - "Cancel" button closes dialog without any changes
   - Clicking backdrop (outside dialog) closes dialog without deleting
   - Pressing Escape key closes dialog without deleting
   - Transaction remains in list unchanged
   - No API calls made when cancelled

5. **Confirm Delete Action**
   - "Delete" button calls `deleteTransaction(id)` from AppContext
   - Loading state shown during delete operation (button disabled, spinner optional)
   - Transaction ID is passed correctly to deleteTransaction method
   - Dialog remains open during async delete operation

6. **Successful Deletion**
   - After successful deleteTransaction, dialog closes automatically
   - Transaction removed from list immediately (UI update via AppContext)
   - Success toast displays: "Transaction deleted"
   - Dashboard (Epic 4) automatically recalculates if implemented
   - List updates without page refresh (React state propagation)

7. **Delete Error Handling**
   - If deleteTransaction fails, error is caught and displayed
   - Error message: "Failed to delete transaction. Please try again."
   - Dialog remains open showing error
   - User can retry delete or cancel
   - Transaction remains in list if delete fails

8. **Transaction Not Found Handling**
   - If transaction doesn't exist when delete attempted (edge case):
     - Show error: "Transaction not found. It may have already been deleted."
     - Close dialog
     - Refresh transaction list to sync state

9. **Keyboard Accessibility**
   - Tab order: Cancel → Delete (logical order)
   - Enter key on "Delete" button confirms deletion
   - Escape key closes dialog (cancels)
   - Focus trapped within dialog while open
   - Focus returns to Delete button in list when dialog closes

10. **Visual Feedback**
    - Delete button has hover state (darker red, icon color change)
    - Dialog buttons have hover and active states
    - Delete button disabled during async operation
    - Optional: Fade-out animation when transaction removed from list
    - Dialog open/close with smooth transition (fade in/out)

11. **Mobile Responsiveness**
    - Dialog adapts to mobile screen size (full width on small screens, max-width on desktop)
    - Touch-friendly button sizes (min 44x44px)
    - Dialog readable and usable on all screen sizes
    - Backdrop blocks scrolling on mobile when dialog open

12. **Unit Tests**
    - Test file created: `src/components/common/ConfirmDialog.test.tsx`
    - Test file updated: `src/pages/TransactionsList.test.tsx`
    - Test: ConfirmDialog renders with title and message
    - Test: Cancel button closes dialog without calling onConfirm
    - Test: Delete button calls onConfirm callback
    - Test: Backdrop click closes dialog without confirming
    - Test: Escape key closes dialog
    - Test: Delete button in list opens confirmation dialog
    - Test: Confirming delete calls deleteTransaction with correct ID
    - Test: Successful delete removes transaction from list
    - Test: Delete error displays error message
    - Test: Dialog variant applies correct styling
    - Coverage target: ≥85% for ConfirmDialog and delete flow

## Tasks / Subtasks

- [ ] **Task 1: Create ConfirmDialog component file and interface** (AC: 2)
  - [ ] Create directory `src/components/common/`
  - [ ] Create file `src/components/common/ConfirmDialog.tsx`
  - [ ] Import React, useEffect (for focus management)
  - [ ] Define ConfirmDialogProps interface:
    ```typescript
    interface ConfirmDialogProps {
      isOpen: boolean;
      title: string;
      message: string;
      confirmLabel?: string;    // Default: "Confirm"
      cancelLabel?: string;     // Default: "Cancel"
      onConfirm: () => void;
      onCancel: () => void;
      variant?: 'danger' | 'warning' | 'info';  // Default: 'info'
    }
    ```
  - [ ] Add JSDoc module comment

- [ ] **Task 2: Implement ConfirmDialog component structure** (AC: 2, 3)
  - [ ] Render nothing if isOpen === false (return null)
  - [ ] If isOpen === true, render:
    - [ ] Backdrop div (full screen, semi-transparent, onClick={onCancel})
    - [ ] Dialog container (centered, white background)
    - [ ] Dialog content: Title, Message, Buttons
  - [ ] Use Tailwind for styling (backdrop, centering, card styling)
  - [ ] Apply variant styling to Delete/Confirm button

- [ ] **Task 3: Implement dialog accessibility** (AC: 2, 9)
  - [ ] Add role="dialog" and aria-modal="true" to dialog container
  - [ ] Add aria-labelledby pointing to title element
  - [ ] Add aria-describedby pointing to message element
  - [ ] Implement focus trap: focus stays within dialog when open
  - [ ] Use useEffect to focus first button when dialog opens
  - [ ] Return focus to trigger button when dialog closes

- [ ] **Task 4: Implement keyboard handlers** (AC: 4, 9)
  - [ ] Add Escape key listener: onKeyDown={(e) => e.key === 'Escape' && onCancel()}
  - [ ] Attach to dialog or document when dialog open
  - [ ] Clean up listener when dialog closes or unmounts
  - [ ] Enter key on Delete button triggers onConfirm (default button behavior)

- [ ] **Task 5: Implement Cancel and Confirm buttons** (AC: 4, 5)
  - [ ] Cancel button:
    - [ ] Label: props.cancelLabel || "Cancel"
    - [ ] onClick: onCancel
    - [ ] Style: secondary button (gray, outline)
  - [ ] Confirm/Delete button:
    - [ ] Label: props.confirmLabel || "Confirm"
    - [ ] onClick: onConfirm
    - [ ] Style: variant-based (danger=red, warning=yellow, info=blue)
    - [ ] For delete: use variant='danger' with red background

- [ ] **Task 6: Add Delete button to TransactionsList** (AC: 1)
  - [ ] Open `src/pages/TransactionsList.tsx`
  - [ ] Import Trash2 icon from lucide-react
  - [ ] Import ConfirmDialog component
  - [ ] Add state for dialog: `const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);`
  - [ ] Add state for transaction to delete: `const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);`
  - [ ] Add Delete button to each transaction row/card
  - [ ] Button onClick: `handleDeleteClick(transaction.id)`

- [ ] **Task 7: Implement delete click handler** (AC: 1, 3)
  - [ ] Create handleDeleteClick function:
    ```typescript
    const handleDeleteClick = (id: string) => {
      setTransactionToDelete(id);
      setDeleteDialogOpen(true);
    };
    ```
  - [ ] Store transaction ID to be deleted in state
  - [ ] Open confirmation dialog

- [ ] **Task 8: Implement delete confirmation handler** (AC: 5, 6)
  - [ ] Get deleteTransaction from useAppContext
  - [ ] Create handleDeleteConfirm async function:
    - [ ] Set loading state (optional: `setDeleting(true)`)
    - [ ] Call `await deleteTransaction(transactionToDelete)`
    - [ ] On success:
      - [ ] Show success toast: "Transaction deleted"
      - [ ] Close dialog: `setDeleteDialogOpen(false)`
      - [ ] Clear transactionToDelete state
    - [ ] Wrap in try-catch for error handling
  - [ ] Set as onConfirm callback for ConfirmDialog

- [ ] **Task 9: Implement delete cancel handler** (AC: 4)
  - [ ] Create handleDeleteCancel function:
    ```typescript
    const handleDeleteCancel = () => {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    };
    ```
  - [ ] Close dialog without deleting
  - [ ] Clear transactionToDelete state
  - [ ] Set as onCancel callback for ConfirmDialog

- [ ] **Task 10: Handle delete errors** (AC: 7)
  - [ ] In handleDeleteConfirm, wrap deleteTransaction in try-catch
  - [ ] On catch, set error state: `setDeleteError("Failed to delete transaction. Please try again.")`
  - [ ] Display error in dialog or as toast
  - [ ] Keep dialog open so user can retry or cancel
  - [ ] Provide "Retry" and "Cancel" options

- [ ] **Task 11: Render ConfirmDialog in TransactionsList** (AC: 3)
  - [ ] Add ConfirmDialog component to TransactionsList render:
    ```tsx
    <ConfirmDialog
      isOpen={deleteDialogOpen}
      title="Delete Transaction"
      message="Are you sure you want to delete this transaction? This action cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="danger"
      onConfirm={handleDeleteConfirm}
      onCancel={handleDeleteCancel}
    />
    ```

- [ ] **Task 12: Style Delete button** (AC: 1, 10)
  - [ ] Use Trash2 icon from Lucide
  - [ ] Apply danger/warning color: text-red-600 hover:text-red-800
  - [ ] Icon button styling (no text, just icon)
  - [ ] Add aria-label: "Delete transaction"
  - [ ] Ensure min touch target size on mobile (44x44px)
  - [ ] Add hover state with darker color

- [ ] **Task 13: Implement backdrop and dialog transitions** (AC: 10, 11)
  - [ ] Add Tailwind transition classes to backdrop and dialog
  - [ ] Backdrop: `transition-opacity duration-300`
  - [ ] Dialog: `transition-all duration-300 ease-out`
  - [ ] Optional: Use React Transition Group or Headless UI for animations
  - [ ] Ensure smooth fade in/out on open/close

- [ ] **Task 14: Prevent body scroll when dialog open** (AC: 11)
  - [ ] When dialog opens, add class to body: `overflow-hidden`
  - [ ] When dialog closes, remove class from body
  - [ ] Use useEffect to manage body class:
    ```typescript
    useEffect(() => {
      if (isOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
      return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);
    ```

- [ ] **Task 15: Create ConfirmDialog tests** (AC: 12)
  - [ ] Create file `src/components/common/ConfirmDialog.test.tsx`
  - [ ] Mock onConfirm and onCancel callbacks
  - [ ] Test: Component renders when isOpen=true
  - [ ] Test: Component does not render when isOpen=false
  - [ ] Test: Displays title and message correctly
  - [ ] Test: Cancel button calls onCancel
  - [ ] Test: Confirm button calls onConfirm
  - [ ] Test: Backdrop click calls onCancel
  - [ ] Test: Escape key calls onCancel
  - [ ] Test: Variant danger applies red styling
  - [ ] Test: Focus management (first button focused on open)
  - [ ] Run tests: npm run test

- [ ] **Task 16: Update TransactionsList tests for delete** (AC: 12)
  - [ ] Open `src/pages/TransactionsList.test.tsx`
  - [ ] Mock useAppContext to include deleteTransaction
  - [ ] Test: Delete button renders for each transaction
  - [ ] Test: Clicking Delete button opens confirmation dialog
  - [ ] Test: Dialog displays correct message
  - [ ] Test: Canceling dialog closes it without deleting
  - [ ] Test: Confirming dialog calls deleteTransaction with correct ID
  - [ ] Test: Successful delete removes transaction from list
  - [ ] Test: Successful delete shows success toast
  - [ ] Test: Delete error displays error message
  - [ ] Verify ≥85% coverage

- [ ] **Task 17: Manual end-to-end testing** (AC: all)
  - [ ] Navigate to /transactions list
  - [ ] Click Delete button on a transaction
  - [ ] Verify confirmation dialog appears
  - [ ] Test Cancel button (dialog closes, transaction remains)
  - [ ] Click Delete again, test backdrop click (dialog closes, transaction remains)
  - [ ] Click Delete again, test Escape key (dialog closes)
  - [ ] Click Delete again, click Confirm/Delete
  - [ ] Verify transaction is removed from list
  - [ ] Verify success toast appears
  - [ ] Test on mobile (responsive dialog, touch targets)
  - [ ] Test keyboard navigation (Tab, Enter, Escape)

- [ ] **Task 18: TypeScript compilation and verification** (AC: all)
  - [ ] Run `npm run build` or `tsc --noEmit`
  - [ ] Fix any TypeScript errors
  - [ ] Verify all imports resolve correctly
  - [ ] Ensure strict mode compliance

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):
- **Common Components**: ConfirmDialog is a reusable component in src/components/common/
- **State Management**: Uses deleteTransaction() from AppContext for data deletion
- **Component Pattern**: Modal/dialog pattern for user confirmation
- **Accessibility**: Focus management, ARIA attributes, keyboard navigation

### Tech Spec Compliance

From [tech-spec-epic-3.md](../tech-spec-epic-3.md):

**ConfirmDialog Component Specification:**
- Reusable modal component for confirmations
- Props: isOpen, title, message, onConfirm, onCancel, variant
- Variants support different styling (danger, warning, info)
- Accessible with ARIA attributes and keyboard support
- Blocks background interaction when open

**Delete Transaction Workflow:**
1. User on /transactions list
2. Click "Delete" button on transaction
3. ConfirmDialog opens with warning message
4. User clicks "Cancel" → dialog closes, no action
5. User clicks "Delete":
   - Call `deleteTransaction(id)` from AppContext
   - AppContext removes from state and localStorage
   - Dialog closes
   - Transaction removed from list
   - Success toast: "Transaction deleted"
6. Dashboard recalculates automatically (Epic 4)

**AppContext deleteTransaction API (from Story 2.4):**
```typescript
deleteTransaction(id: string): Promise<boolean>
```
- Accepts transaction ID
- Returns Promise<boolean> (true if successful)
- Removes from state and localStorage
- Updates all consuming components automatically

### Project Structure Notes

**Files to Create:**
```
src/
└── components/
    └── common/
        ├── ConfirmDialog.tsx              (NEW - reusable confirmation dialog)
        └── ConfirmDialog.test.tsx         (NEW - dialog tests)
```

**Files to Modify:**
```
src/
└── pages/
    ├── TransactionsList.tsx               (MODIFIED - add Delete button and dialog)
    └── TransactionsList.test.tsx          (MODIFIED - add delete tests)
```

**Component Reusability:**
- ConfirmDialog can be reused for other confirmations (future features)
- Generic props make it flexible for various use cases
- Variant system allows different styling contexts

### Testing Strategy

From [tech-spec-epic-3.md](../tech-spec-epic-3.md#test-strategy-summary):

**Component Testing - ConfirmDialog:**
- Test rendering based on isOpen prop
- Test button click callbacks
- Test keyboard handlers (Escape)
- Test backdrop click
- Test accessibility attributes
- Test variant styling

**Integration Testing - Delete Flow:**
- Test complete flow: click Delete → confirm → transaction removed
- Test cancel flow: click Delete → cancel → transaction remains
- Test error handling: delete fails → error message shown
- Test success feedback: delete succeeds → toast shown

**Testing Tools:**
- Vitest for test runner
- React Testing Library for component testing
- @testing-library/user-event for user interactions (click, keyboard)
- vi.mock() for mocking AppContext deleteTransaction

### Learnings from Previous Stories

**From Story 3.2: Transaction List View with Sorting (Status: ready-for-dev)**

- **Delete Button Placeholder**: Story 3.2 included Delete button placeholder
- **List Component**: TransactionsList.tsx is where Delete button will be functional
- **Integration Point**: Add onClick handler to existing Delete button
- **State Updates**: List already uses AppContext, so delete will auto-update via state propagation

[Source: .bmad-ephemeral/stories/3-2-transaction-list-view-with-sorting.md]

**From Story 2.4: Set Up Global State Management (Status: done)**

- **deleteTransaction Available**: `deleteTransaction(id: string): Promise<boolean>`
- **Signature**:
  - Accepts transaction ID (string)
  - Returns Promise<boolean> (true if successful, false if not found)
  - Removes from both state and localStorage
- **State Propagation**: Deletion automatically updates all components consuming transactions
- **Error Handling**: May throw error if localStorage fails, should be caught

**Implementation Notes:**
```typescript
import { useAppContext } from '../context/AppContext';
const { deleteTransaction } = useAppContext();

// On confirm delete
const success = await deleteTransaction(transactionId);
if (success) {
  // Show success toast
  // Close dialog
} else {
  // Show error: transaction not found
}
```

[Source: .bmad-ephemeral/stories/2-4-set-up-global-state-management.md#Dev-Agent-Record]

**From Story 3.1: Create Transaction Form Component (Status: done)**

- **Toast Pattern**: Story 3.1 implemented success toast notifications
- **Toast Library**: Check what toast solution was used (custom or library)
- **Reuse Pattern**: Use same toast approach for "Transaction deleted" message

[Source: .bmad-ephemeral/stories/3-1-create-transaction-form-component.md#Dev-Agent-Record]

### References

- [PRD.md - FR-1.4 Delete Transaction](../../docs/PRD.md#fr-1-transaction-management) - Delete transaction requirements with confirmation
- [architecture.md - Common Components](../../docs/architecture.md#project-structure) - Reusable component patterns
- [tech-spec-epic-3.md - ConfirmDialog Component](../tech-spec-epic-3.md#services-and-modules) - Detailed component specification
- [tech-spec-epic-3.md - Delete Transaction Workflow](../tech-spec-epic-3.md#workflows-and-sequencing) - Complete workflow definition
- [tech-spec-epic-3.md - Acceptance Criteria AC-3.4](../tech-spec-epic-3.md#acceptance-criteria-authoritative) - Story 3.4 ACs from epic tech spec
- [epics.md - Story 3.4](../../docs/epics.md#story-34-delete-transaction-with-confirmation) - Original story definition

## Dev Agent Record

### Context Reference

- [3-4-and-3-5-unified.context.xml](.bmad-ephemeral/stories/3-4-and-3-5-unified.context.xml) - Unified context with Story 3.5

### Agent Model Used

<!-- Will be filled by dev agent -->

### Debug Log References

<!-- Dev agent will document any issues encountered -->

### Completion Notes List

<!-- Dev agent will document:
- ConfirmDialog implementation approach
- Dialog accessibility features
- Delete button integration in list
- Error handling approach
- Testing results
-->

### File List

<!-- Dev agent will list files created/modified:
NEW:
- src/components/common/ConfirmDialog.tsx
- src/components/common/ConfirmDialog.test.tsx

MODIFIED:
- src/pages/TransactionsList.tsx (add Delete button functionality)
- src/pages/TransactionsList.test.tsx (add delete tests)

DELETED:
- None
-->

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob) with Epic 3 tech spec context and learnings from Stories 2.4 (deleteTransaction) and 3.2 (list view)
