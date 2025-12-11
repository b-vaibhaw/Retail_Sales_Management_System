import React from "react";
import { useState, useEffect } from 'react';

function SearchBar({ searchTerm, onSearch }) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [localSearchTerm]);

  // Sync with parent when searchTerm changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by customer name or phone number..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="search-input"
        />
        {localSearchTerm && (
          <button 
            onClick={handleClear} 
            className="clear-btn"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {localSearchTerm && (
        <p className="search-hint">
          Searching for: <strong>{localSearchTerm}</strong>
        </p>
      )}
    </div>
  );
}

export default SearchBar;