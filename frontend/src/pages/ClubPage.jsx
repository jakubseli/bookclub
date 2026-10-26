import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import ClubForm from '../components/ClubForm.jsx'
import { plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'

function RecentReviews({ bookId }) {
  const { data } = useApi(`/books/${bookId}/reviews?size=2&sort=id,desc`)

  if (!data) {
    return null
  }
  return (
    <section className="card stack-sm" aria-labelledby="recent-reviews-heading">
      <h2 id="recent-reviews-heading">Recent reviews</h2>
      {data.content.length === 0 && <p className="muted">Nobody has reviewed this book yet.</p>}
      {data.content.map((review) => (
        <article key={review.id} className="review">
          <p><b>{review.username}</b> <span className="rating">{review.rating} / 5</span></p>
          {review.comment && <p className="muted">{review.comment}</p>}
        </article>
      ))}
    </section>
  )
}

function CurrentBook({ book }) {
  return (
    <section className="card stack-sm" aria-labelledby="current-book-heading">
      <h2 id="current-book-heading" className="section-label">Currently reading</h2>
      {book ? (
        <>
          <p className="book-title">{book.title}</p>
          <p className="muted">{book.author}{book.publishedYear && ` · ${book.publishedYear}`}</p>
        </>
      ) : (
        <p className="muted">No book picked yet.</p>
      )}
    </section>
  )
}

function MemberList({ club, userId }) {
  return (
    <section className="card stack-sm" aria-labelledby="members-heading">
      <h2 id="members-heading">Members ({club.members.length})</h2>
      <ul className="member-list">
        {club.members.map((member) => (
          <li key={member.id}>
            <span className="avatar" aria-hidden="true">{member.username[0].toUpperCase()}</span>
            <span>
              {member.username}
              {member.id === userId && <span className="muted"> (you)</span>}
              {member.id === club.owner.id && <span className="muted"> · owner</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ClubPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: club, error, setData } = useApi(`/clubs/${id}`)
  const [actionError, setActionError] = useState(null)

  if (error) {
    return (
      <div className="stack">
        <Link to="/clubs" className="back-link">← All clubs</Link>
        <p className="alert" role="alert">{error}</p>
      </div>
    )
  }
  if (!club) {
    return <p className="muted">Loading club…</p>
  }

  const isOwner = club.owner.id === user.id
  const isMember = club.members.some((member) => member.id === user.id)
  const membersPath = `/clubs/${id}/members/${user.id}`

  async function run(action) {
    setActionError(null)
    try {
      await action()
    } catch (e) {
      setActionError(e.message)
    }
  }

  const join = () => run(async () => setData(await api(membersPath, { method: 'POST' })))
  const leave = () => run(async () => {
    await api(membersPath, { method: 'DELETE' })
    setData(await api(`/clubs/${id}`))
  })
  const save = async (request) => setData(await api(`/clubs/${id}`, { method: 'PUT', body: request }))
  const remove = () => run(async () => {
    if (window.confirm(`Delete "${club.name}" for everyone? This can't be undone.`)) {
      await api(`/clubs/${id}`, { method: 'DELETE' })
      navigate('/clubs')
    }
  })

  return (
    <div className="stack">
      <Link to="/clubs" className="back-link">← All clubs</Link>
      <div className="toolbar">
        <div className="stack-sm">
          <div className="title-row">
            <h1>{club.name}</h1>
            {isOwner ? <span className="badge badge-owner">You run this club</span> : isMember && <span className="badge badge-member">You're a member</span>}
          </div>
          {club.description && <p className="muted">{club.description}</p>}
          <p className="muted small">Run by {club.owner.username} · {plural(club.members.length, 'member')}</p>
        </div>
        {!isMember && <button type="button" className="button button-primary" onClick={join}>Join club</button>}
        {isMember && !isOwner && <button type="button" className="button button-danger" onClick={leave}>Leave club</button>}
      </div>
      {actionError && <p className="alert" role="alert">{actionError}</p>}
      <div className="two-column">
        <div className="column-main stack">
          {isOwner && (
            <section className="card stack" aria-labelledby="edit-club-heading">
              <h2 id="edit-club-heading">Edit club</h2>
              <ClubForm key={club.id} idPrefix="edit-club" club={club} submitLabel="Save changes" onSubmit={save} />
            </section>
          )}
          <CurrentBook book={club.currentBook} />
          {club.currentBook && <RecentReviews bookId={club.currentBook.id} />}
        </div>
        <div className="column-side">
          <MemberList club={club} userId={user.id} />
        </div>
      </div>
      {isOwner && (
        <section className="card danger-zone toolbar" aria-labelledby="delete-club-heading">
          <div className="stack-sm">
            <h2 id="delete-club-heading">Delete this club</h2>
            <p className="muted">The club is removed for everyone. Its members keep their accounts.</p>
          </div>
          <button type="button" className="button button-danger" onClick={remove}>Delete club</button>
        </section>
      )}
    </div>
  )
}
