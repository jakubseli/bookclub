import { Link, useParams } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import BookCover from '../components/BookCover.jsx'
import ClubImage from '../components/ClubImage.jsx'
import StarRating from '../components/StarRating.jsx'
import SunPath from '../components/SunPath.jsx'
import TagList from '../components/TagList.jsx'
import UserLink from '../components/UserLink.jsx'
import { plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'
import { useClubTags } from '../hooks/useClubTags.js'
import { useSubmit } from '../hooks/useSubmit.js'

function RecentReviews({ bookId }) {
  const { data } = useApi(`/books/${bookId}/reviews?size=2&sort=createdAt,desc`)

  if (!data) {
    return null
  }
  return (
    <section className="card stack-sm" aria-labelledby="recent-reviews-heading">
      <h2 id="recent-reviews-heading">Recent reviews</h2>
      {data.content.length === 0 && <p className="muted">Nobody has reviewed this book yet.</p>}
      {data.content.map((review) => (
        <article key={review.id} className="review">
          <p className="review-meta"><b><UserLink id={review.userId} username={review.username} /></b> <StarRating rating={review.rating} /></p>
          {review.comment && <p className="muted">{review.comment}</p>}
        </article>
      ))}
    </section>
  )
}

function CurrentBook({ club, readingPath }) {
  const book = club.currentBook
  return (
    <section className="card stack-sm" aria-labelledby="current-book-heading">
      <h2 id="current-book-heading" className="section-label">Currently reading</h2>
      {book ? (
        <div className="current-book">
          <Link to={`/books/${book.id}`} className="current-book-cover">
            <BookCover coverId={book.coverId} title={book.title} alt={`Cover of ${book.title}`} />
          </Link>
          <div className="stack-sm">
            <p className="book-title">{book.title}</p>
            <p className="muted">{book.author}{book.publishedYear && ` · ${book.publishedYear}`}</p>
            {club.readingFrom && <SunPath from={club.readingFrom} until={club.readingUntil} />}
            <Link to={`/books/${book.id}`} className="back-link">See all reviews of this book →</Link>
            {readingPath && <Link to={readingPath} className="button align-start">Change book</Link>}
          </div>
        </div>
      ) : (
        <>
          <p className="muted">No book picked yet.</p>
          {readingPath && <Link to={readingPath} className="button button-primary align-start">Pick the first book</Link>}
        </>
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
              <UserLink id={member.id} username={member.username} />
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
  const { labelOf } = useClubTags()
  const { data: club, error, setData } = useApi(`/clubs/${id}`)
  const { submit, error: actionError } = useSubmit()

  if (error) {
    return (
      <div className="stack">
        <Link to="/clubs" className="back-link">← All clubs</Link>
        <p className="alert" role="alert">{error.message}</p>
      </div>
    )
  }
  if (!club) {
    return <p className="muted">Loading club…</p>
  }

  const isOwner = club.owner.id === user.id
  const isMember = club.members.some((member) => member.id === user.id)
  const membersPath = `/clubs/${id}/members/${user.id}`
  const settingsPath = `/clubs/${id}/settings`

  const join = () => submit(async () => setData(await api(membersPath, { method: 'POST' })))
  const leave = () => submit(async () => {
    await api(membersPath, { method: 'DELETE' })
    setData(await api(`/clubs/${id}`))
  })

  return (
    <div className="stack">
      <Link to="/clubs" className="back-link">← All clubs</Link>
      <header className="club-header">
        <ClubImage club={club} className="club-header-image" />
        <div className="club-header-body stack">
          <div className="stack-sm">
            <div className="title-row">
              <h1>{club.name}</h1>
              {isOwner ? <span className="badge badge-owner">You run this club</span> : isMember && <span className="badge badge-member">You're a member</span>}
            </div>
            <TagList tags={club.tags} labelOf={labelOf} />
          </div>
          {club.description && <p className="lead">{club.description}</p>}
          <p className="muted small">Run by <UserLink id={club.owner.id} username={club.owner.username} /> · {plural(club.members.length, 'member')}</p>
          {!isMember && <button type="button" className="button button-primary align-start" onClick={join}>Join club</button>}
          {isMember && !isOwner && <button type="button" className="button button-danger align-start" onClick={leave}>Leave club</button>}
        </div>
      </header>
      {actionError && <p className="alert" role="alert">{actionError}</p>}
      <div className="two-column">
        <div className="column-main stack">
          <CurrentBook club={club} readingPath={isOwner ? `/clubs/${id}/reading` : null} />
          {club.currentBook && <RecentReviews bookId={club.currentBook.id} />}
        </div>
        <div className="column-side stack">
          {isOwner && (
            <section className="card stack-sm" aria-labelledby="settings-heading">
              <h2 id="settings-heading">Club settings</h2>
              <p className="muted">Change the name, description, tags or image, or delete the club.</p>
              <Link to={settingsPath} className="button align-start">Open settings</Link>
            </section>
          )}
          <MemberList club={club} userId={user.id} />
        </div>
      </div>
    </div>
  )
}
