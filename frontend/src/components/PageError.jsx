export default function PageError({ back, message }) {
  return (
    <div className="stack">
      {back}
      <p className="alert" role="alert">{message}</p>
    </div>
  )
}
