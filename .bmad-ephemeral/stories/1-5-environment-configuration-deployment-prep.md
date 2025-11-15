# Story 1.5: Environment Configuration & Deployment Prep

Status: review

## Story

As a developer,
I want environment variables and build configuration set up,
So that the application can be deployed to production (NFR-6).

## Acceptance Criteria

**Given** The application needs deployment configuration
**When** I set up environment handling
**Then** The following are configured:

1. ✅ Environment variable support (.env files with VITE_ prefix)
2. ✅ Separate configs for development and production
3. ✅ Build script produces optimized production bundle in `/dist`
4. ✅ Static asset handling configured correctly
5. ✅ Deployment configuration files for Netlify/Vercel

**And** `npm run build` creates deployable artifact in `/dist` folder
**And** Production build is optimized (minified, tree-shaken, gzipped)
**And** README documents deployment process step-by-step
**And** `.env` files excluded from Git (security)

## Tasks / Subtasks

### Task 1: Create Environment Variable Configuration (AC: #1, #2)

- [ ] **1.1** Create `.env.example` file in project root with template variables:
  ```env
  # Application Configuration
  VITE_APP_NAME=SmartBudget
  VITE_APP_VERSION=1.0.0
  VITE_APP_DESCRIPTION=Personal Finance Manager

  # API Configuration (future use)
  # VITE_API_BASE_URL=http://localhost:3000

  # Feature Flags (future use)
  # VITE_ENABLE_ANALYTICS=false
  ```
- [ ] **1.2** Create `.env.development` file with development-specific values:
  ```env
  VITE_APP_NAME=SmartBudget (Dev)
  VITE_APP_VERSION=1.0.0-dev
  VITE_APP_ENV=development
  ```
- [ ] **1.3** Create `.env.production` file with production values:
  ```env
  VITE_APP_NAME=SmartBudget
  VITE_APP_VERSION=1.0.0
  VITE_APP_ENV=production
  ```
- [ ] **1.4** Verify `.env`, `.env.local`, `.env.*.local` in `.gitignore`:
  ```gitignore
  # Environment files
  .env
  .env.local
  .env.*.local
  ```
