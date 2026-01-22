'use client'
import React, { useState } from 'react'

const ShareButtons = ({ projectTitle, projectUrl, description, imageUrl, title, url }) => {
  const [copied, setCopied] = useState(false)
  const [activeShare, setActiveShare] = useState(null)

  // Support both naming conventions
  const finalTitle = projectTitle || title
  const finalUrl = projectUrl || url

  // Ensure URL is absolute
  const absoluteUrl = finalUrl && finalUrl.startsWith('http') 
    ? finalUrl 
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${finalUrl}`

  const shareData = {
    title: finalTitle,
    url: absoluteUrl,
    description: description || finalTitle,
    image: imageUrl || '/images/logo.png'
  }

  const handleShare = (platform) => {
    setActiveShare(platform)
    setTimeout(() => setActiveShare(null), 300)

    const encodedUrl = encodeURIComponent(shareData.url)
    const encodedTitle = encodeURIComponent(shareData.title)
    const encodedDescription = encodeURIComponent(shareData.description)
    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(shareData.image)}&description=${encodedDescription}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, show message
        alert('Open Instagram and share the link in your bio or stories!')
        return
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
        break
      default:
        return
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareData.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareButtons = [
    { platform: 'facebook', emoji: '📘', label: 'Facebook', color: '#1877F2' },
    { platform: 'twitter', emoji: '𝕏', label: 'Twitter', color: '#1DA1F2' },
    { platform: 'linkedin', emoji: '💼', label: 'LinkedIn', color: '#0A66C2' },
    { platform: 'whatsapp', emoji: '💬', label: 'WhatsApp', color: '#25D366' },
    { platform: 'pinterest', emoji: '📌', label: 'Pinterest', color: '#E60023' },
    { platform: 'telegram', emoji: '✈️', label: 'Telegram', color: '#0088cc' },
    { platform: 'instagram', emoji: '📷', label: 'Instagram', color: '#E1306C' },
    { platform: 'email', emoji: '✉️', label: 'Email', color: '#666' },
  ]

  return (
    <div className="share-buttons-container">
      <div className="share-buttons-grid">
        {shareButtons.map(({ platform, emoji, label, color }) => (
          <button
            key={platform}
            className={`share-btn ${activeShare === platform ? 'active' : ''}`}
            onClick={() => handleShare(platform)}
            title={`Share on ${label}`}
            style={{ '--btn-color': color }}
          >
            <span className="share-emoji">{emoji}</span>
            <span className="btn-label">{label}</span>
          </button>
        ))}
      </div>

      <div className="share-link-section">
        <div className="link-input-group">
          <input
            type="text"
            value={shareData.url}
            readOnly
            className="share-link-input"
            placeholder="Project link"
          />
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
            title="Copy link to clipboard"
          >
            <span>🔗</span>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareButtons
