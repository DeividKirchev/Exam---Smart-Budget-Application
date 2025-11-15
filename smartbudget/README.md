# SmartBudget

A personal finance management application built with React, TypeScript, and Vite.

## Prerequisites

- **Node.js**: 20.19+ or 22.12+ (recommended)
  - Note: Works with Node.js 18.20+ but may show compatibility warnings
- **npm**: 10.x (comes with Node.js)

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## Build

Create an optimized production build:

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

## Preview

Preview the production build locally:

```bash
npm run preview
```

## Code Quality

This project uses ESLint and Prettier to enforce code quality standards.

**Linting Commands:**

- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check code formatting

**Pre-commit Hooks:**

- Husky runs lint-staged before each commit
- Commits with linting errors will be blocked
- Code is automatically formatted on commit

All linting rules are configured in `eslint.config.js`. Formatting rules are defined in `.prettierrc`. For more details on the code quality setup, see the configuration files in the project root.

## Project Structure

```
smartbudget/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, static files
│   ├── components/     # Reusable UI components
│   │   ├── common/    # Generic components
│   │   └── layout/    # Layout components
│   ├── pages/         # Page/view components
│   ├── context/       # React Context providers
│   ├── services/      # Business logic & data access
│   ├── models/        # TypeScript interfaces & types
│   ├── constants/     # App constants & configuration
│   ├── utils/         # Helper functions
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Global styles
│   ├── App.tsx        # Root component
│   └── main.tsx       # Application entry point
├── index.html         # HTML entry point
├── package.json       # Dependencies & scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── .gitignore         # Git ignore rules
```

## Routes

- `/` or `/dashboard` - Dashboard (placeholder)
- `/transactions` - Transactions list (placeholder)
- `/transactions/new` - Add new transaction (placeholder)
- `/transactions/:id/edit` - Edit existing transaction (placeholder)
- `*` - 404 Not Found page

Note: Placeholders will be implemented with full functionality in future epics.

## Components

### Layout Components

- **Layout** - Main layout wrapper providing consistent structure
- **Header** - Application header with SmartBudget branding
- **Navigation** - Responsive navigation menu with active state highlighting

## UI Framework

**Tailwind CSS 4.0** - Utility-first CSS framework for rapid UI development

- Mobile-first responsive design
- Optimized production builds (unused classes purged)
- Custom configuration in `tailwind.config.js`

**Lucide React** - Modern icon library

- Lightweight, tree-shakable SVG icons
- Used for navigation and UI elements

## Responsive Breakpoints

- **Mobile**: < 768px (hamburger menu)
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

The layout is designed mobile-first and adapts seamlessly across all screen sizes.

## Tech Stack

- **React** 18.3.1 - UI framework
- **TypeScript** 5.9.3 - Type safety
- **Vite** 6.4.1 - Build tool & dev server
- **React Router** 6.30.2 - Client-side routing
- **Tailwind CSS** 4.0.0 - Utility-first CSS framework
- **Lucide React** - Icon library
- **ESLint** + **Prettier** - Code quality

## License

Private project for educational purposes.
