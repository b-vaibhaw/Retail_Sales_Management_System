import React from "react";
import { useState } from 'react';

function FilterBar({ filters, onFilterChange, filterOptions = {}, sortBy, order, onSortChange, onClearFilters }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleMultiSelect = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(key, newValues);
  };

  const FilterDropdown = ({ label, filterKey, options, icon = '▼' }) => {
    const selectedCount = filters[filterKey]?.length || 0;
    
    return (
      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown(filterKey)}
        >
          {label}
          {selectedCount > 0 && <span className="filter-badge">{selectedCount}</span>}
          <span className="dropdown-icon">{icon}</span>
        </button>
        
        {openDropdown === filterKey && (
          <div className="dropdown-menu">
            {options?.map(option => (
              <label key={option} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={filters[filterKey]?.includes(option) || false}
                  onChange={() => handleMultiSelect(filterKey, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AgeRangeDropdown = () => {
    return (
      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('age')}
        >
          Age Range
          {(filters.minAge || filters.maxAge) && <span className="filter-badge">1</span>}
          <span className="dropdown-icon">▼</span>
        </button>
        
        {openDropdown === 'age' && (
          <div className="dropdown-menu age-dropdown">
            <div className="age-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minAge}
                onChange={(e) => onFilterChange('minAge', e.target.value)}
                className="age-input"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAge}
                onChange={(e) => onFilterChange('maxAge', e.target.value)}
                className="age-input"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const DateRangeDropdown = () => {
    return (
      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('date')}
        >
          Date
          {(filters.startDate || filters.endDate) && <span className="filter-badge">1</span>}
          <span className="dropdown-icon">▼</span>
        </button>
        
        {openDropdown === 'date' && (
          <div className="dropdown-menu date-dropdown">
            <div className="date-inputs">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
                className="date-input"
              />
              <span>to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const SortDropdown = () => {
    const sortLabel = sortBy === 'customerName' 
      ? `Customer Name (${order === 'asc' ? 'A-Z' : 'Z-A'})`
      : sortBy === 'date'
      ? `Date (${order === 'desc' ? 'Newest' : 'Oldest'})`
      : `Quantity (${order === 'desc' ? 'High-Low' : 'Low-High'})`;

    return (
      <div className="filter-dropdown sort-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('sort')}
        >
          Sort by: {sortLabel}
          <span className="dropdown-icon">▼</span>
        </button>
        
        {openDropdown === 'sort' && (
          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={() => { onSortChange('customerName'); setOpenDropdown(null); }}
            >
              Customer Name (A-Z)
            </button>
            <button 
              className="dropdown-item"
              onClick={() => { onSortChange('date'); setOpenDropdown(null); }}
            >
              Date (Newest First)
            </button>
            <button 
              className="dropdown-item"
              onClick={() => { onSortChange('quantity'); setOpenDropdown(null); }}
            >
              Quantity
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <button className="refresh-btn" onClick={() => window.location.reload()}>
          ⟳
        </button>
        
        <FilterDropdown 
          label="Customer Region" 
          filterKey="region" 
          options={filterOptions.regions}
        />
        
        <FilterDropdown 
          label="Gender" 
          filterKey="gender" 
          options={filterOptions.genders}
        />
        
        <AgeRangeDropdown />
        
        <FilterDropdown 
          label="Product Category" 
          filterKey="category" 
          options={filterOptions.categories}
        />
        
        <FilterDropdown 
          label="Payment Method" 
          filterKey="paymentMethod" 
          options={filterOptions.paymentMethods}
        />
        
        <DateRangeDropdown />
        
        <SortDropdown />
      </div>
    </div>
  );
}

export default FilterBar;