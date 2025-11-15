# Story 1.4: Basic UI Layout & Navigation Component

Status: drafted

## Story

As a user,
I want a consistent layout with navigation across all pages,
So that the application feels cohesive and I can easily move between sections.

## Acceptance Criteria

**Given** I am on any page of the application
**When** The page renders
**Then** I see a consistent layout with:

1. ✅ App header with "SmartBudget" branding/logo
2. ✅ Navigation menu with links to Dashboard and Transactions
3. ✅ Main content area for page-specific content
4. ✅ Responsive design that adapts to screen size (mobile ≥320px, tablet 768-1023px, desktop ≥1024px)

**And** The current page is highlighted in the navigation (active state)
**And** Navigation works on both desktop and mobile (hamburger menu on mobile, < 768px)
**And** Layout component wraps all routes for consistency

## Tasks / Subtasks

### Task 1: Install Tailwind CSS and Dependencies (AC: #3, #4)

- [ ] **1.1** Install Tailwind CSS v4.x + required dependencies:
  ```bash
  npm install -D tailwindcss@^4.0.0 postcss autoprefixer
  ```
- [ ] **1.2** Initialize Tailwind configuration:
  ```bash
  npx tailwindcss init -p
  ```
- [ ] **1.3** Verify `tailwind.config.js` and `postcss.config.js` created
- [ ] **1.4** Configure Tailwind to scan TypeScript/TSX files in `tailwind.config.js`:
  ```javascript
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
  ```
