import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import FormField from '../components/FormField.jsx'
import { useApi } from '../hooks/useApi.js'
import { useSubmit } from '../hooks/useSubmit.js'
import { toUserRequest } from '../users.js'

const EMPTY_ADDRESS = { street: '', city: '', state: '', postalCode: '', country: '' }

function toForm(profile) {
  return {
    username: profile.username,
    email: profile.email,
    password: '',
    age: String(profile.age),
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    phoneNumber: profile.phoneNumber ?? '',
    addresses: profile.addresses.map((address) => ({
      key: address.id,
      street: address.street,
      city: address.city,
      state: address.state ?? '',
      postalCode: address.postalCode ?? '',
      country: address.country,
    })),
  }
}

function AddressFields({ index, address, fieldErrors, onChange, onRemove }) {
  const field = (name, label) => (
    <FormField
      id={`address-${address.key}-${name}`}
      label={label}
      value={address[name]}
      onChange={(e) => onChange(name, e.target.value)}
      error={fieldErrors[`addresses[${index}].${name}`]}
    />
  )

  return (
    <fieldset className="address stack-sm">
      <legend>Address {index + 1}</legend>
      <div className="row">
        {field('street', 'Street *')}
        {field('city', 'City *')}
      </div>
      <div className="row">
        {field('state', 'State')}
        {field('postalCode', 'Postal code')}
        {field('country', 'Country *')}
      </div>
      <div className="actions">
        <button type="button" className="button button-danger" aria-label={`Remove address ${index + 1}`} onClick={onRemove}>Remove address</button>
      </div>
    </fieldset>
  )
}

function ProfileForm({ profile }) {
  const { login } = useAuth()
  const [form, setForm] = useState(() => toForm(profile))
  const [saved, setSaved] = useState(false)
  const { submit, submitting, error, fieldErrors } = useSubmit('That username or email is already taken.')

  function update(changes) {
    setForm({ ...form, ...changes })
    setSaved(false)
  }

  const changeAddress = (index, name, value) =>
    update({ addresses: form.addresses.map((address, i) => (i === index ? { ...address, [name]: value } : address)) })
  const addAddress = () => update({ addresses: [...form.addresses, { ...EMPTY_ADDRESS, key: crypto.randomUUID() }] })
  const removeAddress = (index) => update({ addresses: form.addresses.filter((_, i) => i !== index) })

  async function handleSubmit(event) {
    event.preventDefault()
    const succeeded = await submit(async () => {
      await api(`/users/${profile.id}`, { method: 'PUT', body: toUserRequest(form) })
      await login(form.username, form.password)
    })
    if (succeeded) {
      setForm((current) => ({ ...current, password: '' }))
      setSaved(true)
    }
  }

  const field = (name, label, props = {}) => (
    <FormField
      id={`profile-${name}`}
      name={name}
      label={label}
      value={form[name]}
      onChange={(e) => update({ [name]: e.target.value })}
      error={fieldErrors[name]}
      {...props}
    />
  )

  return (
    <form className="card stack" onSubmit={handleSubmit} noValidate aria-labelledby="details-heading">
      <h2 id="details-heading">Account details</h2>
      {error && <p className="alert" role="alert">{error}</p>}
      <div className="row">
        {field('username', 'Username *', { autoComplete: 'username' })}
        {field('email', 'Email *', { type: 'email', autoComplete: 'email' })}
      </div>
      <div className="row">
        {field('password', 'Password *', { type: 'password', autoComplete: 'current-password', hint: 'Needed to save. Type your current password or a new one.' })}
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
      <section className="stack-sm" aria-labelledby="addresses-heading">
        <h3 id="addresses-heading">Addresses</h3>
        {form.addresses.length === 0 && <p className="muted">No addresses yet.</p>}
        {form.addresses.map((address, index) => (
          <AddressFields
            key={address.key}
            index={index}
            address={address}
            fieldErrors={fieldErrors}
            onChange={(name, value) => changeAddress(index, name, value)}
            onRemove={() => removeAddress(index)}
          />
        ))}
        <div className="actions">
          <button type="button" className="button" onClick={addAddress}>+ Add address</button>
        </div>
      </section>
      <div className="actions">
        <button type="submit" className="button button-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save changes'}</button>
        {saved && <span className="muted" role="status">Saved</span>}
      </div>
    </form>
  )
}

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { data: profile, error } = useApi(`/users/${user.id}`)
  const { submit, error: deleteError } = useSubmit()

  function deleteAccount() {
    if (window.confirm("Delete your account, the clubs you own and your reviews? This can't be undone.")) {
      submit(async () => {
        await api(`/users/${user.id}`, { method: 'DELETE' })
        logout()
        navigate('/login')
      })
    }
  }

  if (error) {
    return <p className="alert" role="alert">{error.message}</p>
  }
  if (!profile) {
    return <p className="muted">Loading profile…</p>
  }

  return (
    <div className="stack readable">
      <Link to={`/users/${user.id}`} className="back-link">← Your profile</Link>
      <div>
        <h1>Settings</h1>
        <p className="muted">Signed in as {user.username}</p>
      </div>
      <ProfileForm key={profile.id} profile={profile} />
      <section className="card danger-zone toolbar" aria-labelledby="delete-account-heading">
        <div className="stack-sm">
          <h2 id="delete-account-heading">Delete account</h2>
          <p className="muted">This deletes your account, the clubs you own and your reviews. It can't be undone.</p>
          {deleteError && <p className="alert" role="alert">{deleteError}</p>}
        </div>
        <button type="button" className="button button-danger" onClick={deleteAccount}>Delete my account</button>
      </section>
    </div>
  )
}
