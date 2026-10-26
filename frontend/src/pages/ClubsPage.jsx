import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import ClubForm from '../components/ClubForm.jsx'
import Pagination from '../components/Pagination.jsx'
import { plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'

const PAGE_SIZE = 6
const SORTS = [
  { value: 'name,asc', label: 'Name A–Z' },
  { value: 'name,desc', label: 'Name Z–A' },
  { value: 'id,desc', label: 'Newest first' },
]

function ClubCard({ club, userId, onJoin }) {
  const isOwner = club.owner.id === userId
  const isMember = club.members.some((member) => member.id === userId)

  return (
    <article className="card stack-sm">
      <div className="card-title">
        <h2><Link to={`/clubs/${club.id}`} className="plain-link">{club.name}</Link></h2>
        {isOwner ? <span className="badge badge-owner">Owner</span> : isMember && <span className="badge badge-member">Member</span>}
      </div>
      {club.description && <p className="muted">{club.description}</p>}
      <p>{club.currentBook ? <>Reading: <b>{club.currentBook.title}</b></> : <span className="muted">No book picked yet</span>}</p>
      <p className="muted small">
        {plural(club.members.length, 'member')} · run by {club.owner.username}
      </p>
      <div className="actions">
        {isMember ? (
          <Link to={`/clubs/${club.id}`} className="button">Open</Link>
        ) : (
          <button type="button" className="button button-primary" onClick={() => onJoin(club.id)}>Join</button>
        )}
      </div>
    </article>
  )
}

export default function ClubsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(SORTS[0].value)
  const [joinError, setJoinError] = useState(null)
  const { data: result, error } = useApi(`/clubs?page=${page}&size=${PAGE_SIZE}&sort=${sort}`)

  async function createClub(request) {
    const club = await api('/clubs', { method: 'POST', body: request })
    navigate(`/clubs/${club.id}`)
  }

  async function joinClub(clubId) {
    try {
      await api(`/clubs/${clubId}/members/${user.id}`, { method: 'POST' })
      navigate(`/clubs/${clubId}`)
    } catch (e) {
      setJoinError(e.message)
    }
  }

  function changeSort(event) {
    setSort(event.target.value)
    setPage(0)
  }

  return (
    <div className="stack">
      <div>
        <h1>Book clubs</h1>
        <p className="muted">Join a club or start your own.</p>
      </div>
      <section className="card stack" aria-labelledby="start-club-heading">
        <h2 id="start-club-heading">Start a club</h2>
        <ClubForm idPrefix="new-club" submitLabel="Create club" onSubmit={createClub} />
      </section>
      {error && <p className="alert" role="alert">{error}</p>}
      {joinError && <p className="alert" role="alert">{joinError}</p>}
      {result && (
        <>
          <div className="toolbar">
            <p className="muted">{plural(result.page.totalElements, 'club')}</p>
            <div className="inline-field">
              <label htmlFor="club-sort">Sort by</label>
              <select id="club-sort" value={sort} onChange={changeSort}>
                {SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          {result.content.length === 0 ? (
            <p className="muted">No clubs yet. Start the first one above.</p>
          ) : (
            <div className="card-grid">
              {result.content.map((club) => <ClubCard key={club.id} club={club} userId={user.id} onJoin={joinClub} />)}
            </div>
          )}
          <Pagination page={result.page} onChange={setPage} />
        </>
      )}
    </div>
  )
}
