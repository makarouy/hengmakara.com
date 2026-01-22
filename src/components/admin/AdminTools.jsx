'use client';
import { useState } from 'react';

export default function AdminTools({ projects }) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projects-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Year', 'Client', 'Status', 'Featured'];
    const rows = projects.map(p => [
      p.id,
      p.title,
      p.category,
      p.year,
      p.client,
      p.archived ? 'Archived' : 'Active',
      p.featured ? 'Yes' : 'No'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projects-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const active = projects.filter(p => !p.archived).length;
    const featured = projects.filter(p => p.featured).length;
    const archived = projects.filter(p => p.archived).length;
    const categories = new Set(projects.map(p => p.category)).size;
    
    return { total: projects.length, active, featured, archived, categories };
  };

  const stats = getStats();

  return (
    <div className="admin-tools">
      <div className="tools-container">
        <h3 className="tools-title">📊 Project Analytics</h3>
        <div className="tools-grid">
          <div className="tool-stat">
            <span className="stat-icon">📈</span>
            <span className="stat-text">Total: {stats.total}</span>
          </div>
          <div className="tool-stat">
            <span className="stat-icon">✓</span>
            <span className="stat-text">Active: {stats.active}</span>
          </div>
          <div className="tool-stat">
            <span className="stat-icon">⭐</span>
            <span className="stat-text">Featured: {stats.featured}</span>
          </div>
          <div className="tool-stat">
            <span className="stat-icon">📁</span>
            <span className="stat-text">Categories: {stats.categories}</span>
          </div>
        </div>

        <h3 className="tools-title">💾 Export & Backup</h3>
        <div className="tools-actions">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="tool-btn-export"
          >
            ⬇️ Export Data
          </button>
          
          {showExportMenu && (
            <div className="export-menu">
              <button onClick={exportAsJSON} className="export-option">
                📄 JSON (Full Backup)
              </button>
              <button onClick={exportAsCSV} className="export-option">
                📊 CSV (Spreadsheet)
              </button>
            </div>
          )}
        </div>

        <h3 className="tools-title">🔧 Recommended Tools</h3>
        <div className="recommended-tools">
          <a href="https://compressor.io/" target="_blank" rel="noopener noreferrer" className="tool-link">
            🖼️ Image Compressor - Optimize images before upload
          </a>
          <a href="https://slug.draftdev.tools/" target="_blank" rel="noopener noreferrer" className="tool-link">
            🔗 Slug Generator - Create URL-friendly slugs
          </a>
          <a href="https://www.grammarly.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
            ✍️ Grammarly - Check spelling & grammar
          </a>
          <a href="https://coolors.co/" target="_blank" rel="noopener noreferrer" className="tool-link">
            🎨 Color Palette - Design consistent colors
          </a>
        </div>
      </div>
    </div>
  );
}
