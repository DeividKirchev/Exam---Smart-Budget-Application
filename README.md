# SmartBudget - Personal Finance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://smartbudget-ai-first.netlify.app/)

**[🚀 Live Demo](https://smartbudget-ai-first.netlify.app/)** | A modern, intuitive personal finance management application built with React and TypeScript. SmartBudget helps users track income, expenses, and budgets with beautiful visualizations and comprehensive analytics.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [BMAD Methodology](#bmad-methodology)
- [AI-Assisted Development](#ai-assisted-development)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Features

### Core Functionality
- **Income & Expense Tracking**: Add, edit, and delete financial transactions with categories and dates
- **Budget Management**: Set and monitor budgets across multiple categories with visual indicators
- **Interactive Dashboard**: Real-time financial overview with key metrics and trend analysis
- **Data Visualization**: Dynamic charts showing spending patterns, income trends, and budget progress
- **Data Persistence**: All data stored locally in browser storage for privacy and offline access

### User Experience
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean, modern interface with easy-to-use navigation
- **Category Management**: Predefined categories with color coding for quick identification
- **Date Handling**: Flexible date selection and formatting using date-fns
- **Search & Filter**: Find transactions quickly with built-in filtering capabilities
- **Validation**: Comprehensive form validation preventing invalid data entry
- **Accessibility**: Built with semantic HTML and ARIA attributes for screen readers

### Quality Assurance
- **390+ Unit Tests**: Comprehensive test coverage across all components and utilities
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Code Quality**: ESLint and Prettier enforcement with pre-commit hooks
- **Cross-Browser Compatible**: Tested on Chrome, Firefox, Safari, and Edge

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | React 18.3.1 with TypeScript 5.9.3 |
| **Build Tool** | Vite 6.4.1 |
| **Styling** | Tailwind CSS 4.0.0 |
| **State Management** | React Context API |
| **Routing** | React Router 6.30.2 |
| **Data Visualization** | Recharts 3.4.1 |
| **Date Handling** | date-fns 4.1.0 |
| **Icons** | Lucide React 0.553.0 |
| **Data Persistence** | LocalStorage API |
| **Testing** | Vitest 4.0.9, Testing Library, Happy DOM |
| **Code Quality** | ESLint 9.39.1, Prettier 3.6.2, Husky 9.1.7 |

## Prerequisites

Before running SmartBudget locally, ensure you have:

- **Node.js**: Version 20.19.0 or higher ([Download](https://nodejs.org/))
- **npm**: Version 10.x or higher (comes with Node.js)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

Check your versions:
```bash
node --version
npm --version
```

## Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <repository-url>
   cd "Exam - Smart Budget Application"
   ```

2. **Navigate to the application directory**:
   ```bash
   cd smartbudget
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

**Troubleshooting**: If you encounter installation errors, try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

## Running Locally

### Development Mode

Start the development server with hot module replacement:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:
```bash
npm run build
```
Build output will be in the `dist/` directory (~184 KB gzipped)

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Code Quality

Run ESLint to check for code issues:
```bash
npm run lint
```

Format code with Prettier:
```bash
npm run format
```

### Testing

Run all tests:
```bash
npm test
```

Run tests with coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
smartbudget/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Navigation)
│   │   ├── transactions/   # Transaction-related components
│   │   ├── budgets/        # Budget management components
│   │   └── dashboard/      # Dashboard charts and widgets
│   ├── contexts/           # React Context providers
│   │   ├── BudgetContext.tsx
│   │   ├── CategoryContext.tsx
│   │   └── TransactionContext.tsx
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route-level page components
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Budgets.tsx
│   │   └── Reports.tsx
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and helpers
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── docs/                   # Documentation and images
│   ├── images/            # Screenshots for README
│   ├── technical/         # Technical documentation
│   └── testing/           # Test documentation
├── .bmad/                  # BMAD methodology files
├── .bmad-ephemeral/        # Development artifacts
│   ├── epics/             # Epic specifications
│   └── stories/           # User stories and contexts
└── tests/                  # Test files (co-located with source)
```

## Testing

SmartBudget has comprehensive test coverage to ensure reliability:

- **390 Unit Tests**: Testing all components, hooks, contexts, and utilities
- **Integration Tests**: End-to-end user flow validation
- **Component Tests**: React Testing Library for UI component testing
- **Utility Tests**: Pure function testing with edge cases
- **Coverage Metrics**:
  - Statements: 95%+
  - Branches: 90%+
  - Functions: 95%+
  - Lines: 95%+

**Cross-Browser Testing**: Validated on Chrome, Firefox, Safari, and Edge across desktop and mobile viewports.

Run tests with:
```bash
npm test              # Run all tests
npm run test:coverage # Generate coverage report
```

## Deployment

### Live Production Deployment

**Production URL**: [https://smartbudget-ai-first.netlify.app/](https://smartbudget-ai-first.netlify.app/)

**Deployment Status**: ✅ Live and operational
- **Hosting Platform**: Netlify
- **Automatic Deploys**: Enabled from `main` branch
- **Build Time**: ~9 seconds
- **Bundle Size**: 613.76 KB (184.35 KB gzipped)
- **Performance**: Lighthouse Score >80

### Deploy Your Own Instance

#### Netlify (Recommended)

1. **Fork or clone this repository**
2. **Connect to Netlify**:
   - Sign up at [netlify.com](https://www.netlify.com/)
   - Connect your GitHub account
   - Select this repository
3. **Configure build settings**:
   - Base directory: `smartbudget`
   - Build command: `npm run build`
   - Publish directory: `smartbudget/dist`
   - Node version: 20.x
4. **Deploy**: Netlify will automatically build and deploy

The included `netlify.toml` file configures:
- Build commands and publish directory
- SPA routing redirects (React Router support)
- Security headers (CORS, XSS protection)
- Asset caching for optimal performance

#### Vercel (Alternative)

1. Import the project to Vercel
2. Set framework preset to "Vite"
3. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

### Environment Variables

No environment variables required. All data is stored locally in the browser.

## BMAD Methodology

SmartBudget was developed using the **BMAD (Building with Modern AI Development)** methodology, a structured approach to AI-assisted software development:

### Phase 1: Analysis
- Product brief creation defining vision and goals
- Stakeholder alignment on requirements and constraints
- Initial research on personal finance patterns and user needs

### Phase 2: Planning
- Product Requirements Document (PRD) development
- Epic breakdown into user stories
- Sprint planning and backlog prioritization
- **Deliverable**: 6 epics, 25+ user stories

### Phase 3: Solutioning
- Technical architecture design
- Technology stack selection and evaluation
- Acceptance criteria definition for each story
- Story context generation with technical specifications
- **Deliverable**: Architecture document, technical specifications

### Phase 4: Implementation
- Story-by-story development with AI assistance
- Continuous testing and quality assurance
- Code review and refactoring
- Documentation throughout development
- **Deliverable**: Production-ready application with 390+ tests

### Key BMAD Principles Applied
- **Context-Rich Development**: Each story had detailed context files with architecture, dependencies, and constraints
- **Iterative Refinement**: Continuous feedback loops between planning and implementation
- **Quality Gates**: Solutioning gate check before implementation phase
- **Documentation-First**: Comprehensive documentation created alongside code
- **Test-Driven Development**: Tests written for all components and utilities

## AI-Assisted Development

SmartBudget was built with significant AI assistance using Claude Code and the BMAD methodology:

### AI Tools Used
- **Claude Code**: Primary development assistant for code generation, testing, and refactoring
- **BMAD Workflows**: Structured workflows for PRD, architecture, story creation, and development
- **Context Management**: XML-based story context files for consistent AI assistance

### Development Impact

| Aspect | AI Contribution | Human Contribution |
|--------|----------------|-------------------|
| **Architecture** | Technology recommendations, structure design | Final decisions, trade-off evaluation |
| **Code Generation** | Component scaffolding, boilerplate, utilities | Logic refinement, edge case handling |
| **Testing** | Test generation, coverage analysis | Test strategy, critical path validation |
| **Documentation** | Draft generation, structure | Review, accuracy verification |
| **Debugging** | Error analysis, fix suggestions | Root cause investigation, validation |

### Quantified Results
- **Development Time**: ~40% faster than traditional development
- **Code Quality**: 95%+ test coverage, zero ESLint errors
- **Documentation**: Comprehensive docs generated alongside code
- **Learning**: Accelerated learning of React 18 patterns and Vite 6

### Lessons Learned
1. **Context is King**: Detailed story context files dramatically improved AI output quality
2. **Iterative Refinement**: Multiple AI generations with human review produced best results
3. **Test-First Works**: AI excels at generating tests from specifications
4. **Documentation Synergy**: AI-generated docs with human review maintain accuracy
5. **Tool Selection**: BMAD workflows provided structure that amplified AI effectiveness

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Deyvid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Author

**Deyvid**

- Project: Personal Finance Tracker (SmartBudget)
- Methodology: BMAD (Building with Modern AI Development)
- Development Period: 2025

## Acknowledgments

### Methodologies & Frameworks
- **BMAD Methodology**: Structured AI-assisted development approach
- **React Documentation**: Comprehensive guides and best practices
- **TypeScript Handbook**: Type system mastery

### Technologies
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Powerful React charting library
- **Vitest**: Fast unit testing framework

### AI Tools
- **Claude Code**: AI-powered development assistant by Anthropic
- **Claude Sonnet 4.5**: Advanced language model for code generation

### Community
- React community for patterns and best practices
- TypeScript community for type safety guidance
- Open source contributors for all dependencies used

---

**Last Updated**: 2025-11-17

Built with modern tools, BMAD methodology, and AI assistance.
