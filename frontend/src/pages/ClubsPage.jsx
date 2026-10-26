import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import ClubImage from '../components/ClubImage.jsx'
import Pagination from '../components/Pagination.jsx'
import SortSelect from '../components/SortSelect.jsx'
import TagList from '../components/TagList.jsx'
import { plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'
import { useClubTags } from '../hooks/useClubTags.js'
import { useSubmit } from '../hooks/useSubmit.js'

const PAGE_SIZE = 6
const SORTS = [
  { value: 'name,asc', label: 'Name A–Z' },
  { value: 'name,desc', label: 'Name Z–A' },
  { value: 'id,desc', label: 'Newest first' },
]

function ClubCard({ club, userId, labelOf, onJoin }) {
  const isOwner = club.owner.id === userId
  const isMember = club.members.some((member) => member.id === userId)

  return (
    <article className="card club-card">
      <ClubImage club={club} />
      <div className="stack-sm club-card-body">
        <div className="card-title">
          <h2><Link to={`/clubs/${club.id}`} className="plain-link">{club.name}</Link></h2>
          {isOwner ? <span className="badge badge-owner">Owner</span> : isMember && <span className="badge badge-member">Member</span>}
        </div>
        <TagList tags={club.tags} labelOf={labelOf} />
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
      </div>
    </article>
  )
}

export default function ClubsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(SORTS[0].value)
  const { labelOf } = useClubTags()
  const { submit, error: joinError } = useSubmit()
  const { data: result, error } = useApi(`/clubs?page=${page}&size=${PAGE_SIZE}&sort=${sort}`)

  const joinClub = (clubId) => submit(async () => {
    await api(`/clubs/${clubId}/members/${user.id}`, { method: 'POST' })
    navigate(`/clubs/${clubId}`)
  })

  function changeSort(value) {
    setSort(value)
    setPage(0)
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <div>
          <h1>Book clubs</h1>
          <p className="muted">Join a club or start your own.</p>
        </div>
        <Link to="/clubs/new" className="button button-primary">Start a club</Link>
      </div>
      {error && <p className="alert" role="alert">{error.message}</p>}
      {joinError && <p className="alert" role="alert">{joinError}</p>}
      {result && (
        <>
          <div className="toolbar">
            <p className="muted">{plural(result.page.totalElements, 'club')}</p>
            <SortSelect id="club-sort" options={SORTS} value={sort} onChange={changeSort} />
          </div>
          {result.content.length === 0 ? (
            <p className="muted">No clubs yet. <Link to="/clubs/new">Start the first one.</Link></p>
          ) : (
            <div className="card-grid">
              {result.content.map((club) => <ClubCard key={club.id} club={club} userId={user.id} labelOf={labelOf} onJoin={joinClub} />)}
            </div>
          )}
          <Pagination page={result.page} onChange={setPage} />
        </>
      )}
    </div>
  )
}
