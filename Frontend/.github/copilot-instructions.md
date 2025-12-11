# Copilot Instructions - TruEstate Retail Sales Frontend

## Project Overview

This is a React 18 frontend for a retail sales management system built with **Vite** (build tool) and **Axios** for API communication. The application enables search, filtering, sorting, and pagination of transaction data from a backend API.

**Key Tech Stack:** React 18 + Vite + Axios  
**Backend API:** `http://localhost:5000/api` (configurable via `VITE_API_URL` env var)

## Architecture & Data Flow

### App Component (`src/App.jsx`)
- **Central orchestrator** managing all state: search, filters, sorting, pagination, and API communication
- Implements **two-tier data fetching**:
  1. `fetchFilterOptions()` - runs once on mount to populate filter UI with available options
  2. `fetchTransactions()` - triggered by `useEffect` when any of these change: `searchTerm`, `filters`, `sortBy`, `order`, `page`
- **Key behavior:** Resets pagination to page 1 when search/filters/sort change (prevents invalid states)
- State structure in `App.jsx`:
  - `filters` object with keys: `region`, `gender`, `category`, `paymentMethod`, `minAge`, `maxAge`, `startDate`, `endDate`
  - Removes empty params before API call (important for query string cleanliness)

### Component Hierarchy
```
App.jsx (state management & data fetching)
├── Stats (displays total records, current page, total pages)
├── SearchBar (debounced search with 300ms delay)
├── FilterPanel (checkboxes for multi-select, range inputs for age/dates)
├── SortingControls (sort field + ascending/descending toggle)
├── TransactionTable (data display with formatters for currency/dates)
└── Pagination (smart page number generation, handles edge cases)
```

### Component-Specific Patterns

- **SearchBar:** Uses local state with debouncing to avoid excessive API calls. Syncs with parent state for external resets.
- **FilterPanel:** Multi-select checkboxes (`handleMultiSelectChange` toggles values in arrays). Shows active filter count.
- **TransactionTable:** Utility functions for formatting (`formatCurrency`, `formatDate`, `getStatusColor`). Accepts transaction array and maps to table rows.
- **SortingControls:** Sort options include `date`, `quantity`, `customerName`. Order shows contextual labels (e.g., "Newest First" for date desc).
- **Pagination:** Smart algorithm generates page numbers showing first, last, and context around current (max 5 pages visible). Includes `hasNext`/`hasPrev` flags.

## API Service (`src/services/api.js`)

**Key patterns:**
- Axios instance with **interceptors** for logging requests and errors
- Base URL from `import.meta.env.VITE_API_URL` or defaults to `http://localhost:5000/api`
- **Three exported functions:**
  - `getTransactions(params)` - accepts search, filter, sort, pagination params
  - `getFilterOptions()` - returns available regions, genders, categories, payment methods
  - `getStats(params)` - for statistics (currently unused but available)
- All functions return the raw response (expect `{ success, data, pagination }` structure from backend)

**Important:** Backend must be running on port 5000. If not available, App shows error: "Failed to fetch transactions. Please check if the backend is running."

## Build & Development Workflow

```bash
npm run dev      # Start dev server on port 5173 (auto-opens browser)
npm run build    # Vite build to `dist/` directory
npm run preview  # Preview production build locally
```

**Config (`vite_config.js`):**
- Dev server on port 5173 with auto-open
- Sourcemaps disabled in production
- React plugin enabled for JSX

## Critical Conventions

1. **Page Reset Pattern:** Any change to search/filters/sort must reset `setPage(1)` to prevent pagination mismatches
2. **Empty Param Removal:** Before API calls, filter out falsy values from params object (avoids `?key=` in URL)
3. **Error States:** App displays user-friendly messages for loading, errors, and empty results. Always try to recover gracefully
4. **Debouncing Search:** 300ms delay prevents API thrashing during fast typing
5. **Array Filters:** Multi-select filters (region, gender, etc.) are stored as arrays, joined with commas before API call

## Key Files & When to Edit

- **`src/App.jsx`** - Add/modify state, change API fetch logic, add new filter types
- **`src/services/api.js`** - Change API endpoint, add new API functions, modify request/response handling
- **`src/components/*`** - Modify UI, add new fields, change formatting logic
- **`src/App.css`** - Styling (flexbox layout with sidebar + main content)
- **`vite_config.js`** - Dev server config, build output settings
- **`package.json`** - Dependencies (React, Axios, Vite)

## Common Tasks & Patterns

**Adding a new filter:**
1. Add field to `filters` state object in App.jsx
2. Add checkbox group or input in FilterPanel.jsx
3. Include field in API params in `fetchTransactions`
4. Ensure it's included in `handleClearFilters`

**Changing API response handling:**
- Check `api.js` interceptors if you need to transform response globally
- App.jsx expects `{ success: bool, data: array, pagination: object }` structure

**Debugging API calls:**
- Axios interceptor logs all requests to console
- Check Network tab to verify params sent
- Ensure backend is running on port 5000
