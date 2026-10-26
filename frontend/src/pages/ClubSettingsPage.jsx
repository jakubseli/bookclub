import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import ClubForm from '../components/ClubForm.jsx'
import PageError from '../components/PageError.jsx'
import { uploadClubImage } from '../clubs.js'
import { useApi } from '../hooks/useApi.js'
import { useSubmit } from '../hooks/useSubmit.js'

export default function ClubSettingsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const notice = useLocation().state?.notice
  const { data: club, error, setData } = useApi(`/clubs/${id}`)
  const { submit, error: deleteError } = useSubmit()
  const backLink = <Link to={`/clubs/${id}`} className="back-link">← Back to the club</Link>

  if (error) {
    return <PageError back={backLink} message={error.message} />
  }
  if (!club) {
    return <p className="muted">Loading club…</p>
  }
  if (club.owner.id !== user.id) {
    return <PageError back={backLink} message="Only the club's owner can change its settings." />
  }

  async function save(request, imageFile) {
    let saved = await api(`/clubs/${id}`, { method: 'PUT', body: request })
    if (imageFile) {
      saved = await uploadClubImage(id, imageFile)
    }
    setData(saved)
    return saved
  }

  function remove() {
    if (window.confirm(`Delete "${club.name}" for everyone? This can't be undone.`)) {
      submit(async () => {
        await api(`/clubs/${id}`, { method: 'DELETE' })
        navigate('/clubs')
      })
    }
  }

  return (
    <div className="stack readable">
      {backLink}
      <div>
        <h1>Club settings</h1>
        <p className="muted">{club.name}</p>
      </div>
      {notice && <p className="alert" role="alert">{notice}</p>}
      <section className="card" aria-label="Club details">
        <ClubForm key={club.id} idPrefix="club-settings" club={club} submitLabel="Save changes" onSubmit={save} />
      </section>
      <section className="card danger-zone toolbar" aria-labelledby="delete-club-heading">
        <div className="stack-sm">
          <h2 id="delete-club-heading">Delete this club</h2>
          <p className="muted">The club is removed for everyone. Its members keep their accounts.</p>
          {deleteError && <p className="alert" role="alert">{deleteError}</p>}
        </div>
        <button type="button" className="button button-danger" onClick={remove}>Delete club</button>
      </section>
    </div>
  )
}
