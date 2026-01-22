'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import ProjectsList from './ProjectsList'
import TestimonialsList from './TestimonialsList'
import ServicesList from './ServicesList'
import PricingList from './PricingList'
import FooterSettingsManager from './FooterSettingsManager'

const AddProjectForm = dynamic(() => import('./AddProjectForm'), { ssr: false })
const AddTestimonialForm = dynamic(() => import('./AddTestimonialForm'), { ssr: false })
const AddServiceForm = dynamic(() => import('./AddServiceForm'), { ssr: false })
const AddPricingForm = dynamic(() => import('./AddPricingForm'), { ssr: false })

const ComprehensiveAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects')
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState({})
  const [stats, setStats] = useState({})

  // Form states for different content types
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    year: '',
    client: '',
    services: '',
    role: '',
    src: '',
    gallery: [],
    slug: '',
    // Testimonials
    author: '',
    position: '',
    content: '',
    image: '',
    // Services
    icon: '',
    // Pricing
    price: '',
    features: [],
    duration: '',
  })

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      let url = ''
      switch (activeTab) {
        case 'projects':
          url = '/api/projects'
          break
        case 'testimonials':
          url = '/api/testimonials'
          break
        case 'services':
          url = '/api/services'
          break
        case 'pricing':
          url = '/api/pricing'
          break
        case 'settings':
          url = '/api/settings'
          break
        default:
          return
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (activeTab === 'settings') {
          setSettings(data)
        } else {
          setItems(Array.isArray(data) ? data : [])
          
          // Fetch stats for projects tab
          if (activeTab === 'projects') {
             try {
                const feedbackRes = await fetch('/api/feedback');
                if (feedbackRes.ok) {
                   const feedbackData = await feedbackRes.json();
                   const newStats = {};
                   
                   // Calculate Views
                   if (feedbackData.views && Array.isArray(feedbackData.views)) {
                       feedbackData.views.forEach(v => {
                           const slug = v.projectSlug || v.slug;
                           if (slug) {
                               if (!newStats[slug]) newStats[slug] = { views: 0, comments: 0 };
                               newStats[slug].views++;
                           }
                       });
                   }

                   // Calculate Comments
                   if (feedbackData.comments && Array.isArray(feedbackData.comments)) {
                       feedbackData.comments.forEach(c => {
                           const slug = c.projectSlug || c.slug;
                           if (slug) {
                               if (!newStats[slug]) newStats[slug] = { views: 0, comments: 0 };
                               newStats[slug].comments++;
                           }
                       });
                   }
                   
                   setStats(newStats);
                }
             } catch (e) {
                console.error("Failed to load stats", e);
             }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      setMessage('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  // Fetch items based on tab
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url = ''
      let method = editingId ? 'PUT' : 'POST'

      switch (activeTab) {
        case 'projects':
          url = editingId ? `/api/projects/${editingId}` : '/api/projects'
          break
        case 'testimonials':
          url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials'
          break
        case 'services':
          url = editingId ? `/api/services/${editingId}` : '/api/services'
          break
        case 'pricing':
          url = editingId ? `/api/pricing/${editingId}` : '/api/pricing'
          break
        case 'settings':
          url = '/api/settings'
          method = 'PUT'
          break
        default:
          return
      }

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage(editingId ? 'Updated successfully!' : 'Created successfully!')
        setShowForm(false)
        setEditingId(null)
        setFormData({})
        fetchItems()
      } else {
        const error = await response.json()
        setMessage(error.error || 'Save failed')
      }
    } catch (error) {
      console.error('Error saving item:', error)
      setMessage('Error saving item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id || item._id);
    setShowForm(true);
    
    // Scroll to top
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setLoading(true)
    try {
      let url = ''
      switch (activeTab) {
        case 'projects':
          url = `/api/projects/${id}`
          break
        case 'testimonials':
          url = `/api/testimonials/${id}`
          break
        case 'services':
          url = `/api/services/${id}`
          break
        case 'pricing':
          url = `/api/pricing/${id}`
          break
        default:
          return
      }

      const response = await fetch(url, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      if (response.ok) {
        setMessage('Deleted successfully!')
        fetchItems()
      } else {
        setMessage('Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      setMessage('Error deleting item')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({})
  }

  const renderForm = () => {
    const commonProps = {
        onSave: () => { fetchItems(); setShowForm(false); setEditingId(null); },
        initialData: editingId ? formData : null,
        onCancel: () => { setShowForm(false); setEditingId(null); }
    };

    switch (activeTab) {
      case 'projects':
        const existingCategories = [...new Set(items.map(p => p.category).filter(Boolean))];
        return (
            <AddProjectForm 
                onProjectAdded={commonProps.onSave} 
                initialData={commonProps.initialData}
                onCancel={commonProps.onCancel}
                existingCategories={existingCategories}
            />
        );

      case 'testimonials':
        return <AddTestimonialForm {...commonProps} />;

      case 'services':
        return <AddServiceForm {...commonProps} />;

      case 'pricing':
        return <AddPricingForm {...commonProps} />;

      case 'settings':
        return (
          <div className="admin-form">
            <h3>Website Settings</h3>
            <form onSubmit={handleSaveItem}>
              <input
                type="text"
                name="siteName"
                placeholder="Site Name"
                value={formData.siteName || 'Heng Makara'}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  siteName: e.target.value
                }))}
              />
              <textarea
                name="siteDescription"
                placeholder="Site Description"
                value={formData.siteDescription || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  siteDescription: e.target.value
                }))}
                rows="3"
              />
              <input
                type="email"
                name="contactEmail"
                placeholder="Contact Email"
                value={formData.contactEmail || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contactEmail: e.target.value
                }))}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
              <input
                type="text"
                name="socialFacebook"
                placeholder="Facebook URL"
                value={formData.socialFacebook || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialFacebook: e.target.value
                }))}
              />
              <input
                type="text"
                name="socialTwitter"
                placeholder="Twitter URL"
                value={formData.socialTwitter || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialTwitter: e.target.value
                }))}
              />
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  const renderList = () => {
    if (loading && items.length === 0) {
      return <div className="admin-loading">Loading...</div>
    }

    if (items.length === 0) {
      return <div className="admin-empty">No items yet. Add one to get started!</div>
    }

    if (activeTab === 'projects') {
      return (
        <ProjectsList 
          projects={items} 
          stats={stats}
          onDelete={handleDelete}
          onEdit={(id) => {
             const item = items.find(i => i.id === id);
             if (item) handleEdit(item);
          }}
          onDuplicate={async (newProject) => {
             fetchItems();
          }}
          onArchive={fetchItems}
        />
      );
    }
    
    if (activeTab === 'testimonials') {
      return (
        <TestimonialsList 
          testimonials={items}
          onDelete={handleDelete}
          onEdit={(id) => {
             const item = items.find(i => i.id === id);
             if (item) handleEdit(item);
          }}
          onToggleStatus={() => {}} 
        />
      );
    }

    if (activeTab === 'services') {
      return (
        <ServicesList 
          services={items}
          onDelete={handleDelete}
          onEdit={(id) => {
             const item = items.find(i => i.id === id);
             if (item) handleEdit(item);
          }}
        />
      );
    }

    if (activeTab === 'pricing') {
      return (
        <PricingList 
          pricing={items}
          onDelete={handleDelete}
          onEdit={(id) => {
             const item = items.find(i => i.id === id);
             if (item) handleEdit(item);
          }}
        />
      );
    }

    if (activeTab === 'footer') {
      return <FooterSettingsManager />;
    }

    return (
      <div className="admin-items-list">
        {items.map(item => (
          <div key={item.id || item._id} className="admin-item-card">
            <div className="admin-item-content">
              <h4>{item.title || item.author || item.name}</h4>
              <p>{item.description || item.content || item.position || ''}</p>
              {item.year && <small>Year: {item.year}</small>}
              {item.price && <small>Price: ${item.price}</small>}
            </div>
            <div className="admin-item-actions">
              <button className="btn-edit" onClick={() => handleEdit(item)}>
                ✏️ Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(item.id || item._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="comprehensive-admin-dashboard">
      <div className="admin-header">
        <h2>🛠️ Complete Website Management</h2>
        <p>Manage all content, settings, and feedback from one place</p>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => { setActiveTab('projects'); setShowForm(false) }}
        >
          🎯 Projects
        </button>
        <button
          className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => { setActiveTab('testimonials'); setShowForm(false) }}
        >
          💬 Testimonials
        </button>
        <button
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => { setActiveTab('services'); setShowForm(false) }}
        >
          ⚙️ Services
        </button>
        <button
          className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pricing'); setShowForm(false) }}
        >
          💰 Pricing
        </button>
        <button
          className={`tab-btn ${activeTab === 'footer' ? 'active' : ''}`}
          onClick={() => { setActiveTab('footer'); setShowForm(false) }}
        >
          🦶 Footer
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('settings'); setShowForm(false) }}
        >
          ⚡ Settings
        </button>
      </div>

      <div className="admin-content">
        {!showForm && activeTab !== 'settings' && activeTab !== 'footer' && (
          <button className="btn-add-new" onClick={() => setShowForm(true)}>
            ➕ Add New {activeTab}
          </button>
        )}

        {showForm ? renderForm() : renderList()}
      </div>
    </div>
  )
}

export default ComprehensiveAdminDashboard
