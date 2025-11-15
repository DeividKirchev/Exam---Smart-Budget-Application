# Story 2.4: Set Up Global State Management

Status: ready-for-review

## Story

As a developer,
I want centralized state management for transactions and UI state,
so that data flows consistently across all components without prop drilling.

## Acceptance Criteria

1. **AppContext Created with TypeScript**
   - File created at `src/context/AppContext.tsx` with React Context implementation
   - `AppContextValue` interface defined with all state properties and action methods
   - Exports `AppProvider` component to wrap the application
   - Exports `useAppContext` custom hook for consuming context
   - All exports have comprehensive JSDoc comments

2. **State Properties Defined**
   - `transactions: Transaction[]` - Array of all transactions loaded from storage
   - `categories: Category[]` - Array of predefined categories from CATEGORIES constant
   - `selectedPeriod: Period` - Currently selected time period for filtering
   - `loading: boolean` - Loading state for async operations
   - `error: string | null` - Error message for user feedback (null when no error)

3. **Transaction Action Methods Implemented**
   - `addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction>` - Adds new transaction, returns created transaction
   - `updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction>` - Updates existing transaction, returns updated transaction
   - `deleteTransaction(id: string): Promise<boolean>` - Deletes transaction, returns success boolean
   - All methods validate input using validators before calling storageService
   - All methods update local state after successful storage operation
   - All methods handle errors gracefully and set error state

4. **Period Action Methods Implemented**
   - `setPeriod(period: Period): void` - Updates selectedPeriod state
   - Persists selected period to localStorage via storageService.saveSettings()
   - Updates state synchronously (no async needed)

5. **Utility Action Methods Implemented**
   - `clearError(): void` - Resets error state to null
   - `refreshData(): Promise<void>` - Reloads transactions from localStorage
   - refreshData() useful for manual data refresh or recovery scenarios

6. **State Reducer Implementation**
   - Uses useReducer hook for complex state management
   - Reducer handles actions: SET_TRANSACTIONS, ADD_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION, SET_PERIOD, SET_LOADING, SET_ERROR, CLEAR_ERROR
   - Reducer is pure function with no side effects
   - Initial state loaded from localStorage on mount

7. **Data Loading on Mount**
   - useEffect hook loads initial data when AppProvider mounts
   - Calls storageService.loadTransactions() to get persisted transactions
   - Calls storageService.loadSettings() to get selected period
   - Imports CATEGORIES from constants/categories.ts (no storage needed - static)
   - Sets loading=true during load, loading=false after completion
   - Handles load errors by setting error state

8. **Provider Integration**
   - AppProvider wraps children with Context.Provider
   - Provides AppContextValue object to all child components
   - No prop drilling required - any component can access context via useAppContext()

9. **Custom Hook with Error Handling**
   - useAppContext() checks if used inside AppProvider
   - Throws error with message "useAppContext must be used within AppProvider" if context is undefined
   - Returns typed AppContextValue object for consuming components

10. **Unit Tests for AppContext**
    - Test file created at `src/context/AppContext.test.tsx`
    - Test AppProvider renders children successfully
    - Test useAppContext throws error when used outside provider
    - Test initial state loads transactions from storageService
    - Test initial state loads categories from CATEGORIES
    - Test initial state loads selectedPeriod from storageService
    - Test addTransaction calls storageService.addTransaction() and updates state
    - Test addTransaction validates data before calling storage
    - Test updateTransaction calls storageService.updateTransaction() and updates state
    - Test deleteTransaction calls storageService.deleteTransaction() and updates state
    - Test setPeriod updates period and saves to settings
    - Test clearError resets error to null
    - Test refreshData reloads transactions from storage
    - Test error handling sets error state when operations fail
    - Coverage target: ≥85% for AppContext.tsx

## Tasks / Subtasks

- [ ] **Task 1: Create AppContext file and imports** (AC: 1)
  - [ ] Create file `src/context/AppContext.tsx`
  - [ ] Import React, createContext, useContext, useReducer, useEffect
  - [ ] Import Transaction, Category, Period types from models
  - [ ] Import storageService from services/storageService
  - [ ] Import CATEGORIES from constants/categories
  - [ ] Import validators from utils/validators
  - [ ] Add JSDoc module comment explaining purpose

