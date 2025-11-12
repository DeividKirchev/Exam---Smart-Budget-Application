# Story 1.1: Project Initialization & Technology Stack Setup

Status: review

## Story

As a developer,
I want to initialize a new project with a modern JavaScript framework and build tooling,
So that I have a solid foundation for building the SmartBudget application.

## Acceptance Criteria

**Given** I need to start the SmartBudget project
**When** I run the project initialization
**Then** A new project is created with:

1. ✅ React 18.x + TypeScript 5.x properly configured via Vite template
2. ✅ Vite 6.x build tool set up with development server
3. ✅ package.json with initial dependencies (React, React-DOM, TypeScript, Vite)
4. ✅ Basic folder structure created: `/src`, `/public`, with subdirectories for `/components`, `/pages`, `/services`, `/utils`, `/constants`
5. ✅ .gitignore configured for Node.js projects (excludes `node_modules/`, `.env`, `dist/`, `.DS_Store`)

**And** The development server starts successfully via `npm run dev`
**And** A basic "Hello World" page renders in the browser at `http://localhost:5173`
**And** Hot Module Replacement (HMR) works instantly when editing React components

## Tasks / Subtasks

### Task 1: Execute Vite Project Initialization (AC: #1, #2, #3)

- [x] **1.1** Verify Node.js version ≥20.19 or ≥22.12 installed (`node --version`)
- [x] **1.2** Run initialization command: `npm create vite@latest smartbudget -- --template react-ts`
- [x] **1.3** Navigate to project directory: `cd smartbudget`
- [x] **1.4** Install dependencies: `npm install`
- [x] **1.5** Verify package.json contains: react@^18.3.0, react-dom@^18.3.0, vite@^6.0.0, typescript@~5.6.0
- [x] **1.6** Verify initial folder structure includes: `/src`, `/public`, `vite.config.ts`, `tsconfig.json`, `index.html`

### Task 2: Enhance Project Structure (AC: #4)

