'use client';
import { useState, useEffect } from 'react';

export default function AddFeaturedContentForm({ editingId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    content: '',
    mediaUrl: '',
    mediaType: 'image',
    thumbnail: '',
    featured: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (editingId) {
      fetchContent(editingId);
    }
  }, [editingId]);

  const fetchContent = async (id) => {
    try {
      const response = await fetch(`/api/featured-content/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
      });
      const data = await response.json();
      setFormData(data);
      if (data.thumbnail) setPreview(data.thumbnail);
    } catch (err) {
      setError('Failed to load content');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      type,
      mediaType: type === 'video' ? 'youtube' : 'image'
    }));
  };

  const handleMediaUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      mediaUrl: url
    }));

    // Auto-detect video type from URL
    if (url.includes('youtube') || url.includes('youtu.be')) {
      setFormData(prev => ({ ...prev, mediaType: 'youtube' }));
    } else if (url.includes('vimeo')) {
      setFormData(prev => ({ ...prev, mediaType: 'vimeo' }));
    } else if (url.startsWith('/') || url.startsWith('http')) {
      setFormData(prev => ({ ...prev, mediaType: 'image' }));
    }
  };

  const handleThumbnailChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      thumbnail: url
    }));
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/featured-content/${editingId}` : '/api/featured-content';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        setFormData({
          type: 'image',
          title: '',
          content: '',
          mediaUrl: '',
          mediaType: 'image',
          thumbnail: '',
          featured: true
        });
        setPreview('');
      } else {
        setError('Failed to save content');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form featured-form">
      <h3>{editingId ? 'Edit Featured Content' : 'Add Featured Content'}</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Content Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleTypeChange}
            required
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="featured">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            {' '}Featured
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Recent Project Showcase"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="content">Description / Text</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Add description or content text"
            rows="4"
          />
        </div>
      </div>

      {formData.type === 'video' && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mediaType">Video Source</label>
              <select
                id="mediaType"
                name="mediaType"
                value={formData.mediaType}
                onChange={handleChange}
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mediaUrl">Video URL / Embed Code *</label>
              <textarea
                id="mediaUrl"
                name="mediaUrl"
                value={formData.mediaUrl}
                onChange={handleMediaUrlChange}
                placeholder="Paste YouTube URL or embed code"
                rows="3"
                required
              />
              <small>
                YouTube: https://www.youtube.com/watch?v=xxxxx
                <br />
                Embed: https://www.youtube.com/embed/xxxxx
              </small>
            </div>
          </div>
        </>
      )}

      {formData.type === 'image' && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mediaUrl">Image URL *</label>
              <input
                type="text"
                id="mediaUrl"
                name="mediaUrl"
                value={formData.mediaUrl}
                onChange={handleMediaUrlChange}
                placeholder="/images/projects/work1.jpg or https://..."
                required
              />
              <small>Use local path (/images/...) or full URL</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail URL</label>
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleThumbnailChange}
                placeholder="/images/projects/thumb.jpg"
              />
            </div>
          </div>

          {preview && (
            <div className="image-preview">
              <p>Preview:</p>
              <img src={preview} alt="Preview" />
            </div>
          )}
        </>
      )}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Saving...' : editingId ? 'Update Content' : 'Add Content'}
        </button>
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  );
}
