'use client';
import React, { useState } from 'react';

export default function PricingList({ pricing, onDelete, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!pricing || pricing.length === 0) {
    return <div className="empty-state">No pricing plans found. Add one!</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(pricing.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pricing.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="projects-table">
      <table>
        <thead>
          <tr>
            <th>Plan Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Features Count</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.id} className={item.active === false ? 'archived-row' : ''}>
              <td style={{fontWeight: 'bold', color: '#00d084'}}>{item.title}</td>
              <td>
                {item.price ? `$${item.price}` : <span style={{fontSize:'12px', opacity:0.7}}>Custom</span>}
              </td>
              <td style={{maxWidth: '250px'}}>
                 <div dangerouslySetInnerHTML={{ __html: item.sortInfo }} />
              </td>
              <td>
                 {item.features ? item.features.length : 0} items
              </td>
              <td>
                <span className={`status-badge ${item.active === false ? 'archived' : 'active'}`}>
                    {item.active === false ? 'Hidden' : 'Active'}
                </span>
              </td>
              <td className="actions-cell">
                <button onClick={() => onEdit(item.id)} className="btn-action btn-edit">✎ Edit</button>
                <button onClick={() => onDelete(item.id)} className="btn-action btn-delete">🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            style={{ padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            style={{ padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
