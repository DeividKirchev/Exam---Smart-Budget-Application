# SmartBudget Application - Test Plan

**Version:** 1.0
**Date:** 2025-11-17
**Project:** SmartBudget MVP
**Epic:** 6 - Finalization and Deployment
**Story:** 6.1 - Manual Testing & Bug Fixes

---

## Test Overview

### Objectives

This test plan validates the complete SmartBudget MVP application through comprehensive manual testing across all supported browsers, devices, and user scenarios. Testing focuses on ensuring production readiness before deployment.

### Scope

**In Scope:**
- All user-facing features (Transaction Management, Dashboard Analytics, Navigation, Filtering)
- Cross-browser compatibility (Chrome 90+, Firefox 88+, Safari 14+)
- Responsive design validation (Mobile ≤767px, Tablet 768-1023px, Desktop ≥1024px)
- Data persistence and integrity (LocalStorage)
- Performance requirements (NFR-P4)
- Edge cases and error handling

**Out of Scope:**
- Server-side functionality (application is client-only)
- Third-party integrations (none exist in MVP)
- Automated test execution (infrastructure exists, but this story is manual testing only)

### Test Environment

**Application Build:**
- Production build: `npm run build` + `npm run preview`
- Local URL: http://localhost:4173
- Clean LocalStorage before each test session

**Browser Test Matrix:**

| Browser         | OS          | Mobile | Tablet | Desktop | Priority |
|-----------------|-------------|--------|--------|---------|----------|
| Chrome 131+     | Windows 11  | N      | N      | ✓       | P0       |
| Chrome 131+     | macOS       | N      | N      | ✓       | P0       |
| Chrome Android  | Android 13+ | ✓      | ✓      | N       | P1       |
| Firefox 133+    | Windows 11  | N      | N      | ✓       | P1       |
| Firefox 133+    | macOS       | N      | N      | ✓       | P1       |
| Safari 18+      | macOS       | N      | N      | ✓       | P1       |
| Safari iOS      | iOS 17+     | ✓      | ✓      | N       | P1       |

**Device Breakpoints:**
- Mobile: 320px, 375px, 414px, 640px (sm)
- Tablet: 768px (md), 1024px (lg)
- Desktop: 1280px (xl), 1920px (2xl)

### Test Categories

1. **Functional Tests (Priority: P0)** - TC-001 to TC-030
   - Transaction Management (TC-001 to TC-010)
   - Dashboard Visualization (TC-011 to TC-020)
   - Navigation, Filtering, and Search (TC-021 to TC-030)

2. **Non-Functional Tests (Priority: P1)** - TC-031 to TC-040
   - Responsive Design (TC-031 to TC-040)
   - Performance validation
   - Cross-browser compatibility

3. **Edge Case Tests (Priority: P2)** - TC-041 to TC-050
   - Empty state, single transaction, large dataset, invalid inputs, storage limits

### Exit Criteria

- All P0 (Critical) test cases pass
- All P1 (High) test cases pass or bugs documented
- P2/P3 bugs documented as known issues
- All P0/P1 bugs fixed and verified
- Performance targets met (Page load <3s, Interactions <100ms, Charts <2s, Filters <500ms)
- No console errors in production build

---

## Test Cases

### Category 1: Functional Tests - Transaction Management (TC-001 to TC-010)

#### TC-001: Add New Income Transaction

**Feature:** Transaction Management
**Description:** Verify user can add a new income transaction with all required fields
**Priority:** P0

**Steps:**
1. Navigate to Transactions page
2. Click "Add Transaction" button
3. Select type: "Income"
4. Enter amount: 5000
5. Select category: "Salary"
6. Enter description: "Monthly Salary - November"
7. Select date: 2025-11-01
8. Click "Save" button

**Expected Result:**
- Transaction form validates all fields
- Success message displays
- User redirected to Transactions list
- New transaction appears at top of list (sorted by date descending)
- Dashboard summary updates with new income amount

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-002: Add New Expense Transaction

**Feature:** Transaction Management
**Description:** Verify user can add a new expense transaction with all required fields
**Priority:** P0

**Steps:**
1. Navigate to Transactions page
2. Click "Add Transaction" button
3. Select type: "Expense"
4. Enter amount: 1500
5. Select category: "Rent"
6. Enter description: "November Rent Payment"
7. Select date: 2025-11-01
8. Click "Save" button

**Expected Result:**
- Transaction form validates all fields
- Success message displays
- User redirected to Transactions list
- New transaction appears in list sorted by date
- Dashboard summary updates with new expense amount

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-003: Edit Existing Transaction

**Feature:** Transaction Management
**Description:** Verify user can edit an existing transaction and changes persist
**Priority:** P0

**Steps:**
1. Navigate to Transactions page
2. Locate an existing transaction
3. Click "Edit" button/icon for that transaction
4. Change amount from original to new value (e.g., 5000 → 5500)
5. Change category to different category
6. Change description
7. Click "Save" button

**Expected Result:**
- Transaction form pre-fills with existing data
- All fields are editable
- Changes save successfully
- User redirected to Transactions list
- Updated transaction displays new values
- Dashboard recalculates with updated amounts

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-004: Delete Transaction with Confirmation

**Feature:** Transaction Management
**Description:** Verify user can delete a transaction with confirmation dialog
**Priority:** P0

**Steps:**
1. Navigate to Transactions page
2. Locate an existing transaction
3. Click "Delete" button/icon for that transaction
4. Observe confirmation dialog appears
5. Click "Confirm" or "Yes" button

**Expected Result:**
- Confirmation dialog displays with transaction details
- Dialog has "Confirm" and "Cancel" buttons
- After confirming, transaction is removed from list
- Success message displays
- Dashboard recalculates without deleted transaction
- Transaction does not reappear after page refresh

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-005: Cancel Delete Operation

**Feature:** Transaction Management
**Description:** Verify user can cancel a delete operation without removing transaction
**Priority:** P1

**Steps:**
1. Navigate to Transactions page
2. Locate an existing transaction
3. Click "Delete" button/icon for that transaction
4. Observe confirmation dialog appears
5. Click "Cancel" or "No" button

**Expected Result:**
- Confirmation dialog displays
- After clicking cancel, dialog closes
- Transaction remains in the list (not deleted)
- No changes to dashboard or transaction list

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-006: View Transaction List Sorted by Date

**Feature:** Transaction Management
**Description:** Verify transactions display sorted by date (most recent first) by default
**Priority:** P0

**Steps:**
1. Navigate to Transactions page
2. Add 3 transactions with different dates:
   - Transaction A: 2025-11-15
   - Transaction B: 2025-11-10
   - Transaction C: 2025-11-20
3. Observe transaction list order

**Expected Result:**
- Transactions display in descending date order (newest first):
  - Transaction C (2025-11-20)
  - Transaction A (2025-11-15)
  - Transaction B (2025-11-10)
- Date format is consistent and readable
- Sort order persists after page refresh

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-007: Sort Transactions by Amount

**Feature:** Transaction Management
**Description:** Verify user can sort transactions by amount (ascending/descending)
**Priority:** P1

**Steps:**
1. Navigate to Transactions page
2. Ensure at least 3 transactions exist with different amounts
3. Click "Amount" column header or sort button
4. Observe sort order changes

**Expected Result:**
- First click sorts ascending (smallest to largest)
- Second click sorts descending (largest to smallest)
- Sort indicator (arrow) displays current direction
- Sort state persists during session

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-008: Sort Transactions by Category

**Feature:** Transaction Management
**Description:** Verify user can sort transactions by category alphabetically
**Priority:** P1

**Steps:**
1. Navigate to Transactions page
2. Ensure transactions exist with different categories
3. Click "Category" column header or sort button
4. Observe sort order changes

**Expected Result:**
- Transactions sort alphabetically by category (A-Z or Z-A)
- Sort indicator displays current direction
- Grouped categories display together

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-009: Navigate to Add Transaction from Empty State

**Feature:** Transaction Management
**Description:** Verify user can navigate to Add Transaction form from empty state message
**Priority:** P0

**Steps:**
1. Clear all transactions (delete all existing transactions)
2. Navigate to Transactions page
3. Observe empty state message displays
4. Click "Add Transaction" button/link in empty state

**Expected Result:**
- Empty state displays friendly message (e.g., "No transactions yet")
- Empty state includes clear call-to-action button
- Clicking CTA navigates to Add Transaction form
- Form displays correctly with all fields

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-010: Navigate to Edit Transaction from List

**Feature:** Transaction Management
**Description:** Verify user can navigate to Edit Transaction form from transaction list
**Priority:** P0

**Steps:**
1. Navigate to Transactions page
2. Ensure at least one transaction exists
3. Click "Edit" button/icon for a transaction
4. Observe form displays with transaction data pre-filled