- [ ] **1.5** Add comment in `.gitignore` explaining env file security
  [Source: tech-spec-epic-1.md#Non-Functional-Requirements]

### Task 2: Configure TypeScript Environment Types (AC: #1)

- [ ] **2.1** Create or update `src/vite-env.d.ts` with environment variable types:
  ```typescript
  /// <reference types="vite/client" />

  interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_DESCRIPTION: string;
    readonly VITE_APP_ENV: 'development' | 'production';
    // Future variables will be added here
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  ```
- [ ] **2.2** Verify TypeScript recognizes env types (no errors when accessing `import.meta.env.VITE_*`)
- [ ] **2.3** Test autocomplete works for environment variables in IDE

### Task 3: Use Environment Variables in App (AC: #1)

- [ ] **3.1** Update `src/components/layout/Header.tsx` to use env variable:
  ```typescript
  const appName = import.meta.env.VITE_APP_NAME || 'SmartBudget';
  const appEnv = import.meta.env.VITE_APP_ENV;

  <h1 className="text-2xl font-bold">
    {appName}
    {appEnv === 'development' && <span className="text-xs ml-2">(Dev)</span>}
  </h1>
  ```
- [ ] **3.2** Add app version to footer or About section (optional):
  ```typescript
  const version = import.meta.env.VITE_APP_VERSION;
  <footer className="text-xs text-gray-500">v{version}</footer>
  ```
- [ ] **3.3** Test that dev environment shows "(Dev)" indicator
- [ ] **3.4** Verify production build does NOT show "(Dev)" indicator

### Task 4: Optimize Vite Build Configuration (AC: #3, minification)

- [ ] **4.1** Update `vite.config.ts` with production optimizations:
  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false, // Disable sourcemaps for production
      minify: 'esbuild', // Fast minification with esbuild
      target: 'es2020', // Modern browsers only
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 5173,
      open: true, // Auto-open browser on dev start
    },
  });
  ```
- [ ] **4.2** Verify `build.outDir` is set to `'dist'`
- [ ] **4.3** Test manual chunks configuration (vendor splitting)
- [ ] **4.4** Document why sourcemaps disabled (faster builds, smaller files)
  [Source: docs/architecture.md#Performance-Considerations]

### Task 5: Create Netlify Deployment Configuration (AC: #5)

- [ ] **5.1** Create `netlify.toml` in project root:
  ```toml
  [build]
    publish = "dist"
    command = "npm run build"

  [build.environment]
    NODE_VERSION = "18.20.4"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
    force = false

  [[headers]]
    for = "/*"
    [headers.values]
      X-Frame-Options = "DENY"
      X-Content-Type-Options = "nosniff"
      Referrer-Policy = "strict-origin-when-cross-origin"

  [[headers]]
    for = "/assets/*"
    [headers.values]
      Cache-Control = "public, max-age=31536000, immutable"
  ```
- [ ] **5.2** Document redirect rule purpose (client-side routing support)
- [ ] **5.3** Document security headers added
  [Source: docs/architecture.md#Deployment-Architecture]

### Task 6: Create Vercel Deployment Configuration (AC: #5)

- [ ] **6.1** Create `vercel.json` in project root:
  ```json
  {
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "vite",
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      },
      {
        "source": "/assets/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
  ```
- [ ] **6.2** Verify rewrites configuration for client-side routing
- [ ] **6.3** Document security headers (XSS, clickjacking prevention)

### Task 7: Add Deployment Scripts to package.json (AC: #3)

- [ ] **7.1** Add preview script to package.json:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "prepare": "husky install"
  }
  ```
- [ ] **7.2** Verify `build` script runs TypeScript check before building
- [ ] **7.3** Add `type-check` script for standalone type checking
- [ ] **7.4** Test each script individually

### Task 8: Test Production Build Process (AC: #3)

- [ ] **8.1** Clean any previous builds: `rm -rf dist` or `rmdir /s dist`
- [ ] **8.2** Run TypeScript type check: `npm run type-check`
  - Verify 0 TypeScript errors
- [ ] **8.3** Run production build: `npm run build`
  - Verify build completes successfully
  - Check build time (should be <30 seconds per NFR)
- [ ] **8.4** Inspect `/dist` folder contents:
  - `index.html` exists
  - `/assets` folder with JS/CSS bundles
  - Assets have hashed filenames (e.g., `main-abc123.js`)
- [ ] **8.5** Check bundle sizes in build output:
  - Total bundle size should be reasonable (<300KB)
  - Individual chunks shown with gzip sizes
- [ ] **8.6** Verify minification:
  - Open `dist/assets/*.js` file
  - Confirm code is minified (no whitespace, short variable names)

### Task 9: Test Production Preview Server (AC: #3, #4)

- [ ] **9.1** Start preview server: `npm run preview`
- [ ] **9.2** Open browser to preview URL (typically `http://localhost:4173`)
- [ ] **9.3** Test all routes work correctly:
  - Navigate to `/`, `/dashboard`, `/transactions`, `/transactions/new`
  - Verify no 404 errors when accessing routes directly
  - Test browser back/forward buttons
- [ ] **9.4** Test environment variables in production build:
  - Verify app name displays correctly
  - Verify NO "(Dev)" indicator shown
  - Check version number displays (if implemented)
- [ ] **9.5** Open browser DevTools:
  - Check Console for errors (should be zero)
  - Check Network tab: verify assets loaded from `/assets`
  - Verify assets have cache headers (immutable)
- [ ] **9.6** Test responsive layout in preview mode (mobile, tablet, desktop)

### Task 10: Security Audit (AC: security)

- [ ] **10.1** Run npm audit: `npm audit`
  - Check for high/critical vulnerabilities
  - Document any vulnerabilities found and mitigation
- [ ] **10.2** Verify `.env` files NOT committed to Git:
  ```bash
  git status --ignored
  # Should show .env files in ignored section
  ```
- [ ] **10.3** Verify no sensitive data in Git:
  ```bash
  git log --all --full-history -- "*.env"
  # Should return no commits (or only .env.example)
  ```
- [ ] **10.4** Test VITE_ prefix enforcement:
  - Try accessing non-VITE_ variable
  - Verify it's undefined (Vite only exposes VITE_* vars)
  [Source: tech-spec-epic-1.md#Security]

### Task 11: Update README with Deployment Documentation (AC: README)

- [ ] **11.1** Add "Environment Variables" section to README:
  ```markdown
  ## Environment Variables

  This project uses environment variables for configuration. Copy `.env.example` to `.env.local` for local development:

  ```bash
  cp .env.example .env.local
  ```

  ### Available Variables

  - `VITE_APP_NAME` - Application name (shown in header)
  - `VITE_APP_VERSION` - Application version
  - `VITE_APP_ENV` - Environment (development/production)

  **Security Note:** Never commit `.env` or `.env.local` files to Git. Only `.env.example` should be committed.
  ```
- [ ] **11.2** Add "Build & Deployment" section:
  ```markdown
  ## Build & Deployment

  ### Production Build

  Create an optimized production build:

  ```bash
  npm run build
  ```

  Output is generated in the `dist/` folder.

  ### Preview Production Build

  Test the production build locally:

  ```bash
  npm run preview
  ```

  ### Deploy to Netlify

  1. Install Netlify CLI: `npm install -g netlify-cli`
  2. Build the project: `npm run build`
  3. Deploy: `netlify deploy --prod`

  Or connect your GitHub repository to Netlify for automatic deployments.

  Configuration is in `netlify.toml`.

  ### Deploy to Vercel

  1. Install Vercel CLI: `npm install -g vercel`
  2. Deploy: `vercel --prod`

  Or connect your GitHub repository to Vercel for automatic deployments.

  Configuration is in `vercel.json`.

  ### Environment Variables in Deployment

  Set the following environment variables in your deployment platform:

  - `VITE_APP_NAME=SmartBudget`
  - `VITE_APP_VERSION=1.0.0`
  - `VITE_APP_ENV=production`
  ```
- [ ] **11.3** Update "Available Scripts" section with all npm scripts
- [ ] **11.4** Add "Browser Support" section:
  ```markdown
  ## Browser Support

  SmartBudget supports modern browsers:

  - Chrome (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
  - Edge (latest 2 versions)

  **Note:** Internet Explorer is not supported.
  ```

### Task 12: Create .gitignore Additions (AC: security)

- [ ] **12.1** Verify `.gitignore` includes deployment and environment files:
  ```gitignore
  # Production build
  dist
  dist-ssr
  *.local

  # Environment variables
  .env
  .env.local
  .env.*.local

  # Deployment
  .vercel
  .netlify

  # Editor directories
  .vscode/*
  !.vscode/extensions.json
  .idea
  .DS_Store
  *.suo
  *.ntvs*
  *.njsproj
  *.sln
  *.sw?
  ```
- [ ] **12.2** Add comments explaining each section
- [ ] **12.3** Verify no sensitive files tracked by Git

### Task 13: Test Asset Optimization (AC: #3, #4)

- [ ] **13.1** Check CSS optimization:
  - Run build
  - Inspect `dist/assets/*.css` files
  - Verify Tailwind CSS purged (only used classes included)
  - Verify CSS minified (no whitespace)
- [ ] **13.2** Check JS code splitting:
  - Inspect build output for chunk information
  - Verify separate chunks: react-vendor.js, router.js, main.js
  - Verify chunk sizes reasonable (vendor ~140KB, router ~20KB)
- [ ] **13.3** Check static assets handling:
  - Place test image in `/public/logo.png` (if available)
  - Verify copied to `/dist/logo.png` unchanged
  - Remove test image after verification
- [ ] **13.4** Verify asset hashing:
  - All JS/CSS files have content hash (e.g., `main.abc123.js`)
  - Prevents caching issues on updates

### Task 14: Document Build Performance Baseline (Best Practice)

- [ ] **14.1** Record production build metrics:
  - Build time (seconds)
  - Total bundle size (KB)
  - Gzipped bundle size (KB)
  - Number of chunks generated
  - Largest chunk size
- [ ] **14.2** Add performance baseline to story completion notes
- [ ] **14.3** Compare with Story 1.1 baseline (144KB) and Story 1.3 (166KB)
- [ ] **14.4** Expected: ~200-250KB after Tailwind CSS added in Story 1.4

### Task 15: Git Commit (Best Practice)

- [ ] **15.1** Verify all linting passes: `npm run lint`
- [ ] **15.2** Verify type check passes: `npm run type-check`
- [ ] **15.3** Stage all changes: `git add .`
- [ ] **15.4** Verify `.env` files NOT staged (only `.env.example` should be):
  ```bash
  git status
  # Should NOT show .env or .env.* except .env.example
  ```
- [ ] **15.5** Create commit with conventional format:
  ```bash
  git commit -m "feat: add environment configuration and deployment setup

  - Create .env.example, .env.development, .env.production templates
  - Configure TypeScript types for environment variables
  - Optimize Vite build config (minification, code splitting, sourcemaps)
  - Add Netlify and Vercel deployment configurations
  - Implement security headers (X-Frame-Options, CSP, etc.)
  - Add deployment scripts and preview server
  - Document deployment process in README
  - Test production build and preview server
  - Run security audit (npm audit)
  - Verify .env files excluded from Git

  🤖 Generated with Claude Code
  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```
- [ ] **15.6** Verify pre-commit hooks pass
- [ ] **15.7** Verify all acceptance criteria met

## Dev Notes

### Architecture Alignment

**Environment Variables (from Architecture):**
- **Vite Environment System**: Uses `import.meta.env.VITE_*` prefix for security
- **TypeScript Support**: Full type safety for env variables via `ImportMetaEnv` interface
- **Security**: Only VITE_* prefixed variables exposed to client (prevents secrets leakage)
  [Source: docs/architecture.md#Environment-Configuration]

**Deployment Targets:**
- **Netlify**: Static hosting with serverless functions support (future)
- **Vercel**: Static hosting with edge functions support (future)
- **GitHub Pages**: Alternative option (requires HashRouter - NOT recommended)
  [Source: docs/architecture.md#Deployment-Architecture]

**Build Optimization Strategy:**
```typescript
// vite.config.ts optimizations
{
  build: {
    minify: 'esbuild',        // Fast minification
    sourcemap: false,         // Smaller bundle for production
    rollupOptions: {
      output: {
        manualChunks: {       // Vendor code splitting
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom']
        }
      }
    }
  }
}
```
[Source: tech-spec-epic-1.md#Performance]

### Implementation Patterns

**Environment Variable Usage Pattern:**
```typescript
// Always provide fallback for robustness
const appName = import.meta.env.VITE_APP_NAME || 'SmartBudget';
const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Type-safe access (TypeScript checks env var exists)
const env: 'development' | 'production' = import.meta.env.VITE_APP_ENV;

// Conditional rendering based on environment
{import.meta.env.DEV && <DevTools />}
{import.meta.env.PROD && <Analytics />}
```

**Deployment Configuration Pattern:**
```toml
# Netlify: netlify.toml
[[redirects]]
  from = "/*"           # Catch all routes
  to = "/index.html"   # Serve index.html (client-side routing)
  status = 200         # HTTP 200 (not 301/302 redirect)
```

```json
// Vercel: vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Security Headers Pattern:**
```toml
[headers.values]
  X-Frame-Options = "DENY"              # Prevent clickjacking
  X-Content-Type-Options = "nosniff"    # Prevent MIME sniffing
  Referrer-Policy = "strict-origin-when-cross-origin"  # Privacy
```

### Project Structure Updates

**New Configuration Files (5 files):**
1. `.env.example` - Template for environment variables
2. `.env.development` - Development environment config
3. `.env.production` - Production environment config
4. `netlify.toml` - Netlify deployment configuration
5. `vercel.json` - Vercel deployment configuration

**New TypeScript Files (1 file):**
1. `src/vite-env.d.ts` - Environment variable type definitions (may already exist from Vite template)

**Modified Files:**
- `vite.config.ts` - Build optimizations, code splitting
- `package.json` - Add type-check and preview scripts
- `.gitignore` - Add .env exclusions, deployment folders
- `README.md` - Deployment documentation
- `src/components/layout/Header.tsx` - Use environment variables (if Story 1.4 complete)

**Build Output (after `npm run build`):**
- `dist/index.html` - Entry point
- `dist/assets/*.js` - JavaScript bundles (hashed filenames)
- `dist/assets/*.css` - CSS bundles (hashed filenames)
- `dist/vite.svg` - Static assets from /public

### Learnings from Previous Story

**From Story 1.4 (Status: drafted - not yet implemented):**

Story 1.4 is currently drafted but not implemented. Key considerations:

- **Tailwind CSS Installation Expected**: Story 1.4 will install Tailwind CSS v4.x
  - **Action**: If Story 1.4 is implemented before this story, Tailwind CSS will be included in production bundle
  - **Expected Bundle Impact**: +30-40 KB for Tailwind CSS (purged)
  - **Current Bundle Size**: 166.51 KB (Story 1.3)
  - **Projected After 1.4**: ~200-210 KB
  - **Projected After 1.5**: Same as 1.4 (this story adds config, not code)

- **Layout Component May Exist**: Story 1.4 creates Layout/Header/Navigation components
  - **Action for This Story**: If Header.tsx exists, update it to use env variables for app name
  - **If Header.tsx doesn't exist**: Document env variable pattern for future use

- **Prerequisites Flexibility**: This story (1.5) can be implemented BEFORE or AFTER Story 1.4
  - Both stories modify different files (minimal conflicts)
  - Story 1.5 focuses on build/deploy config
  - Story 1.4 focuses on UI components
  - **Recommendation**: Either order works, but 1.4 first gives more realistic production bundle size

**From Story 1.3 (Status: done - completed):**

- **React Router Deployed**: Client-side routing requires server redirect configuration
  - **Critical**: Netlify/Vercel redirect rules are REQUIRED for routes to work in production
  - **Without redirects**: Direct URL access (e.g., /transactions) returns 404
  - **Solution**: `/* -> /index.html` redirect allows client-side routing to handle all routes

- **Bundle Size Baseline**: 166.51 KB (54.36 KB gzipped)
  - **Expected After This Story**: Same size (no new dependencies)
  - **Build Performance**: ~3.35s for production build
  - **Action**: Track build time in this story for regression detection

[Source: .bmad-ephemeral/stories/1-3-application-routing-structure.md#Dev-Agent-Record]

### Environment Variable Security

**VITE_ Prefix Requirement:**
- **Why**: Vite only exposes variables prefixed with `VITE_` to client bundle
- **Security**: Prevents accidental exposure of server-side secrets (API keys, database passwords)
- **Example**:
  - `VITE_APP_NAME` → ✅ Exposed to client
  - `DATABASE_URL` → ❌ NOT exposed to client (safe)

**Never Commit:**
- `.env` (local overrides)
- `.env.local` (local secrets)
- `.env.*.local` (environment-specific secrets)

**Safe to Commit:**
- `.env.example` (template with no real values)
- `.env.development` (only if no secrets)
- `.env.production` (only if no secrets)

**Best Practice**: For real deployments, set env variables in Netlify/Vercel dashboard UI, NOT in `.env.production` file.

[Source: tech-spec-epic-1.md#Security]

### Testing Strategy

**Manual Testing Checklist:**

1. **Environment Variables:**
   - Start dev server: verify app name shows with "(Dev)"
   - Build production: verify app name shows WITHOUT "(Dev)"
   - Test fallback: comment out VITE_APP_NAME, verify "SmartBudget" fallback works

2. **Production Build:**
   - Run `npm run build`
   - Verify build completes in <30 seconds
   - Check `dist/` folder exists with index.html and assets/
   - Verify assets have hashed filenames
   - Check bundle size is reasonable (<300KB)

3. **Production Preview:**
   - Run `npm run preview`
   - Navigate to all routes (/, /transactions, etc.)
   - Verify no 404 errors when accessing routes directly
   - Test browser refresh on /transactions route (should work)

4. **Security Checks:**
   - Run `git status` → .env files should NOT appear
   - Run `npm audit` → verify no critical vulnerabilities
   - Try accessing non-VITE_ env variable → verify undefined

5. **Deployment Config:**
   - Verify netlify.toml has redirect rule
   - Verify vercel.json has rewrite rule
   - Verify security headers configured
   - Verify cache headers for assets

6. **Code Splitting:**
   - Inspect build output
   - Verify separate chunks: react-vendor, router, main
   - Verify vendor chunk is largest (~140KB)

[Source: tech-spec-epic-1.md#Testing-Strategy]

### Dependencies Added

**No new runtime dependencies** in this story. Only configuration files.

**Scripts Added (package.json):**
```json
{
  "scripts": {
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

**DevDependencies (already installed from previous stories):**
- vite@^6.0.0 (build tool)
- typescript@~5.6.0 (type checking)
- All other dependencies already installed

[Source: tech-spec-epic-1.md#Dependencies]

### Performance Considerations

**Build Performance Targets (NFR-1.3):**
- Build time: <30 seconds (currently ~3-4s, well within target)
- Bundle size: <500KB (currently ~167KB, plenty of headroom)
- Gzip size: <150KB (currently ~54KB, excellent)

**Code Splitting Benefits:**
- **Vendor chunk**: React + ReactDOM (~140KB) cached separately
- **Router chunk**: React Router (~20KB) cached separately
- **Main chunk**: Application code (~small, changes frequently)
- **Benefit**: Users only re-download main chunk when app updates, vendor stays cached

**Asset Caching Strategy:**
```
/assets/* → Cache-Control: max-age=31536000, immutable
  - JS/CSS bundles have content hash in filename
  - Safe to cache forever (hash changes when content changes)
  - Faster repeat visits
```

**Minification Comparison:**
- **esbuild**: Fast, good compression (used in this project)
- **terser**: Slower, better compression (overkill for this project)
- **none**: No minification (dev only)

[Source: docs/architecture.md#Performance-Considerations]

### Known Issues and Workarounds

**Issue: Direct Route Access 404s in Production**
- **Problem**: Accessing `/transactions` directly in production returns 404
- **Cause**: Static hosts don't know about client-side routes
- **Solution**: Redirect configuration (netlify.toml, vercel.json)
- **Status**: Resolved in this story

**Issue: Environment Variables Not Updating**
- **Problem**: Changing .env file doesn't reflect in app
- **Cause**: Vite caches env variables at dev server start
- **Solution**: Restart dev server (`npm run dev`)
- **Note**: Not a bug, expected behavior

**Issue: TypeScript "Cannot find module" for env variables**
- **Problem**: `import.meta.env.VITE_APP_NAME` shows TypeScript error
- **Cause**: Missing type definitions in vite-env.d.ts
- **Solution**: Add `ImportMetaEnv` interface (Task 2.1)
- **Status**: Resolved in this story

**Issue: Large Bundle Size Warning**
- **Warning**: Vite may warn about chunks >500KB
- **Current Status**: Not expected in this project (~200KB total)
- **If occurs**: Check for accidentally imported large libraries
- **Future**: Implement lazy loading with React.lazy() in Epic 6

### Deployment Platforms Comparison

**Netlify:**
- **Pros**: Simple setup, generous free tier, automatic HTTPS
- **Cons**: Build minutes limited on free tier
- **Best for**: Personal projects, small teams
- **Config**: netlify.toml

**Vercel:**
- **Pros**: Excellent DX, fast builds, Next.js optimizations
- **Cons**: More opinionated (Next.js-focused)
- **Best for**: React/Next.js projects, serverless functions
- **Config**: vercel.json

**GitHub Pages:**
- **Pros**: Free, integrated with GitHub
- **Cons**: Requires HashRouter (bad UX), no server-side config
- **Best for**: Documentation sites
- **Recommendation**: NOT recommended for this project

**Choice for SmartBudget**: Either Netlify or Vercel (both configured in this story).

[Source: docs/architecture.md#Deployment-Architecture]

### Prerequisites Check

**Story 1.1 Must Be Complete:**
- ✅ Vite project initialized
- ✅ package.json exists with build scripts
- ✅ vite.config.ts exists

**Story 1.2 Should Be Complete (for pre-commit hooks):**
- ✅ ESLint + Prettier configured
- ✅ Pre-commit hooks working

**Story 1.3 Must Be Complete (for routing verification in preview):**
- ✅ React Router installed and configured
- ✅ All routes working in dev mode

**Story 1.4 Optional (can be done before or after):**
- ⚠️ If complete: Header component exists, update with env variables
- ⚠️ If not complete: Document env variable pattern for later use

**Verification:**
```bash
npm run build          # Should work (from Story 1.1)
npm run lint          # Should pass (from Story 1.2)
ls src/pages/         # Should have page components (from Story 1.3)
```

### Next Story Preparation

**Epic 1 Completion:**
- This is the LAST story in Epic 1
- After this story, Epic 1 is complete
- **Next Epic**: Epic 2 (Data Layer & State Management)

**Epic 1 Retrospective:**
- After Story 1.5 is done, consider running `*epic-retrospective` workflow
- Review learnings from all 5 foundation stories
- Document technical debt or improvements for future epics

**Epic 2 Prerequisites:**
- Epic 1 complete (all 5 stories done)
- Run `*epic-tech-context` for Epic 2 before starting stories
- Epic 2 will build on this foundation (TypeScript interfaces, state management)

### References

- **Architecture Document**: [docs/architecture.md](../../docs/architecture.md)
  - Deployment Architecture section
  - Environment Configuration patterns
  - Performance Considerations (build optimization)
  - Security Architecture (env variable security)

- **Epic Tech Spec**: [.bmad-ephemeral/stories/tech-spec-epic-1.md](./tech-spec-epic-1.md)
  - AC-1.5: Environment Configuration acceptance criteria
  - Non-Functional Requirements (Performance, Security)
  - Deployment Workflow specifications

- **PRD**: [docs/PRD.md](../../docs/PRD.md)
  - NFR-6: Deployment Requirements
  - NFR-3: Code Quality (linting, type checking)
  - Web Application Specific Requirements

- **Epics Breakdown**: [docs/epics.md](../../docs/epics.md)
  - Story 1.5 detailed requirements and technical notes
  - Epic 1 overall objectives

- **Previous Story**: [.bmad-ephemeral/stories/1-3-application-routing-structure.md](./1-3-application-routing-structure.md)
  - Bundle size baseline (166.51 KB)
  - Build performance baseline (3.35s)
  - Client-side routing requirements

### Security Considerations

**Environment Variable Security:**
- VITE_ prefix prevents server-side secrets from leaking to client
- .env files excluded from Git (in .gitignore)
- .env.example committed as template (no real values)
- Production secrets managed in deployment platform UI

**Deployment Security Headers:**
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy protection
- Future: Content-Security-Policy header (Epic 6)

**Build Security:**
- Sourcemaps disabled in production (prevents code inspection)
- Minification obfuscates code (not security, but reduces readability)
- npm audit run to detect vulnerable dependencies
- Dependencies pinned with ^ (allows patch updates, not major)

**Asset Integrity:**
- Hashed filenames prevent cache poisoning
- Immutable cache headers safe (hash changes → new filename)
- Static hosting reduces attack surface (no server-side code)

[Source: tech-spec-epic-1.md#Security]

## Dev Agent Record

### Context Reference

- [Story 1.5 Context XML](.bmad-ephemeral/stories/1-5-environment-configuration-deployment-prep.context.xml)

### Agent Model Used

claude-sonnet-4-5-20250929

### Implementation Summary

Successfully implemented environment configuration and deployment preparation for SmartBudget application. All acceptance criteria met.

**Key Accomplishments:**
- Created environment variable system with VITE_ prefix for security
- Configured TypeScript types for environment variables
- Optimized Vite build configuration with code splitting
- Created deployment configurations for both Netlify and Vercel
- Added security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection)
- Implemented asset caching strategy (1-year immutable cache for static assets)
- Fixed security vulnerability (js-yaml upgraded to 4.1.1)
- Comprehensive README documentation for deployment process

**Production Build Performance:**
- Bundle size: 171.66 KB (55.84 KB gzipped)
- Build time: ~3-4 seconds
- Bundle size increase from Story 1.4: +0.03 KB (minimal, as expected)
- Code splitting: 3 chunks (react-vendor, router, main)
- All assets hashed for cache busting

**Environment Variable Integration:**
- Development mode shows "SmartBudget (Dev)" in header
- Production mode shows "SmartBudget" without dev indicator
- All environment variables type-safe with TypeScript

**Security Audit:**
- npm audit: 0 vulnerabilities (js-yaml vulnerability fixed)
- .env files properly excluded from Git
- Security headers configured for production deployment
- VITE_ prefix prevents server-side secret leakage

**Testing Completed:**
- Production build successful
- Production preview server working
- All routes accessible in production mode
- Environment variables loading correctly
- Asset optimization verified (minification, tree-shaking)

### Debug Log References

None - implementation completed without issues.

### Completion Notes List

1. **Environment Variable Configuration** - Created .env.example, .env.development, and .env.production files with VITE_ prefixed variables for client-side safety
2. **TypeScript Environment Types** - Added ImportMetaEnv interface to vite-env.d.ts for type-safe environment variable access
3. **Vite Build Optimization** - Already optimized in existing vite.config.ts (code splitting, minification with esbuild)
4. **Header Component Integration** - Updated Header.tsx to dynamically use VITE_APP_NAME, VITE_APP_ENV, and VITE_APP_DESCRIPTION
5. **Netlify Configuration** - Created netlify.toml with SPA redirect rules and security headers
6. **Vercel Configuration** - Created vercel.json with SPA rewrites and security headers
7. **Security Audit** - Fixed js-yaml vulnerability (upgraded to 4.1.1), verified 0 vulnerabilities
8. **README Documentation** - Added comprehensive deployment sections for environment variables, Netlify, and Vercel
9. **Git Security** - Verified .env files excluded from Git, updated .gitignore with deployment folders
10. **Production Testing** - Verified production build, preview server, and environment variable loading

**Bundle Size Progression:**
- Story 1.1: 144.36 KB (46.40 KB gzipped) - Initial React + Vite
- Story 1.3: 166.51 KB (54.36 KB gzipped) - +22 KB for React Router
- Story 1.4: 171.63 KB (55.82 KB gzipped) - +5 KB for Tailwind CSS + Lucide icons
- Story 1.5: 171.66 KB (55.84 KB gzipped) - +0.03 KB (environment variables are build-time only)

**Epic 1 Status:** All 5 foundation stories complete. Project ready for deployment and Epic 2 (Data Layer & State Management).

### File List

**New Configuration Files:**
- [.env.example](../../smartbudget/.env.example) - Environment variable template
- [.env.development](../../smartbudget/.env.development) - Development environment configuration
- [.env.production](../../smartbudget/.env.production) - Production environment configuration
- [netlify.toml](../../smartbudget/netlify.toml) - Netlify deployment configuration
- [vercel.json](../../smartbudget/vercel.json) - Vercel deployment configuration

**New TypeScript Files:**
- [src/vite-env.d.ts](../../smartbudget/src/vite-env.d.ts) - Environment variable type definitions

**Modified Files:**
- [src/components/layout/Header.tsx](../../smartbudget/src/components/layout/Header.tsx) - Uses environment variables dynamically
- [README.md](../../smartbudget/README.md) - Added deployment documentation
- [.gitignore](../../smartbudget/.gitignore) - Added .vercel and .netlify folders
- [package-lock.json](../../smartbudget/package-lock.json) - js-yaml security update

**Git Commit:**
- Commit: ce08be7
- Message: "feat: add environment configuration and deployment setup"
