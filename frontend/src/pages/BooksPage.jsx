import { useState } from 'react'
import { Link } from 'react-router'
import BookCover from '../components/BookCover.jsx'
import Pagination from '../components/Pagination.jsx'
import SortSelect from '../components/SortSelect.jsx'
import { plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'

const PAGE_SIZE = 24
const SORTS = [
  { value: 'title,asc', label: 'Title' },
  { value: 'author,asc', label: 'Author' },
  { value: 'publishedYear,asc', label: 'Year, oldest first' },
  { value: 'publishedYear,desc', label: 'Year, newest first' },
]

export default function BooksPage() {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(SORTS[0].value)
  const { data: result, error } = useApi(`/books?page=${page}&size=${PAGE_SIZE}&sort=${sort}`)

  function changeSort(value) {
    setSort(value)
    setPage(0)
  }

  return (
    <div className="stack">
      <div>
        <h1>Books</h1>
        <p className="muted">The books clubs can read. Open one to see or write reviews.</p>
      </div>
      {error && <p className="alert" role="alert">{error.message}</p>}
      {result && (
        <>
          <div className="toolbar">
            <p className="muted">{plural(result.page.totalElements, 'book')}</p>
            <SortSelect id="book-sort" options={SORTS} value={sort} onChange={changeSort} />
          </div>
          <ul className="book-grid">
            {result.content.map((book) => (
              <li key={book.id}>
                <Link to={`/books/${book.id}`} className="book-card">
                  <BookCover coverId={book.coverId} title={book.title} />
                  <span className="book-card-title">{book.title}</span>
                  <span className="book-card-author">{book.author}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination page={result.page} onChange={setPage} />
        </>
      )}
    </div>
  )
}