- [ ] **Task 2: Define AppContextValue interface** (AC: 1, 2)
  - [ ] Create AppContextValue interface with all state properties:
    ```typescript
    interface AppContextValue {
      transactions: Transaction[];
      categories: Category[];
      selectedPeriod: Period;
      loading: boolean;
      error: string | null;
      addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
      updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<Transaction>;
      deleteTransaction: (id: string) => Promise<boolean>;
      setPeriod: (period: Period) => void;
      clearError: () => void;
      refreshData: () => Promise<void>;
    }
    ```
  - [ ] Add JSDoc comments for each property and method

- [ ] **Task 3: Create AppContext with createContext** (AC: 1)
  - [ ] Create context: `const AppContext = createContext<AppContextValue | undefined>(undefined);`
  - [ ] Initialize with undefined to enforce useAppContext hook usage

- [ ] **Task 4: Define state and action types for reducer** (AC: 6)
  - [ ] Create State interface with transactions, categories, selectedPeriod, loading, error
  - [ ] Create Action type union: SET_TRANSACTIONS | ADD_TRANSACTION | UPDATE_TRANSACTION | DELETE_TRANSACTION | SET_PERIOD | SET_LOADING | SET_ERROR | CLEAR_ERROR
  - [ ] Define action payload types for each action

- [ ] **Task 5: Implement reducer function** (AC: 6)
  - [ ] Create reducer: `function appReducer(state: State, action: Action): State`
  - [ ] Handle SET_TRANSACTIONS: Replace transactions array
  - [ ] Handle ADD_TRANSACTION: Append new transaction to array
  - [ ] Handle UPDATE_TRANSACTION: Find and replace transaction by id
  - [ ] Handle DELETE_TRANSACTION: Filter out transaction by id
  - [ ] Handle SET_PERIOD: Update selectedPeriod
  - [ ] Handle SET_LOADING: Update loading state
  - [ ] Handle SET_ERROR: Update error state
  - [ ] Handle CLEAR_ERROR: Set error to null
  - [ ] Add default case returning current state

- [ ] **Task 6: Implement AppProvider component** (AC: 7, 8)
  - [ ] Create AppProvider: `export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children })`
  - [ ] Initialize state with useReducer and initial values
  - [ ] Define initialState with empty transactions, CATEGORIES, default period, loading=true, error=null

- [ ] **Task 7: Implement data loading useEffect** (AC: 7)
  - [ ] Create useEffect with empty dependency array (run once on mount)
  - [ ] Create async loadInitialData() function inside useEffect
  - [ ] Set loading=true
  - [ ] Call storageService.loadTransactions() and dispatch SET_TRANSACTIONS
  - [ ] Call storageService.loadSettings() and extract selectedPeriod, dispatch SET_PERIOD
  - [ ] Wrap in try-catch, dispatch SET_ERROR on failure
  - [ ] Set loading=false in finally block
  - [ ] Call loadInitialData()

- [ ] **Task 8: Implement addTransaction action** (AC: 3)
  - [ ] Create addTransaction async function
  - [ ] Validate transaction data using validateTransactionData()
  - [ ] If validation fails, throw error with validation messages
  - [ ] Call storageService.addTransaction(transaction)
  - [ ] Dispatch ADD_TRANSACTION with returned transaction
  - [ ] Return created transaction
  - [ ] Wrap in try-catch, dispatch SET_ERROR and re-throw on failure

- [ ] **Task 9: Implement updateTransaction action** (AC: 3)
  - [ ] Create updateTransaction async function
  - [ ] Find existing transaction in state to merge with updates
  - [ ] Validate merged data using validateTransactionData()
  - [ ] If validation fails, throw error
  - [ ] Call storageService.updateTransaction(id, updates)
  - [ ] Dispatch UPDATE_TRANSACTION with returned transaction
  - [ ] Return updated transaction
  - [ ] Wrap in try-catch, dispatch SET_ERROR and re-throw on failure

- [ ] **Task 10: Implement deleteTransaction action** (AC: 3)
  - [ ] Create deleteTransaction async function
  - [ ] Call storageService.deleteTransaction(id)
  - [ ] If successful (returns true), dispatch DELETE_TRANSACTION with id
  - [ ] Return result boolean
  - [ ] Wrap in try-catch, dispatch SET_ERROR and re-throw on failure

