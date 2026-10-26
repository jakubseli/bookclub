import { useState } from 'react'
import { describeError } from '../api.js'

const IDLE = { submitting: false, error: null, fieldErrors: {} }

export function useSubmit(conflictMessage) {
  const [state, setState] = useState(IDLE)

  async function submit(action) {
    setState({ ...IDLE, submitting: true })
    try {
      await action()
      setState(IDLE)
      return true
    } catch (e) {
      setState({ submitting: false, error: describeError(e, conflictMessage), fieldErrors: e.fieldErrors ?? {} })
      return false
    }
  }

  return { ...state, submit }
}
