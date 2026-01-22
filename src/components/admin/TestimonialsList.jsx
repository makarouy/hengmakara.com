'use client';
import React, { useState } from 'react';

export default function TestimonialsList({ testimonials, onDelete, onEdit, onToggleStatus }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!testimonials || testimonials.length === 0) {
    return <div className="empty-state">No testimonials found. Add one!</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = testimonials.slice(indexOfFirstItem, indexOfLastItem);

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
            <th>Photo</th>
            <th>Name</th>
            <th>Position</th>
            <th>Review Preview</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.id} className={item.active === false ? 'archived-row' : ''}>
              <td>
                {item.src || item.image ? (
                    <img src={item.src || item.image} alt={item.name} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                    <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>👤</div>
                )}
              </td>
              <td>{item.name || item.author}</td>
              <td>{item.position}</td>
              <td>
                 <span title={item.review || item.content}>
                    {(item.review || item.content || '').substring(0, 50)}...
                 </span>
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
