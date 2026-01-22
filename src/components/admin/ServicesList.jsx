'use client';
import React, { useState } from 'react';

export default function ServicesList({ services, onDelete, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!services || services.length === 0) {
    return <div className="empty-state">No services found. Add one!</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);

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
            <th>Icon</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.id} className={item.active === false ? 'archived-row' : ''}>
              <td>
                <span style={{fontSize: '24px', color: '#00d084'}}>
                    <i className={item.icon}></i>
                </span>
                <div style={{fontSize: '10px', color: '#666'}}>{item.icon}</div>
              </td>
              <td style={{fontWeight: 'bold'}}>{item.title}</td>
              <td style={{maxWidth: '300px'}}>
                 {(item.description || '').substring(0, 60)}...
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
