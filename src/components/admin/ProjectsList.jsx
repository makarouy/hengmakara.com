'use client';
import { useState } from 'react';

export default function ProjectsList({ projects, onDelete, onEdit, onDuplicate, onArchive, userRole = 'admin', stats = {} }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  // Check if project was created today (show NEW badge)
  const isNew = (createdAt) => {
    if (!createdAt) return false;
    const today = new Date().toISOString().split('T')[0];
    return createdAt === today;
  };

  // Get unique categories for filter
  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter and Sort projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.client?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || project.category === filterCategory;
    
    const matchesStatus = filterStatus === 'All' 
        ? true 
        : filterStatus === 'Archived' 
            ? project.archived 
            : !project.archived;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.archived === b.archived) {
      return (b.id || 0) - (a.id || 0); // Newest first by ID
    }
    return a.archived ? 1 : -1; // Active projects first
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDuplicate = async (project) => {
    if (userRole !== 'admin') {
      alert('Only admins can duplicate projects');
      return;
    }
    if (confirm(`Duplicate "${project.title}"?`)) {
      try {
        const response = await fetch(`/api/projects/${project.id}/duplicate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          const duplicated = await response.json();
          onDuplicate(duplicated);
          showSuccess(`Project duplicated as "${duplicated.title}"`);
        }
      } catch (error) {
        alert('Failed to duplicate project');
      }
    }
  };

  const handleArchive = async (project) => {
    if (confirm(`${project.archived ? 'Restore' : 'Archive'} "${project.title}"?`)) {
      try {
        const response = await fetch(`/api/projects/${project.id}/archive`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({ archived: !project.archived })
        });
        if (response.ok) {
          const updated = await response.json();
          onArchive(updated);
          showSuccess(project.archived ? 'Project restored' : 'Project archived');
        }
      } catch (error) {
        alert('Failed to update archive status');
      }
    }
  };

  const isExpert = userRole === 'expert';
  const isAdmin = userRole === 'admin';

  return (
    <div className="projects-table">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* Filters & Search */}
      <div className="admin-filters" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="🔍 Search by title or client..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            flex: 1, 
            minWidth: '200px',
            padding: '10px', 
            background: '#1a1a1a', 
            border: '1px solid #333', 
            color: '#fff', 
            borderRadius: '5px' 
          }}
        />
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ 
            padding: '10px', 
            background: '#1a1a1a', 
            border: '1px solid #333', 
            color: '#fff', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ 
            padding: '10px', 
            background: '#1a1a1a', 
            border: '1px solid #333', 
            color: '#fff', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Year</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Views</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-state">
                No projects found.
              </td>
            </tr>
          ) : (
            currentItems.map(project => (
              <tr key={project.id} className={project.archived ? 'archived-row' : ''}>
                <td>#{project.id}</td>
                <td className="title-cell">
                  {project.title}
                  {isNew(project.createdAt) && <span className="new-badge">🆕 NEW</span>}
                  {project.archived && <span className="archived-badge">Archived</span>}
                </td>
                <td>
                  <span className="category-badge">{project.category}</span>
                </td>
                <td>{project.year}</td>
                <td>
                  <span className={`status-badge ${project.archived ? 'archived' : 'active'}`}>
                    {project.archived ? 'Archived' : 'Active'}
                  </span>
                </td>
                <td>
                  {project.featured ? (
                    <span className="featured-badge">★ Featured</span>
                  ) : (
                    <span className="badge-gray">-</span>
                  )}
                </td>
                <td className="text-center font-medium">
                  {stats[project.slug]?.views || 0}
                </td>
                <td className="text-center font-medium">
                  {stats[project.slug]?.comments || 0}
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => onEdit(project.id)}
                    className="btn-action btn-edit"
                    title="Edit project"
                  >
                    ✎ Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDuplicate(project)}
                      className="btn-action btn-duplicate"
                      title="Duplicate project"
                    >
                      ⬍ Copy
                    </button>
                  )}
                  <button
                    onClick={() => handleArchive(project)}
                    className={`btn-action ${project.archived ? 'btn-restore' : 'btn-archive'}`}
                    title={project.archived ? 'Restore project' : 'Archive project'}
                  >
                    {project.archived ? '↺ Restore' : '◻ Archive'}
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="btn-action btn-delete"
                    title="Permanently delete"
                  >
                    🗑 Delete
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
