# Epic Technical Specification: Data Layer & State Management

Date: 2025-11-15
Author: Deyvid
Epic ID: 2
Status: Draft

---

## Overview

Epic 2 establishes the foundational data architecture for SmartBudget by implementing robust data models, persistent storage mechanisms, and global state management. This epic creates the critical data infrastructure that all subsequent features (transaction management, dashboard analytics) depend upon. The implementation leverages React Context API for state management and browser LocalStorage for client-side data persistence, aligning with the MVP strategy of simplicity and rapid development without backend dependencies.

This epic directly addresses FR-4 (Data Persistence) and enables FR-1 (Transaction Management) and FR-3 (Dashboard & Analytics) by providing the data layer foundation. The technical implementation follows the architecture decisions documented in [architecture.md](../../docs/architecture.md), specifically ADR-002 (React Context API), ADR-003 (LocalStorage), and ADR-006 (TypeScript).

## Objectives and Scope

**Primary Objectives:**
1. Define type-safe data models for Transaction and Category entities with comprehensive validation
2. Implement LocalStorage service layer providing CRUD operations with error handling and data integrity checks
3. Create predefined category system with visual identifiers (colors, icons) for income and expense classification
4. Establish global state management using React Context API for transactions, categories, and UI state
5. Ensure data persistence across browser sessions with graceful handling of storage limitations

**In Scope:**
- TypeScript interfaces for Transaction, Category, and Period models (Story 2.1)
- LocalStorage service with save/load/delete operations (Story 2.2)
- Predefined categories: 4 income + 8 expense categories with colors and icons (Story 2.3)
- AppContext provider with state and actions for transaction management (Story 2.4)
- Data validation utilities ensuring PRD constraints (positive amounts, valid dates, 2-decimal precision)
- Error handling for storage quota exceeded and data corruption scenarios
- Schema versioning for future data migration support

**Out of Scope (Deferred):**
- Backend API integration (MVP limitation - LocalStorage only)
- User authentication and multi-user support (Future)
- Custom category creation (MVP uses predefined categories only)
- IndexedDB implementation (LocalStorage sufficient for MVP scale <1000 transactions)
- Real-time data synchronization across devices (no backend in MVP)
- Transaction import/export functionality (Epic 6 or post-MVP)
- Advanced query optimization (client-side filtering sufficient for MVP)

## System Architecture Alignment

**Architecture Document Compliance:**
This epic implements the Data Architecture section from [architecture.md](../../docs/architecture.md), specifically:

- **Data Models** (Architecture §Data Architecture): Implements Transaction, Category, and Period TypeScript interfaces exactly as specified with ISO 8601 date formats, UUID v4 IDs, and strict type constraints
- **LocalStorage Schema** (Architecture §Data Architecture): Uses storage keys `smartbudget_transactions`, `smartbudget_settings`, and `smartbudget_schema_version` with JSON serialization
- **State Management Pattern** (Architecture §State Management Patterns): Implements AppState interface with transactions[], categories[], selectedPeriod, filters, loading, and error properties
- **Predefined Categories** (Architecture §Data Relationships): Deploys exact 12-category system (4 income + 8 expense) with specified IDs, colors (#10B981 green family for income, #EF4444 red family for expenses), and Lucide icon names

**Component Dependencies:**
- **src/models/**: Transaction.ts, Category.ts, Period.ts (Story 2.1)
- **src/services/**: storageService.ts (Story 2.2)
- **src/constants/**: categories.ts (Story 2.3)
- **src/context/**: AppContext.tsx, types.ts (Story 2.4)
- **src/utils/**: validators.ts for data validation utilities

**Architectural Constraints Met:**
1. **Type Safety**: All data models use TypeScript interfaces with strict null checks enabled
2. **Single Source of Truth**: Global state managed exclusively through AppContext, no component-local persistence
3. **Service Layer Separation**: Business logic and storage operations isolated in service modules, never in UI components
4. **Error Boundaries**: Storage errors handled gracefully without breaking application state
5. **Consistency Rules**: Naming conventions followed (PascalCase for types, camelCase for functions, UPPER_SNAKE_CASE for constants)

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Owner Story |
|--------|---------------|--------|---------|-------------|
| **models/Transaction.ts** | Define Transaction interface and validation types | N/A (type definitions) | TypeScript interface, validation schemas | Story 2.1 |
| **models/Category.ts** | Define Category interface with visual properties | N/A (type definitions) | TypeScript interface | Story 2.1 |
| **models/Period.ts** | Define Period types and interfaces for date filtering | N/A (type definitions) | TypeScript types and interfaces | Story 2.1 |
| **services/storageService.ts** | Handle all LocalStorage operations with error handling | Transaction objects, category data | CRUD operations, error objects | Story 2.2 |
| **constants/categories.ts** | Provide predefined category definitions | N/A (constant data) | Array of Category objects | Story 2.3 |
| **context/AppContext.tsx** | Manage global application state and provide actions | User actions, storage data | State object, dispatch functions | Story 2.4 |
| **context/types.ts** | Define Context state and action types | N/A (type definitions) | TypeScript interfaces for state/actions | Story 2.4 |
| **utils/validators.ts** | Validate transaction data against business rules | Transaction data, validation rules | Boolean validation results, error messages | Story 2.1 |

**Service Layer Details:**

**storageService.ts** - LocalStorage Abstraction
- Methods: `saveTransactions()`, `loadTransactions()`, `addTransaction()`, `updateTransaction()`, `deleteTransaction()`, `loadSettings()`, `saveSettings()`
- Error Handling: Try-catch for QuotaExceededError, data corruption detection, graceful fallbacks
- Data Format: JSON serialization with schema version tracking
- Validation: Schema validation on load, sanitization before save

**AppContext.tsx** - State Management Provider
- State Properties: `transactions: Transaction[]`, `categories: Category[]`, `selectedPeriod: Period`, `loading: boolean`, `error: string | null`
- Actions: `addTransaction()`, `updateTransaction()`, `deleteTransaction()`, `setPeriod()`, `loadInitialData()`
- Implementation Pattern: Context Provider with useReducer for state updates
- Side Effects: Automatic persistence to LocalStorage on state changes

### Data Models and Contracts

**Transaction Interface** (src/models/Transaction.ts)
```typescript
interface Transaction {
  id: string;                    // UUID v4 format (e.g., "550e8400-e29b-41d4-a716-446655440000")
  amount: number;                // Positive decimal, max 2 decimal places, validated > 0
  date: string;                  // ISO 8601 date format "YYYY-MM-DD" (e.g., "2025-11-15")
  category: string;              // Foreign key to Category.id (must match predefined category)
  type: 'income' | 'expense';    // Transaction type, strictly typed enum
  description: string;           // Optional text, max 200 characters, sanitized for XSS
  createdAt: string;             // ISO 8601 timestamp (e.g., "2025-11-15T10:30:00.000Z")
  updatedAt: string;             // ISO 8601 timestamp, updated on modification
}

// Validation constraints (implemented in validators.ts)
- amount: Must be > 0, finite number, rounds to 2 decimal places
- date: Valid date, not in far future (< 1 year ahead as per PRD NFR-2.2)
- category: Must exist in predefined categories list
- type: Must be exactly 'income' or 'expense'
- description: Max 200 chars, sanitized (< > " ' replaced with HTML entities)
```

**Category Interface** (src/models/Category.ts)
```typescript
interface Category {
  id: string;                    // Unique identifier (e.g., "salary", "food", "rent")
  name: string;                  // Display name (e.g., "Salary", "Food/Groceries", "Rent/Mortgage")
  type: 'income' | 'expense';    // Category classification
  color: string;                 // Hex color code (e.g., "#10B981" for income green)
  icon: string;                  // Lucide React icon name (e.g., "Wallet", "ShoppingCart", "Home")
}

// Predefined categories (12 total):
// Income (4): salary, freelance, investment, other-income
// Expense (8): rent, transport, food, entertainment, utilities, healthcare, shopping, other-expense
```

**Period Type and Interface** (src/models/Period.ts)
```typescript
type PeriodType = 'this-month' | 'last-month' | 'last-3-months' | 'custom';

interface Period {
  type: PeriodType;              // Period preset or custom
  startDate: string;             // ISO 8601 format "YYYY-MM-DD"
  endDate: string;               // ISO 8601 format "YYYY-MM-DD" (inclusive)
  label: string;                 // Human-readable label (e.g., "This Month", "Nov 2025")
}
```

**AppState Interface** (src/context/types.ts)
```typescript
interface AppState {
  transactions: Transaction[];    // All transactions loaded from storage
  categories: Category[];         // Predefined categories (immutable in MVP)
  selectedPeriod: Period;        // Currently selected time period for filtering
  filters: FilterState;          // Active filters (category, type, search)
  loading: boolean;              // Loading state for async operations
  error: string | null;          // Error message for display, null if no error
}

interface FilterState {
  categories: string[];          // Array of category IDs to filter by
  type: 'all' | 'income' | 'expense';  // Type filter
  searchQuery: string;           // Search text for description filtering
}
```

**Data Relationships:**
- **Category → Transaction**: One-to-Many (each category can have multiple transactions)
- **Transaction.category → Category.id**: Foreign key relationship, enforced by validation
- **Period → Transactions**: Filtering relationship (transactions filtered by date range)

**Schema Versioning:**
```typescript
interface StorageSchema {
  version: number;               // Current schema version (start at 1)
  transactions: Transaction[];   // Transaction data
  settings: {                   // User preferences
    selectedPeriod: Period;
    lastSyncTimestamp?: string;
  };
}
```

### APIs and Interfaces

**storageService API** (src/services/storageService.ts)

```typescript
// Storage keys constants
const STORAGE_KEYS = {
  TRANSACTIONS: 'smartbudget_transactions',
  SETTINGS: 'smartbudget_settings',
  SCHEMA_VERSION: 'smartbudget_schema_version'
} as const;

export const storageService = {
  // Load all transactions from LocalStorage
  loadTransactions(): Transaction[] {
    // Returns: Array of validated Transaction objects
    // Throws: StorageError if data corrupted
    // Side effects: Validates and filters invalid data, logs warnings
  },

  // Save all transactions to LocalStorage
  saveTransactions(transactions: Transaction[]): { success: boolean; error?: string } {
    // Params: transactions - Array of Transaction objects
    // Returns: Success status and optional error message
    // Throws: QuotaExceededError if storage limit reached
    // Side effects: Serializes to JSON, writes to localStorage
  },

  // Add single transaction (convenience method)
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    // Params: transaction data without system-generated fields
    // Returns: Complete Transaction with generated ID and timestamps
    // Side effects: Generates UUID, adds timestamps, saves to storage
  },

  // Update existing transaction
  updateTransaction(id: string, updates: Partial<Transaction>): Transaction {
    // Params: id - Transaction ID, updates - fields to modify
    // Returns: Updated Transaction object
    // Throws: NotFoundError if transaction doesn't exist
    // Side effects: Updates updatedAt timestamp, saves to storage
  },

  // Delete transaction by ID
  deleteTransaction(id: string): boolean {
    // Params: id - Transaction ID to delete
    // Returns: true if deleted, false if not found
    // Side effects: Removes from storage array, persists change
  },

  // Load user settings (selected period, preferences)
  loadSettings(): { selectedPeriod: Period; [key: string]: any } {
    // Returns: Settings object with defaults if not found
  },

  // Save user settings
  saveSettings(settings: Record<string, any>): void {
    // Params: settings - Key-value pairs to persist
    // Side effects: Merges with existing settings, saves to localStorage
  },

  // Validate transaction data structure
  validateTransaction(data: any): data is Transaction {
    // Params: data - Object to validate
    // Returns: Type predicate indicating valid Transaction
    // Used internally before saving/loading
  }
};
```

**AppContext API** (src/context/AppContext.tsx)

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

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation using useReducer
  // Provides context value to entire app tree
};

// Consumer hook
export const useAppContext = (): AppContextValue => {
  // Returns: AppContextValue object
  // Throws: Error if used outside AppProvider
};
```

**Validator Utilities API** (src/utils/validators.ts)

```typescript
export const validators = {
  // Validate amount meets business rules
  validateAmount(amount: number): { valid: boolean; error?: string } {
    // Rules: amount > 0, finite, max 2 decimal places
    // Returns: Validation result with error message if invalid
  },

  // Validate date string format and constraints
  validateDate(date: string): { valid: boolean; error?: string } {
    // Rules: Valid ISO 8601 date, not more than 1 year in future
    // Returns: Validation result with error message if invalid
  },

  // Validate category exists in predefined list
  validateCategory(categoryId: string, type: 'income' | 'expense'): { valid: boolean; error?: string } {
    // Rules: Category ID must exist in CATEGORIES, type must match
    // Returns: Validation result with error message if invalid
  },

  // Sanitize description for XSS prevention
  sanitizeDescription(input: string): string {
    // Rules: Replace < > " ' with HTML entities, trim, max 200 chars
    // Returns: Sanitized string safe for storage and display
  },

  // Validate complete transaction object
  validateTransactionData(data: Partial<Transaction>): { valid: boolean; errors: Record<string, string> } {
    // Rules: Runs all field validators
    // Returns: Overall validation result with field-specific errors
  }
};
```

### Workflows and Sequencing

**Application Initialization Sequence:**
```
1. App component mounts
2. AppProvider initializes
   → useReducer creates initial state
   → useEffect calls loadInitialData()
3. storageService.loadTransactions() executes
   → Reads from localStorage['smartbudget_transactions']
   → Validates each transaction with validateTransaction()
   → Filters out corrupted/invalid data
   → Returns clean Transaction[] array
4. storageService.loadSettings() executes
   → Reads from localStorage['smartbudget_settings']
   → Returns selectedPeriod or defaults to "this-month"
5. CATEGORIES constant loaded (predefined, no storage needed)
6. AppProvider state updated with loaded data
7. Context value provided to child components
8. App renders with persisted data
```

**Add Transaction Workflow:**
```
Component → AppContext.addTransaction() → storageService.addTransaction() → LocalStorage

Detailed Steps:
1. User submits transaction form in UI component
2. Component calls addTransaction({ amount, date, category, type, description })
3. AppContext.addTransaction() receives data:
   a. Sets loading = true
   b. Calls validators.validateTransactionData()
   c. If validation fails → set error, return early
   d. Calls storageService.addTransaction()
4. storageService.addTransaction():
   a. Generates UUID v4 for transaction.id
   b. Adds createdAt and updatedAt timestamps (ISO 8601)
   c. Loads current transactions from localStorage
   d. Appends new transaction to array
   e. Saves updated array with saveTransactions()
   f. Returns complete Transaction object
5. AppContext receives new transaction:
   a. Dispatches ADD_TRANSACTION action to reducer
   b. Reducer updates state.transactions array
   c. Sets loading = false
   d. Returns new transaction to caller
6. UI component receives new transaction, shows success message
7. All components consuming transactions re-render with updated data
```

**Update Transaction Workflow:**
```
1. User edits transaction in UI
2. Component calls updateTransaction(id, { amount, description, ... })
3. AppContext.updateTransaction():
   a. Sets loading = true
   b. Validates updated fields
   c. Calls storageService.updateTransaction(id, updates)
4. storageService.updateTransaction():
   a. Loads transactions from localStorage
   b. Finds transaction by id
   c. Merges updates with existing data
   d. Updates updatedAt timestamp
   e. Saves transactions array
   f. Returns updated Transaction
5. AppContext dispatches UPDATE_TRANSACTION action
6. State updated, UI re-renders with changes
```

**Delete Transaction Workflow:**
```
1. User confirms deletion
2. Component calls deleteTransaction(id)
3. AppContext.deleteTransaction():
   a. Sets loading = true
   b. Calls storageService.deleteTransaction(id)
4. storageService.deleteTransaction():
   a. Loads transactions
   b. Filters out transaction with matching id
   c. Saves filtered array
   d. Returns true if found and deleted
5. AppContext dispatches DELETE_TRANSACTION action
6. State updated, UI reflects deletion
```

**Error Handling Flow:**
```
Try: Storage operation (save/load)
Catch: QuotaExceededError
  → Set error = "Storage limit reached. Please delete old transactions."
  → Show user-friendly error message
  → Log technical error to console
  → Do not crash application

Try: Load transactions
Catch: JSON parse error (corrupted data)
  → Log warning
  → Return empty array
  → Set error = "Data corrupted, starting fresh"
  → Allow user to continue
```

## Non-Functional Requirements

### Performance

**Storage Operation Performance:**
- **Read operations**: < 50ms for loadTransactions() with up to 1000 transactions
- **Write operations**: < 100ms for saveTransactions() with validation
- **State updates**: Context consumers re-render in < 16ms (60fps target)
- **Initial load**: App ready with data in < 500ms after mount

**Optimization Strategies:**
- **Batch writes**: Combine multiple transaction updates into single localStorage write
- **Memoization**: Use useMemo for filtered/sorted transaction lists in future epics
- **Lazy validation**: Validate only changed fields on update, not entire object
- **JSON optimization**: Minimize data structure size (no unnecessary nesting)

**Performance Targets from PRD NFR-1:**
- UI responsiveness: < 100ms for all context actions (met by synchronous state updates)
- Data operations: LocalStorage reads/writes meet < 500ms filter performance target

### Security

**Input Validation (NFR-2.2):**
- **Amount validation**: Prevent negative amounts, NaN, Infinity, excessive decimal places
- **Date validation**: Reject invalid dates, far-future dates (> 1 year), prevent injection
- **Category validation**: Whitelist validation against predefined categories only
- **Description sanitization**: HTML entity encoding for < > " ' to prevent XSS attacks

**Data Integrity (NFR-2.3):**
- **Schema validation**: All loaded transactions validated against TypeScript interface
- **Type safety**: TypeScript strict mode prevents type-related bugs
- **Corruption detection**: JSON parse errors caught, invalid data filtered out
- **Foreign key enforcement**: Category IDs validated to exist in CATEGORIES constant

**Client-Side Security (NFR-2.1):**
- **XSS Prevention**: All user input sanitized before storage and display
- **No script execution**: Descriptions treated as plain text, never evaluated as code
- **LocalStorage isolation**: Data scoped to application origin only

**MVP Security Limitations (Documented):**
- No authentication: Single-user application, data accessible to anyone with browser access
- No encryption: Data stored as plain JSON in LocalStorage (acceptable for MVP demo)
- No backend validation: All validation client-side only (sufficient for MVP scope)

### Reliability/Availability

**Data Persistence Reliability (FR-4.1):**
- **Guaranteed persistence**: Data survives browser close, refresh, crash
- **LocalStorage robustness**: 5-10MB quota sufficient for MVP scale (1000 transactions ≈ 100KB)
- **Graceful degradation**: If storage fails, app continues with in-memory state
- **Recovery**: Corrupted data logged and cleared, app continues with empty state

**Error Recovery Strategies:**
- **Quota exceeded**: Clear error message, suggest deleting old transactions
- **Parse errors**: Log warning, start fresh, notify user
- **Missing data**: Defaults provided (empty array for transactions, "this-month" for period)
- **Invalid transactions**: Filtered out on load, not shown to user

**Availability Targets:**
- **Uptime**: 100% (client-side only, no backend dependencies)
- **Data loss prevention**: Auto-save on every state change
- **Concurrent tabs**: Changes in one tab don't sync to others (LocalStorage limitation, acceptable for MVP)

### Observability

**Logging Strategy:**
- **Development**: console.log for successful operations, console.warn for filtered invalid data
- **Production**: console.error for critical errors (storage failures, corruption)
- **User-facing errors**: Displayed via AppContext.error state, not logged

**Metrics to Track:**
- **Transaction count**: Track number of transactions in storage
- **Storage usage**: Monitor localStorage size to warn before quota exceeded
- **Validation failures**: Count and type of validation errors for debugging
- **Load time**: Measure time from loadTransactions() call to state update

**Debug Information:**
- **Schema version**: Logged on app initialization for migration troubleshooting
- **Storage keys**: Log all storage keys on load for debugging
- **Validation errors**: Detailed errors logged to console (field, reason, value)

**Future Enhancements (Post-MVP):**
- Error tracking service (Sentry, LogRocket) for production monitoring
- Performance monitoring for storage operation times
- User analytics for feature usage

## Dependencies and Integrations

**External Dependencies (NPM Packages):**

| Package | Version | Purpose | Usage in Epic 2 |
|---------|---------|---------|-----------------|
| **uuid** | ^10.0.0 | Generate UUIDs for transaction IDs | storageService.addTransaction() generates v4 UUIDs |
| **React** | ^18.3.0 | UI framework, Context API | AppContext provider and hooks |
| **TypeScript** | ~5.6.0 | Type safety | All interfaces and type definitions |
| **lucide-react** | ^0.469.0 | Icon library | Category icons (referenced in categories.ts) |

**Browser APIs:**
- **localStorage**: Primary data persistence mechanism (window.localStorage)
- **JSON**: Serialization (JSON.stringify/parse) for storage format
- **Date**: Date handling for timestamps (new Date().toISOString())

**Internal Dependencies (Epic 1):**
- **Project structure** from Story 1.1: src/ folder organization
- **TypeScript configuration** from Story 1.1: tsconfig.json with strict mode
- **No dependency on routing** (Epic 1 Story 1.3): Data layer is route-independent

**Integration Points for Future Epics:**

**Epic 3 (Transaction Management) will consume:**
- `useAppContext()` hook for transaction CRUD operations
- Transaction and Category type definitions
- Validation utilities for form validation

**Epic 4 (Dashboard & Analytics) will consume:**
- `useAppContext()` hook for transactions and period data
- Period type for time-based filtering
- Category definitions for color-coded charts

**Epic 5 (Responsive UI) will consume:**
- Category colors and icons for visual system
- AppState for loading/error states

**No External API Integrations (MVP):**
- No backend API calls (LocalStorage only)
- No third-party data services
- No authentication providers

## Acceptance Criteria (Authoritative)

**Epic-Level Acceptance Criteria (All stories complete):**

**AC-1: Data Models Defined and Validated**
- ✓ Transaction interface created with all required fields (id, amount, date, category, type, description, createdAt, updatedAt)
- ✓ Category interface created with all required fields (id, name, type, color, icon)
- ✓ Period type and interface defined with all period options
- ✓ All interfaces exported from src/models/ and usable throughout application
- ✓ Validation functions created and tested for amount, date, category, description

**AC-2: LocalStorage Service Operational**
- ✓ storageService.loadTransactions() retrieves and validates data from localStorage
- ✓ storageService.saveTransactions() persists data to localStorage with error handling
- ✓ storageService.addTransaction() generates UUID, timestamps, and saves new transaction
- ✓ storageService.updateTransaction() modifies existing transaction and updates timestamp
- ✓ storageService.deleteTransaction() removes transaction by ID
- ✓ Data survives browser refresh (tested manually)
- ✓ Storage quota exceeded handled gracefully with user-friendly error message
- ✓ Corrupted data detected and application continues without crashing

**AC-3: Predefined Categories Available**
- ✓ 12 categories defined in constants/categories.ts (4 income + 8 expense)
- ✓ Each category has: id, name, type, color (hex), icon (Lucide name)
- ✓ Income categories use green color family (#10B981, #059669, #047857, #065F46)
- ✓ Expense categories use red/orange color family (#EF4444, #DC2626, #B91C1C, #F97316, #EA580C, #C2410C, #9A3412, #7C2D12)
- ✓ Categories match exactly as specified in architecture.md predefined list

**AC-4: Global State Management Working**
- ✓ AppContext created with AppProvider and useAppContext hook
- ✓ State includes: transactions[], categories[], selectedPeriod, loading, error
- ✓ Actions available: addTransaction, updateTransaction, deleteTransaction, setPeriod, clearError
- ✓ State updates trigger re-renders in consuming components
- ✓ Initial data loads from localStorage on app mount
- ✓ State changes persist to localStorage automatically
- ✓ Error thrown if useAppContext used outside AppProvider
- ✓ Loading states managed correctly for async operations

**AC-5: Data Integrity and Validation (Cross-cutting)**
- ✓ Invalid amounts rejected (negative, NaN, >2 decimals, zero)
- ✓ Invalid dates rejected (malformed, >1 year future)
- ✓ Invalid category IDs rejected (not in predefined list, wrong type)
- ✓ Descriptions sanitized to prevent XSS (< > " ' encoded)
- ✓ All transactions validated on load from storage
- ✓ Invalid transactions filtered out silently, warnings logged

**AC-6: Performance Targets Met**
- ✓ loadTransactions() completes in < 50ms for 1000 transactions (tested)
- ✓ saveTransactions() completes in < 100ms (tested)
- ✓ State updates trigger re-renders in < 16ms (60fps maintained)
- ✓ App initialization with data complete in < 500ms

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component/API | Test Idea |
|---------------------|--------------|---------------|-----------|
| **AC-1: Data Models** | Data Models and Contracts | models/Transaction.ts, models/Category.ts, models/Period.ts | Unit test: Validate interfaces compile, validators reject invalid data |
| AC-1.1: Transaction interface complete | Data Models - Transaction Interface | models/Transaction.ts | Assert all 8 required fields present in interface |
| AC-1.2: Category interface complete | Data Models - Category Interface | models/Category.ts | Assert all 5 required fields present in interface |
| AC-1.3: Validation functions | APIs - Validator Utilities | utils/validators.ts | Unit test each validator with valid/invalid inputs |
| **AC-2: Storage Service** | Services and Modules, APIs | services/storageService.ts | Integration test: Save/load data, verify persistence |
| AC-2.1: loadTransactions() works | APIs - storageService.loadTransactions | storageService.loadTransactions | Mock localStorage, verify loading and validation |
| AC-2.2: saveTransactions() persists | APIs - storageService.saveTransactions | storageService.saveTransactions | Save data, reload page, verify still present |
| AC-2.3: CRUD operations | APIs - storageService full API | storageService (all methods) | Integration test full CRUD cycle |
| AC-2.4: Error handling | NFR Security, Reliability | storageService error handlers | Mock QuotaExceededError, verify graceful handling |
| **AC-3: Categories** | Data Models, Dependencies | constants/categories.ts | Visual inspection + count validation |
| AC-3.1: 12 categories defined | Data Models - Category list | CATEGORIES constant | Assert CATEGORIES.length === 12 |
| AC-3.2: Correct colors | System Architecture Alignment | CATEGORIES color properties | Verify green family for income, red for expense |
| AC-3.3: Icons assigned | Data Models - Category Interface | CATEGORIES icon properties | Assert all have valid Lucide icon names |
| **AC-4: State Management** | Services and Modules, APIs | context/AppContext.tsx | Integration test with test provider |
| AC-4.1: AppContext created | APIs - AppContext API | AppContext, AppProvider, useAppContext | Verify context renders, hook returns value |
| AC-4.2: State structure correct | Data Models - AppState | AppState interface | Assert state has all required properties |
| AC-4.3: Actions available | APIs - AppContextValue | Context actions | Test each action modifies state correctly |
| AC-4.4: Persistence integration | Workflows - Add Transaction | AppContext + storageService | Add transaction, reload, verify persisted |
| **AC-5: Validation** | APIs, NFR Security | utils/validators.ts, storageService | Unit tests for all validation rules |
| AC-5.1: Amount validation | APIs - validateAmount | validators.validateAmount | Test negative, NaN, >2 decimals, zero |
| AC-5.2: Date validation | APIs - validateDate | validators.validateDate | Test invalid date, far future |
| AC-5.3: Category validation | APIs - validateCategory | validators.validateCategory | Test non-existent ID, wrong type |
| AC-5.4: XSS prevention | APIs - sanitizeDescription | validators.sanitizeDescription | Test input with <script>, verify encoded |
| **AC-6: Performance** | NFR Performance | All services | Performance profiling during manual test |
| AC-6.1: Load speed | NFR Performance - Read ops | storageService.loadTransactions | Profile with 1000 mock transactions |
| AC-6.2: Save speed | NFR Performance - Write ops | storageService.saveTransactions | Profile saveTransactions() execution time |
| AC-6.3: Render performance | NFR Performance - State updates | AppContext re-renders | React DevTools Profiler: verify < 16ms |

**Traceability to PRD Requirements:**
- **FR-4.1** (Local Data Storage) → AC-2 (Storage Service)
- **FR-4.2** (Data Structure) → AC-1 (Data Models), AC-5 (Validation)
- **FR-2.1** (Predefined Categories) → AC-3 (Categories)
- **NFR-2.2** (Data Validation) → AC-5 (Validation)
- **NFR-2.3** (Data Integrity) → AC-5 (Validation), AC-2.4 (Error handling)
- **NFR-1.2** (UI Responsiveness <100ms) → AC-6.3 (Render performance)

## Risks, Assumptions, Open Questions

**Risks:**

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **R1: LocalStorage quota exceeded** | High - User cannot save new transactions | Low (100KB for 1000 transactions, 5MB quota) | Show clear error message, suggest deleting old data, implement data cleanup tool in future |
| **R2: Browser doesn't support localStorage** | Critical - App unusable | Very Low (modern browsers required per NFR-5) | Feature detection on app load, show error if unsupported, document browser requirements |
| **R3: Data corruption from manual localStorage editing** | Medium - Invalid data crashes app | Low | Robust validation on load, filter invalid data, log warnings, continue with valid subset |
| **R4: TypeScript interfaces diverge from runtime data** | Medium - Type safety illusion | Medium (dev error) | Implement runtime validation matching TS interfaces, use io-ts or zod if complexity grows |
| **R5: UUID collision** | Low - Duplicate transaction IDs | Extremely Low (UUID v4 collision rate ≈ 1 in 2^122) | Accept risk, UUID library handles collision avoidance |
| **R6: Context performance with large transaction sets** | Medium - Slow re-renders | Low-Medium (>1000 transactions) | Use useMemo for derived data, implement virtualization if needed, defer to Epic 3/4 optimization |

**Assumptions:**

| Assumption | Validation | Impact if Wrong |
|------------|------------|-----------------|
| **A1: MVP stays under 1000 transactions** | User testing, analytics | Need IndexedDB migration, pagination |
| **A2: Users won't manually edit localStorage** | Reasonable for MVP demo | Data corruption handled by validation |
| **A3: Single browser, single device usage** | MVP limitation documented | No cross-device sync, acceptable for demo |
| **A4: No concurrent tabs editing data** | Tested and documented | Data in one tab doesn't update in others, acceptable |
| **A5: Date strings as ISO 8601 sufficient** | Date library (date-fns) handles parsing | Need more robust date handling |
| **A6: Context API performance sufficient** | MVP scale testing | May need Zustand/Redux for larger scale |
| **A7: React 18+ available** | Architecture decision, package.json enforces | App won't run on older React versions |

**Open Questions:**

| Question | Owner | Deadline | Impact |
|----------|-------|----------|--------|
| **Q1: Should we implement optimistic updates or wait for storage confirmation?** | Dev Agent (Story 2.4) | Before Story 2.4 | UX responsiveness vs data consistency trade-off |
| **Q2: How to handle schema migrations when data model changes?** | Architect | Before v2.0 (post-MVP) | Need versioning strategy if structure changes |
| **Q3: Should category colors be configurable or hard-coded?** | UX Designer | Before Epic 5 | Affects constants design, decided: hard-coded for MVP |
| **Q4: UUID v4 or sequential IDs for transactions?** | Dev Agent (Story 2.1) | Story 2.1 | UUID chosen for distributed-readiness, no backend conflicts |
| **Q5: Should we validate date ranges (e.g., no transactions from year 1900)?** | Dev Agent (Story 2.1) | Story 2.1 | Additional validation logic, decided: allow historical dates |

**Resolved Questions:**
- ~~Q: LocalStorage vs IndexedDB?~~ → **Resolved: LocalStorage (ADR-003)** - Simpler API, sufficient for MVP scale
- ~~Q: Context API vs Redux?~~ → **Resolved: Context API (ADR-002)** - Sufficient for MVP, less boilerplate
- ~~Q: TypeScript or JavaScript?~~ → **Resolved: TypeScript (ADR-006)** - Type safety critical for multi-agent development

## Test Strategy Summary

**Testing Approach:**
Epic 2 uses a combination of unit tests, integration tests, and manual testing to ensure data layer reliability.

**Unit Tests (Vitest + @testing-library/react):**

**Story 2.1: Data Models & Validation**
- Test validators.ts functions with valid/invalid inputs
- Test edge cases: boundary values, null, undefined, malformed data
- Coverage target: 90% (pure functions, easy to test)
- Example: `validateAmount(-10)` should return `{ valid: false, error: "Amount must be positive" }`

**Story 2.2: LocalStorage Service**
- Mock localStorage API for isolated testing
- Test CRUD operations: save, load, add, update, delete
- Test error handling: QuotaExceededError, JSON parse errors
- Test data validation on load (corrupted data filtered)
- Coverage target: 85%
- Example: Mock localStorage.setItem to throw, verify error handling

**Story 2.3: Categories**
- Validate category count (12 total, 4 income, 8 expense)
- Verify color families (green for income, red/orange for expense)
- Verify all have valid icon names
- Coverage: 100% (constants, simple assertions)

**Story 2.4: AppContext**
- Test context provider renders children
- Test useAppContext hook returns correct value
- Test actions update state correctly
- Test error thrown outside provider
- Use React Testing Library's renderHook for custom hooks
- Coverage target: 80%

**Integration Tests:**

**Full Data Flow Tests:**
1. Add transaction → Verify in localStorage → Reload → Verify still present
2. Load corrupted data → Verify app continues → Verify error logged
3. Exceed storage quota → Verify error message → Verify app usable
4. CRUD cycle → Add → Update → Delete → Verify final state

**Component Integration (Deferred to Epic 3):**
- Test TransactionForm integrates with AppContext
- Test Dashboard reads from AppContext correctly

**Manual Testing:**

**Browser Compatibility:**
- Test on Chrome, Firefox, Safari, Edge (latest 2 versions)
- Verify localStorage works in private/incognito mode
- Test on mobile browsers (iOS Safari, Chrome Android)

**Performance Testing:**
- Measure loadTransactions() time with 100, 500, 1000 mock transactions
- Profile saveTransactions() execution time
- Use React DevTools Profiler to measure re-render performance
- Verify < 100ms for all operations

**Data Persistence Testing:**
- Add transactions → Close browser → Reopen → Verify data present
- Refresh page multiple times → Verify no data loss
- Test across browser restarts

**Error Scenario Testing:**
- Manually edit localStorage to corrupt JSON → Verify graceful handling
- Fill localStorage to quota → Verify clear error message
- Clear localStorage mid-session → Verify app recovers

**Test Coverage Goals:**
- Overall: ≥80%
- Services (storageService, validators): ≥90%
- Context (AppContext): ≥80%
- Models/Constants: 100% (type coverage via TypeScript)

**Testing Tools:**
- **Vitest**: Unit test framework (included with Vite)
- **@testing-library/react**: Component testing utilities
- **@testing-library/jest-dom**: Custom matchers
- **Manual**: Browser dev tools, React DevTools, performance profiling

**Test Execution:**
```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

**Acceptance Criteria for Epic 2 Testing:**
- ✓ All unit tests pass with ≥80% coverage
- ✓ Integration tests cover full CRUD cycle
- ✓ Manual testing confirms data persists across sessions
- ✓ Performance targets met (< 50ms load, < 100ms save)
- ✓ Error scenarios handled gracefully without crashes
