# SmartBudget - System Architecture

## Executive Summary

SmartBudget's architecture embraces modern React best practices with a focus on simplicity, performance, and maintainability. Built on **Vite + React + TypeScript**, the application uses a component-based architecture with client-side state management, responsive design, and local data persistence. This architecture supports rapid AI-assisted development while maintaining professional code quality standards.

**Architecture Philosophy**: Start simple, scale when needed. Use boring technology that works. Let the starter template make standard decisions, focus architectural effort on domain-specific patterns.

## Project Initialization

**First Implementation Story Must Execute:**

```bash
npm create vite@latest smartbudget -- --template react-ts
cd smartbudget
npm install
```

This establishes the base architecture with these decisions automatically:
- ✅ **Framework**: React 18+ with TypeScript
- ✅ **Build Tool**: Vite (fast HMR, optimized builds)
- ✅ **Module System**: ES Modules (ESM)
- ✅ **Linting**: ESLint pre-configured
- ✅ **Development Server**: Vite dev server with instant HMR

**Requirements**: Node.js 20.19+ or 22.12+

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Core Framework** | React | 18.x | All | Industry standard, excellent ecosystem, AI-friendly |
| **Language** | TypeScript | 5.x | All | Type safety, better IDE support, catch errors early |
| **Build Tool** | Vite | 6.x | Epic 1 | Modern, fast, officially recommended for React 2025 |
| **Package Manager** | npm | 10.x | Epic 1 | Comes with Node.js, widely understood |
| **CSS Framework** | Tailwind CSS | 4.0 | Epic 1, 5 | Utility-first, fast development, excellent for responsive design |
| **State Management** | React Context API | Built-in | Epic 2, 3, 4 | Simple, sufficient for MVP scope, no extra dependencies |
| **Routing** | React Router | 6.x | Epic 1 | De facto standard for React routing |
| **Chart Library** | Recharts | 2.x | Epic 4 | React-native components, composable, perfect for dashboard |
| **Date Handling** | date-fns | 4.x | Epic 3, 4 | Lightweight, tree-shakeable, modern alternative to moment.js |
| **Data Persistence** | LocalStorage | Browser API | Epic 2 | Simple, no backend required for MVP, instant reads |
| **Code Quality** | ESLint + Prettier | Latest | Epic 1 | Enforce standards, format automatically |
| **Git Hooks** | Husky + lint-staged | Latest | Epic 1 | Pre-commit quality checks |
| **Icon Library** | Lucide React | Latest | Epic 5 | Modern, tree-shakeable, comprehensive icon set |
| **Deployment** | Netlify or Vercel | N/A | Epic 6 | Free tier, automatic deploys, optimized for Vite |

## Project Structure

```
smartbudget/
├── public/                    # Static assets
│   └── favicon.ico
├── src/
│   ├── assets/               # Images, fonts, static files
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Generic components (Button, Input, Card)
│   │   ├── layout/          # Layout components (Header, Nav, Footer)
│   │   ├── transactions/    # Transaction-specific components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── charts/          # Chart components (PieChart, TrendChart)
│   ├── pages/               # Page/view components
│   │   ├── Dashboard.tsx
│   │   ├── TransactionsList.tsx
│   │   ├── TransactionForm.tsx
│   │   └── NotFound.tsx
│   ├── context/             # React Context providers
│   │   ├── AppContext.tsx   # Global app state
│   │   └── types.ts         # Context type definitions
│   ├── services/            # Business logic & data access
│   │   ├── storageService.ts     # LocalStorage operations
│   │   ├── transactionService.ts # Transaction CRUD logic
│   │   └── calculationService.ts # Financial calculations
│   ├── models/              # TypeScript interfaces & types
│   │   ├── Transaction.ts
│   │   ├── Category.ts
│   │   └── Period.ts
│   ├── constants/           # App constants & configuration
│   │   ├── categories.ts    # Predefined categories with colors
│   │   ├── colors.ts        # Color palette
│   │   └── config.ts        # App configuration
│   ├── utils/               # Helper functions
│   │   ├── dateHelpers.ts   # Date formatting & manipulation
│   │   ├── formatters.ts    # Currency, number formatting
│   │   └── validators.ts    # Input validation functions
│   ├── hooks/               # Custom React hooks
│   │   ├── useTransactions.ts
│   │   ├── usePeriod.ts
│   │   └── useLocalStorage.ts
│   ├── styles/              # Global styles (if needed beyond Tailwind)
│   │   └── index.css        # Tailwind imports + custom CSS
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type declarations
├── .eslintrc.cjs            # ESLint configuration
├── .prettierrc              # Prettier configuration
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration (for Tailwind)
├── README.md                # Project documentation
├── prompts.md               # AI interaction log
└── summary.md               # AI impact analysis
```

**Organization Principles:**
- **Components by feature**: Transaction and dashboard components grouped separately
- **Services layer**: Business logic separated from UI
- **Type-safe models**: All data structures defined with TypeScript
- **Reusable utilities**: Shared functions in dedicated utils folder
- **Custom hooks**: Extract stateful logic for reusability

