import { api } from './api.js'

export const PRESET_IMAGE_COUNT = 8
export const MAX_TAGS = 5
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function uploadClubImage(clubId, file) {
  const form = new FormData()
  form.append('file', file)
  return api(`/clubs/${clubId}/image`, { method: 'PUT', body: form })
}
