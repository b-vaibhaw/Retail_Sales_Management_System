import React from "react";
function FilterPanel({ filters, onFilterChange, filterOptions, onClearFilters }) {
  const handleMultiSelectChange = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(key, newValues);
  };

  const activeFilterCount = 
    (filters.region?.length || 0) +
    (filters.gender?.length || 0) +
    (filters.category?.length || 0) +
    (filters.paymentMethod?.length || 0) +
    (filters.minAge ? 1 : 0) +
    (filters.maxAge ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0);

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>🎯 Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={onClearFilters} className="clear-filters-btn">
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Customer Region */}
      <div className="filter-group">
        <label className="filter-label">Customer Region</label>
        <div className="checkbox-group">
          {filterOptions.regions?.map(region => (
            <label key={region} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.region?.includes(region) || false}
                onChange={() => handleMultiSelectChange('region', region)}
              />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="filter-group">
        <label className="filter-label">Gender</label>
        <div className="checkbox-group">
          {filterOptions.genders?.map(gender => (
            <label key={gender} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.gender?.includes(gender) || false}
                onChange={() => handleMultiSelectChange('gender', gender)}
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div className="filter-group">
        <label className="filter-label">Age Range</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minAge}
            onChange={(e) => onFilterChange('minAge', e.target.value)}
            min={filterOptions.ageRange?.min}
            max={filterOptions.ageRange?.max}
            className="range-input"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxAge}
            onChange={(e) => onFilterChange('maxAge', e.target.value)}
            min={filterOptions.ageRange?.min}
            max={filterOptions.ageRange?.max}
            className="range-input"
          />
        </div>
        {filterOptions.ageRange && (
          <p className="hint">Range: {filterOptions.ageRange.min} - {filterOptions.ageRange.max}</p>
        )}
      </div>

      {/* Product Category */}
      <div className="filter-group">
        <label className="filter-label">Product Category</label>
        <div className="checkbox-group">
          {filterOptions.categories?.map(category => (
            <label key={category} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.category?.includes(category) || false}
                onChange={() => handleMultiSelectChange('category', category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="filter-group">
        <label className="filter-label">Payment Method</label>
        <div className="checkbox-group">
          {filterOptions.paymentMethods?.map(method => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.paymentMethod?.includes(method) || false}
                onChange={() => handleMultiSelectChange('paymentMethod', method)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="filter-group">
        <label className="filter-label">Date Range</label>
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
    </div>
  );
}

export default FilterPanel;