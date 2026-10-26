import { Navigate, Route, Routes } from 'react-router'
import GuestOnly from './components/GuestOnly.jsx'
import Layout from './components/Layout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import BookPage from './pages/BookPage.jsx'
import BooksPage from './pages/BooksPage.jsx'
import ClubPage from './pages/ClubPage.jsx'
import ClubsPage from './pages/ClubsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:id" element={<ClubPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/clubs" replace />} />
      </Route>
    </Routes>
  )
}
