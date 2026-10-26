import { MAX_TAGS } from '../clubs.js'

export default function TagPicker({ options, value, onChange, error }) {
  const full = value.length >= MAX_TAGS

  function toggle(tag) {
    onChange(value.includes(tag) ? value.filter((selected) => selected !== tag) : [...value, tag])
  }

  return (
    <fieldset className="choice-group" aria-describedby={error ? 'tags-error' : undefined}>
      <legend>Tags <span className="muted">(up to {MAX_TAGS})</span></legend>
      <div className="actions">
        {options.map(({ value: tag, label }) => {
          const checked = value.includes(tag)
          return (
            <label key={tag} className="tag-option">
              <input type="checkbox" className="visually-hidden" checked={checked} disabled={!checked && full} onChange={() => toggle(tag)} />
              {label}
            </label>
          )
        })}
      </div>
      {error && <p id="tags-error" className="field-error">{error}</p>}
    </fieldset>
  )
}
