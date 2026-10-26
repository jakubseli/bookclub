import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import FormField from '../components/FormField.jsx'
import { useSubmit } from '../hooks/useSubmit.js'

export default function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { submit, submitting, error, fieldErrors } = useSubmit()

  function handleSubmit(event) {
    event.preventDefault()
    submit(() => login(username, password))
  }

  return (
    <form className="card narrow stack" onSubmit={handleSubmit} noValidate>
      <h1>Log in</h1>
      {error && <p className="alert" role="alert">{error}</p>}
      <FormField id="login-username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={fieldErrors.username} autoComplete="username" />
      <FormField id="login-password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldErrors.password} autoComplete="current-password" />
      <button type="submit" className="button button-primary" disabled={submitting}>
        {submitting ? 'Logging in…' : 'Log in'}
      </button>
      <p className="muted">No account yet? <Link to="/register">Create one</Link></p>
    </form>
  )
}
