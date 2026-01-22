'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { RiArrowRightUpLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'
import { projectsData } from '@/utlits/fackData/projectData'
import Image from 'next/image'

const animations = ['slideIn', 'fadeIn', 'scaleUp']

const getRandomAnimation = () => {
  const randomIndex = Math.floor(Math.random() * animations.length)
  return animations[randomIndex]
}

const Portfolio = ({ className }) => {
  const [projects, setProjects] = useState([])
  const [category, setCategory] = useState('All')
  const [animationClass, setAnimationClass] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data)
      } else {
        setProjects(projectsData)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects(projectsData)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (item) => {
    setCategory(item)
    setAnimationClass(getRandomAnimation())
    setCurrentPage(1)
  }

  // ------ filter unique category
  const filteredCategory = ['All']
  projects.forEach(({ category }) => {
    if (!filteredCategory.includes(category)) {
      filteredCategory.push(category)
    }
  })
  // ------ filter unique category

  // Filter by category and sort: newest first, exclude archived
  const filteredProjects = (
    category === 'All'
      ? projects
      : projects.filter((p) => p.category === category)
  )
    .filter(p => !p.archived) // Hide archived projects
    .sort((a, b) => (b.id || 0) - (a.id || 0)) // Newest first

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    const section = document.getElementById('portfolio')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="portfolio" className={`projects-area ${className || ''}`}>
      <div className="container">
        <div className="container-inner">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <SlideUp>
                <div className="section-title text-center">
                  <h2>Works & Projects</h2>
                  <p>
                    A selection of digital marketing and media production projects—focused on results, storytelling, and impact.
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>

          <SlideUp>
            <ul className="project-filter filter-btns-one justify-content-left pb-15">
              {filteredCategory.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => handleCategoryClick(item)}
                  className={item === category ? 'current' : ''}
                >
                  {item}
                </li>
              ))}
            </ul>
          </SlideUp>

          <div className="row project-masonry-active overflow-hidden">
            {currentItems.map((p, index) => (
              <Card
                key={p.id}
                id={index + 1}
                category={p.category}
                src={p.src}
                title={p.title}
                slug={p.slug}
                animationClass={animationClass}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="row">
              <div className="col-12">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="theme-btn"
                    style={{ 
                      opacity: currentPage === 1 ? 0.5 : 1, 
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      background: currentPage === 1 ? 'transparent' : ''
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="theme-btn"
                    style={{ 
                      opacity: currentPage === totalPages ? 0.5 : 1, 
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      background: currentPage === totalPages ? 'transparent' : ''
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Portfolio

const Card = ({ category, title, src, slug, animationClass, id }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className={`col-lg-4 col-md-6 item ${animationClass}`}>
      <SlideUp delay={id}>
        <div className="project-item style-two">
          <div className="project-image">
            <Image
              width={500}
              height={500}
              sizes="100vw"
              style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover' }}
              src={imgSrc}
              alt={title}
              onError={() => setImgSrc('/images/projects/work1.jpg')}
            />
            <Link href={`/works/${slug}`} className="details-btn">
              <RiArrowRightUpLine />
            </Link>
          </div>

          <div className="project-content">
            <span className="sub-title">{category}</span>
            <h3>
                <Link href={`/works/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {title}
                </Link>
            </h3>
          </div>
        </div>
      </SlideUp>
    </div>
  )
}