## Epic to Architecture Mapping

| Epic | Primary Components/Modules | Technologies Used |
|------|---------------------------|-------------------|
| **Epic 1: Project Foundation** | Project setup, routing, layout, tooling | Vite, React Router, ESLint, Prettier, Husky |
| **Epic 2: Data Layer** | models/, services/, context/, constants/ | TypeScript interfaces, LocalStorage API, React Context |
| **Epic 3: Transaction Management** | components/transactions/, pages/TransactionForm.tsx, pages/TransactionsList.tsx | React forms, Context API, validation utils |
| **Epic 4: Dashboard & Analytics** | components/dashboard/, components/charts/, pages/Dashboard.tsx | Recharts, date-fns, calculation services |
| **Epic 5: Responsive UI** | components/layout/, styles/, all components | Tailwind CSS, Lucide icons, responsive utilities |
| **Epic 6: Quality & Deployment** | Testing, documentation, deployment config | Netlify/Vercel, Git workflows, README/docs |

**Architectural Boundaries:**
- **Data Layer** (Epic 2) → Foundation for all features
- **Transaction Features** (Epic 3) → Depends on Data Layer
- **Dashboard Features** (Epic 4) → Depends on Data Layer & Transactions
- **UI/UX** (Epic 5) → Enhances all features
- **Quality** (Epic 6) → Validates all previous work

## Technology Stack Details

### Core Technologies

**Frontend Framework:**
- **React 18.x**: Component-based UI library
- **TypeScript 5.x**: Static typing for JavaScript
- **Vite 6.x**: Build tool and dev server

**UI & Styling:**
- **Tailwind CSS 4.0**: Utility-first CSS framework
- **Lucide React**: Icon library (tree-shakeable, modern)
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

**State Management & Data:**
- **React Context API**: Global state management
- **LocalStorage**: Browser-based data persistence
- **date-fns 4.x**: Date manipulation and formatting

**Routing & Navigation:**
- **React Router 6.x**: Client-side routing

**Data Visualization:**
- **Recharts 2.x**: React charting library

**Code Quality:**
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files

**Development Tools:**
- **TypeScript Compiler**: Type checking
- **Vite HMR**: Hot Module Replacement for instant updates

### Integration Points

**Component → Context:**
- Components consume global state via `useContext(AppContext)`
- Context provides: transactions[], categories[], period, loading states
- Updates propagate automatically to all consumers

**Component → Services:**
- UI components call service functions for business logic
- Services handle LocalStorage operations
- Services return typed data matching TypeScript interfaces

**Service → LocalStorage:**
- Services use `storageService` as single point of access
- All data serialized as JSON
- Schema version tracking for future migrations

**Recharts Integration:**
- Chart components consume processed data from context
- ResponsiveContainer wraps all charts for responsive sizing
- Custom Tooltip and Legend components for branded look

### Dependencies Overview

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.30.0",
    "recharts": "^2.15.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "postcss": "^8.4.49",
    "prettier": "^3.4.0",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.6.0",
    "vite": "^6.0.0"
  }
}
```

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Component Patterns

**1. Functional Components with TypeScript**
```typescript
// Always use function components with explicit types
interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete
}) => {
  // Component logic
};
```

**2. Custom Hooks Pattern**
```typescript
// Extract reusable stateful logic into custom hooks
export const useTransactions = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useContext(AppContext);

  // Additional logic
  return { transactions, addTransaction, updateTransaction, deleteTransaction };
};
```

**3. Service Layer Pattern**
```typescript
// All business logic in services, not components
export const transactionService = {
  create: (transaction: TransactionInput): Transaction => {
    // Validation, ID generation, persistence
  },
  getAll: (): Transaction[] => {
    // Retrieve from storage
  },
  // ... other methods
};
```

### State Management Patterns

**Global State Structure:**
```typescript
interface AppState {
  transactions: Transaction[];
  categories: Category[];
  selectedPeriod: Period;
  filters: FilterState;
  loading: boolean;
  error: string | null;
}
```

**Context Provider Pattern:**
- Single `AppContext` wraps entire app in `main.tsx`
- State updates via reducer pattern (useReducer) or setState
- All state changes go through context actions

### Data Flow Patterns

```
User Action → Component Event Handler → Service Function →
  LocalStorage Update → Context State Update → UI Re-render
```

**Example Flow: Adding Transaction**
1. User submits form in `TransactionForm`
2. Form calls `handleSubmit` → calls `addTransaction` from context
3. Context action validates → calls `transactionService.create()`
4. Service generates ID → saves to LocalStorage → returns Transaction
5. Context updates state with new transaction
6. All components consuming transactions re-render (Dashboard, TransactionsList)

## Consistency Rules

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `TransactionCard.tsx`)
- Services: `camelCase.ts` (e.g., `storageService.ts`)
- Utilities: `camelCase.ts` (e.g., `dateHelpers.ts`)
- Types/Models: `PascalCase.ts` (e.g., `Transaction.ts`)
- Constants: `camelCase.ts` (e.g., `categories.ts`)

**Code:**
- Variables/Functions: `camelCase` (e.g., `getUserName`, `totalAmount`)
- Types/Interfaces: `PascalCase` (e.g., `Transaction`, `TransactionFormProps`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_DESCRIPTION_LENGTH`, `STORAGE_KEY`)
- Private functions: prefix with underscore `_privateHelper()`
- Boolean variables: prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`)

**Components:**
- Event handlers: `handle` prefix (e.g., `handleSubmit`, `handleDelete`)
- State setters: `set` prefix (e.g., `setTransactions`, `setLoading`)
- Custom hooks: `use` prefix (e.g., `useTransactions`, `usePeriod`)

### Code Organization

**Import Order (enforced by ESLint):**
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 2. Internal modules (absolute imports)
import { Transaction } from '@/models/Transaction';
import { transactionService } from '@/services/transactionService';

// 3. Components
import { TransactionCard } from '@/components/transactions/TransactionCard';

// 4. Utilities & Constants
import { formatCurrency } from '@/utils/formatters';
import { CATEGORIES } from '@/constants/categories';

// 5. Styles (if any)
import './styles.css';
```

**Component Structure:**
```typescript
// 1. Imports
// 2. Type definitions
// 3. Component definition
// 4. Styled components (if using styled-components)
// 5. Export
```

### Error Handling

**Form Validation Errors:**
```typescript
// Inline validation with clear user messages
if (!amount || amount <= 0) {
  setError('Amount must be greater than zero');
  return;
}
```

**Storage Errors:**
```typescript
// Try-catch with user-friendly fallback
try {
  localStorage.setItem(key, value);
} catch (error) {
  console.error('Storage error:', error);
  // Show toast: "Unable to save. Please check your browser storage."
}
```

