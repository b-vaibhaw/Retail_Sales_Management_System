import React from "react";
function StatsCards({ stats = { totalUnits: 0, totalAmount: 0, totalDiscount: 0 } }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">
          Total units sold
          <span className="info-icon">ⓘ</span>
        </div>
        <div className="stat-value">{stats.totalUnits || 0}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">
          Total Amount
          <span className="info-icon">ⓘ</span>
        </div>
        <div className="stat-value">
          ₹{(stats.totalAmount || 0).toFixed(0).toLocaleString('en-IN')} 
          <span className="stat-subtext">({stats.totalUnits || 0} SRs)</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">
          Total Discount
          <span className="info-icon">ⓘ</span>
        </div>
        <div className="stat-value">
          ₹{(stats.totalDiscount || 0).toFixed(0).toLocaleString('en-IN')}
          <span className="stat-subtext">({stats.totalUnits || 0} SRs)</span>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;