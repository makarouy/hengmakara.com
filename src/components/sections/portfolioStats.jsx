'use client'
import React, { useState, useEffect } from 'react'

const PortfolioStats = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalViews: 0,
    averageRating: 0,
    totalComments: 0,
    totalRatings: 0,
    totalReactions: 0,
    totalEngagement: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects
        const projectRes = await fetch('/api/projects')
        const projects = await projectRes.json()
        // Base count of 2500 legacy projects + current website projects
        const totalProjects = projects.length + 2500

        // Fetch all feedback
        const feedbackRes = await fetch('/api/feedback')
        const feedback = feedbackRes.ok ? await feedbackRes.json() : { comments: [], ratings: [], reactions: [], views: [] }

        // Calculate statistics
        const totalViews = feedback.views ? feedback.views.length : 0
        const totalComments = feedback.comments ? feedback.comments.filter(c => c.approved && !c.deleted).length : 0
        const totalRatings = feedback.ratings ? feedback.ratings.length : 0
        const totalReactions = feedback.reactions ? feedback.reactions.length : 0

        // Calculate average rating
        let averageRating = 0
        if (totalRatings > 0) {
          const sumRatings = feedback.ratings.reduce((sum, r) => sum + (r.rating || 0), 0)
          averageRating = (sumRatings / totalRatings).toFixed(1)
        }

        // Calculate total engagement
        const totalEngagement = totalComments + totalRatings + totalReactions

        setStats({
          totalProjects,
          totalViews,
          averageRating,
          totalComments,
          totalRatings,
          totalReactions,
          totalEngagement
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
        // Don't set error state to avoid hiding the component, just log it
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section style={{ paddingTop: '15px', paddingBottom: '15px' }}>
      <div className="container">
        <div className="portfolio-stats-container" style={{ margin: 0 }}>
          <div className="stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="stat-card stat-skeleton">
                <div className="stat-skeleton-bar"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </section>
    )
  }

  // Render content even if there was a background fetch error
  return (
    <section style={{ paddingTop: '15px', paddingBottom: '15px' }}>
    <div className="container">
      <div className="portfolio-stats-container" style={{ margin: 0 }}>
        <div className="stats-header">
          <h3>Portfolio Overview</h3>
          <p>Real-time engagement metrics</p>
        </div>

      <div className="stats-grid">
        {/* Total Projects */}
        <div className="stat-card stat-projects">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalProjects}</div>
            <div className="stat-label">Projects</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="stat-card stat-views">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="stat-card stat-rating">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>

        {/* Total Engagement */}
        <div className="stat-card stat-engagement">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEngagement}</div>
            <div className="stat-label">Engagements</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="stats-breakdown">
        <div className="breakdown-item">
          <span className="breakdown-label">💭 Comments</span>
          <span className="breakdown-value">{stats.totalComments}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">⭐ Ratings</span>
          <span className="breakdown-value">{stats.totalRatings}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">❤️ Reactions</span>
          <span className="breakdown-value">{stats.totalReactions}</span>
        </div>
      </div>
    </div>
    </div>
    </section>
  )
}

export default PortfolioStats
