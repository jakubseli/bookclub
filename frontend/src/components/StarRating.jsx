export default function StarRating({ rating }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 ? '½' : ''}
    </span>
  )
}
