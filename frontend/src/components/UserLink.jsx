import { Link } from 'react-router'

export default function UserLink({ id, username }) {
  return <Link to={`/users/${id}`} className="user-link">{username}</Link>
}
