'use client';
import React, { useState, useEffect } from 'react';

export default function AddPricingForm({ onSave, initialData = null, onCancel }) {
  const defaultState = {
    title: '',
    price: '',
    unit: '/Month',
    sortInfo: '',
    featuresStr: '', // Temporary for editing
    active: true
  };

  const [formData, setFormData] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      // Convert features array to string for textarea
      let featuresStr = '';
      if (Array.isArray(initialData.features)) {
        featuresStr = initialData.features.map(f => {
            if (typeof f === 'string') return f;
            if (f.unable) return '!' + f.feature;
            return f.feature;
        }).join('\n');
      }

      setFormData({
        ...defaultState,
        ...initialData,
        featuresStr
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

    // Parse features string back to array
    const featuresArray = formData.featuresStr.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index) => {
            const unable = line.startsWith('!');
            const featureText = unable ? line.substring(1) : line;
            return {
                id: Date.now() + index,
                feature: featureText,
                unable: unable
            };
        });

    const payload = {
        ...formData,
        features: featuresArray
    };
    delete payload.featuresStr; // Remove temp field

    try {
      const isEdit = !!initialData?.id;
      const url = isEdit ? `/api/pricing/${initialData.id}` : '/api/pricing';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(payload)
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
        <h3>{initialData ? '✏️ Edit Pricing Plan' : '➕ Add New Pricing Plan'}</h3>
        {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel" style={{padding: '5px 15px', background: 'transparent', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer'}}>
                Cancel
            </button>
        )}
      </div>

      {message && <div className={`form-message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
            <div className="form-group mb-2">
                <label>Plan Name *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Gold Plan"
                />
            </div>
            <div className="form-group mb-2">
                <label>Price ($) *</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 199"
                />
            </div>
            <div className="form-group mb-2">
                <label>Billing Unit</label>
                <input
                    type="text"
                    name="unit"
                    value={formData.unit || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. /Month, /Year, /Job"
                />
            </div>
            <div className="form-group">
                <label>Short Description (HTML allowed)</label>
                <input
                    type="text"
                    name="sortInfo"
                    value={formData.sortInfo}
                    onChange={handleInputChange}
                    placeholder="e.g. Best for startups"
                />
            </div>
        </div>

        <div className="form-section">
            <div className="form-group">
                <label>Features List (One per line) *</label>
                <p style={{fontSize:'12px', color:'#888', marginBottom:'5px'}}>
                    Tip: Add <code>!</code> at the start of a line to strike it through (mark as unavailable).
                </p>
                <textarea
                    name="featuresStr"
                    value={formData.featuresStr}
                    onChange={handleInputChange}
                    required
                    rows="10"
                    placeholder="Meta Ads Management&#10;Ads Setup & Optimization&#10;!Monthly Report (Unavailable)"
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
            {loading ? 'Saving...' : (initialData ? '💾 Update Plan' : '✅ Add Plan')}
          </button>
        </div>
      </form>
    </div>
  );
}
