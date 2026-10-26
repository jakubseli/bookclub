import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { api, describeError } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import FormField from '../components/FormField.jsx'
import { toUserRequest } from '../users.js'

const EMPTY_FORM = { username: '', email: '', password: '', age: '', firstName: '', lastName: '', phoneNumber: '' }

export default function RegisterPage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/clubs" replace />
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    try {
      await api('/users', { method: 'POST', body: toUserRequest(form) })
      await login(form.username, form.password)
    } catch (e) {
      setError(describeError(e, 'That username or email is already taken.'))
      setFieldErrors(e.fieldErrors)
      setSubmitting(false)
    }
  }

  const field = (name, label, props = {}) => (
    <FormField id={`register-${name}`} name={name} label={label} value={form[name]} onChange={handleChange} error={fieldErrors[name]} {...props} />
  )

  return (
    <form className="card medium stack" onSubmit={handleSubmit} noValidate>
      <div>
        <h1>Create an account</h1>
        <p className="muted">Fields marked * are required. You can add addresses later on your profile.</p>
      </div>
      {error && <p className="alert" role="alert">{error}</p>}
      <div className="row">
        {field('username', 'Username *', { autoComplete: 'username' })}
        {field('email', 'Email *', { type: 'email', autoComplete: 'email' })}
      </div>
      <div className="row">
        {field('password', 'Password *', { type: 'password', autoComplete: 'new-password', hint: '8 to 72 characters' })}
        {field('age', 'Age *', { type: 'number', min: 0 })}
      </div>
      <div className="row">
        {field('firstName', 'First name', { autoComplete: 'given-name' })}
        {field('lastName', 'Last name', { autoComplete: 'family-name' })}
      </div>
      <div className="row">
        {field('phoneNumber', 'Phone number', { type: 'tel', autoComplete: 'tel' })}
        <div />
      </div>
      <button type="submit" className="button button-primary" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </button>
      <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  )
}
