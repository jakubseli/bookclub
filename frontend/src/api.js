const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'
const TOKEN_KEY = 'bookclub.token'

export const API_ORIGIN = new URL(API_URL).origin

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.detail ?? `Request failed with status ${status}`)
    this.status = status
    this.fieldErrors = body?.errors ?? {}
  }
}

export function describeError(e, conflictMessage) {
  if (e.status === 409 && conflictMessage) {
    return conflictMessage
  }
  return Object.keys(e.fieldErrors ?? {}).length > 0 ? 'Please fix the highlighted fields.' : e.message
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = tokenStore.get()
  const isForm = body instanceof FormData
  const response = await fetch(API_URL + path, {
    method,
    headers: {
      ...(body && !isForm && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: isForm ? body : body && JSON.stringify(body),
  }).catch(() => {
    throw new ApiError(0, { detail: "Can't reach the server. Is the backend running?" })
  })

  if (response.status === 401 && token) {
    tokenStore.clear()
    window.location.assign('/login')
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, data)
  }
  return data
}
