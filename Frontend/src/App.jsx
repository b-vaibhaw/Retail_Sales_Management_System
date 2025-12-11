import React from "react";
import { useState, useEffect } from 'react';
import { getTransactions, getFilterOptions } from './services/api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import StatsCards from './components/StatsCards';
import TransactionTable from './components/TransactionTable';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    category: [],
    tags: [],
    paymentMethod: [],
    minAge: '',
    maxAge: '',
    startDate: '',
    endDate: ''
  });
  
  // Sorting state
  const [sortBy, setSortBy] = useState('customerName');
  const [order, setOrder] = useState('asc');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Stats
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0
  });

  // UI view state controlled by Sidebar
  const [activeView, setActiveView] = useState('dashboard');

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch transactions when any parameter changes
  useEffect(() => {
    fetchTransactions();
  }, [searchTerm, filters, sortBy, order, page]);

  const fetchFilterOptions = async () => {
    try {
      const result = await getFilterOptions();
      if (result.success) {
        setFilterOptions(result.data);
      } else {
        console.warn('Failed to fetch filter options:', result.message);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      const errorMsg = error.response?.status === 0 
        ? 'Cannot connect to backend server'
        : error.response?.data?.message || error.message;
      console.warn('Filter options error:', errorMsg);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        search: searchTerm,
        region: filters.region.join(','),
        gender: filters.gender.join(','),
        category: filters.category.join(','),
        tags: filters.tags.join(','),
        paymentMethod: filters.paymentMethod.join(','),
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy,
        order,
        page,
        limit: 10
      };
      
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const result = await getTransactions(params);
      
      if (result.success) {
        setTransactions(result.data);
        setPagination(result.pagination);
        
        // Calculate stats
        const totalUnits = result.data.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
        const totalAmount = result.data.reduce((sum, item) => sum + (parseFloat(item.finalAmount) || 0), 0);
        const totalDiscount = result.data.reduce((sum, item) => sum + (parseFloat(item.discountPercentage) || 0), 0);
        
        setStats({
          totalUnits,
          totalAmount,
          totalDiscount
        });
      } else {
        setError('Failed to fetch transactions: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      const errorMsg = error.response?.status === 0 
        ? 'Cannot connect to backend. Make sure the backend server is running on http://localhost:5000'
        : error.response?.data?.message || 'Failed to fetch transactions';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); // Reset to page 1 when search changes
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to page 1 when filters change
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setOrder('asc');
    }
    setPage(1); // Reset to page 1 when sort changes
  };

  const handleClearFilters = () => {
    setFilters({
      region: [],
      gender: [],
      category: [],
      tags: [],
      paymentMethod: [],
      minAge: '',
      maxAge: '',
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
    setPage(1);
  };

  const handleNavigate = (viewKey) => {
    setActiveView(viewKey);
  };

  const renderMainContent = () => {
    // Transactions/dashboard view
    if (activeView === 'dashboard') {
      return (
        <>
          <Header 
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />

          <div className="content-area">
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={filterOptions}
              sortBy={sortBy}
              order={order}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
            />

            <StatsCards stats={stats} />

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions found</p>
                <button onClick={handleClearFilters} className="btn-clear">
                  Clear Filters
                </button>
              </div>
            ) : (
                <TransactionTable 
                  transactions={transactions} 
                  pagination={pagination}
                  currentPage={page}
                  onPageChange={setPage}
                />
            )}
          </div>
        </>
      );
    }

    // Other views: simple placeholders for now
    if (activeView === 'nexus') return (
      <div className="main-content">
        <Header searchTerm={searchTerm} onSearch={handleSearch} />
        <div className="content-area"><h2>Nexus</h2><p>Placeholder content for Nexus.</p></div>
      </div>
    );

    if (activeView === 'intake') return (
      <div className="main-content">
        <Header searchTerm={searchTerm} onSearch={handleSearch} />
        <div className="content-area"><h2>Intake</h2><p>Placeholder content for Intake.</p></div>
      </div>
    );

    if (activeView.startsWith('services')) return (
      <div className="main-content">
        <Header searchTerm={searchTerm} onSearch={handleSearch} />
        <div className="content-area"><h2>Services</h2><p>View: {activeView.split('.')[1]}</p></div>
      </div>
    );

    if (activeView.startsWith('invoices')) return (
      <div className="main-content">
        <Header searchTerm={searchTerm} onSearch={handleSearch} />
        <div className="content-area"><h2>Invoices</h2><p>View: {activeView.split('.')[1]}</p></div>
      </div>
    );

    // Fallback: show dashboard
    return renderMainContent('dashboard');
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      
      <div className="main-content">
        {renderMainContent()}
      </div>
    </div>
  );
}

export default App;