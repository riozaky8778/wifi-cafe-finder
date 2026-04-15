import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useCafeStore } from './store/cafeStore'
import Home from './pages/Home'
import CafeDetail from './pages/CafeDetail'
import ReviewForm from './pages/ReviewForm'
import AddCafe from './pages/AddCafe'

export default function App() {
  const setUser = useCafeStore((s) => s.setUser)

  useEffect(() => {
    // get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    // listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cafe/:id" element={<CafeDetail />} />
        <Route path="/review/:id" element={<ReviewForm />} />
        <Route path="/tambah" element={<AddCafe />} />
      </Routes>
    </BrowserRouter>
  )
}
