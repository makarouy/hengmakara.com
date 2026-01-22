'use client'
 
import { useEffect } from 'react'
 
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="container text-center pt-100 pb-100" style={{ padding: '100px 0' }}>
      <h2 className="mb-4">Something went wrong!</h2>
      <p className="mb-4 text-danger">{error.message || "An unexpected error occurred"}</p>
      <button
        onClick={() => reset()}
        className="theme-btn"
      >
        Try again
      </button>
    </div>
  )
}
