import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import BookCover from '../components/BookCover.jsx'
import Pagination from '../components/Pagination.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import SortSelect from '../components/SortSelect.jsx'
import StarRating from '../components/StarRating.jsx'
import UserLink from '../components/UserLink.jsx'
import { formatDate, plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'

const PAGE_SIZE = 5
const SORTS = [
  { value: 'createdAt,desc', label: 'Newest first' },
  { value: 'rating,desc', label: 'Highest rating' },
  { value: 'rating,asc', label: 'Lowest rating' },
]

function CoverGallery({ title, coverIds, selected, onSelect }) {
  return (
    <section className="stack-sm" aria-labelledby="covers-heading">
      <h2 id="covers-heading" className="section-label">More covers</h2>
      <ul className="cover-gallery">
        {coverIds.map((coverId, index) => (
          <li key={coverId}>
            <button
              type="button"
              className="cover-thumb"
              aria-label={`Show cover ${index + 1} of ${coverIds.length}`}
              aria-pressed={index === selected}
              onClick={() => onSelect(index)}
            >
              <BookCover coverId={coverId} title={title} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RatingSummary({ summary }) {
  const highest = Math.max(1, ...summary.distribution.map((entry) => entry.count))

  return (
    <section className="rating-summary" aria-labelledby="ratings-heading">
      <h2 id="ratings-heading" className="section-label">Ratings</h2>
      <div className="rating-summary-body">
        <div className="rating-bars-wrap">
          <span className="stars" aria-hidden="true">★</span>
          <ol className="rating-bars">
            {summary.distribution.map(({ rating, count }) => (
              <li key={rating} title={`${rating} out of 5: ${plural(count, 'review')}`}>
                <span className="rating-bar" style={{ height: `${(count / highest) * 100}%` }} />
                <span className="visually-hidden">{rating} out of 5: {plural(count, 'review')}</span>
              </li>
            ))}
          </ol>
          <span className="stars" aria-hidden="true">★★★★★</span>
        </div>
        <div className="rating-average">
          <span className="rating-number">{summary.average ? summary.average.toFixed(1) : '–'}</span>
          {summary.average && <StarRating rating={Math.round(summary.average * 2) / 2} />}
          <span className="muted small">{plural(summary.count, 'review')}</span>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review, isOwn }) {
  return (
    <article className="review-card">
      <span className="avatar" aria-hidden="true">{review.username[0].toUpperCase()}</span>
      <div className="stack-sm">
        <p className="review-meta">
          Review by <b><UserLink id={review.userId} username={review.username} /></b>
          {isOwn && <span className="muted"> (you)</span>}
          <StarRating rating={review.rating} />
        </p>
        {review.comment && <p>{review.comment}</p>}
        <p className="muted small">{formatDate(review.createdAt)}</p>
      </div>
    </article>
  )
}

function BackToBooks() {
  return <Link to="/books" className="back-link">← All books</Link>
}

export default function BookPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(SORTS[0].value)
  const [coverIndex, setCoverIndex] = useState(0)
  const book = useApi(`/books/${id}`)
  const ratings = useApi(`/books/${id}/ratings`)
  const mine = useApi(`/books/${id}/reviews/mine`)
  const reviews = useApi(`/books/${id}/reviews?page=${page}&size=${PAGE_SIZE}&sort=${sort}`)

  const notReviewedYet = mine.error?.status === 404
  const loadError = book.error ?? (notReviewedYet ? null : mine.error)

  if (loadError) {
    return (
      <div className="stack">
        <BackToBooks />
        <p className="alert" role="alert">{loadError.message}</p>
      </div>
    )
  }
  if (!book.data || (!mine.data && !notReviewedYet)) {
    return <p className="muted">Loading book…</p>
  }

  function refreshReviews() {
    reviews.reload()
    ratings.reload()
  }

  async function saveReview(request) {
    const saved = mine.data
      ? await api(`/reviews/${mine.data.id}`, { method: 'PUT', body: request })
      : await api(`/books/${id}/reviews`, { method: 'POST', body: request })
    mine.setData(saved)
    refreshReviews()
  }

  async function deleteReview() {
    await api(`/reviews/${mine.data.id}`, { method: 'DELETE' })
    mine.reload()
    refreshReviews()
  }

  function changeSort(value) {
    setSort(value)
    setPage(0)
  }

  const { title, author, publishedYear, description, coverIds } = book.data

  return (
    <div className="stack">
      <BackToBooks />
      <div className="book-layout">
        <aside className="book-aside stack">
          <BookCover key={coverIds[coverIndex]} coverId={coverIds[coverIndex]} title={title} size="L" alt={`Cover of ${title}`} />
          {coverIds.length > 1 && <CoverGallery title={title} coverIds={coverIds} selected={coverIndex} onSelect={setCoverIndex} />}
        </aside>
        <div className="book-main stack">
          <header className="stack-sm">
            <h1>
              {title} {publishedYear && <span className="book-year">{publishedYear}</span>}
            </h1>
            <p className="lead">by {author}</p>
          </header>
          {description && (
            <div className="book-description">
              {description.split(/\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          )}
          {ratings.data && <RatingSummary summary={ratings.data} />}
          <ReviewForm key={mine.data?.id ?? 'new'} review={mine.data} onSave={saveReview} onDelete={deleteReview} />
          <section className="stack" aria-labelledby="reviews-heading">
            <div className="toolbar">
              <h2 id="reviews-heading">Reviews</h2>
              <SortSelect id="review-sort" options={SORTS} value={sort} onChange={changeSort} />
            </div>
            {reviews.error && <p className="alert" role="alert">{reviews.error.message}</p>}
            {reviews.data && (
              <>
                {reviews.data.content.length === 0 && <p className="muted">No reviews yet. Be the first.</p>}
                {reviews.data.content.map((review) => <ReviewCard key={review.id} review={review} isOwn={review.userId === user.id} />)}
                <Pagination page={reviews.data.page} onChange={setPage} />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
