'use client';
import React, { useState } from 'react';

export default function FeaturedContentList({ contents, onDelete, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getMediaPreview = (content) => {
    if (content.type === 'image') {
      return (
        <img 
          src={content.thumbnail || content.mediaUrl} 
          alt={content.title}
          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
        />
      );
    } else if (content.type === 'video') {
      return <span className="type-badge video">▶ Video</span>;
    } else {
      return <span className="type-badge text">📝 Text</span>;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(contents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contents.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="featured-content-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Preview</th>
            <th>Title</th>
            <th>Type</th>
            <th>Featured</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-state">
                No featured content found.
              </td>
            </tr>
          ) : (
            currentItems.map(content => (
              <tr key={content.id}>
                <td>#{content.id}</td>
                <td>{getMediaPreview(content)}</td>
                <td className="title-cell">{content.title}</td>
                <td>
                  <span className={`type-badge ${content.type}`}>
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </span>
                </td>
                <td>
                  {content.featured ? (
                    <span className="featured-badge">★ Featured</span>
                  ) : (
                    <span className="badge-gray">-</span>
                  )}
                </td>
                <td>{content.createdAt}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => onEdit(content.id)}
                    className="btn-action btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(content.id)}
                    className="btn-action btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
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
