import { API_ORIGIN } from '../api.js'

export function PresetImage({ preset, className = '' }) {
  return (
    <div className={`club-image club-image-placeholder ${className}`} aria-hidden="true">
      <span>Preset {preset}</span>
    </div>
  )
}

export default function ClubImage({ club, className = '' }) {
  if (club.imageUrl) {
    return <img className={`club-image ${className}`} src={API_ORIGIN + club.imageUrl} alt="" />
  }
  if (club.imagePreset) {
    return <PresetImage preset={club.imagePreset} className={className} />
  }
  return (
    <div className={`club-image club-image-placeholder ${className}`} aria-hidden="true">
      <span className="club-image-initial">{club.name[0].toUpperCase()}</span>
    </div>
  )
}
