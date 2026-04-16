import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useCafeStore } from './store/cafeStore'
import Home from './pages/Home'
import CafeDetail from './pages/CafeDetail'
import ReviewForm from './pages/ReviewForm'
import AddCafe from './pages/AddCafe'
import Login from './pages/Login'
import TopCafe from './pages/TopCafe'
import AdminPage from './pages/AdminPage'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  const setUser = useCafeStore((s) => s.setUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ?? null)
    })
    return () => unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cafe/:id" element={<CafeDetail />} />
        <Route path="/review/:id" element={<ReviewForm />} />
        <Route path="/tambah" element={<AddCafe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/top" element={<TopCafe />} />
		<Route path="/admin" element={<AdminPage />} />
		<Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  )
}
