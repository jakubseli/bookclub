import { useState } from 'react'
import { describeError } from '../api.js'
import BookSelect from './BookSelect.jsx'
import FormField from './FormField.jsx'

function toForm(club) {
  return {
    name: club?.name ?? '',
    description: club?.description ?? '',
    currentBookId: club?.currentBook?.id ?? '',
  }
}

function toClubRequest(form) {
  return {
    name: form.name,
    description: form.description || null,
    currentBookId: form.currentBookId === '' ? null : Number(form.currentBookId),
  }
}

export default function ClubForm({ idPrefix, club, submitLabel, onSubmit }) {
  const [form, setForm] = useState(() => toForm(club))
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setSaved(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    try {
      await onSubmit(toClubRequest(form))
      setSaved(true)
    } catch (e) {
      setError(describeError(e, 'A club with that name already exists.'))
      setFieldErrors(e.fieldErrors)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {error && <p className="alert" role="alert">{error}</p>}
      <div className="row">
        <FormField id={`${idPrefix}-name`} name="name" label="Name *" value={form.name} onChange={handleChange} error={fieldErrors.name} />
        <FormField id={`${idPrefix}-description`} name="description" label="Description" value={form.description} onChange={handleChange} error={fieldErrors.description} />
        <BookSelect id={`${idPrefix}-book`} value={form.currentBookId} onChange={handleChange} />
      </div>
      <div className="actions">
        <button type="submit" className="button button-primary" disabled={submitting}>{submitLabel}</button>
        {saved && <span className="muted" role="status">Saved</span>}
      </div>
    </form>
  )
}
