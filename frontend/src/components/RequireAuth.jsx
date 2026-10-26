import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'

export default function RequireAuth() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
