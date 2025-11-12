# Story 1.2: Code Quality Tooling Setup

Status: ready-for-dev

## Story

As a developer,
I want ESLint, Prettier, and Git hooks configured,
So that code quality standards are automatically enforced (NFR-3.3).

## Acceptance Criteria

**Given** The project is initialized (Story 1.1 complete)
**When** I configure linting and formatting tools
**Then** The following are set up and working:

1. ✅ ESLint installed and configured with React + TypeScript rules
2. ✅ Prettier installed and configured for code formatting
3. ✅ Configuration files created: `.eslintrc.cjs`, `.prettierrc`
4. ✅ Husky installed and configured for Git hooks
5. ✅ lint-staged installed and configured for pre-commit linting
6. ✅ npm scripts added: `lint`, `format`, `lint:fix`

**And** Pre-commit hooks prevent commits with linting errors
**And** All existing code passes linting checks with zero warnings
**And** Prettier formats code automatically on save (via editor config) or pre-commit

## Tasks / Subtasks

### Task 1: Install ESLint Dependencies (AC: #1, #3)

- [ ] **1.1** Install ESLint and TypeScript parser:
  ```bash
  npm install --save-dev eslint@^9.0.0 @typescript-eslint/eslint-plugin@^8.0.0 @typescript-eslint/parser@^8.0.0
  ```
- [ ] **1.2** Install ESLint React plugins:
  ```bash
  npm install --save-dev eslint-plugin-react-hooks@^5.0.0 eslint-plugin-react-refresh@^0.4.14
  ```
- [ ] **1.3** Verify package.json devDependencies include all ESLint packages
- [ ] **1.4** Note: Vite template may have some ESLint packages pre-installed - check package.json first

### Task 2: Configure ESLint (AC: #1, #3)

- [ ] **2.1** Create `.eslintrc.cjs` file in project root
- [ ] **2.2** Add base configuration:
  ```javascript
  module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
  ```
  [Source: docs/architecture.md#Code-Quality]
- [ ] **2.3** Verify .eslintrc.cjs syntax is valid (check for typos)
- [ ] **2.4** Test ESLint: `npx eslint src/` (should run without errors on Vite template code)

### Task 3: Install and Configure Prettier (AC: #2, #3)

- [ ] **3.1** Install Prettier:
  ```bash
  npm install --save-dev prettier@^3.4.0
  ```
- [ ] **3.2** Create `.prettierrc` file in project root:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 80,
    "arrowParens": "avoid"
  }
  ```
  [Source: .bmad-ephemeral/stories/tech-spec-epic-1.md#Configuration-Files-Created]
- [ ] **3.3** Create `.prettierignore` file:
  ```
  dist/
  node_modules/
  .git/
  coverage/
  *.min.js
  package-lock.json
  ```
- [ ] **3.4** Test Prettier: `npx prettier --check src/` (verify it runs)

### Task 4: Add npm Scripts (AC: #6)

- [ ] **4.1** Add linting scripts to package.json:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,css,md,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,css,md,json}\""
  }
  ```
- [ ] **4.2** Test each script:
  - [ ] `npm run lint` (should pass with zero warnings)
  - [ ] `npm run format:check` (should pass or show files to format)
  - [ ] `npm run format` (should format any unformatted files)
  - [ ] `npm run lint:fix` (should auto-fix any fixable issues)
- [ ] **4.3** Verify all Vite template code passes linting

### Task 5: Install and Configure Husky (AC: #4, #7)

- [ ] **5.1** Install Husky:
  ```bash
  npm install --save-dev husky@^9.0.0
  ```
- [ ] **5.2** Initialize Husky:
  ```bash
  npx husky init
  ```
- [ ] **5.3** Verify `.husky/` directory created
- [ ] **5.4** Create pre-commit hook file: `.husky/pre-commit`
- [ ] **5.5** Add pre-commit hook content:
  ```bash
  #!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"

  npx lint-staged
  ```
- [ ] **5.6** Make hook executable (Linux/Mac): `chmod +x .husky/pre-commit`
- [ ] **5.7** Verify package.json has prepare script: `"prepare": "husky"`

### Task 6: Install and Configure lint-staged (AC: #5, #7)

- [ ] **6.1** Install lint-staged:
  ```bash
  npm install --save-dev lint-staged@^15.0.0
  ```
- [ ] **6.2** Create `.lintstagedrc.json` file in project root:
  ```json
  {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
  ```
- [ ] **6.3** Verify configuration only lints/formats staged files (not all files)
- [ ] **6.4** Note: lint-staged runs automatically via Husky pre-commit hook

### Task 7: Test Pre-commit Hook (AC: #7)

- [ ] **7.1** Make a test change: Modify `src/App.tsx` (add intentional linting error):
  ```typescript
  const unused = 'test'; // Unused variable - should trigger error
  ```
- [ ] **7.2** Stage the change: `git add src/App.tsx`
- [ ] **7.3** Attempt commit: `git commit -m "test: verify pre-commit hook"`
- [ ] **7.4** Verify commit is **blocked** with ESLint error message
- [ ] **7.5** Fix the error (remove unused variable)
- [ ] **7.6** Stage fix and commit again
- [ ] **7.7** Verify commit **succeeds** this time
- [ ] **7.8** Verify code was auto-formatted by Prettier during commit