**Expected Result:**
- Clicking edit navigates to edit form (or opens modal)
- Form title indicates "Edit Transaction"
- All fields pre-filled with current transaction data
- Transaction ID passed correctly
- Save updates existing transaction (doesn't create new one)

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

### Category 2: Functional Tests - Dashboard & Analytics (TC-011 to TC-020)

#### TC-011: View Summary Cards (Income, Expenses, Balance)

**Feature:** Dashboard Analytics
**Description:** Verify summary cards display accurate financial totals
**Priority:** P0

**Steps:**
1. Navigate to Dashboard page
2. Observe summary cards for current period (This Month)
3. Manually calculate expected totals:
   - Total Income = sum of all income transactions this month
   - Total Expenses = sum of all expense transactions this month
   - Balance = Total Income - Total Expenses

**Expected Result:**
- Three summary cards display: Income, Expenses, Balance
- Income card shows positive value with income icon
- Expenses card shows positive value with expense icon
- Balance card shows net value (can be positive or negative)
- All amounts formatted as currency ($X,XXX.XX)
- Calculated values match manual calculation

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-012: Verify Calculations Are Accurate for Current Period

**Feature:** Dashboard Analytics
**Description:** Verify dashboard calculations match transaction data for selected period
**Priority:** P0

**Steps:**
1. Add known test data:
   - 3 income transactions: $5000, $2000, $1000 (total $8000)
   - 4 expense transactions: $1500, $800, $600, $300 (total $3200)
2. Navigate to Dashboard
3. Ensure period selector is "This Month"
4. Verify summary cards

**Expected Result:**
- Income card: $8,000.00
- Expenses card: $3,200.00
- Balance card: $4,800.00
- Calculations are exact (no rounding errors)

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-013: Change Period Selector (This Month, Last Month, Custom)

**Feature:** Dashboard Analytics
**Description:** Verify period selector filters dashboard data correctly
**Priority:** P0

**Steps:**
1. Add transactions in both current and previous month
2. Navigate to Dashboard
3. Select "This Month" period
4. Verify only current month transactions included in calculations
5. Select "Last Month" period
6. Verify only previous month transactions included
7. Select "Custom" period and set date range
8. Verify only transactions in date range included

**Expected Result:**
- Period selector has options: This Month, Last Month, Custom (with date picker)
- Changing period updates all summary cards immediately
- Charts update to reflect selected period
- Recent transactions widget filters to selected period
- Data accuracy maintained across period changes

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-014: View Expense Breakdown Pie Chart

**Feature:** Dashboard Analytics
**Description:** Verify expense breakdown pie chart displays correctly with accurate percentages
**Priority:** P0

**Steps:**
1. Add expense transactions across 3-4 different categories:
   - Rent: $1500
   - Food: $600
   - Transportation: $300
   - Entertainment: $100
2. Navigate to Dashboard
3. Locate expense breakdown pie chart

**Expected Result:**
- Pie chart renders with one slice per expense category
- Slice sizes proportional to expense amounts
- Legend displays category names and amounts/percentages
- Colors are distinct and visually appealing
- Total percentage = 100%
- Chart is readable and responsive

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-015: Hover Over Chart Slice to See Tooltip

**Feature:** Dashboard Analytics
**Description:** Verify pie chart tooltips display on hover with category details
**Priority:** P1

**Steps:**
1. Navigate to Dashboard with expense data
2. Hover mouse over each pie chart slice
3. Observe tooltip displays

**Expected Result:**
- Hovering over slice displays tooltip
- Tooltip shows: Category name, Amount, Percentage
- Tooltip is clearly visible (good contrast, readable font)
- Tooltip follows cursor or anchors to slice
- Tooltip disappears when mouse moves away

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-016: View Income vs Expenses Trend Chart

**Feature:** Dashboard Analytics
**Description:** Verify income vs expenses trend chart displays monthly comparison
**Priority:** P0

**Steps:**
1. Add transactions spanning 3+ months
2. Navigate to Dashboard
3. Locate income vs expenses trend chart (line or bar chart)

**Expected Result:**
- Chart displays income and expenses as separate lines/bars
- X-axis shows time periods (months)
- Y-axis shows amounts
- Legend identifies income vs expense lines
- Data points are accurate
- Chart is responsive and readable

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-017: Verify Chart Legend and Colors

**Feature:** Dashboard Analytics
**Description:** Verify chart legends are clear, colors are distinct and accessible
**Priority:** P1

**Steps:**
1. Navigate to Dashboard
2. Review all charts (pie chart, trend chart)
3. Check legend clarity and color contrast

**Expected Result:**
- Each chart has a clear legend
- Legend labels match data series
- Colors are distinct and accessible (color-blind friendly)
- Legend is positioned clearly (not overlapping chart)
- Color consistency across dashboard

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-018: View Recent Transactions Widget

**Feature:** Dashboard Analytics
**Description:** Verify recent transactions widget displays last 5-10 transactions
**Priority:** P0

**Steps:**
1. Add 15+ transactions with various dates
2. Navigate to Dashboard
3. Locate recent transactions widget

**Expected Result:**
- Widget displays 5-10 most recent transactions
- Transactions sorted by date (newest first)
- Each transaction shows: Date, Description, Category, Amount, Type (Income/Expense)
- Amount formatting is correct
- Widget is responsive

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-019: Click "View All" from Recent Transactions

**Feature:** Dashboard Analytics
**Description:** Verify "View All" link navigates to full transactions list
**Priority:** P1

**Steps:**
1. Navigate to Dashboard
2. Locate recent transactions widget
3. Click "View All" or "See All Transactions" link

**Expected Result:**
- Link is clearly visible
- Clicking link navigates to Transactions page
- Transactions page displays complete list
- Active navigation indicator updates to "Transactions"

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-020: Verify Dashboard Updates After Adding Transaction

**Feature:** Dashboard Analytics
**Description:** Verify dashboard immediately updates when new transaction added
**Priority:** P0

**Steps:**
1. Note current dashboard values (Income, Expenses, Balance)
2. Navigate to Add Transaction
3. Add new income transaction: $1000
4. Navigate back to Dashboard
5. Observe updated values

**Expected Result:**
- Income card increases by $1000
- Balance card increases by $1000
- Expenses card remains unchanged
- Charts update to include new transaction
- Recent transactions widget shows new transaction
- Updates are immediate (no refresh needed)

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

### Category 3: Functional Tests - Filtering & Navigation (TC-021 to TC-030)

#### TC-021: Navigate Between Dashboard and Transactions Pages

**Feature:** Navigation
**Description:** Verify navigation between main pages works correctly
**Priority:** P0

**Steps:**
1. Start on Dashboard page
2. Click "Transactions" navigation link
3. Observe page changes to Transactions list
4. Click "Dashboard" navigation link
5. Observe page changes back to Dashboard

**Expected Result:**
- Navigation links clearly visible in header/sidebar
- Clicking link updates page content
- URL updates (e.g., /dashboard → /transactions)
- Page transition is smooth (no flash of content)
- Navigation state persists across reloads

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-022: Browser Back/Forward Buttons Work Correctly

**Feature:** Navigation
**Description:** Verify browser back/forward buttons navigate correctly
**Priority:** P1

**Steps:**
1. Navigate: Dashboard → Transactions → Add Transaction
2. Click browser back button
3. Observe navigation to Transactions page
4. Click browser back button again
5. Observe navigation to Dashboard page
6. Click browser forward button
7. Observe navigation to Transactions page

**Expected Result:**
- Back button navigates to previous page in history
- Forward button navigates to next page in history
- Page state is preserved correctly
- URL updates match navigation
- No broken states or errors

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-023: Active Page Highlighted in Navigation

**Feature:** Navigation
**Description:** Verify current page is highlighted in navigation menu
**Priority:** P1

**Steps:**
1. Navigate to Dashboard page
2. Observe Dashboard link is highlighted/active
3. Navigate to Transactions page
4. Observe Transactions link is highlighted/active
5. Dashboard link no longer highlighted

**Expected Result:**
- Active page link has visual indicator (different color, underline, background)
- Only one link highlighted at a time
- Indicator updates immediately on navigation
- Visual distinction is clear and accessible

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-024: Filter Transactions by Date Range

**Feature:** Transaction Filtering
**Description:** Verify date range filter correctly filters transactions
**Priority:** P0

**Steps:**
1. Add transactions with various dates spanning 3 months
2. Navigate to Transactions page
3. Open filter panel
4. Set date range: 2025-11-01 to 2025-11-30
5. Apply filter

**Expected Result:**
- Filter panel has date range inputs (start date, end date)
- Only transactions within date range display
- Transaction count updates
- Empty state displays if no matches
- Filter can be cleared

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-025: Filter Transactions by Category

**Feature:** Transaction Filtering
**Description:** Verify category filter correctly filters transactions
**Priority:** P0

**Steps:**
1. Add transactions with various categories (Salary, Rent, Food, Transportation)
2. Navigate to Transactions page
3. Open filter panel
4. Select "Food" category
5. Apply filter

**Expected Result:**
- Filter panel has category dropdown/select
- Only transactions with "Food" category display
- Other categories hidden
- Transaction count updates
- Filter can be cleared

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-026: Filter Transactions by Type (Income/Expense)

**Feature:** Transaction Filtering
**Description:** Verify type filter correctly filters transactions
**Priority:** P0

**Steps:**
1. Add both income and expense transactions
2. Navigate to Transactions page
3. Open filter panel
4. Select type: "Income"
5. Apply filter
6. Observe only income transactions display
7. Change filter to "Expense"
8. Observe only expense transactions display

**Expected Result:**
- Filter panel has type selector (Income/Expense/All)
- Only selected type displays
- Transaction count updates
- Filter can be cleared to show all types

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-027: Search Transactions by Description

**Feature:** Transaction Filtering
**Description:** Verify search box filters transactions by description text
**Priority:** P1

**Steps:**
1. Add transactions with various descriptions
2. Navigate to Transactions page
3. Locate search input box
4. Type "Rent" in search box
5. Observe filtering

**Expected Result:**
- Search box is clearly visible
- Typing updates results in real-time (or on Enter)
- Only transactions with "Rent" in description display
- Search is case-insensitive
- Search can be cleared with X button or backspace

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-028: Clear All Filters

**Feature:** Transaction Filtering
**Description:** Verify "Clear Filters" button resets all filters
**Priority:** P1

**Steps:**
1. Navigate to Transactions page
2. Apply multiple filters: Date range, Category, Type, Search
3. Observe filtered results
4. Click "Clear Filters" or "Reset" button

**Expected Result:**
- Clear button is visible when filters active
- Clicking clear resets all filters to default
- All transactions display again
- Filter inputs reset to empty/default state
- Transaction count updates

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-029: Filter State Persists on Navigation

**Feature:** Transaction Filtering
**Description:** Verify filter state persists when navigating away and back
**Priority:** P2

**Steps:**
1. Navigate to Transactions page
2. Apply category filter: "Food"
3. Navigate to Dashboard page
4. Navigate back to Transactions page
5. Observe filter state

**Expected Result:**
- Filter remains active after navigation
- Filtered results still display
- Filter panel shows active filters
- Filter state persists for session (optional: localStorage)

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-030: Empty Filtered Results Show Appropriate Message

**Feature:** Transaction Filtering
**Description:** Verify empty state displays when no transactions match filters
**Priority:** P1

**Steps:**
1. Navigate to Transactions page
2. Apply filter that returns no matches (e.g., category that doesn't exist)
3. Observe empty state

**Expected Result:**
- Empty state message displays (e.g., "No transactions match your filters")
- Message includes helpful guidance ("Try adjusting filters")
- "Clear Filters" button is prominent
- No error messages or broken UI

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

### Category 4: Non-Functional Tests - Responsive Design (TC-031 to TC-040)

#### TC-031: Test Mobile Layout (320px, 375px, 414px widths)

**Feature:** Responsive Design
**Description:** Verify application layouts adapt correctly for mobile screen sizes
**Priority:** P0

**Steps:**
1. Open application in Chrome DevTools
2. Enable device toolbar (responsive mode)
3. Test widths: 320px, 375px, 414px
4. Navigate through all pages (Dashboard, Transactions, Add/Edit forms)

**Expected Result:**
- All content fits within viewport width
- No horizontal scrolling
- Text is readable (minimum 14px font size)
- Touch targets are at least 44x44px
- Forms stack vertically
- Charts are readable and interactive

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-032: Test Tablet Layout (768px, 1024px widths)

**Feature:** Responsive Design
**Description:** Verify application layouts adapt correctly for tablet screen sizes
**Priority:** P0

**Steps:**
1. Open application in Chrome DevTools
2. Test widths: 768px, 1024px
3. Navigate through all pages

**Expected Result:**
- Layout adapts between mobile and desktop styles
- Multi-column layouts where appropriate
- Navigation is accessible (horizontal or hamburger)
- Charts and tables are readable
- No wasted space or overcrowded content

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-033: Test Desktop Layout (1280px, 1920px widths)

**Feature:** Responsive Design
**Description:** Verify application layouts utilize desktop screen space effectively
**Priority:** P0

**Steps:**
1. Open application in browser
2. Test widths: 1280px, 1920px
3. Navigate through all pages

**Expected Result:**
- Full horizontal navigation visible
- Multi-column layouts for dashboard
- Charts are large and readable
- Content is well-spaced and organized
- Maximum width constraint prevents excessive stretching

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-034: Verify Hamburger Menu on Mobile

**Feature:** Responsive Design
**Description:** Verify hamburger menu displays and functions correctly on mobile
**Priority:** P0

**Steps:**
1. Open application in mobile view (≤640px)
2. Locate hamburger menu icon (three lines)
3. Click hamburger icon
4. Observe navigation menu opens
5. Click a navigation link
6. Observe menu closes and navigates

**Expected Result:**
- Hamburger icon visible on mobile
- Tapping icon opens slide-out menu
- Menu contains all navigation links
- Links are tappable (44x44px minimum)
- Menu closes after selection or outside tap
- Animation is smooth

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-035: Test Touch Interactions (Tap, Swipe) on Mobile

**Feature:** Responsive Design
**Description:** Verify touch interactions work smoothly on mobile devices
**Priority:** P1

**Steps:**
1. Test on actual mobile device (or browser touch emulation)
2. Test tapping buttons, links, form inputs
3. Test swiping/scrolling lists
4. Test chart interactions

**Expected Result:**
- All interactive elements respond to tap
- No double-tap zoom on buttons
- Scroll is smooth and natural
- Touch targets are adequately sized
- No accidental taps on nearby elements

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-036: Verify Charts Are Readable on Mobile

**Feature:** Responsive Design
**Description:** Verify charts scale appropriately and remain readable on mobile
**Priority:** P0

**Steps:**
1. Open Dashboard on mobile device (≤767px)
2. Observe pie chart and trend chart
3. Test chart interactions (tap slices, view tooltips)

**Expected Result:**
- Charts scale to fit mobile screen
- Text labels are readable (not overlapping)
- Legend is accessible
- Tooltips display on tap
- Charts don't cause horizontal scrolling

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-037: Test Form Inputs on Mobile (Keyboard Types)

**Feature:** Responsive Design
**Description:** Verify form inputs trigger appropriate mobile keyboards
**Priority:** P1

**Steps:**
1. Open Add Transaction form on mobile device
2. Tap amount input field
3. Observe keyboard type
4. Tap date input field
5. Observe date picker
6. Tap description input field
7. Observe keyboard type

**Expected Result:**
- Amount field triggers numeric keyboard
- Date field triggers date picker
- Description field triggers standard keyboard
- Select fields trigger native dropdown picker
- Form fields are adequately sized for touch

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-038: Verify No Horizontal Scrolling on Any Screen

**Feature:** Responsive Design
**Description:** Verify no horizontal scrolling occurs on any device size
**Priority:** P0

**Steps:**
1. Test all pages on widths: 320px, 768px, 1024px, 1920px
2. Attempt to scroll horizontally
3. Check for content overflow

**Expected Result:**
- No horizontal scrollbar appears
- All content fits within viewport width
- No elements extend beyond screen
- Text wraps appropriately
- Tables/charts are responsive or scrollable within container

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-039: Test Orientation Change (Portrait/Landscape)

**Feature:** Responsive Design
**Description:** Verify application adapts correctly to orientation changes
**Priority:** P2

**Steps:**
1. Open application on mobile device in portrait mode
2. Rotate device to landscape mode
3. Observe layout adaptation
4. Rotate back to portrait
5. Observe layout returns to portrait layout

**Expected Result:**
- Layout adapts immediately to orientation change
- No layout breaks or overlapping content
- Charts and tables adjust appropriately
- Navigation remains accessible
- Content remains readable in both orientations

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-040: Verify Tap Target Sizes (≥44x44px)

**Feature:** Responsive Design
**Description:** Verify all interactive elements meet minimum tap target size
**Priority:** P1

**Steps:**
1. Open application on mobile device
2. Use browser DevTools to inspect button sizes
3. Test tapping buttons, links, icons
4. Measure tap targets for: Navigation links, Form buttons, Edit/Delete icons, Filter controls

**Expected Result:**
- All interactive elements are at least 44x44px
- Adequate spacing between tap targets
- No accidental taps on wrong elements
- Buttons and links are easy to tap accurately

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

### Category 5: Edge Case Tests (TC-041 to TC-050)

#### TC-041: Empty State - No Transactions

**Feature:** Edge Cases
**Description:** Verify application handles empty state gracefully
**Priority:** P0

**Steps:**
1. Clear all transactions (fresh LocalStorage)
2. Navigate to Dashboard
3. Navigate to Transactions page

**Expected Result:**
- Dashboard shows $0.00 for all summary cards
- Charts display empty state message (e.g., "No data to display")
- Transactions page shows empty state with "Add Transaction" CTA
- No errors in console
- Application remains functional

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-042: Single Transaction Behavior

**Feature:** Edge Cases
**Description:** Verify application handles single transaction correctly
**Priority:** P2

**Steps:**
1. Clear all transactions
2. Add one transaction (income $5000)
3. Navigate to Dashboard
4. View charts

**Expected Result:**
- Dashboard summary shows correct values
- Pie chart shows single slice (100%)
- Trend chart shows single data point
- No division by zero errors
- Percentage calculations correct

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-043: Large Dataset - 100+ Transactions

**Feature:** Edge Cases
**Description:** Verify application performance with large dataset
**Priority:** P1

**Steps:**
1. Add 100+ transactions (seed script or manual)
2. Navigate to Dashboard
3. Navigate to Transactions list
4. Test filtering and sorting
5. Measure load times and responsiveness

**Expected Result:**
- Dashboard loads within performance target (<3s)
- Charts render within 2 seconds
- Transaction list displays correctly (paginated or virtualized)
- Filtering responds within 500ms
- No performance degradation
- No browser crashes or freezing

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-044: Invalid Form Inputs (Negative Amount, Future Date)

**Feature:** Edge Cases
**Description:** Verify form validation prevents invalid inputs
**Priority:** P0

**Steps:**
1. Navigate to Add Transaction form
2. Test invalid inputs:
   - Negative amount: -500
   - Zero amount: 0
   - Future date: 2026-01-01
   - Empty required fields
3. Attempt to submit

**Expected Result:**
- Form displays validation error messages
- Submit button disabled until valid
- Error messages are clear and helpful
- Form does not submit with invalid data
- No transactions created with invalid data

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-045: LocalStorage Quota Exceeded (Fill to 5MB)

**Feature:** Edge Cases
**Description:** Verify application handles LocalStorage quota gracefully
**Priority:** P2

**Steps:**
1. Fill LocalStorage to near quota (add many large transactions)
2. Attempt to add more transactions
3. Observe error handling

**Expected Result:**
- Application detects quota exceeded error
- User-friendly error message displays
- Error logged to console
- Application doesn't crash
- User can delete transactions to free space

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-046: Corrupted LocalStorage Data

**Feature:** Edge Cases
**Description:** Verify application handles corrupted LocalStorage gracefully
**Priority:** P1

**Steps:**
1. Open browser DevTools
2. Manually corrupt LocalStorage data (invalid JSON)
3. Refresh application
4. Observe error handling

**Expected Result:**
- Application detects corruption
- Error boundary catches error
- User-friendly message displays
- Option to "Reset Data" or "Clear Storage"
- Application doesn't crash or show white screen

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-047: Very Long Transaction Description (200+ chars)

**Feature:** Edge Cases
**Description:** Verify application handles long descriptions without breaking layout
**Priority:** P2

**Steps:**
1. Add transaction with 200+ character description
2. View in transaction list
3. View in dashboard recent transactions widget
4. View in edit form

**Expected Result:**
- Description doesn't break layout
- Text truncates or wraps appropriately
- Full description visible in edit form
- Tooltip or expand option shows full text if truncated

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-048: Very Large Transaction Amount ($1,000,000+)

**Feature:** Edge Cases
**Description:** Verify application handles very large amounts correctly
**Priority:** P2

**Steps:**
1. Add transaction with amount $1,000,000
2. View in transaction list
3. View in dashboard summary cards
4. Verify formatting and calculations

**Expected Result:**
- Amount displays correctly formatted ($1,000,000.00)
- No number overflow errors
- Calculations remain accurate
- Charts display correctly (not breaking layout)
- Amount fits within UI components

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-049: Date Edge Cases (Leap Year, Year Boundaries)

**Feature:** Edge Cases
**Description:** Verify date handling for edge cases
**Priority:** P2

**Steps:**
1. Add transaction with date: February 29, 2024 (leap year)
2. Add transaction with date: December 31, 2024
3. Add transaction with date: January 1, 2025
4. Test period filtering across year boundary

**Expected Result:**
- Leap year dates accepted and stored correctly
- Year boundary transactions filtered correctly
- Date calculations accurate across year changes
- No date parsing errors

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

#### TC-050: Rapid Successive Actions (Quick Add/Edit/Delete)

**Feature:** Edge Cases
**Description:** Verify application handles rapid user actions without errors
**Priority:** P2

**Steps:**
1. Rapidly add 5 transactions in succession
2. Rapidly edit multiple transactions
3. Rapidly delete multiple transactions
4. Check for race conditions or errors

**Expected Result:**
- All actions complete successfully
- No duplicate transactions created
- State updates correctly
- No console errors
- Dashboard calculates correctly after all actions

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

**Notes:**

**Bug Reference:** *(If failed)*

---

## Performance Testing

### Performance Test 1: Initial Page Load Time (Lighthouse)

**Objective:** Verify initial page load meets <3 seconds (3G connection) requirement

**Steps:**
1. Open Chrome DevTools
2. Navigate to Lighthouse tab
3. Select "Performance" audit
4. Set throttling to "Simulated 3G"
5. Run audit

**Expected Result:**
- Page load completes in <3 seconds
- Lighthouse performance score ≥90
- First Contentful Paint (FCP) <1.5s
- Largest Contentful Paint (LCP) <2.5s
- Total Blocking Time (TBT) <300ms

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail

**Notes:**

---

### Performance Test 2: UI Responsiveness (Interaction Timing)

**Objective:** Verify UI interactions respond within <100ms

**Steps:**
1. Open Chrome DevTools Performance tab
2. Start recording
3. Perform user actions: Click button, Select dropdown, Type in input
4. Stop recording
5. Measure time from interaction to visual feedback

**Expected Result:**
- Button clicks respond <100ms
- Form inputs respond <100ms
- Navigation transitions <100ms
- No janky animations or layout shifts

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail

**Notes:**

---

### Performance Test 3: Chart Rendering Time

**Objective:** Verify charts render within <2 seconds

**Steps:**
1. Open Chrome DevTools Performance tab
2. Navigate to Dashboard
3. Measure time from page load to chart fully rendered

**Expected Result:**
- Pie chart renders <2 seconds
- Trend chart renders <2 seconds
- Charts are interactive immediately after render
- No layout shifts during chart render

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail

**Notes:**

---

### Performance Test 4: Filter Update Performance

**Objective:** Verify filter updates complete within <500ms

**Steps:**
1. Load transaction list with 50+ transactions
2. Open Chrome DevTools Performance tab
3. Apply category filter
4. Measure time from filter selection to filtered results displayed

**Expected Result:**
- Filter update completes <500ms
- Results update is smooth (no jarring transitions)
- Transaction count updates
- No performance degradation with multiple filters

**Actual Result:** *(To be filled during execution)*

**Status:** [ ] Pass / [ ] Fail

**Notes:**

---

## Cross-Browser Testing

### Browser Compatibility Matrix

Test all critical flows on each browser:

| Test Scenario              | Chrome 131+ Win | Chrome 131+ Mac | Firefox 133+ Win | Firefox 133+ Mac | Safari 18+ Mac | Chrome Android | Safari iOS |
|---------------------------|-----------------|-----------------|------------------|------------------|----------------|----------------|------------|
| Add Transaction           | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Edit Transaction          | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Delete Transaction        | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Dashboard Summary         | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Charts Render             | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Navigation                | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Filtering                 | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| LocalStorage Persistence  | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Responsive Design         | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |
| Console Errors (None)     | [ ]             | [ ]             | [ ]              | [ ]              | [ ]            | [ ]            | [ ]        |

**Notes:**

---

## Data Integrity Testing

### Data Integrity Test 1: Persistence Across Refresh

**Steps:**
1. Add new transaction
2. Refresh browser (F5)
3. Verify transaction persists

**Expected Result:** Transaction data intact after refresh

**Actual Result:** *(To be filled)*

**Status:** [ ] Pass / [ ] Fail

---

### Data Integrity Test 2: Persistence Across Browser Close/Reopen

**Steps:**
1. Add new transaction
2. Close browser completely
3. Reopen browser and navigate to application
4. Verify transaction persists

**Expected Result:** Transaction data intact after browser close/reopen

**Actual Result:** *(To be filled)*

**Status:** [ ] Pass / [ ] Fail

---

### Data Integrity Test 3: Edit Changes Persist

**Steps:**
1. Edit existing transaction
2. Refresh browser
3. Verify changes saved

**Expected Result:** Edited values persist after refresh

**Actual Result:** *(To be filled)*

**Status:** [ ] Pass / [ ] Fail

---

### Data Integrity Test 4: Delete Persists

**Steps:**
1. Delete transaction
2. Refresh browser
3. Verify transaction remains deleted

**Expected Result:** Deleted transaction does not reappear

**Actual Result:** *(To be filled)*

**Status:** [ ] Pass / [ ] Fail

---

### Data Integrity Test 5: Multiple Transactions Saved Correctly

**Steps:**
1. Add 50 transactions rapidly
2. Refresh browser
3. Verify all 50 transactions present

**Expected Result:** All transactions saved and retrieved correctly

**Actual Result:** *(To be filled)*

**Status:** [ ] Pass / [ ] Fail

---

### Data Integrity Test 6: Multiple Tabs Simultaneously

**Steps:**
1. Open application in two browser tabs
2. Add transaction in Tab 1
3. Refresh Tab 2
4. Verify transaction appears in Tab 2

**Expected Result:** Data syncs across tabs (via storage event or refresh)

**Actual Result:** *(To be filled)*

**Status:** [ ] Pass / [ ] Fail

**Notes:** Application may not have real-time sync between tabs, but refresh should show latest data

---

## Test Execution Log

**Test Execution Start Date:** *(To be filled)*
**Test Execution End Date:** *(To be filled)*
**Tester:** *(To be filled)*
**Build Version:** *(To be filled)*

### Summary

- **Total Test Cases:** 50 functional + 4 performance + 10 cross-browser scenarios + 6 data integrity = 70 total
- **Passed:** *(To be filled)*
- **Failed:** *(To be filled)*
- **Blocked:** *(To be filled)*
- **Not Executed:** *(To be filled)*

### Bugs Found

*(Link to bug-log.md when created)*

---

## Appendix

### Test Data Templates

**Sample Income Transaction:**
```
Type: Income
Amount: 5000
Category: Salary
Description: Monthly Salary - November 2025
Date: 2025-11-01
```

**Sample Expense Transaction:**
```
Type: Expense
Amount: 1500
Category: Rent
Description: November Rent Payment
Date: 2025-11-01
```

### Test Environment Setup

**Production Build Commands:**
```bash
# Build production version
npm run build

# Preview production build
npm run preview

# Application will be available at: http://localhost:4173
```

**Clear LocalStorage:**
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

**Seed Test Data:**
```javascript
// Add multiple transactions for testing (paste in console)
// Script to be created if needed
```

---

**Document End**