**Component Error Boundaries:**
```typescript
// Use Error Boundary for React component errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

**Consistency Rules:**
- Never show technical error messages to users
- Always log errors to console for debugging
- Provide actionable error messages ("Try again" vs "Error 500")
- Use loading states to prevent errors from hasty user actions

### Logging Strategy

**Development Logging:**
```typescript
// Use console methods appropriately
console.log('Transaction created:', transaction); // Info
console.warn('Category not found, using default'); // Warning
console.error('Failed to save to LocalStorage:', error); // Error
```

**Production Considerations:**
- Remove `console.log` in production builds (Vite strips them automatically)
- Keep `console.error` for critical issues
- Consider adding error tracking service (future: Sentry, LogRocket)

## Data Architecture

### Data Models

**Transaction Model:**
```typescript
interface Transaction {
  id: string;                    // UUID v4
  amount: number;                // Positive number, max 2 decimals
  date: string;                  // ISO 8601 format: "2025-11-10"
  category: string;              // Category ID (foreign key)
  type: 'income' | 'expense';    // Transaction type
  description: string;           // Optional, max 200 characters
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

**Category Model:**
```typescript
interface Category {
  id: string;                    // Unique identifier (e.g., "salary", "food")
  name: string;                  // Display name (e.g., "Salary", "Food/Groceries")
  type: 'income' | 'expense';    // Category type
  color: string;                 // Hex color code (e.g., "#10B981")
  icon: string;                  // Lucide icon name (e.g., "Wallet", "ShoppingCart")
}
```

**Period Model:**
```typescript
type PeriodType = 'this-month' | 'last-month' | 'last-3-months' | 'custom';

interface Period {
  type: PeriodType;
  startDate: string;             // ISO 8601 format
  endDate: string;               // ISO 8601 format
  label: string;                 // Display label (e.g., "This Month")
}
```

### Data Relationships

**Category → Transaction:** One-to-Many
- Each category can have multiple transactions
- Each transaction belongs to exactly one category
- Enforced through `transaction.category` foreign key

**Predefined Categories (Immutable in MVP):**
```typescript
// Income Categories
const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', type: 'income', color: '#10B981', icon: 'Wallet' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#059669', icon: 'Briefcase' },
  { id: 'investment', name: 'Investment', type: 'income', color: '#047857', icon: 'TrendingUp' },
  { id: 'other-income', name: 'Other Income', type: 'income', color: '#065F46', icon: 'DollarSign' }
];

// Expense Categories
const EXPENSE_CATEGORIES = [
  { id: 'rent', name: 'Rent/Mortgage', type: 'expense', color: '#EF4444', icon: 'Home' },
  { id: 'transport', name: 'Transport', type: 'expense', color: '#DC2626', icon: 'Car' },
  { id: 'food', name: 'Food/Groceries', type: 'expense', color: '#B91C1C', icon: 'ShoppingCart' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#F97316', icon: 'Film' },
  { id: 'utilities', name: 'Utilities', type: 'expense', color: '#EA580C', icon: 'Zap' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense', color: '#C2410C', icon: 'Heart' },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#9A3412', icon: 'ShoppingBag' },
  { id: 'other-expense', name: 'Other Expense', type: 'expense', color: '#7C2D12', icon: 'MoreHorizontal' }
];
```

### LocalStorage Schema

**Storage Keys:**
- `smartbudget_transactions`: Array of Transaction objects
- `smartbudget_settings`: User preferences (selected period, etc.)
- `smartbudget_schema_version`: Schema version for migrations

**Data Format:**
```typescript
// Stored as JSON string
localStorage.setItem('smartbudget_transactions', JSON.stringify([
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    amount: 150.50,
    date: "2025-11-10",
    category: "food",
    type: "expense",
    description: "Weekly groceries",
    createdAt: "2025-11-10T10:30:00.000Z",
    updatedAt: "2025-11-10T10:30:00.000Z"
  }
]));
```

**Data Validation:**
```typescript
// Validate on load to catch corruption
const validateTransaction = (tx: any): tx is Transaction => {
  return (
    typeof tx.id === 'string' &&
    typeof tx.amount === 'number' && tx.amount > 0 &&
    typeof tx.date === 'string' &&
    typeof tx.category === 'string' &&
    (tx.type === 'income' || tx.type === 'expense') &&
    (tx.description === undefined || typeof tx.description === 'string')
  );
};
```

### Financial Calculation Patterns

These patterns ensure consistent financial calculations across all components. All calculations must use these exact formulas to prevent agent inconsistencies.

**1. Total Income Calculation:**
```typescript
// calculationService.ts
export const calculateTotalIncome = (
  transactions: Transaction[],
  period?: Period
): number => {
  let filtered = transactions.filter(t => t.type === 'income');

  // Apply period filter if provided
  if (period) {
    filtered = filtered.filter(t =>
      t.date >= period.startDate && t.date <= period.endDate
    );
  }

  return filtered.reduce((sum, t) => sum + t.amount, 0);
};
```

**2. Total Expenses Calculation:**
```typescript
export const calculateTotalExpenses = (
  transactions: Transaction[],
  period?: Period
): number => {
  let filtered = transactions.filter(t => t.type === 'expense');

  if (period) {
    filtered = filtered.filter(t =>
      t.date >= period.startDate && t.date <= period.endDate
    );
  }

  return filtered.reduce((sum, t) => sum + t.amount, 0);
};
```

**3. Net Balance Calculation:**
```typescript
export const calculateNetBalance = (
  transactions: Transaction[],
  period?: Period
): number => {
  const income = calculateTotalIncome(transactions, period);
  const expenses = calculateTotalExpenses(transactions, period);
  return income - expenses;
};
```

**4. Expenses by Category (for Pie Chart):**
```typescript
export const calculateExpensesByCategory = (
  transactions: Transaction[],
  period?: Period
): Record<string, number> => {
  let filtered = transactions.filter(t => t.type === 'expense');

  if (period) {
    filtered = filtered.filter(t =>
      t.date >= period.startDate && t.date <= period.endDate
    );
  }

  return filtered.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
};
```

**5. Income by Category:**
```typescript
export const calculateIncomeByCategory = (
  transactions: Transaction[],
  period?: Period
): Record<string, number> => {
  let filtered = transactions.filter(t => t.type === 'income');

  if (period) {
    filtered = filtered.filter(t =>
      t.date >= period.startDate && t.date <= period.endDate
    );
  }

  return filtered.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
};
```

**6. Trend Data (for Bar/Line Chart):**
```typescript
import { startOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format } from 'date-fns';

export const calculateTrendData = (
  transactions: Transaction[],
  period: Period,
  granularity: 'day' | 'week' | 'month' = 'day'
): Array<{ date: string; income: number; expenses: number; net: number }> => {
  // Determine intervals based on granularity
  const start = new Date(period.startDate);
  const end = new Date(period.endDate);

  let intervals: Date[];
  let formatStr: string;

  if (granularity === 'day') {
    intervals = eachDayOfInterval({ start, end });
    formatStr = 'MMM dd';
  } else if (granularity === 'week') {
    intervals = eachWeekOfInterval({ start, end });
    formatStr = 'MMM dd';
  } else {
    intervals = eachMonthOfInterval({ start, end });
    formatStr = 'MMM yyyy';
  }

  // Calculate income and expenses for each interval
  return intervals.map(intervalDate => {
    const dateStr = format(intervalDate, 'yyyy-MM-dd');

    const income = transactions
      .filter(t => t.type === 'income' && t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense' && t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: format(intervalDate, formatStr),
      income,
      expenses,
      net: income - expenses
    };
  });
};
```

**7. Category Percentage Calculation:**
```typescript
export const calculateCategoryPercentage = (
  categoryAmount: number,
  totalAmount: number
): number => {
  if (totalAmount === 0) return 0;
  return Math.round((categoryAmount / totalAmount) * 100);
};
```

**Usage Pattern - Consistent Across All Components:**
```typescript
// In Dashboard.tsx or any component
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateExpensesByCategory
} from '@/services/calculationService';

const Dashboard = () => {
  const { transactions } = useTransactions();
  const { selectedPeriod } = usePeriod();

  // Calculate metrics using standard formulas
  const totalIncome = useMemo(
    () => calculateTotalIncome(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const netBalance = useMemo(
    () => calculateNetBalance(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  // ...
};
```

### Chart Data Transformation Patterns

These patterns show how to transform transaction data into chart-ready formats for Recharts.

**1. Pie Chart Data (Expense Breakdown):**
```typescript
// Transform expenses by category to Recharts PieChart format
import { CATEGORIES } from '@/constants/categories';
import { calculateExpensesByCategory } from '@/services/calculationService';

const transformToPieChartData = (
  transactions: Transaction[],
  period?: Period
) => {
  const expensesByCategory = calculateExpensesByCategory(transactions, period);

  return Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = CATEGORIES.find(c => c.id === categoryId);

    return {
      name: category?.name || 'Unknown',
      value: amount,
      fill: category?.color || '#gray',
      // Optional: Add percentage
      percentage: calculateCategoryPercentage(
        amount,
        Object.values(expensesByCategory).reduce((a, b) => a + b, 0)
      )
    };
  });
};

// Usage in component
<PieChart width={400} height={400}>
  <Pie
    data={pieChartData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={100}
    label={({ name, percentage }) => `${name}: ${percentage}%`}
  >
    {pieChartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.fill} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

**2. Bar Chart Data (Income vs Expenses Trend):**
```typescript
// Transform trend data to Recharts BarChart format
import { calculateTrendData } from '@/services/calculationService';

const transformToBarChartData = (
  transactions: Transaction[],
  period: Period
) => {
  // Automatically determines granularity based on period length
  const daysDiff = differenceInDays(
    new Date(period.endDate),
    new Date(period.startDate)
  );

  let granularity: 'day' | 'week' | 'month';
  if (daysDiff <= 31) granularity = 'day';
  else if (daysDiff <= 90) granularity = 'week';
  else granularity = 'month';

  return calculateTrendData(transactions, period, granularity);
};

// Usage in component
<BarChart width={600} height={300} data={barChartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="income" fill="#10B981" name="Income" />
  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
</BarChart>
```

**3. Line Chart Data (Net Balance Trend):**
```typescript
// Same data as bar chart, different visualization
<LineChart width={600} height={300} data={trendData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line
    type="monotone"
    dataKey="net"
    stroke="#8884d8"
    name="Net Balance"
    strokeWidth={2}
  />
</LineChart>
```

**4. Responsive Container Pattern:**
```typescript
// Always wrap charts in ResponsiveContainer for adaptive sizing
import { ResponsiveContainer, PieChart, Pie } from 'recharts';

const ExpenseBreakdownChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie data={data} /* ... */ />
      </PieChart>
    </ResponsiveContainer>
  );
};
```

**5. Custom Tooltip Pattern:**
```typescript
// Create branded, user-friendly tooltips
import { formatCurrency } from '@/utils/formatters';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-900">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

// Usage
<Tooltip content={<CustomTooltip />} />
```

## Security Architecture

**MVP Security Focus:**
- **No user authentication**: Single-user application (MVP limitation)
- **Client-side validation**: Prevent malformed data
- **XSS Prevention**: Sanitize all user inputs before display
- **No backend APIs**: No CSRF, SQL injection, or API security concerns in MVP

**Input Sanitization:**
```typescript
// Sanitize description field to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};
```

**Data Validation:**
```typescript
// Validate all inputs before storage
const validateAmount = (amount: number): boolean => {
  return amount > 0 && Number.isFinite(amount) &&
         amount.toFixed(2) === amount.toString();
};

const validateDate = (date: string): boolean => {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime()) && parsed <= new Date();
};
```

**Future Considerations (Post-MVP):**
- User authentication (JWT or OAuth)
- Backend API with HTTPS
- Rate limiting on endpoints
- CORS configuration
- Data encryption at rest

## Performance Considerations

**Performance Targets (from PRD NFR-1):**
- Initial page load: <3 seconds (3G connection)
- UI responsiveness: <100ms for user actions
- Chart rendering: <2 seconds
- Filter updates: <500ms

**Optimization Strategies:**

**1. Code Splitting:**
```typescript
// Lazy load heavy chart components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

