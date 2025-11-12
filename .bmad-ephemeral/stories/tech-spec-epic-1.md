# Epic Technical Specification: Project Foundation & Development Setup

Date: 2025-11-12
Author: Deyvid
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the technical foundation for SmartBudget, a web-based personal finance management application. This epic creates a professional, maintainable project structure using modern React tooling (Vite + React + TypeScript + Tailwind CSS) with automated quality enforcement and deployment infrastructure.

The foundation enables rapid, confident development throughout the remaining 5 epics while demonstrating professional development practices required for the educational objective. This epic delivers working infrastructure with basic routing and responsive layout—a deployable skeleton ready for feature implementation.

## Objectives and Scope

**In Scope:**
- Initialize Vite + React + TypeScript project with proper folder structure
- Configure code quality tooling (ESLint, Prettier, Husky, lint-staged)
- Implement React Router for client-side navigation with placeholder pages
- Create responsive layout component with header and navigation
- Set up environment configuration and production build optimization
- Establish Git repository with professional commit practices
- Configure deployment preparation for Netlify/Vercel

**Out of Scope:**
- Data models or state management (Epic 2)
- Transaction features or business logic (Epic 3)
- Charts or dashboard visualizations (Epic 4)
- Advanced UI components or styling (Epic 5)
- Testing infrastructure or deployment execution (Epic 6)
- Backend services or APIs

**Success Criteria:**
- `npm run dev` starts development server successfully
- `npm run build` produces optimized production bundle
- `npm run lint` passes with zero errors
- Pre-commit hooks prevent commits with linting errors
- All routes accessible with browser back/forward working correctly
- Application responsive on mobile (≥320px), tablet (768px-1023px), and desktop (≥1024px)
- README documents setup and development workflow

## System Architecture Alignment

**Starter Template:** Vite's official `react-ts` template provides the foundation, establishing:
- React 18.x + TypeScript 5.x
- Vite 6.x build tooling with fast HMR
- ESLint pre-configured for React + TypeScript
- ES Modules (ESM) standard

**Additional Architecture Decisions:**
- **React Router 6.x**: Client-side routing (standard for React SPAs)
- **Tailwind CSS 4.0**: Utility-first CSS framework (fast development, responsive built-in)
- **Husky + lint-staged**: Git hooks for automated quality checks
- **Deployment Target**: Static hosting (Netlify/Vercel) optimized for Vite builds

**Project Structure Established:**
```
smartbudget/
├── src/
│   ├── components/
│   │   ├── layout/        # Header, Nav, Layout (this epic)
│   │   └── common/        # Future reusable components
│   ├── pages/             # Route components (placeholders)
│   ├── App.tsx            # Root component with routing
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── .eslintrc.cjs          # Linting configuration
├── .prettierrc            # Formatting configuration
├── vite.config.ts         # Build configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

**Constraints:**
- Node.js 20.19+ or 22.12+ required
- Modern browser support only (latest 2 versions Chrome/Firefox/Safari)
- Client-side only (no backend in MVP)

## Detailed Design

### Services and Modules

This epic establishes no business logic services, only tooling and infrastructure:

| Module | Responsibility | Inputs | Outputs | Owner |
|--------|---------------|---------|---------|-------|
| **Vite Config** | Build optimization, dev server, path aliases | vite.config.ts | Optimized bundles, HMR | Story 1.1 |
| **ESLint Config** | Code linting rules for React + TypeScript | .eslintrc.cjs | Lint errors/warnings | Story 1.2 |
| **Prettier Config** | Code formatting standards | .prettierrc | Formatted code | Story 1.2 |
| **Husky** | Git hooks execution | .husky/pre-commit | Pre-commit validation | Story 1.2 |
| **React Router** | Client-side navigation | Route config in App.tsx | Page rendering | Story 1.3 |
| **Layout Component** | Consistent page structure | Children components | Wrapped layout | Story 1.4 |
| **Tailwind Config** | Design system tokens | tailwind.config.js | Utility classes | Story 1.4 |
| **Environment Config** | Environment variables | .env files | Runtime config | Story 1.5 |

**Configuration Files Created:**
- `.eslintrc.cjs`: React + TypeScript linting rules
- `.prettierrc`: Code formatting (single quotes, 2-space indent, trailing commas)
- `.husky/pre-commit`: Runs lint-staged before commits
- `.lintstagedrc`: Lints and formats staged files only
- `tailwind.config.js`: Tailwind v4 configuration with custom breakpoints
- `.env.example`: Template for environment variables

### Data Models and Contracts

**Router Configuration:**
```typescript
// App.tsx route structure
const routes = [
  { path: '/', element: <Dashboard /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/transactions', element: <TransactionsList /> },
  { path: '/transactions/new', element: <TransactionForm /> },
  { path: '/transactions/:id/edit', element: <TransactionForm /> },
  { path: '*', element: <NotFound /> }
];
```

**Layout Props Interface:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

**Navigation Items:**
```typescript
const navItems = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Transactions', path: '/transactions', icon: 'List' }
];
```

### APIs and Interfaces

**No external APIs in this epic.** Internal component interfaces:

**Layout Component API:**
```typescript
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
```

**Navigation Component API:**
```typescript
export const Navigation: React.FC = () => {
  const location = useLocation();
  // Render nav with active link highlighting
};
```

**Environment Variables Interface:**
```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  // More env variables as needed
}
```

### Workflows and Sequencing

**Story Implementation Sequence:**
1. **Story 1.1** → Initialize project, verify dev server works
2. **Story 1.2** → Add linting/formatting, test pre-commit hooks
3. **Story 1.3** → Implement routing, verify navigation works
4. **Story 1.4** → Create layout, ensure responsive design
5. **Story 1.5** → Configure environment, test production build

**Development Workflow (Established by this epic):**
```
Developer writes code →
  Pre-commit hook triggers →
    lint-staged runs ESLint + Prettier →
      If pass: Commit succeeds →
        Push to GitHub →
          (Future: Auto-deploy via Netlify/Vercel)
      If fail: Commit blocked, errors shown
```

**Deployment Workflow:**
```
npm run build →
  Vite optimizes and bundles →
    dist/ folder created →
      Upload to Netlify/Vercel →
        Production site live
```

## Non-Functional Requirements

### Performance

**NFR-1.1: Initial Page Load**
- Target: <3 seconds on 3G connection
- Implementation: Vite code-splitting, tree-shaking, minification
- Measurement: Lighthouse performance score ≥90

**NFR-1.2: Development HMR**
- Target: Hot Module Replacement <200ms
- Implementation: Vite's fast HMR engine
- Verification: Changes reflect instantly in browser

**NFR-1.3: Production Build**
- Target: Build completes in <30 seconds
- Implementation: Vite optimized build pipeline
- Assets: Minified, gzipped, tree-shaken

### Security

**NFR-2.1: Dependency Security**
- All dependencies from npm with integrity checking
- No known vulnerabilities in dependencies
- Run `npm audit` before any story completion
- Fix high/critical vulnerabilities immediately

**NFR-2.2: XSS Prevention**
- React's built-in XSS protection (auto-escaping)
- No `dangerouslySetInnerHTML` usage in Epic 1
- Content Security Policy headers (configured in deployment)

**NFR-2.3: Environment Variables**
- No sensitive data in Git repository
- `.env` files in `.gitignore`
- Public variables prefixed with `VITE_`

### Reliability/Availability

**NFR-3.1: Error Handling**
- 404 page for invalid routes
- Error boundary for React component errors (basic implementation)
- Graceful fallback if JavaScript fails to load

**NFR-3.2: Browser Compatibility**
- Targets modern browsers (Chrome, Firefox, Safari latest 2 versions)
- ES2020+ JavaScript (no IE11 support)
- Fallback message for unsupported browsers

### Observability

**NFR-4.1: Development Logging**
- Console logging for navigation events
- Error logging for component mount failures
- Build process logs visible during development

**NFR-4.2: Production Monitoring**
- (Deferred to Epic 6) Error tracking service integration
- Basic console logging remains for debugging

## Dependencies and Integrations

**Core Dependencies (package.json):**

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.30.0",
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

**Integration Points:**
- **Vite ↔ React**: `@vitejs/plugin-react` enables JSX and Fast Refresh
- **Tailwind ↔ PostCSS**: PostCSS processes Tailwind directives
- **ESLint ↔ TypeScript**: TypeScript parser for type-aware linting
- **Husky ↔ Git**: Git hooks run lint-staged before commits
- **React Router ↔ React**: Client-side routing without page reloads

**External Services:**
- None in this epic (deployment services in Epic 6)

## Acceptance Criteria (Authoritative)

**AC-1.1: Project Initialization**
- ✓ Vite project created with `react-ts` template
- ✓ `npm install` completes without errors
- ✓ `npm run dev` starts dev server on `http://localhost:5173`
- ✓ Browser shows "Hello World" or Vite default page
- ✓ Folder structure includes: `/src`, `/public`, `vite.config.ts`, `package.json`, `tsconfig.json`

**AC-1.2: Code Quality Tooling**
- ✓ ESLint configured with React + TypeScript rules
- ✓ Prettier configured for consistent formatting
- ✓ Husky installed with pre-commit hook
- ✓ `npm run lint` executes and passes on clean code
- ✓ `npm run format` formats all files consistently
- ✓ Pre-commit hook blocks commits with linting errors
- ✓ All existing code passes linting with zero warnings

**AC-1.3: Application Routing**
- ✓ React Router installed and configured
- ✓ Routes accessible: `/`, `/dashboard`, `/transactions`, `/transactions/new`, `/transactions/:id/edit`
- ✓ Invalid routes show 404 Not Found page
- ✓ Browser back/forward buttons work correctly (no page reload)
- ✓ Navigation is client-side only (no full page refreshes)
- ✓ Placeholder components render for each route

**AC-1.4: Layout & Navigation**
- ✓ Header component with "SmartBudget" branding
- ✓ Navigation menu with Dashboard and Transactions links
- ✓ Current page highlighted in navigation
- ✓ Responsive design: Desktop (≥1024px horizontal nav), Mobile (≤767px hamburger menu)
- ✓ Layout wraps all page content consistently
- ✓ Mobile menu toggles open/closed on hamburger click

**AC-1.5: Environment Configuration**
- ✓ `.env.example` file with template variables
- ✓ Environment variables accessible via `import.meta.env.VITE_*`
- ✓ `npm run build` creates optimized production bundle in `/dist`
- ✓ Production build is minified and tree-shaken
- ✓ README documents: setup steps, dev commands, build process

**Cross-Story Acceptance Criteria:**
- ✓ All stories completed in sequence (1.1 → 1.2 → 1.3 → 1.4 → 1.5)
- ✓ No TypeScript errors (`npm run type-check` passes)
- ✓ No console errors in browser dev tools
- ✓ Professional Git commit messages following conventional commits
- ✓ `.gitignore` excludes: `node_modules/`, `.env`, `dist/`, `.DS_Store`

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component/Module | Test Idea |
|---------------------|-------------|------------------|-----------|
| AC-1.1 | Project Initialization | Vite config, package.json | Manual: Run `npm run dev`, verify localhost loads |
| AC-1.2 | Code Quality Tooling | .eslintrc.cjs, .prettierrc, Husky | Manual: Attempt commit with lint error, verify block |
| AC-1.3 | Routing | App.tsx, React Router | Manual: Navigate to each route, test 404, back button |
| AC-1.4 | Layout | Layout.tsx, Header.tsx, Navigation.tsx | Manual: Resize browser, verify responsive breakpoints |
| AC-1.5 | Environment Config | .env, vite.config.ts, README | Manual: Run build, check dist/ size and optimization |

**PRD Requirement Mapping:**
- **NFR-3.1 (Code Organization)** → Stories 1.1, 1.4 (folder structure)
- **NFR-3.3 (Code Style)** → Story 1.2 (ESLint, Prettier)
- **NFR-3.4 (Git Practices)** → Story 1.2 (Husky, conventional commits)
- **NFR-6.1 (Deployment)** → Story 1.5 (build configuration)
- **FR-5.1 (Mobile Responsiveness)** → Story 1.4 (responsive layout)

**Architecture Document Mapping:**
- **Section: Project Initialization** → Story 1.1
- **Section: Code Quality** → Story 1.2
- **Section: Project Structure** → Stories 1.1, 1.4
- **Section: Technology Stack** → All stories
- **Section: Implementation Patterns** → Story 1.4 (component patterns)

