# Story 5.4: Form UX Enhancements

Status: review

## Story

As a user,
I want forms to be intuitive and provide helpful feedback,
so that I can add/edit transactions quickly without confusion.

## Acceptance Criteria

1. **AC-5.4.1: Auto-focus and Smart Defaults**
   - Amount field receives auto-focus when form opens
   - Date field defaults to today's date
   - Type field defaults to "Expense" (most common use case)
   - Description field is optional (clearly marked)

2. **AC-5.4.2: Dynamic Category Filtering**
   - Category dropdown filters based on Income/Expense toggle
   - When user selects "Income", only income categories shown
   - When user selects "Expense", only expense categories shown
   - Category selection resets when type changes (if invalid for new type)

3. **AC-5.4.3: Real-time Validation with Inline Errors**
   - Amount validates on blur: must be > 0, max 2 decimals
   - Date validates on blur: must be valid date, not future date
   - Category validates on blur: must be selected
   - Validation errors show inline below field (not alert/toast)
   - Error messages are clear and actionable (e.g., "Amount must be greater than $0")

4. **AC-5.4.4: Visual States and Feedback**
   - Fields have clear visual states: default, focus, error, success
   - Focus state: blue border, subtle shadow
   - Error state: red border, red error text below
   - Success state (optional): green checkmark after validation passes
   - Helpful placeholder text in all fields

5. **AC-5.4.5: Mobile Keyboard Optimization**
   - Amount field uses numeric keyboard on mobile (inputMode="decimal")
   - Date field uses native date picker on mobile
   - Description field uses standard text keyboard
   - All fields properly labeled for screen readers

6. **AC-5.4.6: Submit Button States**
   - Submit button disabled until form is valid
   - Disabled state: gray, not clickable, cursor not-allowed
   - Enabled state: blue, clickable, cursor pointer
   - Loading state: spinner shown during save, button text "Saving..."
   - Success feedback: "Transaction saved!" message after successful save

7. **AC-5.4.7: Cancel and Reset Behavior**
   - "Cancel" button clears form and navigates back to previous page
   - Confirmation prompt if form has unsaved changes
   - "Reset" button (optional) clears all fields but stays on form

## Tasks / Subtasks

