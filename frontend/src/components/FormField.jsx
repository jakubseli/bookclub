export default function FormField({ id, label, error, hint, ...inputProps }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...inputProps}
      />
      {error ? <p id={errorId} className="field-error">{error}</p> : hint && <p id={hintId} className="hint">{hint}</p>}
    </div>
  )
}
