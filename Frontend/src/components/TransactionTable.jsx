import React from "react";
import Pagination from './Pagination';

function TransactionTable({ transactions, pagination = {}, currentPage = 1, onPageChange = () => {} }) {
  const formatDate = (dateString) => {
    if (!dateString) return "—";  // null, undefined, empty
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Invalid"; // invalid date
  
    return d.toISOString().split("T")[0];
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined || val === '') return '—';
    const n = parseFloat(val);
    if (isNaN(n)) return String(val);
    return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  };

  return (
    <div className="table-section">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Customer name</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Product Category</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Customer region</th>
              <th>Employee name</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.customerId || '1234567'}</td>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.customerId || 'CUST12016'}</td>
                <td>{transaction.customerName}</td>
                <td>
                  {transaction.phoneNumber}
                  <button className="copy-btn" title="Copy">⍝</button>
                </td>
                <td>{transaction.gender}</td>
                <td>{transaction.age}</td>
                <td>{transaction.productCategory}</td>
                  <td>{String(transaction.quantity).padStart(2, '0')}</td>
                  <td>{formatCurrency(transaction.finalAmount ?? transaction.totalAmount)}</td>
                  <td>{transaction.region || transaction.customerRegion || '—'}</td>
                  <td>{transaction.employeeName || transaction.employee || transaction.seller || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination.totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default TransactionTable;