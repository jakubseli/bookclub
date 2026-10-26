export default function Pagination({ page, onChange }) {
  if (page.totalPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="Pages">
      <button type="button" className="button" disabled={page.number === 0} onClick={() => onChange(page.number - 1)}>
        ‹ Previous
      </button>
      <span className="muted">Page {page.number + 1} of {page.totalPages}</span>
      <button
        type="button"
        className="button"
        disabled={page.number + 1 >= page.totalPages}
        onClick={() => onChange(page.number + 1)}
      >
        Next ›
      </button>
    </nav>
  )
}
