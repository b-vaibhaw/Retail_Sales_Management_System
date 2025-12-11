# Retail Sales Management System - Architecture

## Overview
This document outlines the architecture of the Retail Sales Management System, a full-stack web application for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Databases**: SQLite (default) and MySQL (alternative)
- **Additional Libraries**: CORS, dotenv, sqlite3, mysql2

### Components
- **Server**: Express.js server handling HTTP requests and responses
- **Controllers**: Handle request validation, business logic, and response formatting
- **Services**: Database operations and data processing logic
- **Routes**: Define API endpoints and route handlers
- **Utilities**: Data loading and parsing utilities

### API Endpoints
- `GET /api/transactions` - Retrieve transactions with filtering, sorting, and pagination
- `GET /api/filter-options` - Get available filter options
- `GET /api/stats` - Retrieve statistics and summaries
- `GET /health` - Health check endpoint

### Database Layer
- **SQLite Service**: File-based database for local development
- **MySQL Service**: Relational database for production deployments
- **Migration Scripts**: CSV to database migration utilities

## Frontend Architecture

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS3

### Components
- **App**: Main application component managing state and routing
- **Sidebar**: Navigation component with menu items
- **Header**: Top navigation with search functionality
- **FilterBar**: Dropdown-based filtering interface
- **TransactionTable**: Data display component with pagination
- **StatsCards**: Statistics display component
- **Pagination**: Page navigation component

### State Management
- **Local State**: React useState hooks for component-level state
- **API State**: Direct API calls for data fetching
- **Search State**: Debounced search with 300ms delay
- **Filter State**: Multi-select filters with real-time updates

## Data Flow

### Request Flow
1. **User Interaction**: User interacts with UI components (search, filters, sort, pagination)
2. **State Update**: Frontend state is updated via React hooks
3. **API Call**: Axios sends HTTP request to backend API endpoints
4. **Request Processing**: Express middleware processes the request
5. **Controller Logic**: Controllers validate and process the request
6. **Service Layer**: Services execute database queries and data processing
7. **Database Query**: Database service performs CRUD operations
8. **Response**: Data is returned through the service-controller-route chain
9. **Frontend Update**: React components update with new data

### Data Processing Pipeline
1. **Search**: Case-insensitive full-text search on customer name and phone
2. **Filtering**: Multi-select filters applied server-side
3. **Sorting**: Server-side sorting by date, quantity, or customer name
4. **Pagination**: Server-side pagination with configurable page size
5. **Statistics**: Aggregated calculations for display

## Folder Structure

```
/
├── Backend/
│   ├── data/
│   │   ├── sales.csv          # Source CSV data
│   │   └── truestate.db       # SQLite database
│   ├── scripts/
│   │   ├── migrateToSQLite.js # SQLite migration script
│   │   ├── migrateToMySQL.js  # MySQL migration script
│   │   └── setupDatabase.js   # Database setup script
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── salesController.js        # SQLite controller
│   │   │   └── salesControllerWithDb.js  # MySQL controller
│   │   ├── routes/
│   │   │   └── salesRoutes.js            # API routes
│   │   ├── services/
│   │   │   ├── sqliteDatabaseService.js # SQLite operations
│   │   │   ├── databaseService.js       # MySQL operations
│   │   │   └── salesService.js          # Business logic
│   │   ├── utils/
│   │   │   └── dataLoader.js            # CSV parsing utilities
│   │   └── index.js                     # Main server file
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx              # Navigation sidebar
│   │   │   ├── Header.jsx               # Top header with search
│   │   │   ├── FilterBar.jsx            # Filter dropdowns
│   │   │   ├── TransactionTable.jsx     # Data table
│   │   │   ├── Pagination.jsx           # Page navigation
│   │   │   ├── StatsCards.jsx           # Statistics display
│   │   │   └── FilterPanel.jsx          # Filter panel
│   │   ├── services/
│   │   │   └── api.js                   # API client
│   │   ├── assets/
│   │   │   └── dashboard.png            # Static assets
│   │   ├── App.jsx                      # Main app component
│   │   ├── App.css                      # Global styles
│   │   └── main.jsx                     # React entry point
│   ├── index.html                       # HTML template
│   ├── vite.config.js                   # Vite configuration
│   └── package.json
├── docs/
│   └── architecture.md                  # This file
└── README.md                            # Project documentation
```

## Module Responsibilities

### Backend Modules

#### Controllers (`/controllers/`)
- **salesController.js**: Handles API requests for SQLite-based operations
- **salesControllerWithDb.js**: Handles API requests for MySQL-based operations
- **Responsibilities**:
  - Request validation and sanitization
  - Error handling and response formatting
  - Database readiness checks
  - Middleware integration

#### Services (`/services/`)
- **sqliteDatabaseService.js**: SQLite database operations
- **databaseService.js**: MySQL database operations
- **salesService.js**: Business logic for data processing
- **Responsibilities**:
  - Database connection management
  - Query execution and result processing
  - Data transformation and aggregation
  - Filter and sort operations

#### Routes (`/routes/`)
- **salesRoutes.js**: API endpoint definitions
- **Responsibilities**:
  - Route configuration
  - Middleware attachment
  - Controller method binding

#### Utilities (`/utils/`)
- **dataLoader.js**: CSV file parsing and loading
- **Responsibilities**:
  - File I/O operations
  - Data format conversion
  - CSV parsing logic

### Frontend Modules

#### Components (`/components/`)
- **App.jsx**: Main application component and state management
- **Sidebar.jsx**: Navigation and view switching
- **Header.jsx**: Search interface
- **FilterBar.jsx**: Filter controls
- **TransactionTable.jsx**: Data display
- **Pagination.jsx**: Page navigation
- **StatsCards.jsx**: Statistics visualization
- **Responsibilities**:
  - UI rendering and user interaction
  - State management for component data
  - Event handling and callbacks
  - Data presentation formatting

#### Services (`/services/`)
- **api.js**: HTTP client for backend communication
- **Responsibilities**:
  - API endpoint configuration
  - Request/response interceptors
  - Error handling for network requests
  - Authentication and headers management

### Database Scripts (`/scripts/`)
- **migrateToSQLite.js**: CSV to SQLite migration
- **migrateToMySQL.js**: CSV to MySQL migration
- **setupDatabase.js**: Database initialization
- **Responsibilities**:
  - Data migration and seeding
  - Database schema creation
  - Bulk data operations

## Deployment Considerations

### Backend Deployment
- Environment variables for database configuration
- CORS configuration for frontend domains
- Health check endpoints for monitoring
- Database connection pooling for performance

### Frontend Deployment
- Static asset optimization via Vite build
- Environment-specific API URL configuration
- CDN deployment for static files
- Service worker for offline capabilities (future enhancement)

### Database Options
- **SQLite**: Suitable for development and small-scale production
- **MySQL**: Recommended for larger deployments requiring concurrent access
- Migration scripts provided for both database types
