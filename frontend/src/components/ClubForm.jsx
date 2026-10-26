import { useState } from 'react'
import { useSubmit } from '../hooks/useSubmit.js'
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
  const [saved, setSaved] = useState(false)
  const { submit, submitting, error, fieldErrors } = useSubmit('A club with that name already exists.')

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setSaved(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaved(await submit(() => onSubmit(toClubRequest(form))))
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
