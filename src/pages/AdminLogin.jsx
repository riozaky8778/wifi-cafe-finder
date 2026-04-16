import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const email = result.user.email

      if (email !== 'rio.zaky111@gmail.com') {
        await auth.signOut()
        setError('Email ini bukan admin.')
        return
      }

      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
        <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
        <p className="text-neutral-500 mb-6">Masuk menggunakan Gmail admin untuk membuka panel.</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-2xl bg-black text-white py-4 font-semibold hover:opacity-90 transition"
        >
          {loading ? 'Memproses...' : 'Login dengan Google'}
        </button>

        {error && (
          <p className="text-sm text-red-500 mt-4">{error}</p>
        )}
      </div>
    </div>
  )
}
