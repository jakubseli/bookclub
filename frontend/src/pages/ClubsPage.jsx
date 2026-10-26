import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import Pagination from '../components/Pagination.jsx'

const PAGE_SIZE = 6

function ClubCard({ club, userId }) {
  const isOwner = club.owner.id === userId
  const isMember = club.members.some((member) => member.id === userId)

  return (
    <article className="card stack-sm">
      <div className="card-title">
        <h2>{club.name}</h2>
        {isOwner ? <span className="badge badge-owner">Owner</span> : isMember && <span className="badge badge-member">Member</span>}
      </div>
      {club.description && <p className="muted">{club.description}</p>}
      <p>{club.currentBook ? <>Reading: <b>{club.currentBook.title}</b></> : <span className="muted">No book picked yet</span>}</p>
      <p className="muted small">
        {club.members.length} {club.members.length === 1 ? 'member' : 'members'} · run by {club.owner.username}
      </p>
    </article>
  )
}

export default function ClubsPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    api(`/clubs?page=${page}&size=${PAGE_SIZE}&sort=name`)
      .then((data) => !ignore && setResult(data))
      .catch((e) => !ignore && setError(e.message))
    return () => {
      ignore = true
    }
  }, [page])

  if (error) {
    return <p className="alert" role="alert">{error}</p>
  }
  if (!result) {
    return <p className="muted">Loading clubs…</p>
  }

  return (
    <div className="stack">
      <div>
        <h1>Book clubs</h1>
        <p className="muted">{result.page.totalElements} clubs</p>
      </div>
      {result.content.length === 0 ? (
        <p className="muted">No clubs yet.</p>
      ) : (
        <div className="card-grid">
          {result.content.map((club) => <ClubCard key={club.id} club={club} userId={user.id} />)}
        </div>
      )}
      <Pagination page={result.page} onChange={setPage} />
    </div>
  )
}
