import { API_ORIGIN } from '../api.js'
import { PRESETS } from './clubPresets.jsx'

export function PresetImage({ preset, className = '' }) {
  return (
    <svg className={`club-image ${className}`} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {PRESETS[preset - 1].art}
    </svg>
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