**2. Memoization:**
```typescript
// Memoize expensive calculations
const filteredTransactions = useMemo(() => {
  return transactions.filter(tx =>
    tx.date >= period.startDate && tx.date <= period.endDate
  );
}, [transactions, period]);

// Memoize chart data transformations
const chartData = useMemo(() =>
  transformTransactionsForChart(filteredTransactions),
  [filteredTransactions]
);
```

**3. Debouncing:**
```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query) => setSearchQuery(query), 300),
  []
);
```

**4. Vite Optimizations:**
- Automatic code splitting
- Tree shaking removes unused code
- Minification in production builds
- CSS purging with Tailwind (removes unused styles)

**5. LocalStorage Performance:**
- Read once on app load, cache in memory (Context)
- Batch writes instead of writing on every change
- Use IndexedDB if dataset grows beyond 5MB (future consideration)

**6. Recharts Performance:**
- Limit data points in charts (aggregate if >100 points)
- Use ResponsiveContainer for efficient resizing
- Disable animations if performance issues occur

## Deployment Architecture

**Hosting Platform: Netlify or Vercel (Recommended)**

**Netlify Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel Configuration:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Deployment Process:**
1. Push to main branch on GitHub
2. Platform detects push via webhook
3. Platform runs `npm install && npm run build`
4. Platform deploys `dist/` folder to CDN
5. Platform provides HTTPS URL

