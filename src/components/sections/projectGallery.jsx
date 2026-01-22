'use client';
import { useState } from 'react';

export default function ProjectGallery({ gallery = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <section className="project-gallery">
        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <div
              key={index}
              className="gallery-image"
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`Gallery ${index + 1}`} />
              <div className="gallery-overlay">
                <span className="view-icon">👁</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedImage !== null && (
        <div className="gallery-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img src={gallery[selectedImage]} alt="Full view" />
            <div className="lightbox-nav">
              <button
                className="nav-btn prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length);
                }}
              >
                ‹
              </button>
              <span className="image-counter">
                {selectedImage + 1} / {gallery.length}
              </span>
              <button
                className="nav-btn next"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((selectedImage + 1) % gallery.length);
                }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
