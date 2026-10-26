import { useState } from 'react'
import { useSubmit } from '../hooks/useSubmit.js'
import StarInput from './StarInput.jsx'

export default function ReviewForm({ review, onSave, onDelete }) {
  const [rating, setRating] = useState(review?.rating ?? null)
  const [comment, setComment] = useState(review?.comment ?? '')
  const [saved, setSaved] = useState(false)
  const { submit, submitting, error, fieldErrors } = useSubmit('You have already reviewed this book.')

  async function handleSubmit(event) {
    event.preventDefault()
    setSaved(await submit(() => onSave({ rating, comment: comment || null })))
  }

  function handleDelete() {
    if (window.confirm('Delete your review of this book?')) {
      setSaved(false)
      submit(onDelete)
    }
  }

  return (
    <form className="card stack" onSubmit={handleSubmit} noValidate aria-labelledby="review-form-heading">
      <div>
        <h2 id="review-form-heading">{review ? 'Your review' : 'Write a review'}</h2>
        <p className="muted small">You can review each book once and change it any time.</p>
      </div>
      {error && <p className="alert" role="alert">{error}</p>}
      <StarInput value={rating} onChange={setRating} error={fieldErrors.rating} />
      <div className="field">
        <label htmlFor="review-comment">Comment</label>
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby={fieldErrors.comment ? 'review-comment-error' : 'review-comment-hint'}
        />
        {fieldErrors.comment
          ? <p id="review-comment-error" className="field-error">{fieldErrors.comment}</p>
          : <p id="review-comment-hint" className="hint">Optional, up to 1000 characters</p>}
      </div>
      <div className="actions">
        <button type="submit" className="button button-primary" disabled={submitting}>{review ? 'Save review' : 'Post review'}</button>
        {review && <button type="button" className="button button-danger" disabled={submitting} onClick={handleDelete}>Delete review</button>}
        {saved && <span className="muted" role="status">Saved</span>}
      </div>
    </form>
  )
}
