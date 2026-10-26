import { useState } from 'react'
import { api, tokenStore } from '../api.js'
import { AuthContext } from './AuthContext.js'

function userFromToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
    const claims = JSON.parse(new TextDecoder().decode(bytes))
    return claims.exp * 1000 > Date.now() ? { id: Number(claims.sub), username: claims.username } : null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = tokenStore.get()
    return token ? userFromToken(token) : null
  })

  async function login(username, password) {
    const { token } = await api('/auth/login', { method: 'POST', body: { username, password } })
    tokenStore.set(token)
    setUser(userFromToken(token))
  }

  function logout() {
    tokenStore.clear()
    setUser(null)
  }

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>
}
