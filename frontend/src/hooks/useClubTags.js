import { useApi } from './useApi.js'

export function useClubTags() {
  const { data } = useApi('/clubs/tags')
  const options = data ?? []
  const labels = Object.fromEntries(options.map((tag) => [tag.value, tag.label]))
  return { options, labelOf: (value) => labels[value] ?? value }
}