- [ ] **Task 1**: Implement auto-focus on Amount field (AC: #1)
  - [ ] 1.1: Open `/src/components/transactions/TransactionForm.tsx`
  - [ ] 1.2: Add useRef hook for amount input
  - [ ] 1.3: Call focus() on amount ref in useEffect on component mount
  - [ ] 1.4: Test that amount field receives focus when form loads
  - [ ] 1.5: Ensure focus works on both Add and Edit modes

- [ ] **Task 2**: Set smart default values (AC: #1)
  - [ ] 2.1: Set date field default to today using date-fns format(new Date(), 'yyyy-MM-dd')
  - [ ] 2.2: Set type field default to "expense"
  - [ ] 2.3: Leave amount and description empty (user input required)
  - [ ] 2.4: Verify defaults in Add mode (not Edit mode - should use existing values)
  - [ ] 2.5: Test that defaults populate correctly on form load

- [ ] **Task 3**: Implement dynamic category filtering (AC: #2)
  - [ ] 3.1: Import INCOME_CATEGORIES and EXPENSE_CATEGORIES from constants
  - [ ] 3.2: Create filteredCategories computed value based on selected type
  - [ ] 3.3: Update category dropdown to show only filteredCategories
  - [ ] 3.4: Add onChange handler for type field to reset category if invalid
  - [ ] 3.5: Test: Select Income → verify only income categories shown
  - [ ] 3.6: Test: Switch from Income to Expense → verify categories update
  - [ ] 3.7: Test: Category resets when switching type with incompatible category

- [ ] **Task 4**: Implement real-time validation (AC: #3)
  - [ ] 4.1: Create validation state object: { amount: '', date: '', category: '' }
  - [ ] 4.2: Create validateAmount function (amount > 0, max 2 decimals)
  - [ ] 4.3: Create validateDate function (valid date, not future)
  - [ ] 4.4: Create validateCategory function (not empty)
  - [ ] 4.5: Add onBlur handlers to each field to trigger validation
  - [ ] 4.6: Update validation state with error messages
  - [ ] 4.7: Display error messages below each field (conditionally rendered)

- [ ] **Task 5**: Create field visual states (AC: #4)
  - [ ] 5.1: Define base input classes (border, padding, rounded)
  - [ ] 5.2: Add focus state classes (focus:ring-2 focus:ring-blue-500)
  - [ ] 5.3: Add error state classes (border-red-500 conditionally applied)
  - [ ] 5.4: Create error message component (red text, small, icon optional)
  - [ ] 5.5: Add placeholder text to all fields
  - [ ] 5.6: Test all states visually at different breakpoints

- [ ] **Task 6**: Optimize mobile keyboard types (AC: #5)
  - [ ] 6.1: Add inputMode="decimal" to amount field
  - [ ] 6.2: Add type="number" with step="0.01" to amount field
  - [ ] 6.3: Add type="date" to date field (native picker on mobile)
  - [ ] 6.4: Add type="text" to description field
  - [ ] 6.5: Test on mobile device/emulator - verify correct keyboards appear
  - [ ] 6.6: Add aria-label to all fields for accessibility

- [ ] **Task 7**: Implement submit button states (AC: #6)
  - [ ] 7.1: Create isFormValid computed value (all validations pass)
  - [ ] 7.2: Add disabled attribute to submit button when !isFormValid
  - [ ] 7.3: Apply disabled styles (bg-gray-300 text-gray-500 cursor-not-allowed)
  - [ ] 7.4: Create loading state (isSubmitting)
  - [ ] 7.5: Show spinner and "Saving..." text during submission
  - [ ] 7.6: Add success message after save (toast or inline message)
  - [ ] 7.7: Test submit button in all states (disabled, enabled, loading, success)

- [ ] **Task 8**: Implement cancel behavior (AC: #7)
  - [ ] 8.1: Add Cancel button next to Submit button
  - [ ] 8.2: Track form dirty state (has user made changes)
  - [ ] 8.3: Show confirmation dialog if dirty: "Discard unsaved changes?"
  - [ ] 8.4: Navigate back to previous page on cancel (use navigate(-1))
  - [ ] 8.5: Test cancel with no changes (immediate navigation)
  - [ ] 8.6: Test cancel with changes (confirmation prompt appears)

- [ ] **Task 9**: Add helpful placeholder text (AC: #4)
  - [ ] 9.1: Amount placeholder: "0.00"
  - [ ] 9.2: Date placeholder: "Select date" (though type="date" may not need it)
  - [ ] 9.3: Category placeholder: "Select a category"
  - [ ] 9.4: Description placeholder: "Optional: Add a note about this transaction"
  - [ ] 9.5: Verify placeholders are helpful and not redundant with labels

- [ ] **Task 10**: Comprehensive form UX testing (AC: All)
  - [ ] 10.1: Test full happy path: Fill form → Submit → Success
  - [ ] 10.2: Test validation errors: Submit invalid form → See inline errors
  - [ ] 10.3: Test mobile keyboards: Open on mobile → Verify numeric/date keyboards
  - [ ] 10.4: Test category filtering: Toggle Income/Expense → Verify categories update
  - [ ] 10.5: Test cancel with changes: Edit form → Cancel → See confirmation
  - [ ] 10.6: Test auto-focus: Open form → Amount field focused
  - [ ] 10.7: Test accessibility: Tab through form → All fields reachable, labels read
  - [ ] 10.8: Test loading state: Submit → See spinner → Success message

## Dev Notes

### Architecture Patterns

**Form State Management Pattern:**
- Use controlled components (React state for all form fields)
- Validation state separate from form data state
- Real-time validation on blur, final validation on submit
- Pattern from [Architecture: Component Patterns](docs/architecture.md#Component-Patterns)

**Validation Pattern:**
```typescript
interface ValidationErrors {
  amount?: string;
  date?: string;
  category?: string;
  description?: string;
}

const validateAmount = (amount: number): string | undefined => {
  if (!amount || amount <= 0) return "Amount must be greater than $0";
  if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) return "Amount can have max 2 decimal places";
  return undefined;
};
```

**Mobile Input Types:**
```tsx
// Amount field - numeric keyboard on mobile
<input
  type="number"
  inputMode="decimal"
  step="0.01"
  placeholder="0.00"
/>

// Date field - native date picker on mobile
<input
  type="date"
  max={format(new Date(), 'yyyy-MM-dd')}
/>
```

**Dynamic Category Filtering:**
```typescript
const filteredCategories = useMemo(() => {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}, [type]);
```

### Project Structure Notes

**Files to Modify:**
- `/src/components/transactions/TransactionForm.tsx` - Main form component with all UX enhancements

**Files to Create:**
- None (all enhancements in existing form component)

**Dependencies:**
- React hooks: useState, useEffect, useRef, useMemo
- date-fns: format, isAfter, isValid
- React Router: useNavigate (for cancel navigation)
- Existing categories constant: INCOME_CATEGORIES, EXPENSE_CATEGORIES

### Testing Standards

**Manual Testing Checklist:**
1. **Auto-focus**: Open Add Transaction → Amount field has focus
2. **Smart Defaults**: Form shows today's date, "Expense" selected
3. **Category Filtering**: Toggle Income/Expense → Categories update dynamically
4. **Validation - Amount**: Enter "-10" → Blur → See "Amount must be greater than $0"
5. **Validation - Date**: Select future date → Blur → See error
6. **Validation - Category**: Leave empty → Blur → See error
7. **Visual States**: Click field → Blue focus ring, Enter invalid value → Red border
8. **Mobile Keyboards**: Open form on mobile → Amount shows numeric keyboard, Date shows date picker
9. **Submit Disabled**: Leave form invalid → Submit button gray and disabled
10. **Submit Enabled**: Fill valid form → Submit button blue and clickable
11. **Loading State**: Submit → See spinner and "Saving..." text
12. **Success Message**: After save → See "Transaction saved!" message
13. **Cancel - No Changes**: Open form → Click Cancel → Navigate back immediately
14. **Cancel - With Changes**: Edit form → Click Cancel → See "Discard changes?" confirmation
15. **Accessibility**: Tab through form → All fields reachable, screen reader reads labels

**Browser/Device Testing:**
- Test on Chrome, Firefox, Safari (desktop)
- Test on iOS Safari (mobile - verify native date picker)
- Test on Android Chrome (mobile - verify numeric keyboard)
- Test on tablet (iPad, Android tablet)

**Accessibility Testing:**
- All inputs have associated labels (for or aria-label)
- Error messages announced by screen reader (aria-live)
- Focus states clearly visible
- Touch targets ≥44x44px on mobile

### References

- [Epics: Story 5.4 - Form UX Enhancements](docs/epics.md#Story-5.4-Form-UX-Enhancements)
- [PRD: FR-1.1 - Add Transaction](docs/PRD.md#FR-1-Transaction-Management)
- [PRD: NFR-4.1 - Usability Standards](docs/PRD.md#NFR-4-Usability)
- [PRD: NFR-4.2 - Error Handling](docs/PRD.md#NFR-4-Usability)
- [Architecture: Form Validation Pattern](docs/architecture.md#Error-Handling)
- [Architecture: Component Patterns](docs/architecture.md#Component-Patterns)

### Key Implementation Details

**Form Component Structure:**
```tsx
// /src/components/transactions/TransactionForm.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isAfter, isValid } from 'date-fns';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories';

interface FormData {
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description: string;
}

interface ValidationErrors {
  amount?: string;
  date?: string;
  category?: string;
}

export const TransactionForm = ({ mode = 'create', initialData = null }) => {
  const navigate = useNavigate();
  const amountRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    amount: initialData?.amount || '',
    type: initialData?.type || 'expense',
    category: initialData?.category || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    description: initialData?.description || ''
  });

  // Validation state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-focus amount field on mount
  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  // Track dirty state
  useEffect(() => {
    if (mode === 'create') {
      const hasData = formData.amount || formData.description;
      setIsDirty(!!hasData);
    }
  }, [formData, mode]);

  // Filtered categories based on type
  const filteredCategories = useMemo(() => {
    return formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }, [formData.type]);

  // Validation functions
  const validateAmount = (value: string): string | undefined => {
    const num = parseFloat(value);
    if (!value || isNaN(num) || num <= 0) {
      return "Amount must be greater than $0";
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return "Amount can have max 2 decimal places";
    }
    return undefined;
  };

  const validateDate = (value: string): string | undefined => {
    const date = new Date(value);
    if (!value || !isValid(date)) {
      return "Please select a valid date";
    }
    if (isAfter(date, new Date())) {
      return "Date cannot be in the future";
    }
    return undefined;
  };

  const validateCategory = (value: string): string | undefined => {
    if (!value) return "Please select a category";
    return undefined;
  };

  // Handle field blur (trigger validation)
  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let error: string | undefined;
    if (field === 'amount') error = validateAmount(formData.amount);
    else if (field === 'date') error = validateDate(formData.date);
    else if (field === 'category') error = validateCategory(formData.category);

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle field change
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Reset category if type changes and current category is incompatible
    if (field === 'type') {
      const newFilteredCategories = value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      const isCategoryValid = newFilteredCategories.some(cat => cat.id === formData.category);
      if (!isCategoryValid) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    }
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      !validateAmount(formData.amount) &&
      !validateDate(formData.date) &&
      !validateCategory(formData.category)
    );
  }, [formData]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const amountError = validateAmount(formData.amount);
    const dateError = validateDate(formData.date);
    const categoryError = validateCategory(formData.category);

    if (amountError || dateError || categoryError) {
      setErrors({ amount: amountError, date: dateError, category: categoryError });
      setTouched({ amount: true, date: true, category: true });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save transaction logic here
      // await saveTransaction(formData);

      // Show success message
      // toast.success("Transaction saved!");

      // Navigate back
      navigate('/transactions');
    } catch (error) {
      console.error('Failed to save transaction:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm("You have unsaved changes. Discard them?");
      if (!confirmDiscard) return;
    }
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Add Transaction' : 'Edit Transaction'}
      </h1>

      {/* Amount Field */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount *
        </label>
        <input
          ref={amountRef}
          id="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          onBlur={() => handleBlur('amount')}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            touched.amount && errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {touched.amount && errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      {/* Type Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={(e) => handleChange('type', e.target.value)}
              className="mr-2"
            />
            Income
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={(e) => handleChange('type', e.target.value)}
              className="mr-2"
            />
            Expense
          </label>
        </div>
      </div>

      {/* Category Field */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            touched.category && errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          {filteredCategories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {touched.category && errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Date Field */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          id="date"
          type="date"
          max={format(new Date(), 'yyyy-MM-dd')}
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          onBlur={() => handleBlur('date')}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            touched.date && errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {touched.date && errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <input
          id="description"
          type="text"
          placeholder="Optional: Add a note about this transaction"
          maxLength={200}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/200 characters
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`flex-1 py-2 px-4 rounded-md font-medium ${
            isFormValid && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            mode === 'create' ? 'Add Transaction' : 'Save Changes'
          )}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
```

**Form Validation Summary:**
- Amount: > 0, max 2 decimals
- Date: Valid date, not in future
- Category: Must be selected
- Description: Optional, max 200 chars

**Mobile Optimization:**
- inputMode="decimal" for amount (numeric keyboard)
- type="date" for date (native date picker)
- Touch targets ≥44x44px
- Full-width inputs on mobile for easier tapping

### Learnings from Previous Story

**From Story 5.3 (Status: drafted)**

Story 5.3 focused on responsive dashboard layout. Key takeaways for this story:

- **Responsive Form Patterns**: Apply same mobile-first approach (base styles, then md:, lg:)
- **useMediaQuery Hook Available**: Can use for conditional mobile/desktop behavior if needed
- **Touch Target Standards**: Maintain ≥44x44px for all buttons and inputs on mobile
- **Tailwind Responsive Classes**: Use text-sm md:text-base for responsive text sizing
- **Mobile Optimization Priority**: Form fields must be touch-friendly and properly sized

**Responsive Form Considerations:**
- Form container: max-w-lg for desktop, full-width with padding on mobile
- Input fields: Full-width on mobile for easy tapping
- Buttons: Full-width on mobile, side-by-side on desktop
- Error messages: Adequate spacing below fields on mobile
- Form should be testable at 320px, 768px, 1024px breakpoints

**Pattern Alignment:**
- Follow same validation pattern as existing forms (if any)
- Consistent button styling with other components
- Error messages styled consistently with app theme
- Loading states match dashboard loading patterns

[Source: stories/5-3-responsive-dashboard-layout.md]

## Dev Agent Record

### Context Reference

**Mutual Context File:** [.bmad-ephemeral/stories/5-345-ui-enhancements.context.xml](.bmad-ephemeral/stories/5-345-ui-enhancements.context.xml)

This story shares context with Stories 5.3 (Responsive Dashboard Layout) and 5.5 (Error States & Empty States). The mutual context file contains comprehensive documentation of shared components, dependencies, responsive breakpoints, design patterns, and implementation notes that apply across all three stories.

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