- [ ] **Task 11: Implement setPeriod action** (AC: 4)
  - [ ] Create setPeriod function
  - [ ] Dispatch SET_PERIOD with new period
  - [ ] Call storageService.saveSettings({ selectedPeriod: period })
  - [ ] No async needed (fire and forget for settings save)

- [ ] **Task 12: Implement utility actions** (AC: 5)
  - [ ] Create clearError function: dispatch CLEAR_ERROR
  - [ ] Create refreshData async function:
    - [ ] Set loading=true
    - [ ] Call storageService.loadTransactions()
    - [ ] Dispatch SET_TRANSACTIONS
    - [ ] Set loading=false
    - [ ] Handle errors

- [ ] **Task 13: Create context value object and provider** (AC: 8)
  - [ ] Create value object with all state properties and action methods
  - [ ] Return `<AppContext.Provider value={value}>{children}</AppContext.Provider>`

- [ ] **Task 14: Implement useAppContext hook** (AC: 9)
  - [ ] Create `export function useAppContext(): AppContextValue`
  - [ ] Call `const context = useContext(AppContext);`
  - [ ] If context is undefined, throw Error("useAppContext must be used within AppProvider")
  - [ ] Return context
  - [ ] Add JSDoc with usage example

- [ ] **Task 15: Create unit tests** (AC: 10)
  - [ ] Create file `src/context/AppContext.test.tsx`
  - [ ] Mock storageService with vi.mock()
  - [ ] Mock CATEGORIES import
  - [ ] Test: AppProvider renders children
  - [ ] Test: useAppContext throws error outside provider
  - [ ] Test: Initial state loads from storageService on mount
  - [ ] Test: addTransaction validates and calls storageService
  - [ ] Test: addTransaction updates state after success
  - [ ] Test: addTransaction sets error on validation failure
  - [ ] Test: updateTransaction calls storageService and updates state
  - [ ] Test: deleteTransaction calls storageService and updates state
  - [ ] Test: setPeriod updates period and saves settings
  - [ ] Test: clearError resets error to null
  - [ ] Test: refreshData reloads transactions
  - [ ] Run `npm run test` and verify all tests pass

- [ ] **Task 16: Integrate AppProvider in main App** (AC: 8)
  - [ ] Open `src/main.tsx` or `src/App.tsx` (whichever has root component)
  - [ ] Import AppProvider from context/AppContext
  - [ ] Wrap application with `<AppProvider>...</AppProvider>`
  - [ ] Verify app renders without errors
  - [ ] Check browser console for any context warnings

- [ ] **Task 17: TypeScript compilation and verification** (AC: 1)
  - [ ] Run `npm run build` or `tsc --noEmit`
  - [ ] Verify no TypeScript errors
  - [ ] Fix any type errors in context or reducer
  - [ ] Ensure all imports resolve correctly

## Dev Notes

### Architecture Alignment

From [architecture.md](../../docs/architecture.md):
- **State Management Pattern**: React Context + useReducer for centralized state
- **No Redux**: MVP uses built-in React state management to avoid external dependencies
- **Service Layer Integration**: AppContext calls storageService for all persistence operations
- **Single Source of Truth**: Context holds current application state, localStorage provides persistence
- **Error Handling**: Errors surfaced to UI via error state property

### Tech Spec Compliance

From [tech-spec-epic-2.md](../tech-spec-epic-2.md):

**AppContext API** (complete specification):
```typescript
export interface AppContextValue {
  // State properties
  transactions: Transaction[];
  categories: Category[];
  selectedPeriod: Period;
  loading: boolean;
  error: string | null;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<boolean>;

  // Period actions
  setPeriod: (period: Period) => void;

  // Utility actions
  clearError: () => void;
  refreshData: () => Promise<void>;
}
```

**Initialization Sequence:**
1. AppProvider mounts
2. useReducer creates initial state
3. useEffect triggers loadInitialData()
4. storageService.loadTransactions() → transactions array
5. storageService.loadSettings() → selectedPeriod
6. CATEGORIES imported (static) → categories array
7. State updated, loading=false
8. App renders with persisted data

