import React from "react";
import { useState, useEffect } from 'react';

function Header({ searchTerm, onSearch }) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearchTerm]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <header className="header">
      <h1 className="page-title">Sales Management System</h1>
      
      <div className="header-search">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍︎</span>
          <input
            type="text"
            placeholder="Name, Phone no."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;