- [ ] **1.5** Add Tailwind directives to `src/index.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- [ ] **1.6** Verify dev server restarts and Tailwind classes work
  [Source: docs/architecture.md#Technology-Stack-Details]

### Task 2: Install Lucide React Icons (AC: #1, #2)

- [ ] **2.1** Install Lucide React icon library:
  ```bash
  npm install lucide-react
  ```
- [ ] **2.2** Verify package.json includes `lucide-react` dependency
- [ ] **2.3** Test icon import works:
  ```typescript
  import { LayoutDashboard, List, Menu } from 'lucide-react';
  ```
  [Source: docs/architecture.md#Dependencies-Overview]

### Task 3: Create Layout Component (AC: #1, #3, #4)

- [ ] **3.1** Create directory: `src/components/layout/`
- [ ] **3.2** Create file: `src/components/layout/Layout.tsx`
- [ ] **3.3** Define TypeScript interface for Layout props:
  ```typescript
  interface LayoutProps {
    children: React.ReactNode;
  }
  ```
- [ ] **3.4** Implement Layout component structure:
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
- [ ] **3.5** Export Layout as default export
  [Source: tech-spec-epic-1.md#APIs-and-Interfaces]

### Task 4: Create Header Component (AC: #1)

- [ ] **4.1** Create file: `src/components/layout/Header.tsx`
- [ ] **4.2** Implement Header with branding:
  ```typescript
  export const Header: React.FC = () => {
    return (
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">SmartBudget</h1>
          <p className="text-sm text-blue-100">Personal Finance Manager</p>
        </div>
      </header>
    );
  };
  ```
- [ ] **4.3** Export Header component
- [ ] **4.4** Use semantic HTML (`<header>`, `<h1>`)

### Task 5: Create Navigation Component (AC: #2, active state)

- [ ] **5.1** Create file: `src/components/layout/Navigation.tsx`
- [ ] **5.2** Import React Router hooks and Link:
  ```typescript
  import { Link, useLocation } from 'react-router-dom';
  import { LayoutDashboard, List, Plus } from 'lucide-react';
  ```
- [ ] **5.3** Define navigation items data structure:
  ```typescript
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: List }
  ];
  ```
- [ ] **5.4** Implement Navigation with active state detection:
  ```typescript
  export const Navigation: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
      return location.pathname === path ||
             (path === '/' && location.pathname === '/dashboard');
    };

    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive(item.path)
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  };
  ```
- [ ] **5.5** Export Navigation component
- [ ] **5.6** Use semantic HTML (`<nav>`, `<ul>`, `<li>`)
  [Source: tech-spec-epic-1.md#Data-Models-and-Contracts]

### Task 6: Implement Mobile Responsive Navigation (AC: hamburger menu)

- [ ] **6.1** Add state for mobile menu open/closed in Navigation.tsx:
  ```typescript
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  ```
- [ ] **6.2** Import Menu and X icons from Lucide:
  ```typescript
  import { Menu, X } from 'lucide-react';
  ```
- [ ] **6.3** Add hamburger menu button (visible only on mobile < 768px):
  ```typescript
  <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="md:hidden p-2 text-gray-600 hover:text-gray-900"
    aria-label="Toggle menu"
  >
    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
  ```
- [ ] **6.4** Update navigation list to show/hide based on screen size:
  ```typescript
  <ul className={`flex-col md:flex-row md:flex space-y-0 md:space-x-1 ${
    isMobileMenuOpen ? 'flex' : 'hidden md:flex'
  }`}>
  ```
- [ ] **6.5** Add mobile-specific styles (full-width links on mobile)
- [ ] **6.6** Close mobile menu when navigation item clicked:
  ```typescript
  onClick={() => setIsMobileMenuOpen(false)}
  ```
- [ ] **6.7** Test responsive behavior at breakpoints: 320px, 767px, 768px, 1024px

### Task 7: Wrap Routes in Layout Component (AC: all pages)

- [ ] **7.1** Import Layout in `src/App.tsx`:
  ```typescript
  import { Layout } from './components/layout/Layout';
  ```
- [ ] **7.2** Wrap `<Routes>` with `<Layout>`:
  ```typescript
  <BrowserRouter>
    <Layout>
      <Routes>
        {/* Existing routes */}
      </Routes>
    </Layout>
  </BrowserRouter>
  ```
- [ ] **7.3** Remove inline navigation from App.tsx (now in Layout)
- [ ] **7.4** Verify all pages render within Layout component

### Task 8: Update Page Components with Tailwind Styling (AC: #3)

- [ ] **8.1** Update Dashboard.tsx with Tailwind classes:
  ```typescript
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
    <p className="text-gray-600">Dashboard features will be implemented in Epic 4.</p>
  </div>
  ```
- [ ] **8.2** Update TransactionsList.tsx similarly
- [ ] **8.3** Update TransactionForm.tsx similarly
- [ ] **8.4** Update NotFound.tsx with centered error page styling:
  ```typescript
  <div className="text-center py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
    <Link to="/" className="text-blue-600 hover:text-blue-700 underline">
      Return to Dashboard
    </Link>
  </div>
  ```
- [ ] **8.5** Remove old inline styles from page components

### Task 9: Test Responsive Layout (AC: #4)

- [ ] **9.1** Start dev server: `npm run dev`
- [ ] **9.2** Open browser DevTools responsive design mode
- [ ] **9.3** Test at mobile breakpoint (375px width):
  - [ ] Hamburger menu visible
  - [ ] Navigation hidden by default
  - [ ] Clicking hamburger opens menu
  - [ ] Clicking nav item closes menu and navigates
  - [ ] Content readable and usable
- [ ] **9.4** Test at tablet breakpoint (768px width):
  - [ ] Hamburger menu hidden
  - [ ] Full navigation visible
  - [ ] Layout adapts smoothly
- [ ] **9.5** Test at desktop breakpoint (1024px+ width):
  - [ ] Full navigation visible
  - [ ] Content centered with proper margins
  - [ ] No horizontal scroll
- [ ] **9.6** Test minimum width (320px):
  - [ ] Layout doesn't break
  - [ ] Text remains readable
  - [ ] Buttons/links tappable (44px min)

### Task 10: Test Active Navigation State (AC: active highlighting)

- [ ] **10.1** Navigate to Dashboard (/)
  - [ ] "Dashboard" link highlighted with blue underline
  - [ ] "Transactions" link gray (not active)
- [ ] **10.2** Navigate to /dashboard
  - [ ] "Dashboard" link still highlighted (same as /)
- [ ] **10.3** Navigate to /transactions
  - [ ] "Transactions" link highlighted
  - [ ] "Dashboard" link no longer highlighted
- [ ] **10.4** Navigate to /transactions/new
  - [ ] "Transactions" remains highlighted (parent route)
- [ ] **10.5** Verify color contrast meets accessibility (WCAG AA)

### Task 11: Verify TypeScript Compilation (AC: quality)

- [ ] **11.1** Run TypeScript type check: `npx tsc --noEmit`
- [ ] **11.2** Fix any type errors in Layout/Header/Navigation
- [ ] **11.3** Ensure proper types for React.FC components
- [ ] **11.4** Verify no `any` types used

### Task 12: Test Production Build (AC: deployment)

- [ ] **12.1** Run production build: `npm run build`
- [ ] **12.2** Verify build succeeds with no errors or warnings
- [ ] **12.3** Check bundle size remains under 200KB target
- [ ] **12.4** Check Tailwind CSS purge working (unused classes removed)
- [ ] **12.5** Run production preview: `npm run preview`
- [ ] **12.6** Test responsive layout in preview mode

### Task 13: Accessibility Testing (Best Practice)

- [ ] **13.1** Verify semantic HTML used (`<header>`, `<nav>`, `<main>`)
- [ ] **13.2** Test keyboard navigation:
  - [ ] Tab through nav links
  - [ ] Enter key activates links
  - [ ] Focus visible on interactive elements
- [ ] **13.3** Add aria-label to hamburger menu button
- [ ] **13.4** Verify color contrast ratios (active: blue-600, inactive: gray-600)
- [ ] **13.5** Test with screen reader (optional but recommended)

### Task 14: Update README Documentation (Best Practice)

- [ ] **14.1** Add "UI Framework" section documenting Tailwind CSS
- [ ] **14.2** Add "Icons" section documenting Lucide React
- [ ] **14.3** Update "Components" section listing Layout/Header/Navigation
- [ ] **14.4** Document responsive breakpoints:
  ```markdown
  ## Responsive Breakpoints
  - Mobile: < 768px (hamburger menu)
  - Tablet: 768px - 1023px
  - Desktop: ≥ 1024px
  ```

### Task 15: Git Commit (Best Practice)

- [ ] **15.1** Verify all linting passes: `npm run lint`
- [ ] **15.2** Stage all changes: `git add .`
- [ ] **15.3** Create commit with conventional format:
  ```bash
  git commit -m "feat: add responsive layout with Tailwind CSS navigation

  - Install Tailwind CSS v4.x + Lucide React icons
  - Create Layout component wrapping all routes
  - Implement Header with SmartBudget branding
  - Build responsive Navigation with active state highlighting
  - Add mobile hamburger menu (< 768px)
  - Update all page components with Tailwind styling
  - Test responsive design at mobile/tablet/desktop breakpoints
  - Verify accessibility (semantic HTML, keyboard nav, ARIA labels)

  🤖 Generated with Claude Code
  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```
- [ ] **15.4** Verify pre-commit hooks pass
- [ ] **15.5** Verify all acceptance criteria met

## Dev Notes

### Architecture Alignment

**Styling Framework (from Architecture):**
- **Tailwind CSS 4.0**: Utility-first CSS framework for rapid UI development [Source: docs/architecture.md#Decision-Summary]
- **Responsive-First**: Mobile-first approach with breakpoints
- **No custom CSS files needed**: All styling via Tailwind utility classes

**Icon Library:**
- **Lucide React**: Lightweight, tree-shakable icon library
- **Modern SVG icons**: Clean, consistent design system
- **Alternative considered**: React Icons (more comprehensive but larger bundle)
  [Source: docs/architecture.md#Dependencies-Overview]

**Layout Pattern Established:**
```typescript
// Layout wraps all routes
<Layout>
  <Routes>
    <Route ... />
  </Routes>
