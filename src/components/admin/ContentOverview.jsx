'use client';
import React, { useEffect, useState } from 'react';

export default function ContentOverview() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [feedback, setFeedback] = useState({ views: [], reactions: [], comments: [] });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('All Time');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Pagination states
  const [projectsPage, setProjectsPage] = useState(1);
  const [servicesPage, setServicesPage] = useState(1);
  const [pricingPage, setPricingPage] = useState(1);
  const [testimonialsPage, setTestimonialsPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [projectsRes, servicesRes, pricingRes, testimonialsRes, settingsRes, feedbackRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/services'),
          fetch('/api/pricing'),
          fetch('/api/testimonials'),
          fetch('/api/settings'),
          fetch('/api/feedback')
        ]);

        const projectsData = await projectsRes.json();
        const servicesData = await servicesRes.json();
        const pricingData = await pricingRes.json();
        const testimonialsData = await testimonialsRes.json();
        const settingsData = await settingsRes.json();
        const feedbackData = await feedbackRes.json();

        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setPricing(Array.isArray(pricingData) ? pricingData : []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
        setSettings(settingsData || {});
        setFeedback(feedbackData || { views: [], reactions: [], comments: [] });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter Data Logic
  const isWithinRange = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    
    // Clear time part for accurate date comparison
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (timeRange === 'All Time') return true;
    
    if (timeRange === 'Today') {
        return d.getTime() === n.getTime();
    }
    
    if (timeRange === 'This Week') {
        const day = n.getDay(); // 0 (Sun) to 6 (Sat)
        const diff = n.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
        const monday = new Date(n.setDate(diff));
        return d >= monday;
    }
    
    if (timeRange === 'This Month') {
        return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }
    
    if (timeRange === 'This Year') {
        return d.getFullYear() === n.getFullYear();
    }

    if (timeRange === 'Custom') {
       if (!customStartDate || !customEndDate) return true;
       const start = new Date(customStartDate);
       const end = new Date(customEndDate);
       return d >= start && d <= end;
    }

    return true;
  };

  // Filtered Data
  const filteredProjects = projects.filter(p => isWithinRange(p.createdAt));
  const filteredViews = (feedback.views || []).filter(v => isWithinRange(v.date));
  
  // Calculate stats based on Filter
  const totalViews = timeRange === 'All Time' ? (feedback.views?.length || 0) : filteredViews.length;
  // For Static Content (Services, Pricing, Testimonials), we usually show total unless they have dates. 
  // Assuming they don't have createdAt, we keep showing total or we could hide/dim them.
  // For now, I will show Total but maybe add a note or just keep it simple.
  
  // Get top viewed projects (filtered)
  const projectViews = {};
  filteredViews.forEach(v => {
      const slug = v.projectSlug || v.slug;
      if (slug) {
        projectViews[slug] = (projectViews[slug] || 0) + 1;
      }
  });

  const topProjects = projects
      .map(p => ({
          ...p,
          views: projectViews[p.slug] || 0
      }))
      .filter(p => p.views > 0) // Only show active projects in this period
      .sort((a, b) => b.views - a.views)
      .slice(0, 5); // Top 5

  if (loading) {
    return <div className="admin-section"><p>Loading overview...</p></div>;
  }

  const stats = [
    { label: 'Total Views', value: totalViews, icon: '👁️', color: '#9b59b6' },
    { label: 'New Projects', value: filteredProjects.length, icon: '🎯', color: '#3498db' }, // Changed label to "New Projects" to reflect time filtering
    { label: 'Services', value: services.length, icon: '⚙️', color: '#2ecc71' },
    { label: 'Pricing Plans', value: pricing.length, icon: '💰', color: '#f39c12' },
    { label: 'Testimonials', value: testimonials.length, icon: '💬', color: '#e74c3c' }
  ];

  // Helper for pagination controls
  const PaginationControls = ({ currentPage, totalItems, setPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
        <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            style={{ padding: '6px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.9em' }}>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            style={{ padding: '6px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
          >
            Next
          </button>
        </div>
    );
  };
  
  const getPaginatedData = (data, page) => {
      const indexOfLastItem = page * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="admin-section">
      <div className="d-flex justify-content-between align-items-center mb-4" style={{flexWrap: 'wrap', gap: '15px'}}>
        <h2>⚡ Content Overview & Summary</h2>
        
        <div className="date-filter d-flex align-items-center gap-2">
            <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#222',
                    color: '#fff',
                    cursor: 'pointer'
                }}
            >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
            </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Projects */}
      <div className="overview-section">
        <h3>🏆 Top Performing Projects ({timeRange})</h3>
        {topProjects.length > 0 ? (
            <div className="stats-list">
                {topProjects.map((p, i) => (
                    <div key={p.id} style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px',
                        background: '#222',
                        marginBottom: '8px',
                        borderRadius: '6px',
                        borderLeft: `4px solid ${i === 0 ? '#e74c3c' : (i === 1 ? '#f39c12' : (i === 2 ? '#f1c40f' : '#333'))}`
                    }}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <span style={{fontWeight:'bold', width:'20px', color:'#666'}}>#{i+1}</span>
                            {p.src && <img src={p.src} alt="" style={{width:'40px', height:'40px', borderRadius:'4px', objectFit:'cover'}} />}
                            <span>{p.title}</span>
                        </div>
                        <div style={{display:'flex', gap:'15px'}}>
                            <span style={{color:'#9b59b6', fontWeight:'bold'}}>👁️ {p.views}</span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-muted">No view data yet.</p>
        )}
      </div>

      {/* Site Settings */}
      <div className="overview-section">
        <h3>📋 Site Settings</h3>
        <div className="settings-info">
          <p><strong>Site Name:</strong> {settings.siteName || 'Not set'}</p>
          <p><strong>Description:</strong> {settings.siteDescription || 'Not set'}</p>
          <p><strong>Email:</strong> {settings.contactEmail || 'Not set'}</p>
          <p><strong>Phone:</strong> {settings.phone || 'Not set'}</p>
          <p><strong>Address:</strong> {settings.address || 'Not set'}</p>
          <p><strong>Social Links:</strong></p>
          <ul>
            <li>Facebook: {settings.socialFacebook || 'Not set'}</li>
            <li>Instagram: {settings.socialInstagram || 'Not set'}</li>
            <li>LinkedIn: {settings.socialLinkedin || 'Not set'}</li>
            <li>Twitter: {settings.socialTwitter || 'Not set'}</li>
          </ul>
        </div>
      </div>

      {/* Projects/Works */}
      <div className="overview-section">
        <h3>🎯 Your Projects/Works ({projects.length})</h3>
        {projects.length > 0 ? (
          <>
            <div className="content-list">
              {getPaginatedData(projects, projectsPage).map((project) => (
                <div key={project.id} className="content-item">
                  <div className="item-title">{project.title}</div>
                  <div className="item-meta">
                    <span className="badge">{project.category}</span>
                    <span className="badge secondary">{project.year}</span>
                    <span className="text-small">{project.client}</span>
                  </div>
                </div>
              ))}
            </div>
            <PaginationControls 
                currentPage={projectsPage} 
                totalItems={projects.length} 
                setPage={setProjectsPage} 
            />
          </>
        ) : (
          <p className="empty-state">No projects added yet</p>
        )}
      </div>

      {/* Services */}
      <div className="overview-section">
        <h3>⚙️ Your Services ({services.length})</h3>
        {services.length > 0 ? (
          <>
            <div className="content-list">
              {getPaginatedData(services, servicesPage).map((service) => (
                <div key={service.id} className="content-item">
                  <div className="item-title">{service.title}</div>
                  <div className="item-description">{service.description}</div>
                </div>
              ))}
            </div>
            <PaginationControls 
                currentPage={servicesPage} 
                totalItems={services.length} 
                setPage={setServicesPage} 
            />
          </>
        ) : (
          <p className="empty-state">No services added yet</p>
        )}
      </div>

      {/* Pricing Plans */}
      <div className="overview-section">
        <h3>💰 Your Pricing Plans ({pricing.length})</h3>
        {pricing.length > 0 ? (
          <>
            <div className="pricing-grid">
              {getPaginatedData(pricing, pricingPage).map((plan) => (
                <div key={plan.id} className="pricing-card">
                  <div className="plan-title">{plan.title}</div>
                  <div className="plan-price">${plan.price || 'Custom'}</div>
                  <div className="plan-info">{plan.sortInfo}</div>
                  <div className="plan-features">
                    <strong>Features ({plan.features?.length || 0}):</strong>
                    <ul>
                      {plan.features?.slice(0, 3).map((f, idx) => (
                        <li key={idx}>{f.feature}</li>
                      ))}
                      {plan.features?.length > 3 && <li>...and {plan.features.length - 3} more</li>}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <PaginationControls 
                currentPage={pricingPage} 
                totalItems={pricing.length} 
                setPage={setPricingPage} 
            />
          </>
        ) : (
          <p className="empty-state">No pricing plans added yet</p>
        )}
      </div>

      {/* Testimonials */}
      <div className="overview-section">
        <h3>💬 Your Testimonials ({testimonials.length})</h3>
        {testimonials.length > 0 ? (
          <>
            <div className="content-list">
              {getPaginatedData(testimonials, testimonialsPage).map((testimonial) => (
                <div key={testimonial.id} className="content-item">
                  <div className="item-title">{testimonial.name}</div>
                  <div className="item-meta">
                    <span className="text-small">{testimonial.position}</span>
                  </div>
                  <div className="item-description">{testimonial.review}</div>
                </div>
              ))}
            </div>
            <PaginationControls 
                currentPage={testimonialsPage} 
                totalItems={testimonials.length} 
                setPage={setTestimonialsPage} 
            />
          </>
        ) : (
          <p className="empty-state">No testimonials added yet</p>
        )}
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #f8f9fa;
          border-left: 4px solid;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          margin-top: 4px;
        }

        .overview-section {
          margin-bottom: 40px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .overview-section h3 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
        }

        .settings-info {
          font-size: 14px;
          line-height: 1.8;
        }

        .settings-info p {
          margin: 8px 0;
        }

        .settings-info ul {
          margin-left: 20px;
          margin-top: 10px;
        }

        .content-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .content-item {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 3px solid #3498db;
        }

        .item-title {
          font-weight: bold;
          color: #333;
          margin-bottom: 6px;
        }

        .item-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .badge {
          background: #3498db;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .badge.secondary {
          background: #95a5a6;
        }

        .text-small {
          font-size: 12px;
          color: #666;
        }

        .item-description {
          color: #555;
          font-size: 13px;
          line-height: 1.5;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .pricing-card {
          background: white;
          border: 2px solid #3498db;
          border-radius: 8px;
          padding: 15px;
        }

        .plan-title {
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }

        .plan-price {
          font-size: 24px;
          color: #3498db;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .plan-info {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }

        .plan-features {
          font-size: 12px;
        }

        .plan-features strong {
          display: block;
          margin-bottom: 6px;
        }

        .plan-features ul {
          margin: 6px 0 0 18px;
          padding: 0;
        }

        .plan-features li {
          margin-bottom: 3px;
          color: #555;
        }

        .empty-state {
          color: #999;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        h2 {
          color: #333;
          margin-bottom: 30px;
        }
      `}</style>
    </div>
  );
}
