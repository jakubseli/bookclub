import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import ClubPage from './pages/ClubPage.jsx'
import ClubsPage from './pages/ClubsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:id" element={<ClubPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/clubs" replace />} />
      </Route>
    </Routes>
  )
}
