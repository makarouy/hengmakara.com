'use client';
import React, { useState, useEffect } from 'react';

export default function AddProjectForm({ onProjectAdded, initialData = null, onCancel, existingCategories = [] }) {
  // Default known categories
  const defaultCategories = ['Account Recovery', 'Digital Marketing', 'Media Production'];
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
     // Merge default and existing to get unique sorted list
     const combined = [...new Set([...defaultCategories, ...existingCategories])].sort();
     setAvailableCategories(combined);
  }, [existingCategories]);

  const defaultState = {
    title: '',
    category: '',
    excerpt: '',
    description: '',
    slug: '',
    src: '',
    year: new Date().getFullYear().toString(),
    client: '',
    services: '',
    role: '',
    gallery: [],
    videos: [],
    featured: false,
    archived: false
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultState,
        ...initialData,
        // Ensure arrays are arrays
        gallery: initialData.gallery || [],
        videos: initialData.videos || []
      });
    }
  }, [initialData]);

  const [photoUrl, setPhotoUrl] = useState('');
  const [videoEmbed, setVideoEmbed] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', 'projects/uploads');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: uploadData
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await res.json();
      
      if (data.url) {
        if (field === 'src') {
            setFormData(prev => ({ ...prev, src: data.url }));
        } else if (field === 'gallery') {
            setFormData(prev => ({ 
                ...prev, 
                gallery: [...prev.gallery, data.url] 
            }));
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, photoUrl]
      }));
      setPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleAddVideo = () => {
    if (videoEmbed.trim()) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, videoEmbed]
      }));
      setVideoEmbed('');
    }
  };

  const handleRemoveVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const isEdit = !!initialData?.id;
      const url = isEdit ? `/api/projects/${initialData.id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage(isEdit ? '✅ Project updated successfully!' : '✅ Project added successfully!');
        if (!isEdit) {
           setFormData(defaultState);
        }
        if (onProjectAdded) onProjectAdded();
        if (onCancel && isEdit) setTimeout(onCancel, 1000); 
        else setTimeout(() => setMessage(''), 3000);
      } else {
        setMessageType('error');
        setMessage('❌ ' + (data.error || 'Failed to save project'));
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-form">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{initialData ? '✏️ Edit Project' : '➕ Add New Project'}</h3>
        {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel" style={{padding: '5px 15px', background: 'transparent', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer'}}>
                Cancel
            </button>
        )}
      </div>

      {message && (
        <div className={`form-message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h4>📝 Basic Information</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Facebook Page Recovery"
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              {!isAddingNewCategory ? (
                <div className="d-flex gap-2">
                    <select 
                        name="category" 
                        value={formData.category} 
                        onChange={(e) => {
                            if (e.target.value === '__NEW__') {
                                setIsAddingNewCategory(true);
                                setFormData(prev => ({ ...prev, category: '' }));
                            } else {
                                handleInputChange(e);
                            }
                        }} 
                        required
                        style={{ flex: 1 }}
                    >
                        <option value="">Select category</option>
                        {availableCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="__NEW__">➕ Add New Category...</option>
                    </select>
                </div>
              ) : (
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter new category name"
                        value={newCategoryName}
                        onChange={(e) => {
                            setNewCategoryName(e.target.value);
                            setFormData(prev => ({ ...prev, category: e.target.value }));
                        }}
                        autoFocus
                        required
                    />
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => {
                            setIsAddingNewCategory(false);
                            setNewCategoryName('');
                            setFormData(prev => ({ ...prev, category: '' }));
                        }}
                        style={{ width: 'auto', padding: '0 15px' }}
                    >
                        ✕
                    </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Excerpt (Short description)</label>
            <input
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief description shown in listings"
            />
          </div>

          <div className="form-group">
            <label>Description (Full details)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed project description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Slug (URL friendly name)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated-from-title"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                Featured Project
              </label>
            </div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="archived"
                        checked={formData.archived}
                        onChange={handleInputChange}
                    />
                    Archived (Hidden)
                </label>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="form-section">
          <h4>🖼️ Featured Image</h4>
          <div className="form-group">
            <label>Main Image *</label>
            <div className="d-flex gap-3 align-items-center mb-2">
                <label className="btn-upload theme-btn" style={{cursor: 'pointer', padding: '8px 15px', fontSize: '14px'}}>
                    {uploading ? 'Uploading...' : '📁 Upload Image'}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'src')} 
                        disabled={uploading}
                        style={{display: 'none'}}
                    />
                </label>
            </div>
            {formData.src && (
                <div className="mt-3">
                    <img src={formData.src} alt="Preview" style={{maxHeight: '200px', maxWidth: '100%', borderRadius: '8px', border: '1px solid #333'}} />
                </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="form-section">
          <h4>📸 Photo Gallery (Multiple)</h4>
          <p className="form-help">Upload photos or add URLs</p>
          
          <div className="mb-3">
             <label className="btn-upload theme-btn" style={{cursor: 'pointer', padding: '8px 15px', fontSize: '14px', marginRight: '10px'}}>
                {uploading ? 'Uploading...' : '📁 Upload to Gallery'}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'gallery')} 
                    disabled={uploading}
                    style={{display: 'none'}}
                />
             </label>
          </div>

          <div className="form-row-multi">
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://... or any image URL"
            />
            <button type="button" onClick={handleAddPhoto} className="btn-add">
              + Add URL
            </button>
          </div>

          {formData.gallery.length > 0 && (
            <div className="gallery-list">
              <p><strong>Added Photos ({formData.gallery.length}):</strong></p>
              <div className="gallery-items">
                {formData.gallery.map((photo, index) => (
                  <div key={index} className="gallery-item">
                    <div className="gallery-preview">
                      <img src={photo} alt={`Gallery ${index + 1}`} />
                    </div>
                    <div className="gallery-url">{photo.substring(0, 50)}...</div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="btn-remove"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="form-section">
          <h4>🎥 Embed Videos</h4>
          <p className="form-help">Add YouTube or Vimeo embed codes</p>
          
          <div className="form-row-multi">
            <input
              type="text"
              value={videoEmbed}
              onChange={(e) => setVideoEmbed(e.target.value)}
              placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
            />
            <button type="button" onClick={handleAddVideo} className="btn-add">
              + Add Video
            </button>
          </div>

          {formData.videos.length > 0 && (
            <div className="videos-list">
              <p><strong>Added Videos ({formData.videos.length}):</strong></p>
              <div className="videos-items">
                {formData.videos.map((video, index) => (
                  <div key={index} className="video-item">
                    <div className="video-preview">
                      <iframe
                        width="200"
                        height="120"
                        src={video}
                        title={`Video ${index + 1}`}
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                      className="btn-remove"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div className="form-section">
          <h4>💼 Project Details</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                placeholder="Client name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Services</label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleInputChange}
                placeholder="e.g., Account Recovery, Media Production"
              />
            </div>
            <div className="form-group">
              <label>Your Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., Account Recovery Specialist"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Saving...' : (initialData ? '💾 Update Project' : '✅ Add Project')}
          </button>
        </div>
      </form>

      <style>{`
        .add-project-form {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 30px;
        }

        .add-project-form h3 {
          margin-top: 0;
          color: #fff;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .form-message {
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .form-message.success {
          background: #27ae60;
          color: white;
        }

        .form-message.error {
          background: #e74c3c;
          color: white;
        }

        .form-section {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h4 {
          color: #fff;
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .form-help {
          font-size: 12px;
          color: #999;
          margin-bottom: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-row-multi {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .form-row-multi input {
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: #aaa;
          font-size: 13px;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea,
        .form-group select,
        .form-row-multi input {
          background: #2a2a2a;
          border: 1px solid #444;
          color: #fff;
          padding: 10px;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus,
        .form-row-multi input:focus {
          outline: none;
          border-color: #3498db;
          background: #333;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-group input[type="checkbox"] {
          width: auto;
          margin-right: 8px;
        }

        .btn-add {
          background: #3498db;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
        }

        .btn-add:hover {
          background: #2980b9;
        }

        .gallery-list,
        .videos-list {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #333;
        }

        .gallery-list p,
        .videos-list p {
          color: #aaa;
          margin: 0 0 12px 0;
          font-size: 13px;
        }

        .gallery-items,
        .videos-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }

        .gallery-item,
        .video-item {
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .gallery-preview,
        .video-preview {
          width: 100%;
          height: 100px;
          background: #1a1a1a;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-preview img,
        .video-preview iframe {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-url {
          padding: 8px;
          font-size: 11px;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-bottom: 1px solid #333;
          flex: 1;
        }

        .btn-remove {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .btn-remove:hover {
          background: #c0392b;
        }

        .form-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .btn-submit {
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background: #229954;
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
