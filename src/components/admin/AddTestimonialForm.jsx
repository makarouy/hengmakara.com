'use client';
import React, { useState, useEffect } from 'react';

export default function AddTestimonialForm({ onSave, initialData = null, onCancel }) {
  const defaultState = {
    name: '',
    position: '',
    review: '',
    src: '',
    active: true
  };

  const [formData, setFormData] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultState,
        ...initialData,
        name: initialData.name || initialData.author || '', // Handle legacy 'author' field
        review: initialData.review || initialData.content || '', // Handle legacy 'content' field
        src: initialData.src || initialData.image || '' // Handle legacy 'image' field
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', 'testimonials/uploads');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: uploadData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setFormData(prev => ({ ...prev, src: data.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const isEdit = !!initialData?.id;
      const url = isEdit ? `/api/testimonials/${initialData.id}` : '/api/testimonials';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(isEdit ? '✅ Updated successfully!' : '✅ Added successfully!');
        if (!isEdit) setFormData(defaultState);
        if (onSave) onSave();
        if (onCancel && isEdit) setTimeout(onCancel, 1000);
      } else {
        const data = await response.json();
        setMessage('❌ ' + (data.error || 'Failed to save'));
      }
    } catch (error) {
      setMessage('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-form">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{initialData ? '✏️ Edit Testimonial' : '➕ Add New Testimonial'}</h3>
        {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel" style={{padding: '5px 15px', background: 'transparent', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer'}}>
                Cancel
            </button>
        )}
      </div>

      {message && <div className={`form-message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
            <div className="form-group">
                <label>Author Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. John Doe"
                />
            </div>
            <div className="form-group">
                <label>Position / Title</label>
                <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g. CEO of Company"
                />
            </div>
        </div>

        <div className="form-section">
            <div className="form-group">
                <label>Testimonial Review *</label>
                <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="What did they say?"
                />
            </div>
        </div>

        <div className="form-section">
            <h4>🖼️ Author Photo</h4>
            <div className="d-flex gap-3 align-items-center mb-3">
                <label className="btn-upload theme-btn" style={{cursor: 'pointer', padding: '8px 15px', fontSize: '14px'}}>
                    {uploading ? 'Uploading...' : '📁 Upload Photo'}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{display: 'none'}}
                    />
                </label>
            </div>
            {formData.src && (
                <div className="mt-2">
                    <img src={formData.src} alt="Preview" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #333'}} />
                </div>
            )}
        </div>

        <div className="form-section">
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="active"
                        checked={formData.active !== false}
                        onChange={handleInputChange}
                    />
                    Active (Visible on website)
                </label>
            </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Saving...' : (initialData ? '💾 Update Testimonial' : '✅ Add Testimonial')}
          </button>
        </div>
      </form>
    </div>
  );
}
