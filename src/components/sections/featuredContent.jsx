'use client';
import { useState, useEffect } from 'react';

export default function FeaturedContent() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/featured-content');
        const data = await response.json();
        const featured = data
            .filter(c => c.featured && c.active !== false)
            .sort((a, b) => a.order - b.order);
        setContents(featured);
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (contents.length === 0) return null;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // YouTube: convert watch URL to embed URL
    if (url.includes('youtube.com/watch')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    
    // Already embed URL
    if (url.includes('embed')) return url;
    
    // Vimeo
    if (url.includes('vimeo')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    
    return url;
  };

  return (
    <section className="featured-content-section">
      <div className="container">
        <div className="featured-content-grid">
          {contents.map((content, index) => (
            <div key={content.id} className="featured-item">
              {content.type === 'image' && (
                <div className="featured-image">
                  <img src={content.mediaUrl} alt={content.title} />
                  {content.title && <h3>{content.title}</h3>}
                  {content.content && <p>{content.content}</p>}
                </div>
              )}

              {content.type === 'video' && (
                <div className="featured-video">
                  <div className="video-wrapper">
                    <iframe
                      src={getEmbedUrl(content.mediaUrl)}
                      title={content.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {content.title && <h3>{content.title}</h3>}
                  {content.content && <p>{content.content}</p>}
                </div>
              )}

              {content.type === 'text' && (
                <div className="featured-text">
                  {content.title && <h3>{content.title}</h3>}
                  {content.content && <p>{content.content}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