## Risks, Assumptions, Open Questions

**Risks:**
1. **[RISK]** Tailwind CSS 4.0 is very new (released 2024). If breaking changes or instability occur, fallback to Tailwind CSS 3.4 (stable, well-documented)
   - *Mitigation:* Test Tailwind 4.0 in Story 1.4; if issues arise, downgrade immediately

2. **[RISK]** Vite configuration may require tweaks for deployment platform
   - *Mitigation:* Story 1.5 includes deployment prep; Epic 6 handles actual deployment

3. **[RISK]** Pre-commit hooks might slow down development workflow
   - *Mitigation:* Use lint-staged to lint only changed files; skip hooks with `--no-verify` in emergencies (discouraged)

**Assumptions:**
1. **[ASSUMPTION]** Developer has Node.js 20.19+ or 22.12+ installed
   - *Validation:* README includes prerequisite check commands

2. **[ASSUMPTION]** Modern browsers support ES2020+ JavaScript
   - *Validation:* Vite defaults to modern ES targets; browser compatibility tested in Epic 6

3. **[ASSUMPTION]** npm (not yarn/pnpm) is used for package management
   - *Validation:* package-lock.json will be in repository

4. **[ASSUMPTION]** No backend required for routing (SPA only)
   - *Validation:* React Router handles all routing client-side

**Open Questions:**
1. **[QUESTION]** Should we use hash routing (#/) or browser routing (/)  for React Router?
   - *Decision:* Use browser routing (BrowserRouter) for cleaner URLs; configure deployment platform for SPA fallback to index.html

2. **[QUESTION]** Should navigation be in header or sidebar?
   - *Decision:* Header navigation for simplicity; sidebar deferred to future enhancement

3. **[QUESTION]** What's the mobile breakpoint for hamburger menu?
   - *Decision:* ≤767px triggers hamburger menu (Tailwind's `md` breakpoint)

## Test Strategy Summary

**Epic 1 Testing Approach: Manual Testing**

Automated testing is deferred to Epic 6. Epic 1 uses manual verification:

**Story 1.1 Testing:**
- Execute: `npm create vite@latest smartbudget -- --template react-ts && cd smartbudget && npm install && npm run dev`
- Verify: Browser opens, Vite welcome screen appears, no console errors
- Verify: `npm run build` completes successfully

**Story 1.2 Testing:**
- Introduce intentional linting error (e.g., unused variable)
- Execute: `npm run lint`
- Verify: Linting error reported
- Execute: `git add . && git commit -m "test"`
- Verify: Pre-commit hook blocks commit due to lint error
- Fix error, verify commit succeeds

**Story 1.3 Testing:**
- Navigate to each route manually: `/`, `/dashboard`, `/transactions`, `/transactions/new`, `/transactions/123/edit`, `/invalid-route`
- Verify: Correct placeholder components render
- Verify: 404 page shows for invalid route
- Test: Browser back/forward buttons navigate correctly without page reload
- Check: No console errors, network tab shows no full page loads

**Story 1.4 Testing:**
- Resize browser to 320px, 768px, 1024px, 1920px
- Verify: Layout adapts responsively
- Verify: Mobile (≤767px) shows hamburger menu
- Verify: Desktop (≥1024px) shows horizontal navigation
- Test: Hamburger menu toggles on click
- Check: Active page highlighted in nav

**Story 1.5 Testing:**
- Create `.env` file with test variables
- Verify: Variables accessible via `import.meta.env.VITE_*`
- Execute: `npm run build`
- Verify: `/dist` folder created with optimized bundles
- Check: Bundle sizes reasonable (<500KB for initial bundle)
- Inspect: `dist/assets` files are minified and hashed

**Acceptance Testing:**
- Complete all 5 stories sequentially
- Execute full workflow: clone repo → npm install → npm run dev → test all routes → npm run build
- Verify: README instructions work for fresh setup
- Check: No warnings or errors in any commands
- Validate: Professional Git history with clear commit messages

**Test Coverage Goals (Epic 1):**
- Manual verification: 100% of acceptance criteria
- Automated tests: 0% (deferred to Epic 6)
- User flow testing: Basic navigation and responsive design confirmed

---

**Epic 1 Tech Spec Complete - Ready for Story Implementation**
