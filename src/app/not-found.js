import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="container text-center pt-100 pb-100">
      <h1 className="display-1 fw-bold">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="mb-5">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link href="/" className="theme-btn">
        Return Home
      </Link>
    </div>
  )
}
