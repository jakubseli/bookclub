import { useState } from 'react'
import { useClubTags } from '../hooks/useClubTags.js'
import { useSubmit } from '../hooks/useSubmit.js'
import BookSelect from './BookSelect.jsx'
import FormField from './FormField.jsx'
import ImagePicker from './ImagePicker.jsx'
import TagPicker from './TagPicker.jsx'

function toForm(club) {
  return {
    name: club?.name ?? '',
    description: club?.description ?? '',
    tags: club?.tags ?? [],
    currentBookId: club?.currentBook?.id ?? '',
    imagePreset: club ? club.imagePreset : 1,
    imageFile: null,
  }
}

function toClubRequest(form, withBook) {
  return {
    name: form.name,
    description: form.description || null,
    tags: form.tags,
    imagePreset: form.imageFile ? null : form.imagePreset,
    ...(withBook && { currentBookId: form.currentBookId === '' ? null : Number(form.currentBookId) }),
  }
}

export default function ClubForm({ idPrefix, club, withBook = false, submitLabel, onSubmit }) {
  const [form, setForm] = useState(() => toForm(club))
  const [saved, setSaved] = useState(false)
  const { options: tagOptions } = useClubTags()
  const { submit, submitting, error, fieldErrors } = useSubmit('A club with that name already exists.')

  function update(changes) {
    setForm((current) => ({ ...current, ...changes }))
    setSaved(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const succeeded = await submit(async () => {
      const savedClub = await onSubmit(toClubRequest(form, withBook), form.imageFile)
      if (savedClub) {
        setForm(toForm(savedClub))
      }
    })
    setSaved(succeeded)
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {error && <p className="alert" role="alert">{error}</p>}
      <div className="row">
        <FormField id={`${idPrefix}-name`} label="Name *" value={form.name} onChange={(e) => update({ name: e.target.value })} error={fieldErrors.name} />
        <FormField id={`${idPrefix}-description`} label="Description" value={form.description} onChange={(e) => update({ description: e.target.value })} error={fieldErrors.description} />
      </div>
      <TagPicker options={tagOptions} value={form.tags} onChange={(tags) => update({ tags })} error={fieldErrors.tags} />
      <ImagePicker
        currentImageUrl={club?.imageUrl}
        preset={form.imagePreset}
        file={form.imageFile}
        onChange={({ preset, file }) => update({ imagePreset: preset, imageFile: file })}
      />
      {withBook && <BookSelect id={`${idPrefix}-book`} value={form.currentBookId} onChange={(e) => update({ currentBookId: e.target.value })} />}
      <div className="actions">
        <button type="submit" className="button button-primary" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</button>
        {saved && <span className="muted" role="status">Saved</span>}
      </div>
    </form>
  )
}