</Layout>

// Layout structure
<div className="min-h-screen">
  <Header />      {/* Branding */}
  <Navigation />  {/* Nav menu */}
  <main>          {/* Page content */}
    {children}
  </main>
</div>
```
[Source: tech-spec-epic-1.md#APIs-and-Interfaces]

### Implementation Patterns

**Responsive Navigation Pattern:**
```typescript
// Desktop: Always visible horizontal nav
// Mobile: Hamburger menu with dropdown

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Hamburger button (mobile only)
<button className="md:hidden" onClick={toggleMenu}>
  {isMobileMenuOpen ? <X /> : <Menu />}
</button>

// Nav items (hidden on mobile unless menu open)
<ul className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
  {navItems.map(...)}
</ul>
```

**Active Link Highlighting:**
```typescript
const location = useLocation();

const isActive = (path: string) => {
  return location.pathname === path ||
         (path === '/' && location.pathname === '/dashboard');
};

// Apply conditional classes
<Link className={isActive(path)
  ? 'border-blue-600 text-blue-600'
  : 'border-transparent text-gray-600'}>
```

**Tailwind Responsive Classes:**
```typescript
// Mobile-first approach
className="flex-col md:flex-row"  // Column on mobile, row on desktop
className="hidden md:block"       // Hidden on mobile, visible on desktop
className="md:hidden"             // Visible on mobile, hidden on desktop
className="container mx-auto px-4 py-8"  // Centered content with padding
```

### Project Structure Updates

**New Directories:**
- `src/components/layout/` - Layout-related components

**New Files Created (3 files):**
1. `src/components/layout/Layout.tsx` - Main layout wrapper
2. `src/components/layout/Header.tsx` - App header with branding
3. `src/components/layout/Navigation.tsx` - Responsive nav menu

**New Config Files (2 files):**
1. `tailwind.config.js` - Tailwind CSS configuration
2. `postcss.config.js` - PostCSS configuration (Tailwind processor)

**Modified Files:**
- `src/App.tsx` - Wrap Routes in Layout, remove old nav
- `src/index.css` - Add Tailwind directives
- `src/pages/Dashboard.tsx` - Add Tailwind styling
- `src/pages/TransactionsList.tsx` - Add Tailwind styling
- `src/pages/TransactionForm.tsx` - Add Tailwind styling
- `src/pages/NotFound.tsx` - Add centered error page styling
- `package.json` - Add tailwindcss, postcss, autoprefixer, lucide-react
- `README.md` - Document UI framework and components

### Learnings from Previous Story

**From Story 1.3 (Status: done - completed):**

Story 1.3 successfully implemented React Router with the following key outcomes:

- **React Router Version**: react-router-dom@6.30.2 installed
  - Fully compatible with Vite 6.4.1
  - No compatibility issues with Node.js 18.20.4
  - **Action for This Story**: Can safely use all React Router hooks (useLocation for active state)

- **Routing Foundation Established**:
  - ✅ BrowserRouter wrapping in App.tsx - DO NOT recreate
  - ✅ All 6 routes configured (/, /dashboard, /transactions, /transactions/new, /transactions/:id/edit, 404)
  - ✅ Basic navigation with Link components already exists
  - **Action**: Replace basic nav with Layout component navigation

- **Page Components Created** (4 files in src/pages/):
  - Dashboard.tsx, TransactionsList.tsx, TransactionForm.tsx, NotFound.tsx
  - All are placeholder components with minimal styling
  - **Action for This Story**: Update these components with Tailwind classes, DO NOT recreate

- **Bundle Size Tracking**:
  - Story 1.1: 144.36 KB (46.40 KB gzipped)
  - Story 1.3: 166.51 KB (54.36 KB gzipped)
  - Increase from React Router: ~22 KB (~8 KB gzipped)
  - **Expected after This Story**: +30-40 KB for Tailwind CSS (still under 200KB target)

- **Quality Standards Established**:
  - TypeScript strict mode: 0 errors
  - Pre-commit hooks: ESLint + Prettier auto-formatting working
  - Conventional commit messages with emoji
  - **Action**: Maintain same quality standards and commit format

- **Files to Modify** (NOT recreate):
  - `src/App.tsx` - Already has BrowserRouter and Routes, just wrap in Layout
  - Page components - Already exist, just add Tailwind styling
  - Remove inline `<nav>` from App.tsx (lines ~11-15) and replace with Layout

- **Git Workflow**:
  - Commit pattern established: "feat: title" + bullet details + emoji footer
  - Pre-commit hooks automatically format code
  - **Action**: Follow same commit message pattern

- **Development Server**:
  - Running on port 5174 (5173 was in use)
  - HMR working correctly
  - **Action**: No changes needed to dev server setup

[Source: .bmad-ephemeral/stories/1-3-application-routing-structure.md#Dev-Agent-Record]

### Testing Strategy

**Manual Testing Checklist:**

1. **Responsive Layout:**
   - Test mobile (375px): hamburger menu, collapsible nav
   - Test tablet (768px): full nav, no hamburger
   - Test desktop (1280px): full nav, centered content
   - Test extreme mobile (320px): no horizontal scroll

2. **Active State:**
   - Navigate to each route
   - Verify correct nav item highlighted
   - Test both `/` and `/dashboard` highlight Dashboard

3. **Navigation Functionality:**
   - Click each nav link
   - Verify route changes
   - Verify active state updates
   - Test hamburger toggle on mobile
   - Verify menu closes after clicking item (mobile)

4. **Visual Consistency:**
   - Header visible on all pages
   - Navigation visible on all pages
   - Content area properly spaced
   - No layout shift between pages

5. **Accessibility:**
   - Tab through navigation with keyboard
   - Verify focus visible
   - Test hamburger with Enter/Space
   - Verify semantic HTML in DevTools

6. **Build Verification:**
   - `npm run build` succeeds
   - Bundle size reasonable (< 200KB)
   - Production preview works correctly
   - Tailwind purge removes unused classes

[Source: tech-spec-epic-1.md#Testing-Strategy]

### Dependencies Added

**Tailwind CSS:**
```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "postcss": "latest",
    "autoprefixer": "latest"
  }
}
```

**Lucide React Icons:**
```json
{
  "dependencies": {
    "lucide-react": "latest"
  }
}
```

**Type Definitions:**
- Included with lucide-react (no separate @types needed)
- Tailwind CSS doesn't require types (CSS framework)

[Source: docs/architecture.md#Dependencies-Overview]

### Performance Considerations

**Tailwind CSS Bundle Size:**
- Development: Full Tailwind CSS (~3MB uncompressed)
- Production: Purged to only used classes (~20-30KB gzipped)
- PurgeCSS automatically removes unused utility classes
- Expected bundle increase: ~30-40 KB gzipped (acceptable)

**Icon Library Tree-Shaking:**
- Lucide React supports tree-shaking
- Only imported icons included in bundle
- Estimated impact: ~5-10 KB for 3-5 icons
- Alternative (React Icons) would add ~50KB

**Layout Component Performance:**
- Single Layout instance wraps all routes
- No re-mount on route changes (only content swaps)
- Navigation state persists across routes
- Mobile menu state resets on route change (intentional UX)

**CSS-in-JS NOT Used:**
- Avoided styled-components, emotion (adds ~15-20KB + runtime cost)
- Tailwind compiles to static CSS (no runtime overhead)
- Better performance for this use case

[Source: docs/architecture.md#Performance-Considerations]

### Known Issues and Workarounds

**Issue: Tailwind v4 Alpha**
- **Status**: Tailwind CSS v4 is currently in alpha/beta
- **Risk**: API changes possible before stable release
- **Mitigation**: Pin to specific version in package.json
- **Alternative**: Use Tailwind v3.x (stable) if v4 issues arise
- **Recommendation**: Proceed with v4 for modern features, fallback to v3 if needed

**Issue: Mobile Menu Accessibility**
- **Problem**: Mobile menu requires JavaScript (not accessible if JS disabled)
- **Impact**: Low (modern web apps require JS)
- **Future Enhancement**: Add `<noscript>` fallback message

**Issue: Active State on Nested Routes**
- **Current**: Only exact matches highlighted (e.g., /transactions/new doesn't highlight "Transactions")
- **Enhancement**: Could add parent route highlighting logic
- **Decision**: Current approach is simpler and acceptable for MVP

**Issue: Layout Shift on Route Change**
- **Potential**: Content height varies between pages
- **Solution**: min-h-screen on Layout ensures no vertical shift
- **Verify**: Test during manual testing

### Responsive Breakpoints

Following Tailwind's default breakpoint system (customizable in tailwind.config.js if needed):

```javascript
// Tailwind default breakpoints
{
  'sm': '640px',   // Small tablets
  'md': '768px',   // Tablets
  'lg': '1024px',  // Desktops
  'xl': '1280px',  // Large desktops
  '2xl': '1536px'  // Extra large
}
```

**This Story's Usage:**
- Mobile: `< 768px` (no prefix) - Hamburger menu
- Desktop: `≥ 768px` (md: prefix) - Full navigation

**Architecture Requirements:**
- Mobile: ≥ 320px [Source: docs/architecture.md#Non-Functional-Requirements]
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### Color Palette Established

**Primary Colors (from PRD guidance):**
- Primary Blue: `blue-600` (#2563eb) - Header, active links
- Income Green: `green-500` (future use in Epic 3-4)
- Expense Red: `red-500` (future use in Epic 3-4)

**Neutral Colors:**
- Background: `gray-50` (#f9fafb) - Page background
- Text Primary: `gray-900` (#111827) - Headings, body text
- Text Secondary: `gray-600` (#4b5563) - Muted text, inactive links
- Border: `gray-200` (#e5e7eb) - Subtle borders

**Interactive States:**
- Hover: `hover:text-gray-900`, `hover:text-blue-700`
- Active Link: `border-blue-600 text-blue-600`
- Inactive Link: `border-transparent text-gray-600`

[Source: docs/PRD.md#User-Experience-Principles]

### Prerequisites Check

**Story 1.3 Must Be Complete:**
- ✅ React Router installed (react-router-dom@6.30.2)
- ✅ BrowserRouter configured in App.tsx
- ✅ All routes defined and working
- ✅ Page components created (Dashboard, TransactionsList, TransactionForm, NotFound)
- ✅ Basic navigation links exist (will be replaced)

**Verification:**
```bash
ls src/pages/                    # Should have 4 page components
npm list react-router-dom         # Should show 6.30.x
npm run dev                       # Should start without errors
```

### Next Story Preparation

**Story 1.5 Prerequisites:**
- This story completes UI foundation
- Story 1.5 will add environment configuration and deployment prep
- Layout/Header/Navigation established here will be used throughout app

**Patterns Established for Future Epics:**
- Tailwind utility-first styling approach
- Responsive mobile-first design
- Component-based layout architecture
- Icon usage with Lucide React
- All future components should use Tailwind classes
- All future pages render inside Layout (automatic via App.tsx)

### References

- **Architecture Document**: [docs/architecture.md](../../docs/architecture.md)
  - Technology Stack: Tailwind CSS 4.0 decision
  - Implementation Patterns: Component patterns
  - Data Models: Layout component API
  - Performance Considerations: CSS optimization

- **Epic Tech Spec**: [.bmad-ephemeral/stories/tech-spec-epic-1.md](./tech-spec-epic-1.md)
  - AC-1.4: Basic UI Layout acceptance criteria
  - Layout Component API specification
  - Navigation Items data structure
  - Responsive design requirements

- **PRD**: [docs/PRD.md](../../docs/PRD.md)
  - User Experience Principles: Color guidance, visual hierarchy
  - NFR-1 (Browser Compatibility): Modern browsers only
  - NFR-2 (Responsive Design): Breakpoint requirements

- **Epics Breakdown**: [docs/epics.md](../../docs/epics.md)
  - Story 1.4 detailed requirements and technical notes
  - Epic 1 overall objectives

- **Previous Story**: [.bmad-ephemeral/stories/1-3-application-routing-structure.md](./1-3-application-routing-structure.md)
  - React Router setup and page components
  - Bundle size baseline (166.51 KB)
  - Files to modify (App.tsx, page components)

### Security Considerations

**Tailwind CSS Security:**
- No user-generated class names (XSS safe)
- Static CSS generation (no runtime injection)
- Content Security Policy (CSP) compatible

**Icon Library:**
- Lucide icons are static SVG (no external requests)
- Tree-shaken to only included icons
- No CDN dependencies (bundled with app)

**Layout Component:**
- No user input accepted
- No dangerouslySetInnerHTML used
- Children rendered safely via React

**Navigation Links:**
- React Router Link component handles escaping
- No direct href manipulation
- CSRF not applicable (client-side only)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
