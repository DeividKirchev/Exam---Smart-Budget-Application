# Story 2.1: Define Data Models & TypeScript Interfaces

Status: completed

## Story

As a developer,
I want clear data models for Transactions, Categories, and Periods with TypeScript interfaces and validation utilities,
so that data structure is consistent and type-safe throughout the application.

## Acceptance Criteria

1. **Transaction Interface Created**
   - Interface includes all 8 required fields: id, amount, date, category, type, description, createdAt, updatedAt
   - All fields have correct TypeScript types as specified in [tech-spec-epic-2.md](../tech-spec-epic-2.md#data-models-and-contracts)
   - Interface exported from `src/models/Transaction.ts` and importable throughout app
   - Comments document field purposes and constraints

2. **Category Interface Created**
   - Interface includes all 5 required fields: id, name, type, color, icon
   - Types correctly specified (type as 'income' | 'expense', color as string hex code)
   - Interface exported from `src/models/Category.ts`
   - Comments explain each field's purpose

3. **Period Type and Interface Defined**
   - PeriodType defined as union: 'this-month' | 'last-month' | 'last-3-months' | 'custom'
   - Period interface includes: type, startDate, endDate, label
   - All date fields use ISO 8601 string format
   - Interface exported from `src/models/Period.ts`

4. **Validation Utilities Created**
   - `validators.ts` created in `src/utils/` with all validation functions
   - `validateAmount()`: Rejects negative, NaN, Infinity, >2 decimals, zero
   - `validateDate()`: Rejects invalid dates, dates >1 year in future
   - `validateCategory()`: Validates category ID exists in predefined list, type matches
   - `sanitizeDescription()`: HTML entity encodes < > " ' characters, trims, enforces 200 char max
   - `validateTransactionData()`: Runs all validators, returns comprehensive validation result
   - Each validator returns `{ valid: boolean; error?: string }` or similar structure

5. **Type Definitions Compile**
   - All TypeScript interfaces compile without errors
   - TypeScript strict mode enabled (verify in tsconfig.json)
   - No `any` types used except where absolutely necessary
   - JSDoc comments on all interfaces explaining purpose

6. **Validation Functions Tested**
   - Unit tests written for all validators (using Vitest)
   - Tests cover valid inputs, invalid inputs, edge cases
   - Test coverage ≥90% for validators.ts
   - Example tests: negative amount, NaN, >2 decimals, invalid date, XSS attempts in description

## Tasks / Subtasks

- [x] **Task 1: Create Transaction interface** (AC: 1)
  - [x] Create `src/models/Transaction.ts` file
  - [x] Define Transaction interface with all 8 fields
  - [x] Add JSDoc comments explaining each field
  - [x] Add inline comments for validation constraints
  - [x] Export interface as named export

- [x] **Task 2: Create Category interface** (AC: 2)
  - [x] Create `src/models/Category.ts` file
  - [x] Define Category interface with all 5 fields
  - [x] Use strict literal types for `type` field
  - [x] Add JSDoc comments
  - [x] Export interface

- [x] **Task 3: Create Period types and interface** (AC: 3)
  - [x] Create `src/models/Period.ts` file
  - [x] Define PeriodType as union of 4 string literals
  - [x] Define Period interface with 4 fields
  - [x] Add JSDoc comments
  - [x] Export both type and interface

- [x] **Task 4: Create validation utilities** (AC: 4)
  - [x] Create `src/utils/validators.ts` file
  - [x] Implement `validateAmount()` with all business rules
  - [x] Implement `validateDate()` with format and range checks
  - [x] Implement `validateCategory()` with whitelist validation
  - [x] Implement `sanitizeDescription()` with XSS prevention
  - [x] Implement `validateTransactionData()` orchestrating all validators
  - [x] Add JSDoc comments to all functions
  - [x] Export all validators as named exports

- [x] **Task 5: Verify TypeScript compilation** (AC: 5)
  - [x] Run `npm run type-check` (or equivalent tsc command)
  - [x] Fix any compilation errors
  - [x] Verify strict mode enabled in tsconfig.json
  - [x] Ensure no `any` types used

- [x] **Task 6: Write unit tests for validators** (AC: 6)
  - [x] Create `src/utils/validators.test.ts` file
  - [x] Write tests for `validateAmount()`: valid amounts, negative, zero, NaN, Infinity, >2 decimals
  - [x] Write tests for `validateDate()`: valid dates, invalid format, far future, past dates
  - [x] Write tests for `validateCategory()`: valid categories, invalid ID, wrong type
  - [x] Write tests for `sanitizeDescription()`: clean text, XSS attempts (<script>), quotes, max length
  - [x] Write tests for `validateTransactionData()`: complete valid object, multiple errors
  - [x] Run `npm run test` and verify all tests pass
  - [x] Run `npm run test:coverage` and verify ≥90% coverage for validators.ts

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):
- **Data Models Section**: Implement Transaction, Category, and Period interfaces exactly as specified
- **Validation Patterns**: Follow validation error return pattern `{ valid: boolean; error?: string }`
- **Naming Conventions**:
  - Files: PascalCase for model files (Transaction.ts, Category.ts)
  - Interfaces: PascalCase (Transaction, Category)
  - Functions: camelCase (validateAmount, sanitizeDescription)
  - Constants: UPPER_SNAKE_CASE for validation rules
- **Security Architecture**: Implement XSS prevention through sanitization (NFR-2.1)

### Tech Spec Compliance

From [tech-spec-epic-2.md](../tech-spec-epic-2.md):

