import { useApi } from '../hooks/useApi.js'

export default function BookSelect({ id, value, onChange, error }) {
  const { data } = useApi('/books?size=200&sort=title')

  return (
    <div className="field">
      <label htmlFor={id}>Book *</label>
      <select id={id} value={value} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">Choose a book</option>
        {data?.content.map((book) => (
          <option key={book.id} value={book.id}>{book.title} ({book.author})</option>
        ))}
      </select>
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  )
}
