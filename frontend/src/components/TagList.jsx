export default function TagList({ tags, labelOf }) {
  if (tags.length === 0) {
    return null
  }
  return (
    <ul className="tag-list" aria-label="Tags">
      {tags.map((tag) => <li key={tag} className="tag">{labelOf(tag)}</li>)}
    </ul>
  )
}
