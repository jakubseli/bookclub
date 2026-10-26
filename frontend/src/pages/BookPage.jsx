import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import Pagination from '../components/Pagination.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import SortSelect from '../components/SortSelect.jsx'
import { plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'

const PAGE_SIZE = 5
const SORTS = [
  { value: 'id,desc', label: 'Newest first' },
  { value: 'rating,desc', label: 'Highest rating' },
  { value: 'rating,asc', label: 'Lowest rating' },
]

function ReviewCard({ review, isOwn }) {
  return (
    <article className="card stack-sm">
      <div className="title-row">
        <span className="avatar" aria-hidden="true">{review.username[0].toUpperCase()}</span>
        <b>{review.username}</b>
        {isOwn && <span className="muted">(you)</span>}
        <span className="rating">{review.rating} / 5</span>
      </div>
      {review.comment ? <p>{review.comment}</p> : <p className="muted"><i>No comment</i></p>}
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
  const book = useApi(`/books/${id}`)
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

  async function saveReview(request) {
    const saved = mine.data
      ? await api(`/reviews/${mine.data.id}`, { method: 'PUT', body: request })
      : await api(`/books/${id}/reviews`, { method: 'POST', body: request })
    mine.setData(saved)
    reviews.reload()
  }

  async function deleteReview() {
    await api(`/reviews/${mine.data.id}`, { method: 'DELETE' })
    mine.reload()
    reviews.reload()
  }

  function changeSort(value) {
    setSort(value)
    setPage(0)
  }

  const { title, author, publishedYear } = book.data

  return (
    <div className="stack readable">
      <BackToBooks />
      <div className="stack-sm">
        <h1>{title}</h1>
        <p className="lead">{author}{publishedYear && ` · ${publishedYear}`}</p>
        {reviews.data && <p className="muted small">{plural(reviews.data.page.totalElements, 'review')}</p>}
      </div>
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
  )
}
