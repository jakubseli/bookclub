import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import BookSelect from '../components/BookSelect.jsx'
import FormField from '../components/FormField.jsx'
import { useApi } from '../hooks/useApi.js'
import { useSubmit } from '../hooks/useSubmit.js'

const DEFAULT_LENGTH_DAYS = 28

function toDay(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')
}

function initialPeriod(club) {
  if (club.readingFrom) {
    return { from: club.readingFrom, until: club.readingUntil }
  }
  const today = new Date()
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + DEFAULT_LENGTH_DAYS)
  return { from: toDay(today), until: toDay(end) }
}

function ReadingForm({ club }) {
  const navigate = useNavigate()
  const [bookId, setBookId] = useState(club.currentBook?.id ?? '')
  const [period, setPeriod] = useState(() => initialPeriod(club))
  const { submit, submitting, error, fieldErrors } = useSubmit()

  function handleSubmit(event) {
    event.preventDefault()
    submit(async () => {
      const request = { bookId: bookId === '' ? null : Number(bookId), from: period.from || null, until: period.until || null }
      await api(`/clubs/${club.id}/reading`, { method: 'PUT', body: request })
      navigate(`/clubs/${club.id}`)
    })
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {error && <p className="alert" role="alert">{error}</p>}
      <BookSelect id="reading-book" value={bookId} onChange={(e) => setBookId(e.target.value)} error={fieldErrors.bookId} />
      <div className="row">
        <FormField id="reading-from" label="From *" type="date" value={period.from} onChange={(e) => setPeriod({ ...period, from: e.target.value })} error={fieldErrors.from} />
        <FormField id="reading-until" label="Until *" type="date" min={period.from} value={period.until} onChange={(e) => setPeriod({ ...period, until: e.target.value })} error={fieldErrors.until ?? fieldErrors.periodValid} />
      </div>
      <div className="actions">
        <button type="submit" className="button button-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
        <Link to={`/clubs/${club.id}`} className="button">Cancel</Link>
      </div>
    </form>
  )
}

export default function ReadingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: club, error } = useApi(`/clubs/${id}`)
  const backLink = <Link to={`/clubs/${id}`} className="back-link">← Back to the club</Link>

  if (error) {
    return (
      <div className="stack">
        {backLink}
        <p className="alert" role="alert">{error.message}</p>
      </div>
    )
  }
  if (!club) {
    return <p className="muted">Loading club…</p>
  }
  if (club.owner.id !== user.id) {
    return (
      <div className="stack">
        {backLink}
        <p className="alert" role="alert">Only the club's owner can choose what the club reads.</p>
      </div>
    )
  }

  return (
    <div className="stack readable">
      {backLink}
      <div>
        <h1>{club.currentBook ? 'Change the book' : 'Pick the first book'}</h1>
        <p className="muted">{club.name}</p>
      </div>
      <section className="card" aria-label="Book and reading period">
        <ReadingForm club={club} />
      </section>
    </div>
  )
}
