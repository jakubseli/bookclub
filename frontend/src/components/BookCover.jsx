import { useState } from 'react'

export default function BookCover({ coverId, title, size = 'M', alt = '' }) {
  const [failed, setFailed] = useState(false)

  if (!coverId || failed) {
    return (
      <div className="book-cover book-cover-missing" role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        <span>{title}</span>
      </div>
    )
  }
  return (
    <img
      className="book-cover"
      src={`https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
