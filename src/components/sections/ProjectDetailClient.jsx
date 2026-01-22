"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import ProjectGallery from './projectGallery';
import ShareButtons from './ShareButtons';
import { ViewCounter, ReactionsWidget, RatingWidget, CommentsSection } from './FeedbackComponents';

export default function ProjectDetailClient({ slug }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const found = projects.find(p => p.slug === slug || p.slug === `${slug}/`);
        
        // Check if archived and not admin
        const isAdmin = typeof window !== 'undefined' && localStorage.getItem('adminToken');
        
        if (found) {
            if (found.archived && !isAdmin) {
                setError('This project is archived.');
            } else {
                setProject(found);
            }
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  if (loading) {
    return <div className="container pt-60"><p>Loading...</p></div>;
  }
  if (error || !project) {
    return <div className="container pt-60"><p>{error || 'Project not found'}</p></div>;
  }
  return (
    <div className="new-project-detail-page">
      {/* Hero Header */}
      <div className="project-hero-header">
        <div className="container">
          {project.category && <span className="project-tag">{project.category}</span>}
          <h1 className="project-main-title">{project.title}</h1>
          {project.excerpt && <p className="project-intro">{project.excerpt}</p>}
        </div>
      </div>

      {/* Featured Image Section */}
      {project.src && (
        <div className="project-hero-image">
          <div className="container">
            <div className="image-frame">
              <Image 
                width={1095} 
                height={1072} 
                sizes="100vw" 
                style={{width:"100%", height:"auto"}} 
                src={project.src} 
                alt={project.title} 
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="container project-main-layout">
        <div className="row">
          {/* Left Sidebar - Info */}
          <div className="col-lg-4">
            <div className="project-info-sidebar">
              {/* Project Meta */}
              <div className="info-card">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-key">Year</span>
                    <span className="info-val">{project.year}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Client</span>
                    <span className="info-val">{project.client}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Services</span>
                    <span className="info-val">{project.services}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Role</span>
                    <span className="info-val">{project.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Main (Now Description Only in Card) */}
          <div className="col-lg-8">
            <div className="info-card h-100">
               <h3 className="card-title" style={{ fontSize: '18px', marginBottom: '20px' }}>Project Overview</h3>
               <p className="section-text" style={{ margin: 0 }}>{project.description}</p>
            </div>
          </div>
        </div>

        {/* Full Width Sections BELOW the split layout */}
        <div className="row">
          <div className="col-12">
            <div className="project-content-main mt-5">
              
              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <section className="content-block gallery-section">
                  <h2 className="section-title">📸 Gallery</h2>
                  <div className="block-content">
                    <ProjectGallery gallery={project.gallery} />
                  </div>
                </section>
              )}

              {/* Videos */}
              {project.videos && project.videos.length > 0 && (
                <section className="content-block videos-section">
                  <h2 className="section-title">🎬 Videos</h2>
                  <div className="videos-grid">
                    {project.videos.map((video, index) => (
                      <div key={index} className="video-box">
                        <iframe
                          src={video}
                          title={`Video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Interaction Section */}
              <div className="interaction-section">
                {/* Share */}
                <div className="interaction-block share-card">
                  <h3 className="section-title">Share This Project</h3>
                  <p className="section-text mb-3">Help spread the word about this work</p>
                  <ShareButtons url={`/works/${project.slug}`} title={project.title} />
                </div>

                {/* Engagement */}
                <div className="interaction-grid-2">
                  <div className="interaction-block engagement-card">
                    <h3 className="section-title">Engagement</h3>
                    <div className="engagement-row">
                      <ViewCounter projectSlug={project.slug} />
                    </div>
                    <div className="engagement-row">
                      <ReactionsWidget projectSlug={project.slug} />
                    </div>
                  </div>
                  <div className="interaction-block">
                    <h3 className="section-title">Rate this project</h3>
                    <RatingWidget projectSlug={project.slug} />
                  </div>
                </div>

                {/* Comments */}
                <div className="interaction-block comments-block">
                  <h2 className="section-title">Comments</h2>
                  <CommentsSection projectSlug={project.slug} projectTitle={project.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Overall */
        .new-project-detail-page {
          background: #0a0a0f;
          padding-bottom: 80px;
        }

        /* Hero Header */
        .project-hero-header {
          padding: 160px 0 60px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 0;
        }

        .project-tag {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 6px;
          color: #667eea;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 24px;
        }

        .project-main-title {
          font-size: 64px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 20px 0;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .project-intro {
          font-size: 18px;
          color: #a0a0b0;
          margin: 0;
          line-height: 1.6;
          max-width: 800px;
        }

        /* Hero Image */
        .project-hero-image {
          padding: 50px 0;
          background: rgba(18, 18, 20, 0.5);
        }

        .image-frame {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .image-frame img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Main Layout */
        .project-main-layout {
          padding: 60px 0;
        }

        /* Sidebar */
        .project-info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 24px;
        }

        .info-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-key {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #8080a0;
          font-weight: 600;
        }

        .info-val {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .card-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .card-description {
          font-size: 12px;
          color: #8080a0;
          margin: 0 0 14px 0;
        }

        .share-card {
        }

        .engagement-card {
        }

        .engagement-row {
          margin-bottom: 12px;
        }

        .engagement-row:last-child {
          margin-bottom: 0;
        }

        /* Interaction Section (New Bottom Layout) */
        .interaction-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .interaction-block {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 24px;
        }

        /* Override generic section title for smaller inner blocks */
        .interaction-block .section-title {
           font-size: 14px;
           font-weight: 700;
           margin-bottom: 16px;
           text-transform: uppercase;
           letter-spacing: 0.5px;
           color: #fff;
           opacity: 0.9;
        }

        .interaction-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* Comments Override for this layout */
        .interaction-block.comments-block {
           border: 1px solid rgba(255, 255, 255, 0.06);
           margin-top: 0;
           padding-top: 24px;
           background: rgba(255, 255, 255, 0.02);
        }
        
        .interaction-block.comments-block .section-title {
           font-size: 18px; /* Slightly larger for comments */
           margin-bottom: 24px;
           text-transform: none;
        }

        @media (max-width: 768px) {
          .interaction-grid-2 {
              grid-template-columns: 1fr;
          }
        }

        /* Comments Section Styling */
        .comments-block h2 {
          font-size: 24px;
        }

        .comments-block {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 28px;
          margin-top: 0;
          padding-top: 28px;
        }

        /* Main Content */
        .project-content-main {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .content-block {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 30px;
          overflow: hidden;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 24px 0;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-text {
          font-size: 15px;
          line-height: 1.8;
          color: #b0b0c0;
          margin: 0;
        }

        /* Videos */
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .video-box {
          border-radius: 10px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          aspect-ratio: 16/9;
        }

        .video-box iframe {
          width: 100%;
          height: 100%;
          display: block;
          border: none;
        }

        /* Comments */
        .comments-block {
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Small Share Buttons Override */
        .share-card .share-buttons-grid {
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 8px !important;
          margin: 15px 0 !important;
        }

        .share-card .share-btn {
          padding: 10px 4px !important;
          border-radius: 8px !important;
          gap: 4px !important;
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }

        .share-card .share-btn:hover {
          background: var(--btn-color) !important;
          border-color: var(--btn-color) !important;
          transform: translateY(-2px) !important;
        }

        .share-card .share-emoji {
          font-size: 16px !important;
        }

        .share-card .btn-label {
          font-size: 9px !important;
          font-weight: 500 !important;
        }

        .share-card .share-link-section {
          padding: 0 !important;
          margin: 15px 0 0 0 !important;
          background: transparent !important;
          border: none !important;
        }

        .share-card .share-link-input {
          height: 34px !important;
          font-size: 11px !important;
          background: rgba(0, 0, 0, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: #a0a0b0 !important;
        }

        .share-card .copy-btn {
          height: 34px !important;
          padding: 0 12px !important;
          font-size: 11px !important;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .project-main-title {
            font-size: 42px;
          }

          .section-title {
            font-size: 20px;
          }
        }

        @media (max-width: 768px) {
          .project-hero-header {
            padding: 120px 0 40px;
          }

          .project-main-title {
            font-size: 32px;
            margin-bottom: 12px;
          }

          .project-intro {
            font-size: 14px;
          }

          .project-hero-image {
            padding: 35px 0;
          }

          .project-main-layout {
            padding: 40px 0;
          }

          .project-info-sidebar {
            margin-bottom: 35px;
            gap: 16px;
          }

          .info-card {
            padding: 18px;
            border-radius: 8px;
          }

          .info-grid {
            gap: 14px;
          }

          .info-val {
            font-size: 14px;
          }

          .project-content-main {
            gap: 32px;
          }

          .section-title {
            font-size: 18px;
            margin-bottom: 12px;
          }

          .section-text {
            font-size: 14px;
            line-height: 1.7;
          }

          .video-box iframe {
            height: 100%;
          }

          .videos-grid {
            gap: 18px;
          }

          .comments-block {
            padding: 20px;
            border-radius: 8px;
          }
        }

        @media (max-width: 576px) {
          .project-hero-header {
            padding: 100px 0 30px;
          }

          .project-tag {
            font-size: 9px;
            padding: 5px 10px;
          }

          .project-main-title {
            font-size: 26px;
            margin-bottom: 10px;
          }

          .project-intro {
            font-size: 13px;
          }

          .project-hero-image {
            padding: 25px 0;
          }

          .image-frame {
            border-radius: 10px;
          }

          .info-card {
            padding: 14px;
            border-radius: 8px;
          }

          .info-grid {
            gap: 12px;
          }

          .info-key {
            font-size: 10px;
          }

          .info-val {
            font-size: 13px;
          }

          .card-title {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .section-title {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .section-text {
            font-size: 13px;
          }

          .video-box iframe {
            height: 100%;
          }

          .videos-grid {
            gap: 14px;
          }

          .project-content-main {
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
