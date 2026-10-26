import { Link, useNavigate } from 'react-router'
import { api } from '../api.js'
import ClubForm from '../components/ClubForm.jsx'
import { uploadClubImage } from '../clubs.js'

export default function NewClubPage() {
  const navigate = useNavigate()

  async function create(request, imageFile) {
    const club = await api('/clubs', { method: 'POST', body: request })
    if (imageFile) {
      try {
        await uploadClubImage(club.id, imageFile)
      } catch (e) {
        navigate(`/clubs/${club.id}/settings`, { state: { notice: `The club was created, but its image wasn't saved: ${e.message}` } })
        return
      }
    }
    navigate(`/clubs/${club.id}`)
  }

  return (
    <div className="stack readable">
      <Link to="/clubs" className="back-link">← All clubs</Link>
      <div>
        <h1>Start a club</h1>
        <p className="muted">You'll pick the first book once the club exists.</p>
      </div>
      <section className="card" aria-label="New club">
        <ClubForm idPrefix="new-club" submitLabel="Create club" onSubmit={create} />
      </section>
    </div>
  )
}
