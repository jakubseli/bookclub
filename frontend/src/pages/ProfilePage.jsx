import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import BookCover from '../components/BookCover.jsx'
import ClubImage from '../components/ClubImage.jsx'
import Pagination from '../components/Pagination.jsx'
import StarRating from '../components/StarRating.jsx'
import { formatDate, plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'

function ProfileReview({ review }) {
  const { book } = review
  return (
    <article className="profile-review">
      <Link to={`/books/${book.id}`} className="profile-review-cover">
        <BookCover coverId={book.coverId} title={book.title} />
      </Link>
      <div className="stack-sm">
        <p className="review-meta">
          <Link to={`/books/${book.id}`} className="plain-link"><b>{book.title}</b></Link>
          {book.publishedYear && <span className="muted">{book.publishedYear}</span>}
        </p>
        <StarRating rating={review.rating} />
        {review.comment && <p>{review.comment}</p>}
        <p className="muted small">Reviewed {formatDate(review.createdAt)}</p>
      </div>
    </article>
  )
}

function ClubRow({ club }) {
  return (
    <li className="club-row">
      <Link to={`/clubs/${club.id}`} className="club-row-image" tabIndex={-1} aria-hidden="true">
        <ClubImage club={club} />
      </Link>
      <div>
        <Link to={`/clubs/${club.id}`} className="plain-link"><b>{club.name}</b></Link>
        <p className="muted small">{plural(club.members.length, 'member')}</p>
      </div>
    </li>
  )
}

function Profile({ id }) {
  const { user } = useAuth()
  const [reviewPage, setReviewPage] = useState(0)
  const [clubPage, setClubPage] = useState(0)
  const profile = useApi(`/users/${id}/profile`)
  const reviews = useApi(`/users/${id}/reviews?page=${reviewPage}&size=5&sort=createdAt,desc`)
  const clubs = useApi(`/clubs?memberId=${id}&page=${clubPage}&size=8&sort=name`)

  if (profile.error) {
    return <p className="alert" role="alert">{profile.error.message}</p>
  }
  if (!profile.data) {
    return <p className="muted">Loading profile…</p>
  }

  const { username } = profile.data
  const isOwn = Number(id) === user.id
  const counts = [reviews.data && plural(reviews.data.page.totalElements, 'review'), clubs.data && plural(clubs.data.page.totalElements, 'club')]

  return (
    <div className="stack">
      <header className="profile-header">
        <span className="avatar avatar-large" aria-hidden="true">{username[0].toUpperCase()}</span>
        <div className="stack-sm">
          <h1>{username}{isOwn && <span className="muted"> (you)</span>}</h1>
          <p className="muted">{counts.filter(Boolean).join(' · ')}</p>
        </div>
        {isOwn && <Link to="/settings" className="button profile-settings">Settings</Link>}
      </header>
      <div className="two-column">
        <section className="column-main stack" aria-labelledby="profile-reviews-heading">
          <h2 id="profile-reviews-heading">Recent reviews</h2>
          {reviews.error && <p className="alert" role="alert">{reviews.error.message}</p>}
          {reviews.data && (
            <>
              {reviews.data.content.length === 0 && <p className="muted">No reviews yet.</p>}
              {reviews.data.content.map((review) => <ProfileReview key={review.id} review={review} />)}
              <Pagination page={reviews.data.page} onChange={setReviewPage} />
            </>
          )}
        </section>
        <section className="column-side card stack" aria-labelledby="profile-clubs-heading">
          <h2 id="profile-clubs-heading">Clubs</h2>
          {clubs.error && <p className="alert" role="alert">{clubs.error.message}</p>}
          {clubs.data && (
            <>
              {clubs.data.content.length === 0 && <p className="muted">Not in any clubs yet.</p>}
              <ul className="club-rows">
                {clubs.data.content.map((club) => <ClubRow key={club.id} club={club} />)}
              </ul>
              <Pagination page={clubs.data.page} onChange={setClubPage} />
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { id } = useParams()
  return <Profile key={id} id={id} />
}
