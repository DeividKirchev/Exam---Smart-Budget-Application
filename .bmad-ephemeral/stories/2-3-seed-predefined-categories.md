# Story 2.3: Seed Predefined Categories

Status: ready-for-review

## Story

As a system,
I want predefined income and expense categories loaded on first run,
so that users have immediate category options without manual setup (FR-2.1).

## Acceptance Criteria

1. **Category Constant File Created**
   - File created at `src/constants/categories.ts` with predefined category array
   - Exports `CATEGORIES` constant as read-only Category[] array
   - Exports `getCategoryById()` helper function to retrieve category by ID
   - Exports `getCategoriesByType()` helper function to filter categories by type ('income' | 'expense')
   - All exports have comprehensive JSDoc comments

2. **Income Categories Defined**
   - Category: Salary (id: 'salary', type: 'income', color: '#10B981', icon: 'Wallet')
   - Category: Freelance (id: 'freelance', type: 'income', color: '#059669', icon: 'Briefcase')
   - Category: Investment (id: 'investment', type: 'income', color: '#047857', icon: 'TrendingUp')
   - Category: Other Income (id: 'other-income', type: 'income', color: '#065F46', icon: 'PiggyBank')
   - All income categories use green color palette (#10B981 family - emerald shades)
   - Total: 4 income categories

3. **Expense Categories Defined**
   - Category: Rent/Mortgage (id: 'rent', type: 'expense', color: '#EF4444', icon: 'Home')
   - Category: Transport (id: 'transport', type: 'expense', color: '#DC2626', icon: 'Car')
   - Category: Food/Groceries (id: 'food', type: 'expense', color: '#B91C1C', icon: 'ShoppingCart')
   - Category: Entertainment (id: 'entertainment', type: 'expense', color: '#991B1B', icon: 'Film')
   - Category: Utilities (id: 'utilities', type: 'expense', color: '#F59E0B', icon: 'Lightbulb')
   - Category: Healthcare (id: 'healthcare', type: 'expense', color: '#D97706', icon: 'Heart')
   - Category: Shopping (id: 'shopping', type: 'expense', color: '#B45309', icon: 'ShoppingBag')
   - Category: Other Expense (id: 'other-expense', type: 'expense', color: '#92400E', icon: 'MoreHorizontal')
   - Expense categories use red/orange color palette (#EF4444 red family, #F59E0B amber family)
   - Total: 8 expense categories

4. **Category Data Structure Compliance**
   - Each category object matches Category interface from Story 2.1:
     ```typescript
     {
       id: string,          // Unique identifier (kebab-case)
       name: string,        // Display name with proper capitalization
       type: 'income' | 'expense',
       color: string,       // Hex color code (e.g., "#10B981")
       icon: string         // Lucide React icon name (e.g., "Wallet")
     }
     ```
   - All category IDs use kebab-case (e.g., 'other-income', 'food')
   - All colors are valid hex codes (#RRGGBB format)
   - All icon names are valid Lucide React icon component names

5. **Helper Functions Implemented**
   - `getCategoryById(id: string): Category | undefined` - Returns category by ID or undefined
   - `getCategoriesByType(type: 'income' | 'expense'): Category[]` - Filters categories by type
   - Both functions include JSDoc comments with examples
   - Functions use type-safe TypeScript implementations

6. **Visual Consistency Enforced**
   - Income categories: All green shades for positive financial events
   - Expense categories: Red/orange shades for outgoing money
   - Color progression: Darker shades for less common categories within each type
   - Icon selection: Clear, recognizable Lucide icons matching category purpose

7. **Category Icons Verified**
   - All icons are valid Lucide React component names
   - Icon names match exactly with lucide-react exports (e.g., 'Wallet' not 'wallet')
   - Icons visually represent their category (e.g., 'ShoppingCart' for Food, 'Home' for Rent)
   - No duplicate icons unless semantically appropriate

8. **Import/Export Structure**
   - Category interface imported from `src/models/Category.ts`
   - CATEGORIES exported as `as const satisfies readonly Category[]` for type safety
   - Named exports for all helper functions
   - File can be imported in validators, components, and context providers

9. **Integration with Validators**
   - Update `src/utils/validators.ts` to import CATEGORIES from constants file
   - Replace hardcoded PREDEFINED_CATEGORIES with imported CATEGORIES
   - Ensure `validateCategory()` function uses new constant
   - No functional change to validation logic, only data source

10. **Unit Tests for Categories**
    - Test file created at `src/constants/categories.test.ts`
    - Test CATEGORIES array has exactly 12 entries (4 income + 8 expense)
    - Test all income categories have type='income' and green colors
    - Test all expense categories have type='expense' and red/orange colors
    - Test getCategoryById() returns correct category
    - Test getCategoryById() returns undefined for non-existent ID
    - Test getCategoriesByType('income') returns exactly 4 categories
    - Test getCategoriesByType('expense') returns exactly 8 categories
    - Test all category IDs are unique
    - Test all color codes are valid hex format (#RRGGBB)
    - Coverage target: 100% for categories.ts (simple constant file)

## Tasks / Subtasks

- [ ] **Task 1: Create categories constant file** (AC: 1)
  - [ ] Create file `src/constants/categories.ts`
  - [ ] Import Category interface from `src/models/Category.ts`
  - [ ] Add JSDoc module comment explaining purpose

- [ ] **Task 2: Define income categories array** (AC: 2)
  - [ ] Create income categories array with 4 entries:
    - [ ] Salary (id: 'salary', green: #10B981, icon: 'Wallet')
    - [ ] Freelance (id: 'freelance', green: #059669, icon: 'Briefcase')
    - [ ] Investment (id: 'investment', green: #047857, icon: 'TrendingUp')
    - [ ] Other Income (id: 'other-income', green: #065F46, icon: 'PiggyBank')
  - [ ] Verify all have type: 'income'
  - [ ] Add JSDoc comments for income section

- [ ] **Task 3: Define expense categories array** (AC: 3)
  - [ ] Create expense categories array with 8 entries:
    - [ ] Rent/Mortgage (id: 'rent', red: #EF4444, icon: 'Home')
    - [ ] Transport (id: 'transport', red: #DC2626, icon: 'Car')
    - [ ] Food/Groceries (id: 'food', red: #B91C1C, icon: 'ShoppingCart')
    - [ ] Entertainment (id: 'entertainment', red: #991B1B, icon: 'Film')
    - [ ] Utilities (id: 'utilities', amber: #F59E0B, icon: 'Lightbulb')
    - [ ] Healthcare (id: 'healthcare', amber: #D97706, icon: 'Heart')
    - [ ] Shopping (id: 'shopping', amber: #B45309, icon: 'ShoppingBag')
    - [ ] Other Expense (id: 'other-expense', amber: #92400E, icon: 'MoreHorizontal')
  - [ ] Verify all have type: 'expense'
  - [ ] Add JSDoc comments for expense section

- [ ] **Task 4: Combine and export CATEGORIES constant** (AC: 4, 8)
  - [ ] Merge income and expense arrays into CATEGORIES
  - [ ] Export as: `export const CATEGORIES = [...incomeCategories, ...expenseCategories] as const satisfies readonly Category[];`
  - [ ] Verify total count is 12 categories
  - [ ] Add comprehensive JSDoc comment for CATEGORIES constant

- [ ] **Task 5: Implement getCategoryById helper** (AC: 5)
  - [ ] Create function: `export function getCategoryById(id: string): Category | undefined`
  - [ ] Use `CATEGORIES.find(cat => cat.id === id)`
  - [ ] Return undefined if not found
  - [ ] Add JSDoc with parameter description and example usage

- [ ] **Task 6: Implement getCategoriesByType helper** (AC: 5)
  - [ ] Create function: `export function getCategoriesByType(type: 'income' | 'expense'): Category[]`
  - [ ] Use `CATEGORIES.filter(cat => cat.type === type)`
  - [ ] Add JSDoc with parameter description and example usage

- [ ] **Task 7: Update validators to use CATEGORIES** (AC: 9)
  - [ ] Open `src/utils/validators.ts`
  - [ ] Import CATEGORIES: `import { CATEGORIES } from '../constants/categories';`
  - [ ] Remove hardcoded PREDEFINED_CATEGORIES object
  - [ ] Update validateCategory() to use: `CATEGORIES.find(c => c.id === categoryId && c.type === type)`
  - [ ] Ensure all validator tests still pass after change

- [ ] **Task 8: Create unit tests for categories** (AC: 10)
  - [ ] Create file `src/constants/categories.test.ts`
  - [ ] Import CATEGORIES, getCategoryById, getCategoriesByType
  - [ ] Test: CATEGORIES array length is 12
  - [ ] Test: 4 income categories exist with correct type and green colors
  - [ ] Test: 8 expense categories exist with correct type and red/orange colors
  - [ ] Test: getCategoryById() returns correct category for valid IDs
  - [ ] Test: getCategoryById() returns undefined for invalid ID
  - [ ] Test: getCategoriesByType('income') returns 4 categories
  - [ ] Test: getCategoriesByType('expense') returns 8 categories
  - [ ] Test: All category IDs are unique (no duplicates)
  - [ ] Test: All color codes match hex format (#RRGGBB)
  - [ ] Run `npm run test` and verify all tests pass

- [ ] **Task 9: Verify icon names with Lucide React** (AC: 7)
  - [ ] Check lucide-react documentation or package exports
  - [ ] Confirm all icon names are valid: Wallet, Briefcase, TrendingUp, PiggyBank, Home, Car, ShoppingCart, Film, Lightbulb, Heart, ShoppingBag, MoreHorizontal
  - [ ] Ensure proper PascalCase format for icon names

- [ ] **Task 10: Run existing validator tests** (AC: 9)
  - [ ] Run `npm run test src/utils/validators.test.ts`
  - [ ] Verify validateCategory() tests still pass after CATEGORIES integration
  - [ ] Fix any broken tests due to category ID changes (if any)

- [ ] **Task 11: TypeScript compilation** (AC: 1, 4, 8)
  - [ ] Run `npm run build` or `tsc --noEmit`
  - [ ] Verify no TypeScript errors
  - [ ] Ensure Category interface imports work correctly
  - [ ] Fix any type errors

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):
- **Data Relationships**: Category → Transaction is One-to-Many. Each transaction references a category by ID.
- **Predefined Categories**: 12-category system (4 income + 8 expense) with specified IDs, colors, and Lucide icon names
- **Color Scheme**: Income uses #10B981 green family, Expense uses #EF4444 red family and #F59E0B amber family
- **Constants Location**: `/src/constants/` folder for app-wide configuration and reference data
- **Naming Conventions**: Files use camelCase (categories.ts), exports use UPPER_CASE for constants (CATEGORIES)

### Tech Spec Compliance

From [tech-spec-epic-2.md](../tech-spec-epic-2.md):

**Predefined Categories (12 total):**
- Income (4): salary, freelance, investment, other-income
- Expense (8): rent, transport, food, entertainment, utilities, healthcare, shopping, other-expense

**Category Interface (from Story 2.1):**
```typescript
interface Category {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Display name
  type: 'income' | 'expense';    // Category classification
  color: string;                 // Hex color code (e.g., "#10B981")
  icon: string;                  // Lucide React icon name (e.g., "Wallet")
}
```

**Color Palette:**
- Income: Emerald green shades (#10B981, #059669, #047857, #065F46)
- Expense (Essential): Red shades (#EF4444, #DC2626, #B91C1C, #991B1B)
- Expense (Utilities/Discretionary): Amber shades (#F59E0B, #D97706, #B45309, #92400E)

**Icon Library:**
- Use Lucide React icon names (imported from 'lucide-react' package)
- Icons stored as strings matching component names (e.g., 'Wallet', 'Home')
- Components import icons: `import { Wallet, Home, ... } from 'lucide-react'`

### Project Structure Notes

**Files to Create:**
```
src/
└── constants/
    ├── categories.ts         (NEW - main category definitions)
    └── categories.test.ts    (NEW - unit tests)
```

**Files to Modify:**
```
src/
└── utils/
    └── validators.ts         (MODIFIED - import CATEGORIES instead of hardcoded list)
```

**Dependencies from Story 2.1:**
- `src/models/Category.ts` - Category interface (import)
- `src/utils/validators.ts` - Will be updated to use CATEGORIES constant

**No Directory Creation:**
- `src/constants/` directory may already exist from Epic 1 project setup
- If not, create directory as part of Task 1

### Testing Strategy

From [tech-spec-epic-2.md](../tech-spec-epic-2.md#test-strategy-summary):
- Use Vitest for unit testing (included with Vite from Epic 1)
- Test coverage target: 100% for categories.ts (simple constant file, no complex logic)
- Test categories.test.ts validates data structure integrity
- Test that validators.test.ts still passes after integration (regression testing)

**Test Coverage Focus:**
- Data structure validation (12 categories, correct types, valid colors)
- Helper function correctness (getCategoryById, getCategoriesByType)
- Uniqueness constraints (no duplicate IDs)
- Format validation (hex color codes, icon name strings)

### Learnings from Previous Story

**From Story 2.2: Implement LocalStorage Service (Status: ready-for-dev)**

Story 2.2 has been drafted with context generated, but not yet implemented. Once implemented, this section will contain relevant learnings.

**Expected Integration Points:**
- `storageService.loadTransactions()` will validate `transaction.category` against CATEGORIES (via validators)
- AppContext (Story 2.4) will load CATEGORIES into global state for UI components
- Transaction forms (Epic 3) will use CATEGORIES for dropdown/selection UI

**Note:** Story 2.3 can proceed independently. Categories are read-only constants that don't depend on storageService implementation.

### Learnings from Story 2.1

**From Story 2.1: Define Data Models & TypeScript Interfaces (Status: done)**

- **New Interfaces Created**: Category interface available at `src/models/Category.ts` - import this for type safety
- **Validation Pattern Established**: `src/utils/validators.ts` contains validateCategory() which currently uses hardcoded category list - this story will update it to use CATEGORIES constant
- **TypeScript Strict Mode**: Project uses strict TypeScript - all exports must be properly typed
- **JSDoc Standard**: All public interfaces and functions include comprehensive JSDoc comments

[Source: .bmad-ephemeral/stories/2-1-define-data-models-typescript-interfaces.md#Dev-Agent-Record]

### References

- [PRD.md - FR-2.1 Transaction Categorization](../../docs/PRD.md#fr-2-transaction-categorization) - Category requirement specification
- [PRD.md - Predefined Categories List](../../docs/PRD.md#predefined-categories) - Income and expense categories
- [architecture.md - Data Relationships](../../docs/architecture.md#data-relationships) - Category to Transaction relationship
- [architecture.md - Predefined Categories](../../docs/architecture.md#predefined-categories) - 12-category system with colors and icons
- [tech-spec-epic-2.md - Category Interface](../tech-spec-epic-2.md#data-models-and-contracts) - Complete Category interface specification
- [tech-spec-epic-2.md - Predefined Categories](../tech-spec-epic-2.md#data-models-and-contracts) - Category IDs and visual properties
- [epics.md - Story 2.3](../../docs/epics.md#story-23-seed-predefined-categories) - Original story definition

## Dev Agent Record

### Context Reference

- [2-3-seed-predefined-categories.context.xml](.bmad-ephemeral/stories/2-3-seed-predefined-categories.context.xml)

### Agent Model Used

claude-sonnet-4-5-20250929 (Amelia, Dev Agent)

### Debug Log References

No blocking issues. Updated validator tests to use new category IDs (changed 'groceries' → 'food', 'transportation' → 'transport', removed 'dining'). All tests passing after update.

### Completion Notes List

**New Constants Created:**
- `categories.ts` - Complete predefined categories with 12 categories (4 income + 8 expense)
- `categories.test.ts` - Comprehensive unit tests with 39 tests achieving 100% coverage

**Category IDs Established:**
- **Income (4)**: salary, freelance, investment, other-income
- **Expense (8)**: rent, transport, food, entertainment, utilities, healthcare, shopping, other-expense

**Color Scheme Applied:**
- Income categories: Emerald green palette (#10B981, #059669, #047857, #065F46)
- Expense categories: Red palette (#EF4444, #DC2626, #B91C1C, #991B1B) for essentials + Amber palette (#F59E0B, #D97706, #B45309, #92400E) for utilities/discretionary

**Icon Names (Lucide React):**
- All icons verified as valid Lucide React component names in PascalCase format
- Icons: Wallet, Briefcase, TrendingUp, PiggyBank, Home, Car, ShoppingCart, Film, Lightbulb, Heart, ShoppingBag, MoreHorizontal

**Architectural Decisions Made:**
1. **Type Safety**: Exported CATEGORIES as `as const satisfies readonly Category[]` for maximum type safety
2. **Helper Functions**: Provided `getCategoryById()` and `getCategoriesByType()` for easy category lookup and filtering
3. **Validator Integration**: Updated validators.ts to import CATEGORIES instead of hardcoded list, maintaining single source of truth
4. **Test Data Synchronization**: Updated validator tests to match new category IDs for regression testing

**Interfaces/Methods for Reuse:**
- `CATEGORIES` constant - Available for import in any component/context that needs category list
- `getCategoryById(id)` - Use for category lookup in transaction forms and validators
- `getCategoriesByType(type)` - Use for filtering categories in dropdown menus (e.g., show only expense categories when transaction type is expense)

**Technical Debt Deferred:**
- None - Implementation is complete per AC

**Warnings for Next Story:**
- Story 2.4 (AppContext) should import CATEGORIES for global state initialization
- Transaction forms (Epic 3) will need to filter categories by type using `getCategoriesByType()`
- Category validation in validators.ts now requires exact match of both ID and type

### File List

**NEW:**
- `smartbudget/src/constants/categories.ts` (166 lines) - Predefined categories constant with helper functions
- `smartbudget/src/constants/categories.test.ts` (389 lines) - Comprehensive unit tests (39 tests, 100% coverage)

**MODIFIED:**
- `smartbudget/src/utils/validators.ts` - Added CATEGORIES import, updated validateCategory() to use CATEGORIES.find() instead of hardcoded array
- `smartbudget/src/utils/validators.test.ts` - Updated expense category IDs to match new CATEGORIES (groceries→food, transportation→transport, removed dining)

**DELETED:**
- None

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob)
- 2025-11-15: Story implemented by Dev agent (Amelia) - All ACs satisfied, 39/39 category tests + 63/63 validator tests passing, 100% coverage for categories.ts
