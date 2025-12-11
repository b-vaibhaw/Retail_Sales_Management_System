import React from "react";
function Stats({ total, currentPage, totalPages }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-icon">📊</span>
        <div>
          <p className="stat-value">{total}</p>
          <p className="stat-label">Total Results</p>
        </div>
      </div>
      
      <div className="stat-card">
        <span className="stat-icon">📄</span>
        <div>
          <p className="stat-value">{currentPage} / {totalPages}</p>
          <p className="stat-label">Current Page</p>
        </div>
      </div>
      
      <div className="stat-card">
        <span className="stat-icon">📋</span>
        <div>
          <p className="stat-value">{Math.min(10, total)}</p>
          <p className="stat-label">Items Per Page</p>
        </div>
      </div>
    </div>
  );
}

export default Stats;