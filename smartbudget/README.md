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

## Environment Variables

This project uses Vite's environment variable system with the `VITE_` prefix for security.

**Configuration Files:**

- `.env.example` - Template with all available variables
- `.env.development` - Development-specific configuration
- `.env.production` - Production configuration

**Available Variables:**

- `VITE_APP_NAME` - Application name (default: "SmartBudget")
- `VITE_APP_VERSION` - Application version
- `VITE_APP_ENV` - Environment (development/production)
- `VITE_APP_DESCRIPTION` - Application description

**Security:**

- Only variables prefixed with `VITE_` are exposed to the client
- Never commit `.env` files with sensitive data to Git
- Use `.env.example` as a template for other developers

## Deployment

This application is configured for deployment to **Netlify** or **Vercel**.

### Deploy to Netlify

1. **Connect Repository:**
   - Log in to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These are pre-configured in `netlify.toml`)

3. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add your `VITE_*` variables from `.env.production`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically deploy on every push to main

### Deploy to Vercel

1. **Connect Repository:**
   - Log in to [Vercel](https://vercel.com/)
   - Click "Add New" → "Project"
   - Import your Git repository

2. **Configure Build Settings:**
   - Framework Preset: Vite
   - (Vercel auto-detects this)

3. **Set Environment Variables:**
   - Add your `VITE_*` variables from `.env.production`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main

### Production Build Optimization

- **Code Splitting:** React and React Router chunked separately
- **Minification:** JavaScript and CSS minified
- **Tree Shaking:** Unused code eliminated
- **Asset Optimization:** Images and static files optimized
- **Caching:** Static assets cached with immutable headers (1 year)
- **Security Headers:** XSS protection, clickjacking prevention, CSP

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
