import { formatDay, readingStatus } from '../format.js'

export default function SunPath({ from, until }) {
  const { progress, label } = readingStatus(from, until)
  const angle = Math.PI * (1 - progress)
  const x = (180 + 100 * Math.cos(angle)).toFixed(1)
  const y = (120 - 100 * Math.sin(angle)).toFixed(1)

  return (
    <div className="stack-sm">
      <svg className="sun-path" viewBox="0 0 360 140" aria-hidden="true">
        <path className="sun-track" d="M 80 120 A 100 100 0 0 1 280 120" />
        {progress > 0 && <path className="sun-progress" d={`M 80 120 A 100 100 0 0 1 ${x} ${y}`} />}
        <circle className="sun-ring" cx={x} cy={y} r="24" />
        <circle className="sun-disc" cx={x} cy={y} r="16" />
        <rect className="sun-ground" x="40" y="128" width="280" height="8" />
      </svg>
      <p className="sun-path-labels">
        <span className="muted">{formatDay(from)}</span>
        <b>{label}</b>
        <span className="muted">{formatDay(until)}</span>
      </p>
    </div>
  )
}
