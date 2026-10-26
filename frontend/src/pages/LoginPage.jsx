import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import FormField from '../components/FormField.jsx'

export default function LoginPage() {
  const { user, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/clubs" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(username, password)
    } catch (e) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="card narrow stack" onSubmit={handleSubmit} noValidate>
      <h1>Log in</h1>
      {error && <p className="alert" role="alert">{error}</p>}
      <FormField id="login-username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
      <FormField id="login-password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      <button type="submit" className="button button-primary" disabled={submitting}>
        {submitting ? 'Logging in…' : 'Log in'}
      </button>
      <p className="muted">No account yet? <Link to="/register">Create one</Link></p>
    </form>
  )
}