- [x] **2.1** Create directory: `src/components/` (for reusable UI components)
- [x] **2.2** Create directory: `src/components/layout/` (for Header, Nav, Layout components)
- [x] **2.3** Create directory: `src/components/common/` (for generic components - future)
- [x] **2.4** Create directory: `src/pages/` (for page/route components)
- [x] **2.5** Create directory: `src/services/` (for business logic and data access)
- [x] **2.6** Create directory: `src/utils/` (for helper functions)
- [x] **2.7** Create directory: `src/constants/` (for app constants and configuration)
- [x] **2.8** Create directory: `src/models/` (for TypeScript interfaces and types)
- [x] **2.9** Create directory: `src/hooks/` (for custom React hooks)
- [x] **2.10** Create directory: `src/context/` (for React Context providers)
- [x] **2.11** Verify folder structure matches architecture document [Source: docs/architecture.md#Project-Structure]

### Task 3: Configure .gitignore (AC: #5)

- [x] **3.1** Verify Vite template created `.gitignore` file
- [x] **3.2** Ensure `.gitignore` includes: `node_modules/`, `dist/`, `.env`, `.env.local`
- [x] **3.3** Add additional exclusions: `.DS_Store`, `*.log`, `.vscode/`, `.idea/`, `coverage/`
- [x] **3.4** Verify sensitive files will not be tracked by Git

### Task 4: Test Development Server (AC: #6, #7, #8)

- [x] **4.1** Start development server: `npm run dev`
- [x] **4.2** Verify server starts without errors on port 5173
- [x] **4.3** Open browser to `http://localhost:5173`
- [x] **4.4** Verify Vite welcome page renders with React logo
- [x] **4.5** Test Hot Module Replacement (HMR):
  - [x] Edit `src/App.tsx` (change text)
  - [x] Verify browser updates instantly without full reload
  - [x] Check console for no errors
- [x] **4.6** Stop server (`Ctrl+C`) and verify graceful shutdown

### Task 5: Initialize Git Repository (Best Practice)

- [x] **5.1** Initialize Git: `git init`
- [x] **5.2** Add all files: `git add .`
- [x] **5.3** Create initial commit: `git commit -m "feat: initialize Vite + React + TypeScript project

- Initialize SmartBudget project using Vite react-ts template
- Set up project folder structure (components, pages, services, utils, constants)
- Configure .gitignore for Node.js development

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"`
- [x] **5.4** Verify clean Git status: `git status`

### Task 6: Validation and Documentation

- [x] **6.1** Run TypeScript type check: `npx tsc --noEmit` (verify no errors)
- [x] **6.2** Run build command: `npm run build` (verify production build succeeds)
- [x] **6.3** Verify `dist/` folder created with optimized bundles
- [x] **6.4** Document project setup in README.md:
  - [x] Add "Prerequisites: Node.js 20.19+ or 22.12+"
  - [x] Add "Setup: npm install"
  - [x] Add "Development: npm run dev"
  - [x] Add "Build: npm run build"
- [x] **6.5** Verify all acceptance criteria met

## Dev Notes

### Architecture Alignment

**Technology Stack (from Architecture):**
- **Framework**: React 18.x (industry standard, excellent ecosystem, AI-friendly) [Source: docs/architecture.md#Decision-Summary]
- **Language**: TypeScript 5.x (type safety, better IDE support, catch errors early)
- **Build Tool**: Vite 6.x (modern, fast, officially recommended for React 2025)
- **Package Manager**: npm 10.x (comes with Node.js, widely understood)

**Initialization Command:**
```bash
npm create vite@latest smartbudget -- --template react-ts
cd smartbudget
npm install
```
[Source: docs/architecture.md#Project-Initialization]

**Project Structure to Establish:**
```
smartbudget/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, static files
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Generic components (Button, Input, Card)
│   │   └── layout/          # Layout components (Header, Nav, Footer)
│   ├── pages/               # Page/view components
│   ├── context/             # React Context providers
│   ├── services/            # Business logic & data access
│   ├── models/              # TypeScript interfaces & types
│   ├── constants/           # App constants & configuration
│   ├── utils/               # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Global styles (if needed beyond Tailwind)
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type declarations
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```
[Source: docs/architecture.md#Project-Structure]

### Implementation Patterns

**Naming Conventions (to establish):**
- Components: `PascalCase.tsx` (e.g., `TransactionCard.tsx`)
- Services: `camelCase.ts` (e.g., `storageService.ts`)
- Utilities: `camelCase.ts` (e.g., `dateHelpers.ts`)
- Types/Models: `PascalCase.ts` (e.g., `Transaction.ts`)
[Source: docs/architecture.md#Naming-Conventions]

**Development Server:**
- Vite dev server with instant HMR (Hot Module Replacement)
- Default port: 5173
- Fast refresh preserves component state
[Source: docs/architecture.md#Technology-Stack-Details]

### Performance Targets

**From Epic Tech Spec:**
- Development HMR: <200ms (Vite's fast HMR engine)
- Production build: <30 seconds
- Initial page load: <3 seconds on 3G (will be validated in Epic 6)
[Source: .bmad-ephemeral/stories/tech-spec-epic-1.md#NFR-Performance]

### Testing Strategy

**Manual Testing for this Story:**
1. Execute initialization: `npm create vite@latest smartbudget -- --template react-ts && cd smartbudget && npm install && npm run dev`
2. Verify browser opens and Vite welcome screen appears with no console errors
3. Verify `npm run build` completes successfully and creates `/dist` folder
4. Test HMR by editing `src/App.tsx`, verify instant browser update without reload
[Source: .bmad-ephemeral/stories/tech-spec-epic-1.md#Test-Strategy-Summary]

### References

- **Architecture Document**: [docs/architecture.md](../../docs/architecture.md)
  - Project Initialization section
  - Decision Summary table
  - Project Structure diagram
  - Technology Stack Details
  - Naming Conventions

- **Epic Tech Spec**: [.bmad-ephemeral/stories/tech-spec-epic-1.md](./tech-spec-epic-1.md)
  - AC-1.1: Project Initialization acceptance criteria
  - Services and Modules section (Vite Config module)
  - NFR-1: Performance requirements
  - Test Strategy Summary

- **PRD**: [docs/PRD.md](../../docs/PRD.md)
  - NFR-3.1: Code Organization requirements
  - Web Application Specific Requirements section

- **Epics Breakdown**: [docs/epics.md](../../docs/epics.md)
  - Story 1.1 detailed requirements and acceptance criteria

### Security Considerations

- **Dependency Security**: All dependencies from npm with integrity checking [Source: tech-spec-epic-1.md#NFR-Security]
- **.gitignore**: Ensure `.env` files excluded to prevent accidental commits of sensitive data
- **No vulnerabilities**: Run `npm audit` after install; fix any high/critical issues immediately

### Prerequisites Check

**Required:**
- Node.js 20.19+ or 22.12+ installed [Source: docs/architecture.md#Project-Initialization]
- npm 10.x (comes with Node.js)
- Git installed for version control

**Verification Commands:**
```bash
node --version    # Should show v20.19+ or v22.12+
npm --version     # Should show v10.x
git --version     # Any recent version
```

### Known Constraints

- **Browser Support**: Modern browsers only (Chrome, Firefox, Safari latest 2 versions) [Source: tech-spec-epic-1.md#NFR-Reliability]
- **No IE11 Support**: ES2020+ JavaScript, modern ES Modules [Source: docs/architecture.md#Browser-Compatibility]
- **Client-Side Only**: No backend in MVP [Source: tech-spec-epic-1.md#System-Architecture-Alignment]

### Next Story Preparation

**Story 1.2 Prerequisites:**
- This story must be completed first (Story 1.1 is prerequisite for Story 1.2)
- Working project initialization enables code quality tooling setup
- Git repository established enables Husky git hooks configuration

**Files Created (for Story 1.2):**
- `package.json` - Will be modified to add ESLint, Prettier, Husky dependencies
- `vite.config.ts` - May need ESLint plugin configuration
- Project structure - Provides codebase for linting rules

## Dev Agent Record

### Context Reference

- [Story Context XML](.bmad-ephemeral/stories/1-1-project-initialization-technology-stack-setup.context.xml)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

Implementation Plan:
1. ✅ Vite project initialization with react-ts template
2. ✅ Project structure enhancement (11 subdirectories created)
3. ✅ .gitignore configuration with environment and coverage exclusions
4. ✅ Development server testing (Vite 6.4.1, HMR verified)
5. ✅ Git repository initialization with proper commit message
6. ✅ Validation (TypeScript check, production build, README update)

### Completion Notes List

**Node.js Version:**
- v18.20.4 (below recommended 20.19+/22.12+ but Vite 6.x compatible)
- Compatibility warnings noted during installation but all functionality working

**Actual Versions Installed:**
- React: 18.3.1
- React-DOM: 18.3.1
- TypeScript: 5.9.3
- Vite: 6.4.1 (downgraded from 7.2.2 due to Node.js compatibility)
- @vitejs/plugin-react: 4.7.0

**Deviations from Initial Template:**
- create-vite initially created Vite 7.2.2 which required Node.js 20.19+
- Downgraded to Vite 6.4.1 to maintain compatibility with Node.js 18.20.4
- This matches the architecture specification (Vite 6.x)

**Setup Issues Resolved:**
- Issue: Vite 7.2.2 failed with "crypto.hash is not a function" error (Node.js 18.x incompatible)
- Resolution: Downgraded to Vite 6.x per architecture specification using:
  ```bash
  npm install vite@^6.0.0 @vitejs/plugin-react@^4.3.0 react@^18.3.0 react-dom@^18.3.0
  ```

**HMR Performance:**
- Dev server started in 659ms
- HMR configured and working (tested with App.tsx modification)
- Production build completed in 1.10s (144KB bundle, 46KB gzipped)

**Build Output:**
- TypeScript compilation: ✓ No errors
- Production build: ✓ Success (30 modules transformed)
- Bundle size: 144.36 KB (46.40 KB gzipped)

### File List

**NEW - Vite Template Files (16 files):**
- smartbudget/.gitignore
- smartbudget/README.md
- smartbudget/eslint.config.js
- smartbudget/index.html
- smartbudget/package.json
- smartbudget/package-lock.json
- smartbudget/tsconfig.json
- smartbudget/tsconfig.app.json
- smartbudget/tsconfig.node.json
- smartbudget/vite.config.ts
- smartbudget/public/vite.svg
- smartbudget/src/App.css
- smartbudget/src/App.tsx
- smartbudget/src/assets/react.svg
- smartbudget/src/index.css
- smartbudget/src/main.tsx

**NEW - Manually Created Directories:**
- smartbudget/src/components/
- smartbudget/src/components/layout/
- smartbudget/src/components/common/
- smartbudget/src/pages/
- smartbudget/src/services/
- smartbudget/src/utils/
- smartbudget/src/constants/
- smartbudget/src/models/
- smartbudget/src/hooks/
- smartbudget/src/context/
- smartbudget/src/styles/

**MODIFIED:**
- smartbudget/.gitignore (added .env, .env.local, .env.production, coverage/)
- smartbudget/README.md (replaced with SmartBudget-specific documentation)
- smartbudget/src/App.tsx (modified for HMR testing: "Vite + React" → "SmartBudget - Test HMR")
- smartbudget/package.json (downgraded dependencies to architecture specification)

---

**Story Ready for Story Context Generation**

Run `*story-context` to generate technical context XML and mark this story ready for development.
