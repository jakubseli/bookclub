import { useEffect, useState } from 'react'
import { api } from '../api.js'

export function useApi(path) {
  const [state, setState] = useState({ data: null, error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!path) {
      return
    }
    let ignore = false
    api(path)
      .then((data) => !ignore && setState({ data, error: null }))
      .catch((e) => !ignore && setState({ data: null, error: e.message }))
    return () => {
      ignore = true
    }
  }, [path, version])

  return {
    ...state,
    setData: (data) => setState({ data, error: null }),
    reload: () => setVersion((v) => v + 1),
  }
}
