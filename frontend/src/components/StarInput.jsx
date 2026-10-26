import { useState } from 'react'

const STEPS = Array.from({ length: 10 }, (_, index) => (index + 1) / 2)

export default function StarInput({ value, onChange, error }) {
  const [hovered, setHovered] = useState(null)
  const shown = hovered ?? value ?? 0

  function select(step) {
    setHovered(null)
    onChange(step)
  }

  return (
    <fieldset className="star-input" aria-describedby={error ? 'rating-error' : undefined}>
      <legend>Rating *</legend>
      <div className="actions">
        <div className="star-halves" onMouseLeave={() => setHovered(null)}>
          {STEPS.map((step) => (
            <label
              key={step}
              className={`star-half${step % 1 ? ' star-half-left' : ''}${shown >= step ? ' star-half-on' : ''}`}
              onMouseEnter={() => setHovered(step)}
            >
              <input type="radio" name="rating" className="visually-hidden" value={step} checked={value === step} onChange={() => select(step)} />
              <span className="star-glyph" aria-hidden="true">★</span>
              <span className="visually-hidden">{step} out of 5</span>
            </label>
          ))}
        </div>
        <span className="muted">{value ? `${value} out of 5` : 'Pick a rating'}</span>
      </div>
      {error && <p id="rating-error" className="field-error">{error}</p>}
    </fieldset>
  )
}
