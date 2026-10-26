import { useState } from 'react'
import { Link } from 'react-router'
import Pagination from '../components/Pagination.jsx'
import { plural } from '../format.js'
import { useApi } from '../hooks/useApi.js'

const PAGE_SIZE = 10
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

  function changeSort(event) {
    setSort(event.target.value)
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
            <div className="inline-field">
              <label htmlFor="book-sort">Sort by</label>
              <select id="book-sort" value={sort} onChange={changeSort}>
                {SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <div className="table-box">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Author</th>
                  <th scope="col">Year</th>
                </tr>
              </thead>
              <tbody>
                {result.content.map((book) => (
                  <tr key={book.id}>
                    <td><Link to={`/books/${book.id}`} className="plain-link"><b>{book.title}</b></Link></td>
                    <td>{book.author}</td>
                    <td>{book.publishedYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={result.page} onChange={setPage} />
        </>
      )}
    </div>
  )
}
