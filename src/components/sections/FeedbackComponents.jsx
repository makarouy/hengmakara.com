'use client'
import React, { useState, useEffect, useCallback } from 'react'

const ViewCounter = ({ projectSlug }) => {
  const [views, setViews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const recordView = async () => {
      try {
        // Record view
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'addView',
            projectSlug
          })
        })

        // Fetch views
        const response = await fetch(`/api/feedback?projectSlug=${projectSlug}&type=views`)
        const data = await response.json()
        setViews(data.count || 0)
      } catch (error) {
        console.error('Error recording view:', error)
      } finally {
        setLoading(false)
      }
    }

    if (projectSlug) {
      recordView()
    }
  }, [projectSlug])

  return (
    <div className="view-counter-widget">
      <div className="view-stat">
        <span className="view-icon">👁️</span>
        <span className="view-count">{loading ? '-' : views.toLocaleString()}</span>
        <span className="view-label">Views</span>
      </div>
    </div>
  )
}

const ReactionsWidget = ({ projectSlug }) => {
  const [reactions, setReactions] = useState({})
  const [loading, setLoading] = useState(true)
  const [clicked, setClicked] = useState({})

  const reactionEmojis = [
    { emoji: '❤️', label: 'Love' },
    { emoji: '👍', label: 'Great' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '😍', label: 'Amazing' },
    { emoji: '👏', label: 'Awesome' }
  ]

  const fetchReactions = useCallback(async () => {
    try {
      const response = await fetch(`/api/feedback?projectSlug=${projectSlug}&type=reactions`)
      const data = await response.json()
      // Ensure data is an object with counts, not array of objects
      if (Array.isArray(data)) {
        // Fallback: If API returns array, group it manually
        const grouped = data.reduce((acc, r) => {
            if (r && r.emoji) {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1
            }
            return acc
        }, {})
        setReactions(grouped)
      } else {
        setReactions(data || {})
      }
    } catch (error) {
      console.error('Error fetching reactions:', error)
    } finally {
      setLoading(false)
    }
  }, [projectSlug])

  useEffect(() => {
    fetchReactions()
  }, [fetchReactions])

  const handleReaction = async (emoji) => {
    try {
      setClicked(prev => ({ ...prev, [emoji]: true }))
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addReaction',
          projectSlug,
          data: { emoji }
        })
      })

      setReactions(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1
      }))

      setTimeout(() => setClicked(prev => ({ ...prev, [emoji]: false })), 300)
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  if (loading) return <div className="reactions-loading">Loading reactions...</div>

  return (
    <div className="reactions-widget">
      <h4>React to this project</h4>
      <div className="reactions-grid">
        {reactionEmojis.map(({ emoji, label }) => (
          <button
            key={emoji}
            className={`reaction-btn ${clicked[emoji] ? 'clicked' : ''}`}
            onClick={() => handleReaction(emoji)}
            title={label}
          >
            <span className="reaction-emoji">{emoji}</span>
            <span className="reaction-count">
              {typeof reactions[emoji] === 'number' ? reactions[emoji] : 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const RatingWidget = ({ projectSlug }) => {
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [userName, setUserName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const fetchRatings = useCallback(async () => {
    try {
      const response = await fetch(`/api/feedback?projectSlug=${projectSlug}&type=ratings`)
      const data = await response.json()
      setAverageRating(parseFloat(data.average) || 0)
      setTotalRatings(data.count || 0)
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setLoading(false)
    }
  }, [projectSlug])

  useEffect(() => {
    fetchRatings()
  }, [fetchRatings])

  const handleSubmitRating = async (e) => {
    e.preventDefault()
    if (!userRating) {
      setError('Please select a rating')
      return
    }

    try {
      setError('')
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addRating',
          projectSlug,
          data: {
            rating: userRating,
            name: userName || 'Anonymous'
          }
        })
      })

      setSubmitted(true)
      setUserRating(0)
      setUserName('')
      fetchRatings()

      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Error submitting rating:', error)
      setError('Failed to submit rating')
    }
  }

  return (
    <div className="rating-widget">
      <div className="rating-header">
        <h4>Rate this project</h4>
        <div className="rating-display">
          <div className="stars-display">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}>
                ★
              </span>
            ))}
          </div>
          <span className="rating-average">{averageRating.toFixed(1)}</span>
          <span className="rating-count">({totalRatings} ratings)</span>
        </div>
      </div>

      <form onSubmit={handleSubmitRating} className="rating-form">
        {error && <p className="error-message">{error}</p>}
        {submitted && <p className="success-message">✓ Rating submitted!</p>}

        <div className="stars-input">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              className={`star-btn ${star <= (hoverRating || userRating) ? 'active' : ''}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        <div className="rating-name-input">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength="100"
          />
        </div>

        <button type="submit" className="submit-rating-btn">
          Submit Rating
        </button>
      </form>
    </div>
  )
}

const CommentsSection = ({ projectSlug, projectTitle }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', text: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/feedback?projectSlug=${projectSlug}&type=comments`)
      const data = await response.json()
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }, [projectSlug])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!formData.name.trim() || !formData.email.trim() || !formData.text.trim()) {
      setError('All fields are required')
      return
    }

    if (formData.text.length < 10) {
      setError('Comment must be at least 10 characters')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addComment',
          projectSlug,
          data: formData
        })
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSuccess(true)
      setFormData({ name: '', email: '', text: '' })
      setTimeout(() => {
        setSuccess(false)
        fetchComments()
      }, 2000)
    } catch (error) {
      console.error('Error submitting comment:', error)
      setError('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <p className="loading">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong className="comment-name">{comment.name}</strong>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <div className="add-comment-form">
        <h4>Leave a comment</h4>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">✓ Comment submitted! Awaiting approval.</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              maxLength="100"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              maxLength="255"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <textarea
              name="text"
              placeholder="Share your thoughts about this project..."
              value={formData.text}
              onChange={handleChange}
              maxLength="1000"
              rows="4"
              disabled={submitting}
            />
            <span className="char-count">{formData.text.length}/1000</span>
          </div>

          <button
            type="submit"
            className="submit-comment-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  )
}

export { ViewCounter, ReactionsWidget, RatingWidget, CommentsSection }
