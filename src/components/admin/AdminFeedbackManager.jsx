'use client'
import React, { useState, useEffect } from 'react'


const AdminFeedbackManager = () => {
  const [feedback, setFeedback] = useState({
    comments: [],
    ratings: [],
    reactions: [],
    views: []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('comments')
  const [userRole, setUserRole] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const role = localStorage.getItem('adminRole')
    if (role) {
      setUserRole(role)
    }
    fetchFeedback()
  }, [])

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback')
      const data = await response.json()
      setFeedback(data)
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveComment = async (id) => {
    try {
      await fetch('/api/feedback', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          id,
          action: 'approveComment'
        })
      })
      fetchFeedback()
    } catch (error) {
      console.error('Error approving comment:', error)
    }
  }

  const handleDeleteComment = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
      await fetch(`/api/feedback?id=${id}&type=comment`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      fetchFeedback()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleDeleteRating = async (id) => {
    if (!confirm('Delete this rating?')) return
    try {
      await fetch(`/api/feedback?id=${id}&type=rating`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      fetchFeedback()
    } catch (error) {
      console.error('Error deleting rating:', error)
    }
  }

  const handleDeleteReaction = async (id) => {
    try {
      await fetch(`/api/feedback?id=${id}&type=reaction`, {
        method: 'DELETE'
      })
      fetchFeedback()
    } catch (error) {
      console.error('Error deleting reaction:', error)
    }
  }

  if (loading) {
    return <div className="admin-feedback-manager"><p>Loading feedback...</p></div>
  }

  const PaginationControls = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
        <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            style={{ padding: '5px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            style={{ padding: '5px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
    );
  };

  const getPaginatedData = (data) => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  const unapprovedComments = feedback.comments.filter(c => !c.approved && !c.deleted)
  const approvedComments = feedback.comments.filter(c => c.approved && !c.deleted)
  const paginatedApproved = getPaginatedData(approvedComments);
  const paginatedRatings = getPaginatedData(feedback.ratings);
  const reactionList = Array.isArray(feedback.reactions) ? feedback.reactions : [];
  const paginatedReactions = getPaginatedData(reactionList);
  const paginatedViews = getPaginatedData([...feedback.views].reverse()); // Newest views first

  return (
    <div className="admin-feedback-manager">
      <div className="feedback-header">
        <h2>📊 Feedback Management</h2>
        <div className="feedback-stats">
          <div className="stat-card">
            <span role="img" aria-label="comments">💬</span> {feedback.comments.length} Comments
          </div>
          <div className="stat-card">
            <span role="img" aria-label="star">⭐</span> {feedback.ratings.length} Ratings
          </div>
          <div className="stat-card">
            <span role="img" aria-label="smile">😊</span> {Array.isArray(feedback.reactions) ? feedback.reactions.length : Object.values(feedback.reactions).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)} Reactions
          </div>
          <div className="stat-card">
            <span role="img" aria-label="eye">👁️</span> {feedback.views.length} Views
          </div>
        </div>
      </div>

      <div className="feedback-tabs">
        <button
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <span role="img" aria-label="comments">💬</span> Comments ({feedback.comments.filter(c => !c.deleted).length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ratings')}
        >
          <span role="img" aria-label="star">⭐</span> Ratings ({feedback.ratings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'reactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('reactions')}
        >
          <span role="img" aria-label="smile">😊</span> Reactions ({Array.isArray(feedback.reactions) ? feedback.reactions.length : Object.keys(feedback.reactions).length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'views' ? 'active' : ''}`}
          onClick={() => setActiveTab('views')}
        >
          <span role="img" aria-label="eye">👁️</span> Views ({feedback.views.length})
        </button>
      </div>

      {/* COMMENTS TAB */}
      {activeTab === 'comments' && (
        <div className="feedback-content">
          {unapprovedComments.length > 0 && (
            <div className="comments-section">
              <h3>⏳ Pending Approval ({unapprovedComments.length})</h3>
              <div className="feedback-list">
                {unapprovedComments.map(comment => (
                  <div key={comment.id} className="feedback-item pending">
                    <div className="feedback-header-row">
                      <strong>{comment.name}</strong>
                      <span className="feedback-date">
                        {new Date(comment.date || comment.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="feedback-text">{comment.text}</p>
                    <p className="feedback-meta">Project: {comment.projectSlug}</p>
                    <div className="feedback-actions">
                      <button
                        className="btn-approve"
                        onClick={() => handleApproveComment(comment.id)}
                        title="Approve"
                      >
                        <span role="img" aria-label="approve">✅</span> Approve
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Delete"
                      >
                        <span role="img" aria-label="delete">🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {approvedComments.length > 0 && (
            <div className="comments-section">
              <h3>✓ Approved ({approvedComments.length})</h3>
              <div className="feedback-list">
                {paginatedApproved.map(comment => (
                  <div key={comment.id} className="feedback-item approved">
                    <div className="feedback-header-row">
                      <strong>{comment.name}</strong>
                      <span className="feedback-date">
                        {new Date(comment.date || comment.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="feedback-text">{comment.text}</p>
                    <p className="feedback-meta">Project: {comment.projectSlug}</p>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Delete"
                    >
                      <span role="img" aria-label="delete">🗑️</span> Delete
                    </button>
                  </div>
                ))}
              </div>
              <PaginationControls totalItems={approvedComments.length} />
            </div>
          )}

          {feedback.comments.filter(c => !c.deleted).length === 0 && (
            <p className="empty-message">No comments yet</p>
          )}
        </div>
      )}

      {/* RATINGS TAB */}
      {activeTab === 'ratings' && (
        <div className="feedback-content">
          {feedback.ratings.length > 0 ? (
            <>
              <div className="rating-stats">
                <div className="rating-stat">
                  <strong>Average Rating:</strong>
                  <span className="rating-avg">
                    {(feedback.ratings.reduce((sum, r) => sum + r.rating, 0) / feedback.ratings.length).toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
              <div className="feedback-list">
                {paginatedRatings.map(rating => (
                  <div key={rating.id} className="feedback-item rating-item">
                    <div className="feedback-header-row">
                      <strong>{rating.name || 'Anonymous'}</strong>
                      <span className="rating-stars">
                        {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                      </span>
                    </div>
                    <p className="feedback-meta">
                      Project: {rating.projectSlug} | {new Date(rating.date || rating.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteRating(rating.id)}
                    >
                      <span role="img" aria-label="delete">🗑️</span> Delete
                    </button>
                  </div>
                ))}
              </div>
              <PaginationControls totalItems={feedback.ratings.length} />
            </>
          ) : (
            <p className="empty-message">No ratings yet</p>
          )}
        </div>
      )}

      {/* REACTIONS TAB */}
      {activeTab === 'reactions' && (
        <div className="feedback-content">
          {Array.isArray(feedback.reactions) ? (
            <>
                <div className="reactions-list-detailed">
                    {paginatedReactions.map((reaction, index) => (
                        <div key={index} className="reaction-detail-item">
                            <span className="reaction-emoji">{reaction.emoji}</span>
                            <span className="reaction-project">{reaction.projectSlug}</span>
                            <span className="reaction-date">{new Date(reaction.date).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <PaginationControls totalItems={feedback.reactions.length} />
            </>
          ) : (
             // Fallback if it's the grouped object (legacy/different API response)
            Object.keys(feedback.reactions).length > 0 ? (
                <div className="reactions-stats">
                {Object.entries(feedback.reactions).map(([emoji, count]) => (
                    <div key={emoji} className="reaction-stat">
                    <span className="reaction-emoji">{emoji}</span>
                    <span className="reaction-count">{typeof count === 'object' ? 1 : count}</span>
                    </div>
                ))}
                </div>
            ) : (
                <p className="empty-message">No reactions yet</p>
            )
          )}
        </div>
      )}

      {/* VIEWS TAB */}
      {activeTab === 'views' && (
        <div className="feedback-content">
          <div className="view-stats">
            <div className="stat-big">
              <div className="stat-number">{feedback.views.length}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>
          {feedback.views.length > 0 && (
            <div className="views-timeline">
              <p className="timeline-info">Latest activity (Page {currentPage}):</p>
              <div className="view-list">
                {paginatedViews.map(view => (
                  <div key={view.id || Math.random()} className="view-item">
                    <span className="view-project">{view.projectSlug}</span>
                    <span className="view-time">
                      {new Date(view.date || view.timestamp || Date.now()).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <PaginationControls totalItems={feedback.views.length} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminFeedbackManager
