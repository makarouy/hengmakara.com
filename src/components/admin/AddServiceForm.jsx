'use client';
import React, { useState, useEffect } from 'react';

export default function AddServiceForm({ onSave, initialData = null, onCancel }) {
  const defaultState = {
    title: '',
    description: '',
    icon: '',
    active: true
  };

  const [formData, setFormData] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultState,
        ...initialData
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const isEdit = !!initialData?.id;
      const url = isEdit ? `/api/services/${initialData.id}` : '/api/services';
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
        <h3>{initialData ? '✏️ Edit Service' : '➕ Add New Service'}</h3>
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
                <label>Service Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Digital Marketing"
                />
            </div>
            <div className="form-group">
                <label>Icon Class (Remix Icon) *</label>
                <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. RiGlobalFill"
                />
                <small style={{color:'#888', display:'block', marginTop:'5px'}}>
                    Find icons at <a href="https://remixicon.com/" target="_blank" style={{color:'#00d084'}}>remixicon.com</a>
                </small>
            </div>
        </div>

        <div className="form-section">
            <div className="form-group">
                <label>Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Service description..."
                />
            </div>
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
            {loading ? 'Saving...' : (initialData ? '💾 Update Service' : '✅ Add Service')}
          </button>
        </div>
      </form>
    </div>
  );
}