**Transaction Model Requirements:**
- `id`: UUID v4 format string
- `amount`: number (positive, max 2 decimals)
- `date`: ISO 8601 date string "YYYY-MM-DD"
- `category`: string (foreign key to Category.id)
- `type`: 'income' | 'expense' (literal union)
- `description`: string (max 200 chars, sanitized)
- `createdAt`: ISO 8601 timestamp string
- `updatedAt`: ISO 8601 timestamp string

**Validation Rules from Tech Spec:**
- Amount: Must be > 0, finite, rounds to 2 decimal places
- Date: Valid date, not >1 year in future (per PRD NFR-2.2)
- Category: Must exist in predefined list (will be defined in Story 2.3)
- Description: Max 200 chars, HTML entity encoding for < > " '

### Project Structure Notes

**Files to Create:**
```
src/
├── models/
│   ├── Transaction.ts    (NEW)
│   ├── Category.ts       (NEW)
│   └── Period.ts         (NEW)
└── utils/
    ├── validators.ts     (NEW)
    └── validators.test.ts (NEW)
```

**Directory Creation:**
- Create `src/models/` directory if it doesn't exist
- `src/utils/` should exist from Epic 1 project setup

### Testing Strategy

From [tech-spec-epic-2.md](../tech-spec-epic-2.md#test-strategy-summary):
- Use Vitest for unit testing (included with Vite from Epic 1)
- Target coverage: ≥90% for validators.ts (pure functions, easy to test)
- Test both success and failure cases
- Include edge cases and boundary conditions

**Testing Setup (if not already configured):**
```typescript
// src/test/setup.ts should exist from Epic 1
// validators.test.ts imports
import { describe, it, expect } from 'vitest';
import { validateAmount, validateDate, sanitizeDescription } from './validators';
```

### XSS Prevention Implementation

**sanitizeDescription() Implementation Guidance:**
```typescript
export const sanitizeDescription = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .substring(0, 200); // Enforce max length
};
```

### Validation Return Type Pattern

**Consistent across all validators:**
```typescript
type ValidationResult = {
  valid: boolean;
  error?: string;
};

// Example usage
export const validateAmount = (amount: number): ValidationResult => {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return { valid: false, error: 'Amount must be a finite number' };
  }
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }
  // Check 2 decimal places
  const decimals = (amount.toString().split('.')[1] || '').length;
  if (decimals > 2) {
    return { valid: false, error: 'Amount cannot have more than 2 decimal places' };
  }
  return { valid: true };
};
```

### Future Epic Integration

**Epic 3 (Transaction Management) will use:**
- Transaction interface for form type checking
- Validators for form validation
- Type definitions for props and state

**Epic 4 (Dashboard & Analytics) will use:**
- Period interface for time filtering
- Category interface for chart colors/icons

### References

- [PRD.md - FR-4.2 Data Structure](../../docs/PRD.md#fr-4-data-persistence) - Data model requirements
- [PRD.md - NFR-2.2 Data Validation](../../docs/PRD.md#nfr-2-security--data-integrity) - Validation rules
- [architecture.md - Data Models](../../docs/architecture.md#data-architecture) - Technical specifications
- [tech-spec-epic-2.md - Data Models](../tech-spec-epic-2.md#data-models-and-contracts) - Complete interface definitions
- [tech-spec-epic-2.md - Validator API](../tech-spec-epic-2.md#apis-and-interfaces) - Validation function signatures
- [epics.md - Story 2.1](../../docs/epics.md#story-21-define-data-models--typescript-interfaces) - Original story definition

## Dev Agent Record

### Context Reference

- [Story Context XML](.bmad-ephemeral/stories/2-1-define-data-models-typescript-interfaces.context.xml)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No debugging required. All implementations passed on first attempt after fixing date validation edge case.

### Completion Notes List

**Architectural Decisions:**
- Used happy-dom instead of jsdom for testing environment due to Node 18 compatibility
- Used istanbul coverage provider instead of v8 due to Node 18 limitations (node:inspector/promises not available)
- Enhanced date validation to prevent auto-correction (e.g., 2025-02-30 → 2025-03-02) by comparing ISO string output

**Patterns Created:**
- Consistent ValidationResult type pattern: `{ valid: boolean; error?: string }`
- Comprehensive JSDoc comments on all interfaces and functions
- Predefined categories list (basic structure for Story 2.3 expansion)
- HTML entity encoding pattern for XSS prevention

**Interfaces/Methods for Reuse:**
- Transaction, Category, Period interfaces - foundational for all future epics
- validateAmount(), validateDate(), validateCategory() - reusable in forms (Epic 3)
- sanitizeDescription() - XSS prevention for all user input
- validateTransactionData() - orchestrator pattern for comprehensive validation

**Warnings for Next Story (2.2 - LocalStorage Service):**
- Category validation currently uses hardcoded predefined list
- Story 2.3 will need to replace PREDEFINED_CATEGORIES with actual category data
- Consider creating shared constants file for category definitions

**Test Coverage:**
- 63 unit tests written, all passing
- 100% code coverage for validators.ts (exceeds ≥90% target)
- Comprehensive edge cases covered: NaN, Infinity, invalid dates, XSS attempts

### File List

**NEW FILES:**
- smartbudget/src/models/Transaction.ts
- smartbudget/src/models/Category.ts
- smartbudget/src/models/Period.ts
- smartbudget/src/utils/validators.ts
- smartbudget/src/utils/validators.test.ts
- smartbudget/src/test/setup.ts

**MODIFIED FILES:**
- smartbudget/vite.config.ts (added Vitest configuration)
- smartbudget/package.json (added test scripts and testing dependencies)

**DELETED FILES:**
None

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob)
- 2025-11-15: Story implemented and completed by Dev agent (Amelia) - All 6 ACs passed
