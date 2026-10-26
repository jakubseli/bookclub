import { useEffect, useMemo, useState } from 'react'
import { API_ORIGIN } from '../api.js'
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from '../clubs.js'
import { PresetImage } from './ClubImage.jsx'
import { PRESETS } from './clubPresets.jsx'

export default function ImagePicker({ currentImageUrl, preset, file, onChange }) {
  const [fileError, setFileError] = useState(null)
  const previewUrl = useMemo(() => file && URL.createObjectURL(file), [file])
  const selected = file ? 'upload' : preset ? `preset-${preset}` : currentImageUrl ? 'current' : null

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl])

  function chooseFile(event) {
    const chosen = event.target.files[0]
    event.target.value = ''
    if (!chosen) {
      return
    }
    if (!IMAGE_TYPES.includes(chosen.type)) {
      setFileError('Pick a JPEG, PNG or WebP image.')
    } else if (chosen.size > MAX_IMAGE_BYTES) {
      setFileError('The image must be 2 MB or smaller.')
    } else {
      setFileError(null)
      onChange({ preset: null, file: chosen })
    }
  }

  return (
    <fieldset className="choice-group" aria-describedby={fileError ? 'image-error' : undefined}>
      <legend>Image</legend>
      <div className="image-picker">
        {currentImageUrl && (
          <label className="image-option">
            <input type="radio" name="club-image" className="visually-hidden" checked={selected === 'current'} onChange={() => onChange({ preset: null, file: null })} />
            <img className="club-image" src={API_ORIGIN + currentImageUrl} alt="" />
            <span>Current image</span>
          </label>
        )}
        {PRESETS.map(({ name }, index) => (
          <label key={name} className="image-option">
            <input type="radio" name="club-image" className="visually-hidden" checked={selected === `preset-${index + 1}`} onChange={() => onChange({ preset: index + 1, file: null })} />
            <PresetImage preset={index + 1} />
            <span className="visually-hidden">{name}</span>
          </label>
        ))}
        <label className="image-option image-option-upload">
          <input type="radio" name="club-image" className="visually-hidden" checked={selected === 'upload'} disabled={!file} onChange={() => {}} />
          {previewUrl ? <img className="club-image" src={previewUrl} alt="" /> : <span className="club-image club-image-placeholder">+</span>}
          <span>{file ? file.name : 'Your own image'}</span>
        </label>
      </div>
      <div className="actions">
        <label className="button" htmlFor="club-image-file">Upload an image…</label>
        <input id="club-image-file" type="file" className="visually-hidden" accept={IMAGE_TYPES.join(',')} onChange={chooseFile} />
        <span className="muted small">JPEG, PNG or WebP, up to 2 MB</span>
      </div>
      {fileError && <p id="image-error" className="field-error">{fileError}</p>}
    </fieldset>
  )
}