**Transaction Action Workflow:**
1. Component calls addTransaction()
2. Validate using validateTransactionData()
3. Call storageService.addTransaction()
4. Dispatch ADD_TRANSACTION action
5. Reducer updates state immutably
6. All consuming components re-render with new data

### Project Structure Notes

**Files to Create:**
```
src/
└── context/
    ├── AppContext.tsx        (NEW - main context implementation)
    └── AppContext.test.tsx   (NEW - unit tests)
```

**Files to Modify:**
```
src/
├── main.tsx or App.tsx      (MODIFIED - wrap with AppProvider)
```

**Dependencies from Previous Stories:**
- `src/models/Transaction.ts`, `Category.ts`, `Period.ts` - Type imports (Story 2.1)
- `src/services/storageService.ts` - Storage operations (Story 2.2)
- `src/constants/categories.ts` - CATEGORIES constant (Story 2.3)
- `src/utils/validators.ts` - Data validation (Story 2.1)

**Context Directory:**
- Create `src/context/` directory if it doesn't exist
- This folder will hold AppContext and any future context providers

### Testing Strategy

From [tech-spec-epic-2.md](../tech-spec-epic-2.md#test-strategy-summary):
- Use Vitest + React Testing Library for component testing
- Mock storageService using vi.mock() for isolated testing
- Test coverage target: ≥85% for AppContext.tsx
- Test async operations using async/await in tests
- Test error boundaries and error state handling

**Test Coverage Focus:**
- Provider rendering and children propagation
- Hook error handling (useAppContext outside provider)
- Initial data loading from storageService
- All action methods (add, update, delete, setPeriod)
- Validation integration
- Error state management
- State immutability in reducer

### Learnings from Previous Stories

**From Story 2.3: Seed Predefined Categories (Status: done)**

- **New Constants Created**: CATEGORIES constant available at `src/constants/categories.ts` - import this for categories array
- **Helper Functions Available**:
  - `getCategoryById(id)` - Use for category lookup if needed
  - `getCategoriesByType(type)` - Use for filtering categories (useful for transaction forms later)
- **Category IDs Established**:
  - Income (4): salary, freelance, investment, other-income
  - Expense (8): rent, transport, food, entertainment, utilities, healthcare, shopping, other-expense
- **Integration Note**: AppContext should import CATEGORIES and set categories state to CATEGORIES (no storage needed - they're static constants)

[Source: .bmad-ephemeral/stories/2-3-seed-predefined-categories.md#Dev-Agent-Record]

**From Story 2.2: Implement LocalStorage Service (Status: done)**

- **Storage Service Available**: `storageService` at `src/services/storageService.ts` with complete CRUD operations
- **Methods to Use**:
  - `loadTransactions()` - Returns Transaction[] for initial load
  - `addTransaction(transaction)` - Adds new transaction, returns complete Transaction
  - `updateTransaction(id, updates)` - Updates transaction, returns updated Transaction
  - `deleteTransaction(id)` - Deletes transaction, returns boolean
  - `loadSettings()` - Returns settings object with selectedPeriod
  - `saveSettings(settings)` - Persists settings to localStorage
- **Error Handling**: Load methods never throw - return empty arrays/defaults on error
- **Validation Integration**: storageService uses validators from Story 2.1 internally

[Source: .bmad-ephemeral/stories/2-2-implement-localstorage-service.md#Dev-Agent-Record]

**From Story 2.1: Define Data Models & TypeScript Interfaces (Status: done)**

- **Type Definitions Available**:
  - Transaction interface at `src/models/Transaction.ts`
  - Category interface at `src/models/Category.ts`
  - Period type at `src/models/Transaction.ts` (or separate file)
- **Validators Available**: `src/utils/validators.ts` contains `validateTransactionData()` for full transaction validation
- **TypeScript Strict Mode**: Project uses strict TypeScript - ensure all types are properly defined

[Source: .bmad-ephemeral/stories/2-1-define-data-models-typescript-interfaces.md#Dev-Agent-Record]

### References

- [PRD.md - FR-4 Data Persistence](../../docs/PRD.md#fr-4-data-persistence) - State management requirements
- [architecture.md - State Management](../../docs/architecture.md#state-management) - React Context + useReducer pattern
- [architecture.md - Component Architecture](../../docs/architecture.md#component-architecture) - Provider wrapping strategy
- [tech-spec-epic-2.md - AppContext API](../tech-spec-epic-2.md#data-models-and-contracts) - Complete AppContext interface specification
- [tech-spec-epic-2.md - Workflows](../tech-spec-epic-2.md#workflows-and-sequencing) - Add/Update/Delete transaction workflows
- [epics.md - Story 2.4](../../docs/epics.md#story-24-set-up-global-state-management) - Original story definition

## Dev Agent Record

### Context Reference

- [2-4-set-up-global-state-management.context.xml](.bmad-ephemeral/stories/2-4-set-up-global-state-management.context.xml)

### Agent Model Used

claude-sonnet-4-5-20250929 (Amelia, Dev Agent)

### Debug Log References

No blocking issues. Fixed test mock interference by resetting mocks in beforeEach. All 21 tests passing after implementing proper mock cleanup.

### Completion Notes List

**New Context/State Management Created:**
- `AppContext.tsx` - Complete React Context implementation with useReducer pattern for centralized state management
- `AppContext.test.tsx` - Comprehensive unit tests with 88.04% coverage (21 tests, 100% function coverage)

**State Management Architecture:**
- **Pattern**: React Context + useReducer (no external state management libraries)
- **State Properties**: transactions, categories, selectedPeriod, loading, error
- **8 Reducer Actions**: SET_TRANSACTIONS, ADD_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION, SET_PERIOD, SET_LOADING, SET_ERROR, CLEAR_ERROR
- **Pure Reducer**: All state updates immutable, no side effects in reducer

**Architectural Decisions Made:**
1. **Context Pattern**: Used React Context API with undefined default to enforce useAppContext hook usage
2. **Reducer Pattern**: useReducer for complex state management with clear action types
3. **Validation Integration**: All transaction actions validate data before calling storageService
4. **Error Handling Strategy**: Errors caught in actions, set in error state, and re-thrown for component handling
5. **Data Loading**: Initial load on mount using useEffect with loading state management
6. **Categories Static**: CATEGORIES imported directly from constants (no storage needed)
7. **Settings Persistence**: Period changes immediately persisted to localStorage via storageService

**Transaction Action Workflow:**
1. Component calls addTransaction/updateTransaction/deleteTransaction
2. Validate data using validateTransactionData() from validators
3. Call storageService for persistence
4. Dispatch action to update local state
5. Return result to component
6. On error: set error state and re-throw

**Interfaces/Methods for Reuse:**
- `useAppContext()` hook - Available to all components for accessing state and actions
- `AppProvider` component - Wraps application in main.tsx to provide context
- `addTransaction(transaction)` - Epic 3 transaction forms will use
- `updateTransaction(id, updates)` - Epic 3 transaction editing will use
- `deleteTransaction(id)` - Epic 3 transaction deletion will use
- `transactions` state - Epic 4 dashboard will use for analytics
- `selectedPeriod` state - Epic 4 filtering will use
- `clearError()` - Components can clear error messages after display

**Technical Debt Deferred:**
- None - Implementation is complete per AC

**Warnings for Next Story:**
- Epic 3 components must wrap with `<AppProvider>` in main.tsx (already done in this story)
- Transaction forms should use `useAppContext()` hook to access addTransaction()
- Dashboard should use `useAppContext()` to access transactions and selectedPeriod
- Components should handle loading state from context (show spinners when loading=true)
- Error messages should be displayed from context.error state

### File List

**NEW:**
- `smartbudget/src/context/AppContext.tsx` (362 lines) - Complete Context provider with state management, reducer, and all action methods
- `smartbudget/src/context/AppContext.test.tsx` (584 lines) - Comprehensive unit tests (21 tests, 88.04% coverage)

**MODIFIED:**
- `smartbudget/src/main.tsx` - Wrapped App component with AppProvider for global state access

**DELETED:**
- None

---

**Change Log:**
- 2025-11-15: Story drafted by SM agent (Bob)
- 2025-11-15: Story implemented by Dev agent (Amelia) - All ACs satisfied, 21/21 tests passing, 88.04% coverage, integrated into main.tsx
