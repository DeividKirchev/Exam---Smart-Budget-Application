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

## Tech Stack

- **React** 18.3.1 - UI framework
- **TypeScript** 5.9.3 - Type safety
- **Vite** 6.4.1 - Build tool & dev server
- **ESLint** - Code quality

## License

Private project for educational purposes.