**Build Output:**
- Minified JavaScript bundles
- Optimized CSS (Tailwind purged)
- Source maps for debugging (production builds)
- Service worker for PWA (future enhancement)

**Environment Variables:**
- `VITE_APP_VERSION`: App version for display
- `VITE_STORAGE_KEY_PREFIX`: LocalStorage key prefix

**Performance Optimizations:**
- CDN distribution globally
- HTTP/2 for faster loading
- Gzip compression automatically applied
- Browser caching headers set

## Development Environment

### Prerequisites

**Required:**
- Node.js 20.19+ or 22.12+ ([https://nodejs.org/](https://nodejs.org/))
- npm 10.x (comes with Node.js)
- Modern browser (Chrome, Firefox, Edge, Safari latest 2 versions)
- Git 2.x+ for version control

**Recommended:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

**Optional:**
- React Developer Tools (browser extension)
- Vite extension for debugging

### Setup Commands

**Initial Setup:**
```bash
# 1. Create project with Vite
npm create vite@latest smartbudget -- --template react-ts
cd smartbudget

# 2. Install dependencies
npm install

# 3. Install additional dependencies
npm install react-router-dom recharts date-fns lucide-react

# 4. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5. Install code quality tools
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks
npm install -D husky lint-staged
npx husky init

# 6. Start development server
npm run dev
```

**Daily Development:**
```bash
# Start dev server (with HMR)
npm run dev

# Run linting
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "prepare": "husky"
  }
}
```

## Testing Patterns

SmartBudget uses **Vitest** (included with Vite) and **React Testing Library** for testing. These patterns ensure consistent, maintainable tests across all AI agents.

### Test Framework Setup

**Install Testing Dependencies:**
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Vite Config (vite.config.ts):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

**Test Setup File (src/test/setup.ts):**
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### Test Organization

**Test File Location:**
- Place tests adjacent to source files: `ComponentName.test.tsx`
- Group related tests in describe blocks
- Use descriptive test names

**Example Structure:**
```
src/
├── components/
│   ├── transactions/
│   │   ├── TransactionCard.tsx
│   │   └── TransactionCard.test.tsx
│   └── dashboard/
│       ├── SummaryCards.tsx
│       └── SummaryCards.test.tsx
└── services/
    ├── calculationService.ts
    └── calculationService.test.ts
```

### Component Testing Patterns

**1. Basic Component Rendering:**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionCard } from './TransactionCard';

describe('TransactionCard', () => {
  it('displays transaction details correctly', () => {
    const mockTransaction = {
      id: '1',
      amount: 150.50,
      date: '2025-11-10',
      category: 'food',
      type: 'expense' as const,
      description: 'Groceries',
      createdAt: '2025-11-10T10:00:00Z',
      updatedAt: '2025-11-10T10:00:00Z'
    };

    render(<TransactionCard transaction={mockTransaction} />);

    expect(screen.getByText('$150.50')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText(/food/i)).toBeInTheDocument();
  });
});
```

**2. Testing User Interactions:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TransactionForm } from './TransactionForm';

describe('TransactionForm', () => {
  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<TransactionForm onSubmit={mockSubmit} />);

    // Fill out form
    await user.type(screen.getByLabelText(/amount/i), '100');
    await user.selectOptions(screen.getByLabelText(/category/i), 'food');
    await user.type(screen.getByLabelText(/description/i), 'Lunch');

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify callback
    expect(mockSubmit).toHaveBeenCalledWith({
      amount: 100,
      category: 'food',
      description: 'Lunch',
      // ... other fields
    });
  });

  it('displays validation error for invalid amount', async () => {
    const user = userEvent.setup();
    render(<TransactionForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/amount/i), '-10');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/amount must be greater than zero/i)).toBeInTheDocument();
  });
});
```

**3. Testing with Context:**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppContext } from '@/context/AppContext';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('displays summary cards with context data', () => {
    const mockContextValue = {
      transactions: [
        { id: '1', amount: 100, type: 'income', /* ... */ },
        { id: '2', amount: 50, type: 'expense', /* ... */ }
      ],
      categories: [],
      selectedPeriod: { type: 'this-month', startDate: '2025-11-01', endDate: '2025-11-30' }
    };

    render(
      <AppContext.Provider value={mockContextValue}>
        <Dashboard />
      </AppContext.Provider>
    );

    expect(screen.getByText('$100.00')).toBeInTheDocument(); // Total Income
    expect(screen.getByText('$50.00')).toBeInTheDocument();  // Total Expenses
  });
});
```

### Service Testing Patterns

**1. Pure Function Testing:**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotalIncome, calculateNetBalance } from './calculationService';

describe('calculationService', () => {
  const mockTransactions = [
    { id: '1', amount: 100, type: 'income', date: '2025-11-10', /* ... */ },
    { id: '2', amount: 50, type: 'expense', date: '2025-11-10', /* ... */ },
    { id: '3', amount: 200, type: 'income', date: '2025-11-15', /* ... */ }
  ];

  describe('calculateTotalIncome', () => {
    it('calculates total income correctly', () => {
      const total = calculateTotalIncome(mockTransactions);
      expect(total).toBe(300);
    });

    it('filters by period when provided', () => {
      const period = {
        type: 'custom' as const,
        startDate: '2025-11-10',
        endDate: '2025-11-10',
        label: 'Nov 10'
      };

      const total = calculateTotalIncome(mockTransactions, period);
      expect(total).toBe(100); // Only first transaction
    });
  });

  describe('calculateNetBalance', () => {
    it('calculates net balance as income minus expenses', () => {
      const balance = calculateNetBalance(mockTransactions);
      expect(balance).toBe(250); // 300 - 50
    });
  });
});
```

