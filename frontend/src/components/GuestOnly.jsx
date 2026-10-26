import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'

export default function GuestOnly() {
  const { user } = useAuth()
  return user ? <Navigate to="/clubs" replace /> : <Outlet />
}
