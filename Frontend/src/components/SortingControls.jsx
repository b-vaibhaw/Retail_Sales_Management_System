import React from "react";
function SortingControls({ sortBy, order, onSortChange }) {
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'customerName', label: 'Customer Name' }
  ];

  const handleSortByChange = (e) => {
    onSortChange(e.target.value, order);
  };

  const handleOrderChange = (newOrder) => {
    onSortChange(sortBy, newOrder);
  };

  const getOrderLabel = () => {
    if (sortBy === 'date') return order === 'desc' ? 'Newest First' : 'Oldest First';
    if (sortBy === 'quantity') return order === 'desc' ? 'High to Low' : 'Low to High';
    if (sortBy === 'customerName') return order === 'asc' ? 'A to Z' : 'Z to A';
    return '';
  };

  return (
    <div className="sorting-controls">
      <div className="sort-group">
        <label htmlFor="sortBy">Sort by:</label>
        <select 
          id="sortBy"
          value={sortBy} 
          onChange={handleSortByChange}
          className="sort-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="sort-order-buttons">
        <button
          onClick={() => handleOrderChange(order === 'asc' ? 'desc' : 'asc')}
          className="order-toggle-btn"
          title="Toggle sort order"
        >
          {order === 'asc' ? '↑' : '↓'} {getOrderLabel()}
        </button>
      </div>
    </div>
  );
}

export default SortingControls;