**2. LocalStorage Service Testing:**
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storageService } from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves and retrieves transactions', () => {
    const transactions = [
      { id: '1', amount: 100, type: 'income', /* ... */ }
    ];

    storageService.saveTransactions(transactions);
    const retrieved = storageService.loadTransactions();

    expect(retrieved).toEqual(transactions);
  });

  it('handles storage quota exceeded error gracefully', () => {
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

    const result = storageService.saveTransactions([/* large data */]);

    expect(result).toEqual({ success: false, error: 'Storage quota exceeded' });
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('validates transaction data on load', () => {
    // Store invalid data
    localStorage.setItem('smartbudget_transactions', JSON.stringify([
      { id: '1', amount: -100 } // Invalid: negative amount
    ]));

    const transactions = storageService.loadTransactions();

    expect(transactions).toEqual([]); // Invalid data filtered out
  });
});
```

### Chart Component Testing

**Testing Recharts Components:**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';

describe('ExpenseBreakdownChart', () => {
  const mockChartData = [
    { name: 'Food', value: 150, fill: '#EF4444' },
    { name: 'Transport', value: 50, fill: '#DC2626' }
  ];

  it('renders chart with data', () => {
    render(<ExpenseBreakdownChart data={mockChartData} />);

    // Recharts renders SVG
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays empty state when no data', () => {
    render(<ExpenseBreakdownChart data={[]} />);

    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });
});
```

### Custom Hook Testing

**Testing Custom Hooks:**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTransactions } from './useTransactions';
import { AppContext } from '@/context/AppContext';

describe('useTransactions', () => {
  it('returns transactions from context', () => {
    const mockContextValue = {
      transactions: [{ id: '1', amount: 100, /* ... */ }],
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn()
    };

    const wrapper = ({ children }) => (
      <AppContext.Provider value={mockContextValue}>
        {children}
      </AppContext.Provider>
    );

    const { result } = renderHook(() => useTransactions(), { wrapper });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].amount).toBe(100);
  });
});
```

### Test Coverage Guidelines

**Target Coverage:**
- **Overall:** ≥80% coverage
- **Services:** ≥90% coverage (critical business logic)
- **Components:** ≥70% coverage (UI can be harder to test)
- **Utilities:** ≥90% coverage (pure functions, easy to test)

**Run Coverage:**
```bash
npm run test:coverage
```

**What to Test:**
- ✅ Business logic (calculations, validations)
- ✅ User interactions (form submissions, button clicks)
- ✅ Error handling (validation errors, storage errors)
- ✅ Edge cases (empty data, invalid inputs)
- ❌ Don't test: Implementation details, third-party libraries, trivial getters/setters

### Continuous Integration

**GitHub Actions (Optional):**
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test -- --coverage
```

## Architecture Decision Records (ADRs)

### ADR-001: Choose Vite over Create React App

**Status:** Accepted
**Date:** 2025-11-10

**Context:**
- Create React App is officially deprecated as of Feb 2025
- Need modern, fast build tool for React development
- Educational project requires demonstrating current best practices

**Decision:**
Use Vite with react-ts template as build tool and dev server.

**Consequences:**
- ✅ Instant HMR and fast startup (<100ms)
- ✅ Modern ES modules, no bundling in dev
- ✅ Officially recommended by React team 2025
- ✅ Excellent TypeScript support out of the box
- ⚠️ Different configuration from CRA (minimal learning curve)

**Alternatives Considered:**
- Create React App (deprecated, slow)
- Next.js (overkill for client-only MVP, adds SSR complexity)
- Parcel (less popular, smaller ecosystem)

---

### ADR-002: Use React Context API over Redux/Zustand

**Status:** Accepted
**Date:** 2025-11-10

**Context:**
- MVP scope with simple state (transactions, categories, period)
- No complex async state orchestration needed
- Team consists of AI agents + intermediate developer
- Minimize dependencies for simpler codebase

**Decision:**
Use React Context API with useReducer for global state management.

