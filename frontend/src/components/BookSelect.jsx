import { useApi } from '../hooks/useApi.js'

export default function BookSelect({ id, value, onChange }) {
  const { data } = useApi('/books?size=100&sort=title')

  return (
    <div className="field">
      <label htmlFor={id}>Current book</label>
      <select id={id} name="currentBookId" value={value} onChange={onChange}>
        <option value="">No book yet</option>
        {data?.content.map((book) => (
          <option key={book.id} value={book.id}>{book.title} ({book.author})</option>
        ))}
      </select>
    </div>
  )
}
