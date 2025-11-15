# Story 1.3: Application Routing Structure

Status: review

## Story

As a user,
I want to navigate between different pages in the application,
So that I can access Dashboard, Transactions, and other views seamlessly.

## Acceptance Criteria

**Given** The application is running (Story 1.1 complete)
**When** I navigate to different routes
**Then** The following routes are accessible:

1. ✅ `/` or `/dashboard` - Dashboard view (placeholder component)
2. ✅ `/transactions` - Transactions list view (placeholder component)
3. ✅ `/transactions/new` - Add transaction form (placeholder component)
4. ✅ `/transactions/:id/edit` - Edit transaction form (placeholder component with dynamic :id param)
5. ✅ `/*` (invalid routes) - 404 Not Found page

**And** Navigation is client-side only (no page reloads, no full HTTP requests)
**And** Browser back/forward buttons work correctly
**And** Invalid routes show a proper 404 Not Found page
**And** URL updates in browser address bar when navigating

## Tasks / Subtasks

### Task 1: Install React Router Dependencies (AC: #1-5)

- [x] **1.1** Install React Router v6:
  ```bash
  npm install react-router-dom@^6.30.0
  ```
- [x] **1.2** Verify package.json includes `react-router-dom` in dependencies
- [x] **1.3** Check React Router version matches architecture spec (6.x)
  [Source: docs/architecture.md#Technology-Stack-Details]

### Task 2: Create Placeholder Page Components (AC: #1-4)

- [x] **2.1** Create Dashboard page component:
  - [x] File: `src/pages/Dashboard.tsx`
  - [x] Export functional component with placeholder content
  - [x] Add heading: "Dashboard Page (Placeholder)"
  - [x] Add TypeScript types for props (if any)
- [x] **2.2** Create Transactions List page:
  - [x] File: `src/pages/TransactionsList.tsx`
  - [x] Export functional component
  - [x] Add heading: "Transactions List (Placeholder)"
- [x] **2.3** Create Transaction Form page:
  - [x] File: `src/pages/TransactionForm.tsx`
  - [x] Export functional component
  - [x] Accept optional `mode` prop: 'create' | 'edit'
  - [x] Display different heading based on mode
  - [x] Add placeholder: "Add Transaction" or "Edit Transaction"
  - [x] Use `useParams()` hook to access `:id` for edit mode
- [x] **2.4** Create 404 Not Found page:
  - [x] File: `src/pages/NotFound.tsx`
  - [x] Export functional component
  - [x] Add heading: "404 - Page Not Found"
  - [x] Add message: "The page you're looking for doesn't exist."
  - [x] Add link back to Dashboard

### Task 3: Configure React Router in App.tsx (AC: #1-5)

- [x] **3.1** Import React Router components in `src/App.tsx`:
  ```typescript
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  ```
- [x] **3.2** Import all page components:
  ```typescript
  import Dashboard from './pages/Dashboard';
  import TransactionsList from './pages/TransactionsList';
  import TransactionForm from './pages/TransactionForm';
  import NotFound from './pages/NotFound';
  ```
- [x] **3.3** Wrap entire app in `<BrowserRouter>`:
  ```typescript
  function App() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Routes will go here */}
        </Routes>
      </BrowserRouter>
    );
  }
  ```
  [Source: docs/architecture.md#Routing-Navigation]
- [x] **3.4** Define all routes inside `<Routes>`:
  ```typescript
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/transactions" element={<TransactionsList />} />
    <Route path="/transactions/new" element={<TransactionForm mode="create" />} />
    <Route path="/transactions/:id/edit" element={<TransactionForm mode="edit" />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
  ```
  [Source: tech-spec-epic-1.md#Data-Models-and-Contracts]
- [x] **3.5** Verify route order (most specific first, wildcard `*` last)
- [x] **3.6** Remove any default Vite template content from App.tsx

### Task 4: Add Navigation Links (Basic) (AC: navigation)

- [x] **4.1** Import `Link` component in App.tsx or create basic Nav component:
  ```typescript
  import { Link } from 'react-router-dom';
  ```
- [x] **4.2** Add simple navigation above `<Routes>`:
  ```typescript
  <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
    <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
    <Link to="/transactions" style={{ marginRight: '1rem' }}>Transactions</Link>
    <Link to="/transactions/new">Add Transaction</Link>
  </nav>
  ```
- [x] **4.3** Note: Full navigation styling will be in Story 1.4

### Task 5: Test Client-Side Navigation (AC: navigation, back/forward)

- [x] **5.1** Start dev server: `npm run dev`
- [x] **5.2** Open browser to `http://localhost:5173`
- [x] **5.3** Test each route manually:
  - [x] Navigate to `/` - verify Dashboard renders
  - [x] Navigate to `/dashboard` - verify Dashboard renders
  - [x] Navigate to `/transactions` - verify Transactions List renders
  - [x] Navigate to `/transactions/new` - verify "Add Transaction" form renders
  - [x] Navigate to `/transactions/123/edit` - verify "Edit Transaction" renders with id=123
  - [x] Navigate to `/invalid-route` - verify 404 page renders
- [x] **5.4** Test browser navigation:
  - [x] Click browser back button - verify previous page renders
  - [x] Click browser forward button - verify next page renders
  - [x] Verify URL updates in address bar
  - [x] Verify no full page reload (check Network tab - no document requests)
- [x] **5.5** Check console for errors (should be zero errors)

### Task 6: Test Dynamic Route Parameters (AC: #4)

- [x] **6.1** In TransactionForm.tsx, add `useParams` hook:
  ```typescript
  import { useParams } from 'react-router-dom';

  const TransactionForm = ({ mode }: { mode: 'create' | 'edit' }) => {
    const { id } = useParams();

    return (
      <div>
        <h1>{mode === 'create' ? 'Add Transaction' : `Edit Transaction ${id}`}</h1>
      </div>
    );
  };
  ```
- [x] **6.2** Test with different IDs:
  - [x] `/transactions/123/edit` - should show "Edit Transaction 123"
  - [x] `/transactions/456/edit` - should show "Edit Transaction 456"
  - [x] `/transactions/abc/edit` - should show "Edit Transaction abc"
- [x] **6.3** Verify `id` parameter is accessible in component

### Task 7: Verify TypeScript Compilation (AC: quality)

- [x] **7.1** Run TypeScript type check: `npx tsc --noEmit`
- [x] **7.2** Fix any TypeScript errors in page components
- [x] **7.3** Ensure all components have proper type annotations
- [x] **7.4** Verify no `any` types used (strict mode)

### Task 8: Test Production Build (AC: deployment readiness)

- [x] **8.1** Run production build: `npm run build`
- [x] **8.2** Verify build succeeds with no errors
- [x] **8.3** Check bundle size (should be reasonable, <200KB)
- [x] **8.4** Preview production build: `npm run preview`
- [x] **8.5** Test all routes in preview mode

### Task 9: Update README (Best Practice)

- [x] **9.1** Add "Routes" section to README.md:
  ```markdown
  ## Routes

  - `/` or `/dashboard` - Dashboard (placeholder)
  - `/transactions` - Transactions list (placeholder)
  - `/transactions/new` - Add new transaction (placeholder)
  - `/transactions/:id/edit` - Edit existing transaction (placeholder)
  - `*` - 404 Not Found page
  ```
- [x] **9.2** Note that placeholders will be implemented in future stories

### Task 10: Git Commit (Best Practice)

- [x] **10.1** Stage all changes: `git add .`
- [x] **10.2** Verify linting passes (if Story 1.2 complete): `npm run lint`
- [x] **10.3** Create commit with conventional format:
  ```bash
  git commit -m "feat: add React Router with page routing structure

  - Install react-router-dom v6.30
  - Create placeholder page components (Dashboard, Transactions, Form, 404)
  - Configure routes in App.tsx with BrowserRouter
  - Add basic navigation links
  - Test client-side navigation and browser back/forward
  - Verify dynamic route parameters (/transactions/:id/edit)

  🤖 Generated with Claude Code
  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```
- [x] **10.4** Verify all acceptance criteria met

## Dev Notes

### Architecture Alignment

**Routing Technology (from Architecture):**
- **React Router 6.x**: De facto standard for React routing [Source: docs/architecture.md#Decision-Summary]
- **Client-Side Routing**: BrowserRouter for clean URLs (not HashRouter)
- **No Backend Required**: All routing handled in browser

**Route Structure Established:**
```typescript
const routes = [
  { path: '/', element: <Dashboard /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/transactions', element: <TransactionsList /> },
  { path: '/transactions/new', element: <TransactionForm /> },
  { path: '/transactions/:id/edit', element: <TransactionForm /> },
  { path: '*', element: <NotFound /> }
];
```
[Source: docs/architecture.md#Data-Models-and-Contracts]

### Implementation Patterns

**Page Component Pattern:**
```typescript
// src/pages/Dashboard.tsx
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard Page (Placeholder)</h1>
      <p>This is a placeholder. Dashboard features will be implemented in Epic 4.</p>
    </div>
  );
};

export default Dashboard;
```

**Dynamic Route Pattern:**
```typescript
// src/pages/TransactionForm.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

interface TransactionFormProps {
  mode: 'create' | 'edit';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>{mode === 'create' ? 'Add Transaction' : `Edit Transaction #${id}`}</h1>
      <p>Form implementation in Epic 3</p>
    </div>
  );
};

export default TransactionForm;
```

**App.tsx Router Setup:**
```typescript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionsList />} />
        <Route path="/transactions/new" element={<TransactionForm mode="create" />} />
        <Route path="/transactions/:id/edit" element={<TransactionForm mode="edit" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Project Structure Updates

**New Directories:**
- `src/pages/` - Already created in Story 1.1 ✓

**New Files Created (5 files):**
1. `src/pages/Dashboard.tsx` - Dashboard placeholder
2. `src/pages/TransactionsList.tsx` - Transactions list placeholder
3. `src/pages/TransactionForm.tsx` - Transaction form placeholder
4. `src/pages/NotFound.tsx` - 404 error page

**Modified Files:**
- `src/App.tsx` - Add BrowserRouter and Routes configuration
- `package.json` - Add react-router-dom dependency
- `README.md` - Document available routes

### Testing Strategy

**Manual Testing Checklist:**

1. **Route Accessibility:**
   - Visit each URL directly in browser
   - Verify correct component renders
   - Check no console errors

2. **Client-Side Navigation:**
   - Use `<Link>` components to navigate
   - Open browser Network tab
   - Verify no document (HTML) requests after initial load
   - Only XHR/fetch requests should appear (when data loading added later)

3. **Browser History:**
   - Navigate: Dashboard → Transactions → Add Transaction
   - Click back button twice
   - Verify returns to Dashboard
   - Click forward button once
   - Verify returns to Transactions

4. **Dynamic Routes:**
   - Navigate to `/transactions/999/edit`
   - Verify "Edit Transaction #999" displays
   - Change URL to `/transactions/abc/edit`
   - Verify "Edit Transaction #abc" displays

5. **404 Handling:**
   - Navigate to `/this-route-does-not-exist`
   - Verify 404 page renders
   - Verify "Page Not Found" message
   - Click link back to Dashboard

6. **Build Verification:**
   - Run `npm run build`
   - Run `npm run preview`
   - Test all routes in production preview

[Source: .bmad-ephemeral/stories/tech-spec-epic-1.md#Story-1.3-Testing]

### Dependencies Added

**React Router:**
```json
{
  "dependencies": {
    "react-router-dom": "^6.30.0"
  }
}
```

**Type Definitions:**
- Included with react-router-dom (no separate @types needed)

[Source: docs/architecture.md#Dependencies-Overview]

### Performance Considerations

**Code Splitting (Future):**
- Current approach: All pages bundled together
- Future optimization (Epic 6): Use React.lazy() and Suspense for route-based code splitting
- For MVP with 5 simple pages, bundling together is acceptable

**Bundle Size Impact:**
- React Router adds ~10-15KB gzipped
- Expected total bundle: ~160KB (was 144KB from Story 1.1)
- Still well within performance budget (<500KB)

### Known Issues and Workarounds

**Issue: Deployment on Static Hosts (404s on Direct URL Access)**
- **Problem**: Navigating to `/transactions` directly gives 404 on static hosts (Netlify/Vercel)
- **Cause**: Server doesn't know about client-side routes
- **Solution**: Configure server redirect (Story 1.5 or Epic 6)
  - Netlify: Add `_redirects` file with `/* /index.html 200`
  - Vercel: Add `vercel.json` with rewrites config
- **Workaround**: Use HashRouter (#/transactions) - NOT recommended, breaks UX

**Issue: useParams returns undefined**
- **Cause**: Using useParams outside Router context
- **Solution**: Ensure component is rendered inside `<Routes>`

**Issue: Multiple renders on navigation**
- **Expected**: React Router triggers re-render when route changes
- **Not an issue**: This is normal behavior

### Prerequisites Check

**Story 1.1 Must Be Complete:**
- ✅ Vite project initialized with React + TypeScript
- ✅ src/pages/ directory exists
- ✅ Development server working
- ✅ Git repository initialized

**Verification:**
```bash
ls src/pages/          # Should exist (created in Story 1.1)
npm run dev            # Should start without errors
```

### Next Story Preparation

**Story 1.4 Prerequisites:**
- This story establishes routing foundation
- Story 1.4 will enhance with full Layout and Navigation components
- Placeholder pages will be replaced with actual implementations in Epic 3-4

**Patterns Established for Story 1.4:**
- Page component structure in `src/pages/`
- BrowserRouter wrapping in App.tsx
- Basic navigation with `<Link>` components
- Story 1.4 will create `src/components/layout/` components

### Learnings from Previous Story

**From Story 1.1 (Status: review - completed):**

Story 1.1 has been successfully implemented with the following key learnings:

- **Node.js Version**: v18.20.4 used (below recommended 20.19+ but compatible)
  - Vite 6.4.1 works well with Node.js 18.x
  - No need to upgrade Node.js for this project

- **Vite Version Adjustment**: Downgraded from 7.2.2 to 6.4.1
  - Reason: Vite 7.x requires Node.js 20.19+ (crypto.hash function)
  - Resolution: Used `npm install vite@^6.0.0` per architecture spec
  - **Action for This Story**: Verify React Router compatible with Vite 6.4.1 ✓

- **Project Structure Established**: 11 subdirectories created including:
  - ✅ `src/pages/` - Ready for this story's page components
  - ✅ `src/components/` - Ready for Story 1.4 layout components
  - All folders follow architecture document exactly

- **Build Performance Baseline**:
  - Dev server startup: 659ms
  - Production build: 1.10s
  - Bundle size: 144.36 KB (46.40 KB gzipped)
  - **Expected after this story**: +10-15KB for React Router

- **Files Created**: 16 Vite template files + 11 directories
  - `src/App.tsx` exists and needs modification for routing
  - `src/main.tsx` entry point configured correctly
  - TypeScript configuration working (no errors)

- **Git Repository**: Initialized and ready
  - Initial commit made with conventional commit format
  - Pattern established for commit messages (feat: title, bullets, emoji)

- **Development Workflow**: Established
  - `npm run dev` starts server on port 5173
  - HMR working (instant updates)
  - `npm run build` creates production bundle

**Integration Notes for Story 1.3:**
- Modify existing `src/App.tsx` (from Story 1.1) to add routing
- Create new files in existing `src/pages/` directory
- Follow same Git commit message pattern
- Build on existing package.json (add react-router-dom dependency)
- Maintain bundle size efficiency (total should stay <200KB)

[Source: .bmad-ephemeral/stories/1-1-project-initialization-technology-stack-setup.md#Dev-Agent-Record]

### References

- **Architecture Document**: [docs/architecture.md](../../docs/architecture.md)
  - Routing & Navigation section
  - Technology Stack (React Router 6.x)
  - Data Models and Contracts (route structure)

- **Epic Tech Spec**: [.bmad-ephemeral/stories/tech-spec-epic-1.md](./tech-spec-epic-1.md)
  - AC-1.3: Application Routing acceptance criteria
  - APIs and Interfaces (route configuration)
  - Test Strategy for Story 1.3

- **PRD**: [docs/PRD.md](../../docs/PRD.md)
  - Web Application Specific Requirements
  - Client-Side Features (routing requirements)

- **Epics Breakdown**: [docs/epics.md](../../docs/epics.md)
  - Story 1.3 detailed requirements and technical notes

- **Previous Story**: [.bmad-ephemeral/stories/1-1-project-initialization-technology-stack-setup.md](./1-1-project-initialization-technology-stack-setup.md)
  - Project foundation and structure
  - Vite version compatibility notes
  - Build performance baseline

### Security Considerations

**Client-Side Routing Security:**
- No authentication in MVP - all routes publicly accessible
- Future (Epic 2+): Add route guards for protected routes
- No sensitive data in URL parameters in MVP

**XSS Prevention:**
- React Router escapes URL parameters automatically
- `useParams()` hook returns sanitized values
- No `dangerouslySetInnerHTML` needed

**404 Page:**
- Custom 404 prevents information disclosure
- Doesn't reveal internal route structure
- User-friendly message maintains professional UX

## Dev Agent Record

### Context Reference

- [.bmad-ephemeral/stories/1-3-application-routing-structure.context.xml](.bmad-ephemeral/stories/1-3-application-routing-structure.context.xml)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No blocking issues encountered during implementation. All tasks executed successfully in single continuous session.

### Completion Notes List

**React Router Installation:**
- Version installed: react-router-dom@6.30.2 (matches architecture spec 6.x)
- No compatibility issues with Vite 6.4.1
- No compatibility issues with Node.js 18.20.4

**Implementation Results:**
- ✅ All 4 placeholder page components created with proper TypeScript types
- ✅ All 6 routes configured in App.tsx (/, /dashboard, /transactions, /transactions/new, /transactions/:id/edit, 404)
- ✅ Basic navigation links implemented using React Router Link component
- ✅ Dynamic route parameters working correctly with useParams hook

**Quality Checks:**
- ✅ TypeScript compilation: 0 errors (npx tsc --noEmit)
- ✅ Pre-commit hooks: ESLint + Prettier auto-formatted all code
- ✅ Production build successful in 3.35s

**Bundle Size Analysis:**
- Previous (Story 1.1): 144.36 KB (46.40 KB gzipped)
- Current (Story 1.3): 166.51 KB (54.36 KB gzipped)
- Increase: ~22 KB (~8 KB gzipped) - React Router overhead as expected
- Status: ✅ Well under 200KB target

**Manual Testing Confirmed:**
- Dev server runs on port 5174 (5173 was in use)
- All routes accessible and rendering correct components
- Browser back/forward navigation works correctly
- URL updates in address bar
- Client-side routing (no page reloads)
- Dynamic route parameters display correctly (/transactions/:id/edit)

**Git Commit:**
- Commit hash: be386d9
- Conventional commit format used
- Pre-commit hooks passed (lint-staged formatted files)

### File List

**NEW Files (4):**
- smartbudget/src/pages/Dashboard.tsx
- smartbudget/src/pages/TransactionsList.tsx
- smartbudget/src/pages/TransactionForm.tsx
- smartbudget/src/pages/NotFound.tsx

**MODIFIED Files (4):**
- smartbudget/src/App.tsx (added BrowserRouter, Routes, and basic navigation)
- smartbudget/package.json (added react-router-dom@^6.30.2 dependency)
- smartbudget/package-lock.json (dependency lock file updated)
- smartbudget/README.md (documented all routes in new Routes section)

---

**Story Ready for Story Context Generation**

Run `*story-context` to generate technical context XML and mark this story ready for development.
