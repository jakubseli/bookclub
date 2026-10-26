import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="site-header">
        <nav className="nav" aria-label="Main">
          <Link to="/clubs" className="brand">Bookclub</Link>
          {user && (
            <>
              <NavLink to="/clubs" className="nav-link">Clubs</NavLink>
              <NavLink to="/books" className="nav-link">Books</NavLink>
              <NavLink to="/profile" className="nav-link">{user.username}</NavLink>
              <button type="button" className="nav-link" onClick={handleLogout}>Log out</button>
            </>
          )}
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </>
  )
}