**Consequences:**
- ✅ Zero extra dependencies
- ✅ Built into React, well-understood pattern
- ✅ Sufficient for MVP scale (<1000 transactions)
- ✅ Easy to migrate to Zustand/Redux if needed later
- ⚠️ All context consumers re-render on state change (acceptable for MVP)

**Alternatives Considered:**
- Redux Toolkit (overkill, too much boilerplate)
- Zustand (great, but unnecessary dependency for MVP scope)
- Jotai (too new, less documentation)

---

### ADR-003: LocalStorage for Data Persistence (MVP)

**Status:** Accepted
**Date:** 2025-11-10

**Context:**
- MVP requirement: single-user, no cross-device sync
- Want to avoid backend complexity in Phase 1
- Need data to survive browser refresh
- Target dataset: <1000 transactions (~50-100KB)

**Decision:**
Use browser LocalStorage for data persistence in MVP.

**Consequences:**
- ✅ Zero backend infrastructure needed
- ✅ Instant read/write performance
- ✅ Simple implementation
- ✅ Perfect for educational/demo project
- ⚠️ Data tied to single browser (acceptable for MVP)
- ⚠️ 5-10MB storage limit (sufficient for MVP scale)
- ⚠️ No cross-device sync (documented limitation)

**Migration Path:**
- Post-MVP: Add backend API with PostgreSQL/MongoDB
- LocalStorage becomes cache layer
- Implement sync mechanism

**Alternatives Considered:**
- IndexedDB (more complex API, overkill for simple CRUD)
- Backend from start (adds deployment complexity, slows MVP)
- sessionStorage (loses data on tab close)

---

### ADR-004: Recharts for Data Visualization

**Status:** Accepted
**Date:** 2025-11-10

**Context:**
- Need pie chart (expense breakdown) and trend chart (income vs expenses)
- React-specific library preferred for component integration
- Performance target: <2 second render time
- Responsive design required

**Decision:**
Use Recharts as charting library.

**Consequences:**
- ✅ React-native components (not wrapper)
- ✅ Composable API matches React paradigm
- ✅ SVG-based, scales well on all devices
- ✅ Responsive out of the box
- ✅ 24.8K GitHub stars, well-maintained
- ⚠️ Limited animation capabilities (acceptable for MVP)

**Alternatives Considered:**
- Chart.js (Canvas-based, requires react-chartjs-2 wrapper)
- Victory (heavier, more complex API)
- Nivo (beautiful but larger bundle size)
- D3.js (too low-level, steep learning curve)

---

### ADR-005: Tailwind CSS for Styling

**Status:** Accepted
**Date:** 2025-11-10

**Context:**
- Responsive design critical (mobile, tablet, desktop)
- Rapid development velocity needed
- Consistent design system required
- NFR requirement: Professional code quality

**Decision:**
Use Tailwind CSS 4.0 as styling solution.

**Consequences:**
- ✅ Utility-first approach accelerates development
- ✅ Purge unused CSS in production (minimal bundle)
- ✅ Responsive utilities built-in
- ✅ Modern v4.0 features (CSS-first config, faster builds)
- ✅ Excellent for AI-assisted development (descriptive class names)
- ⚠️ Learning curve for utility classes (mitigated by IntelliSense)

**Alternatives Considered:**
- CSS Modules (more verbose, slower development)
- Styled-components (runtime overhead, larger bundle)
- Material-UI (opinionated design, harder to customize)
- Plain CSS (too manual, inconsistent patterns)

---

### ADR-006: TypeScript for Type Safety

**Status:** Accepted
**Date:** 2025-11-10

**Context:**
- Educational project demonstrating professional practices
- AI-assisted development benefits from strong typing
- Complex data structures (Transaction, Category)
- Multiple agents will write code

**Decision:**
Use TypeScript for entire codebase.

**Consequences:**
- ✅ Catch errors at compile time, not runtime
- ✅ Better IDE autocomplete and refactoring
- ✅ Self-documenting code through interfaces
- ✅ AI agents generate more reliable code with types
- ✅ Industry standard for professional React apps 2025
- ⚠️ Slightly slower initial development (offset by fewer bugs)

**Alternatives Considered:**
- JavaScript with JSDoc (weaker type checking)
- JavaScript only (too error-prone for multi-agent development)

---

## Conclusion

This architecture provides a solid foundation for SmartBudget development. Key principles:

1. **Simplicity First**: Use proven, boring technology
2. **Type Safety**: TypeScript prevents entire classes of bugs
3. **Modern Standards**: Vite, React 18, Tailwind v4 - all 2025 best practices
4. **AI-Friendly**: Clear patterns, strong types, consistent structure
5. **Scalable**: Easy to migrate LocalStorage → Backend, Context → Zustand

**Next Steps:**
1. ✅ Architecture Complete
2. → Run Solutioning Gate Check (validate PRD + Architecture alignment)
3. → Begin Epic 1: Project Foundation (Story 1.1: Initialize with Vite)

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: 2025-11-10_
_For: Deyvid_
_Architect: Winston_
