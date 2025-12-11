# Retail Sales Management System

## Overview
A full-stack web application for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities. Built with React and Node.js, this system provides an intuitive interface for analyzing sales transactions with real-time data processing.

## Tech Stack
- **Frontend**: React 18, Vite, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## Search Implementation Summary
Implements case-insensitive full-text search on customer name and phone number fields using JavaScript string matching. Search is debounced on the client-side (300ms delay) to reduce unnecessary API calls. The backend filters data in memory using `toLowerCase()` and `includes()` methods for accurate, performant results that work seamlessly alongside active filters and sorting.

## Filter Implementation Summary
Multi-select filtering system supporting 7 filter categories: Customer Region, Gender, Age Range, Product Category, Tags, Payment Method, and Date Range. Filters work independently and in combination through a server-side processing pipeline. Multi-select filters use array inclusion checks, while range filters (age, date) use boundary comparisons. All active filters are preserved when pagination or sorting changes.

## Sorting Implementation Summary
Three sorting options implemented: Date (newest/oldest first), Quantity (high to low/low to high), and Customer Name (A-Z/Z-A). Sorting is performed server-side after search and filter operations using JavaScript's native `sort()` method with custom comparators. Sort state persists across pagination and maintains active search/filter criteria.

## Pagination Implementation Summary
Server-side pagination delivering 10 items per page with intelligent page navigation. Implements slice-based pagination that calculates start/end indices based on current page and limit. Returns pagination metadata including total records, current page, total pages, and hasNext/hasPrev flags. All query parameters (search, filters, sort) are retained when navigating between pages.

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create data folder and add sales.json
mkdir data
# Place your sales.json file in backend/data/

# Start development server
npm run dev

# Backend will run on http://localhost:5000
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# Frontend will run on http://localhost:5173
```

### Production Build
```bash
# Build for production
cd frontend
npm run build

# The dist folder will contain the production build
```
