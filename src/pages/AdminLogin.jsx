import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .admin-root {
    min-height: 100vh;
    background: #0c0c0f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* Background glow blobs */
  .admin-root::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(255,140,97,0.12) 0%, transparent 70%);
    top: -200px; right: -150px;
    pointer-events: none;
  }
  .admin-root::after {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(240,93,94,0.08) 0%, transparent 70%);
    bottom: -150px; left: -100px;
    pointer-events: none;
  }

  /* Grid pattern */
  .admin-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .admin-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 28px;
    padding: 44px 40px;
    backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04),
      0 32px 64px rgba(0,0,0,0.5),
      0 0 80px rgba(255,140,97,0.06);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .admin-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,140,97,0.12);
    border: 1px solid rgba(255,140,97,0.25);
    border-radius: 50px;
    padding: 5px 12px;
    font-size: 11px; font-weight: 700;
    color: #FF8C61; letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .admin-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: #FF8C61;
    border-radius: 50%;
    box-shadow: 0 0 6px #FF8C61;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .admin-title {
    font-family: 'Syne', sans-serif;
    font-size: 34px; font-weight: 800;
    color: white; line-height: 1.1;
    margin: 0 0 10px;
    letter-spacing: -0.5px;
  }
  .admin-title span {
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .admin-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    line-height: 1.6;
    margin: 0 0 36px;
  }

  /* Divider */
  .admin-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    margin-bottom: 28px;
  }

  /* Google button */
  .btn-google {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    padding: 15px 24px;
    background: white;
    border: none; border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600;
    color: #1a1a1a;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
  }
  .btn-google::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,140,97,0.08), rgba(240,93,94,0.08));
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-google:hover::before { opacity: 1; }
  .btn-google:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .btn-google:active { transform: translateY(0); }
  .btn-google:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-google svg { flex-shrink: 0; }

  /* Loading dots */
  .loading-dots {
    display: flex; gap: 4px; align-items: center;
  }
  .loading-dots span {
    width: 5px; height: 5px;
    background: #999;
    border-radius: 50%;
    animation: dot 1.2s ease-in-out infinite;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* Error */
  .admin-error {
    display: flex; align-items: center; gap: 8px;
    background: rgba(240,93,94,0.1);
    border: 1px solid rgba(240,93,94,0.2);
    border-radius: 10px;
    padding: 12px 14px;
    margin-top: 16px;
    color: #F05D5E;
    font-size: 13px; font-weight: 500;
    animation: shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  /* Footer */
  .admin-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.2);
  }
  .admin-footer a {
    color: rgba(255,255,255,0.35);
    text-decoration: none;
  }
  .admin-footer a:hover { color: rgba(255,255,255,0.6); }
`

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
        setError('Email ini tidak memiliki akses admin.')
        return
      }

      navigate('/admin')
    } catch (err) {
      setError('Login gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{style}</style>
      <div className="admin-root">
        <div className="admin-grid" />

        <div className="admin-card">
          <div className="admin-badge">Admin Panel</div>

          <h1 className="admin-title">
            Selamat<br />
            <span>Datang</span>
          </h1>
          <p className="admin-sub">
            Masuk dengan akun Google yang terdaftar untuk mengakses panel pengelola WiFi Cafe Finder.
          </p>

          <div className="admin-divider" />

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn-google"
          >
            {loading ? (
              <>
                <div className="loading-dots">
                  <span/><span/><span/>
                </div>
                Memverifikasi...
              </>
            ) : (
              <>
                {/* Google icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Masuk dengan Google
              </>
            )}
          </button>

          {error && (
            <div className="admin-error">
              ⚠️ {error}
            </div>
          )}

          <div className="admin-footer">
            WiFi Cafe Finder &nbsp;·&nbsp; Pekanbaru
          </div>
        </div>
      </div>
    </>
  )
}