### Task 8: Add .editorconfig for Consistency (Best Practice)

- [ ] **8.1** Create `.editorconfig` file in project root:
  ```ini
  root = true

  [*]
  charset = utf-8
  indent_style = space
  indent_size = 2
  end_of_line = lf
  insert_final_newline = true
  trim_trailing_whitespace = true

  [*.md]
  trim_trailing_whitespace = false
  ```
  [Source: docs/epics.md#Story-1.2-Technical-Notes]
- [ ] **8.2** Verify .editorconfig is recognized by your IDE
- [ ] **8.3** Note: EditorConfig ensures consistent formatting across different editors/IDEs

### Task 9: Update README with Linting Info (Best Practice)

- [ ] **9.1** Add "Code Quality" section to README.md:
  ```markdown
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
  ```
- [ ] **9.2** Document linting rules in README (link to .eslintrc.cjs for details)

### Task 10: Validation and Clean-up (AC: #8)

- [ ] **10.1** Run full lint check: `npm run lint` (verify zero errors, zero warnings)
- [ ] **10.2** Run format check: `npm run format:check` (verify all code formatted)
- [ ] **10.3** Verify all acceptance criteria met
- [ ] **10.4** Create Git commit with conventional commit format:
  ```bash
  git add .
  git commit -m "feat: add ESLint, Prettier, and Husky for code quality

  - Install and configure ESLint with React + TypeScript rules
  - Install and configure Prettier for code formatting
  - Set up Husky + lint-staged for pre-commit quality checks
  - Add npm scripts for linting and formatting
  - Create .editorconfig for editor consistency
  - Update README with code quality documentation

  🤖 Generated with Claude Code
  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```
- [ ] **10.5** Verify commit succeeds with pre-commit hooks active
- [ ] **10.6** Run build to ensure tooling doesn't break build: `npm run build`

## Dev Notes

### Architecture Alignment

**Code Quality Tools (from Architecture):**
- **ESLint**: JavaScript/TypeScript linting with React plugins [Source: docs/architecture.md#Code-Quality]
- **Prettier**: Code formatting with consistent style
- **Husky**: Git hooks for pre-commit quality checks
- **lint-staged**: Run linters only on staged files (performance optimization)

**Configuration Standards:**
- Prettier: 2-space indent, single quotes, trailing commas (ES5) [Source: tech-spec-epic-1.md#Configuration-Files-Created]
- ESLint: Recommended rules + React hooks + TypeScript
- Pre-commit: Blocks commits with linting errors

### Implementation Patterns

**ESLint Configuration Strategy:**
- Use `.eslintrc.cjs` (CommonJS) for compatibility with ESM projects
- Extend recommended rulesets (eslint, TypeScript, React Hooks)
- Minimal custom rules - trust the defaults
- Ignore dist/ and config files

**Prettier Integration:**
- Prettier runs **after** ESLint in lint-staged
- No ESLint-Prettier conflict plugins needed (modern approach)
- Prettier handles formatting, ESLint handles code quality

**Husky + lint-staged Workflow:**
```
Git commit attempt →
  Husky pre-commit hook triggers →
    lint-staged runs on staged files only →
      ESLint --fix (auto-fix issues) →
        Prettier --write (format code) →
          If all pass: Commit succeeds
          If errors remain: Commit blocked, dev fixes manually
```

### Performance Considerations

**lint-staged Optimization:**
- Only lints/formats **staged files**, not entire codebase
- Critical for large projects (fast commits)
- In this project: ~10 files initially, very fast

**ESLint Performance:**
- `--report-unused-disable-directives`: Catches unnecessary disable comments
- `--max-warnings 0`: Treat warnings as errors (strict mode)
- Fast on modern hardware with TypeScript caching

### Testing Strategy

**Manual Testing for this Story:**

1. **ESLint Testing:**
   - Add intentional error: `const x = 'test';` (unused variable)
   - Run `npm run lint` - should fail
   - Run `npm run lint:fix` - should remove unused variable
   - Verify lint passes

2. **Prettier Testing:**
   - Add unformatted code: `const  y =   'test'  ;` (extra spaces)
   - Run `npm run format:check` - should fail
   - Run `npm run format` - should fix formatting
   - Verify format:check passes

3. **Pre-commit Hook Testing:**
   - Modify file with linting error
   - Stage and commit
   - Verify commit blocked
   - Fix error, commit again
   - Verify commit succeeds and code auto-formatted

4. **Build Integration:**
   - Run `npm run build` after all setup
   - Verify build succeeds (tooling doesn't break build)

[Source: .bmad-ephemeral/stories/tech-spec-epic-1.md#Story-1.2-Testing]

### Dependencies Added

**ESLint Ecosystem:**
```json
{
  "devDependencies": {
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14"
  }
}
```

**Formatting & Git Hooks:**
```json
{
  "devDependencies": {
    "prettier": "^3.4.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  }
}
```
[Source: docs/architecture.md#Dependencies-Overview]

### Configuration Files Created

**Total: 5 new configuration files**
1. `.eslintrc.cjs` - ESLint rules
2. `.prettierrc` - Prettier formatting rules
3. `.prettierignore` - Files to skip formatting
4. `.lintstagedrc.json` - lint-staged configuration
5. `.editorconfig` - Editor consistency settings

**Modified:**
- `package.json` - Added scripts and devDependencies
- `.husky/pre-commit` - Pre-commit hook script

### Known Issues and Workarounds

**Issue: ESLint and Prettier Conflicts**
- **Solution**: Run Prettier **after** ESLint in lint-staged
- **Why**: Prettier handles all formatting, ESLint handles code quality
- **No conflict plugins needed**: Modern approach as of 2025

**Issue: Pre-commit hooks slow on large changesets**
- **Solution**: lint-staged only processes staged files
- **Fallback**: Use `git commit --no-verify` for urgent commits (discouraged)

**Issue: Windows vs Unix line endings**
- **Solution**: .editorconfig sets `end_of_line = lf`
- **Git**: Configure `core.autocrlf = input` on Windows

### Prerequisites Check

**Story 1.1 Must Be Complete:**
- ✅ Project initialized with Vite + React + TypeScript
- ✅ package.json exists
- ✅ Git repository initialized
- ✅ Folder structure established

**Verification:**
```bash
# Verify Story 1.1 complete
ls package.json     # Should exist
ls src/             # Should exist
git status          # Should show initialized Git repo
npm run dev         # Should start dev server
```

### Next Story Preparation

**Story 1.3 Prerequisites:**
- This story (1.2) establishes code quality standards
- Linting ensures clean code for routing implementation
- Pre-commit hooks will catch errors in routing code

**Patterns Established for Story 1.3:**
- Commit message format (conventional commits)
- Code quality checks (all new code must pass lint)
- Automated formatting (Prettier handles styling)

### Learnings from Previous Story

**From Story 1.1 (Status: drafted):**

Since Story 1.1 is drafted but not yet implemented, this story will build upon the planned foundation:

- **Project Structure Created**: Story 1.1 establishes the base Vite project that this story will enhance with quality tooling
- **Git Repository**: Story 1.1 initializes Git, enabling Husky hook installation
- **Package.json**: Story 1.1 creates package.json for adding devDependencies
- **TypeScript Config**: Story 1.1's tsconfig.json will be respected by ESLint's TypeScript parser

**Integration Note**: This story assumes Story 1.1 is complete. If implementing both stories together, complete Story 1.1 first, then proceed to Story 1.2.

[Source: .bmad-ephemeral/stories/1-1-project-initialization-technology-stack-setup.md]

### References

- **Architecture Document**: [docs/architecture.md](../../docs/architecture.md)
  - Code Quality section
  - Dependencies Overview
  - Implementation Patterns

- **Epic Tech Spec**: [.bmad-ephemeral/stories/tech-spec-epic-1.md](./tech-spec-epic-1.md)
  - AC-1.2: Code Quality Tooling acceptance criteria
  - Configuration Files Created section
  - NFR-Security requirements

- **PRD**: [docs/PRD.md](../../docs/PRD.md)
  - NFR-3.3: Code Style & Consistency requirements
  - NFR-3.4: Git Practices requirements

- **Epics Breakdown**: [docs/epics.md](../../docs/epics.md)
  - Story 1.2 detailed requirements and technical notes

- **Previous Story**: [.bmad-ephemeral/stories/1-1-project-initialization-technology-stack-setup.md](./1-1-project-initialization-technology-stack-setup.md)
  - Project foundation and structure

### Security Considerations

**Dependency Security:**
- Run `npm audit` after installing new packages
- Fix high/critical vulnerabilities immediately
- Keep ESLint/Prettier updated for security patches

**Git Hook Security:**
- Husky hooks run local scripts - verify .husky/ contents
- Never commit sensitive data (hooks won't catch everything)
- lint-staged prevents accidental commits of large files

**Code Injection Prevention:**
- ESLint rules prevent dangerous patterns (`eval`, `dangerouslySetInnerHTML`)
- TypeScript strict mode catches many security issues
- Pre-commit hooks as first line of defense

## Dev Agent Record

### Context Reference

- [Story Context XML](.bmad-ephemeral/stories/1-2-code-quality-tooling-setup.context.xml)

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent during implementation_

### Completion Notes List

_Dev agent will document:_
- Exact ESLint version installed and any configuration adjustments
- Prettier formatting decisions or rule modifications
- Husky setup issues encountered (especially on Windows)
- lint-staged performance observations
- Pre-commit hook test results
- Any linting errors found in Vite template code and how resolved
- Build verification results

### File List

_Dev agent will list all files created/modified:_
- NEW: .eslintrc.cjs, .prettierrc, .prettierignore, .lintstagedrc.json, .editorconfig
- NEW: .husky/pre-commit hook script
- MODIFIED: package.json (scripts and devDependencies added)
- MODIFIED: README.md (code quality documentation added)

---

**Story Ready for Story Context Generation**

Run `*story-context` to generate technical context XML and mark this story ready for development.
