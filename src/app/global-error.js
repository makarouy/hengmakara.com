'use client'
 
export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="container text-center pt-100 pb-100" style={{ padding: '100px 0' }}>
            <h2 className="mb-4">Something went wrong!</h2>
            <p className="mb-4">A critical error occurred.</p>
            <button onClick={() => reset()} className="theme-btn">Try again</button>
        </div>
      </body>
    </html>
  )
}
