import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .login-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #FAF8F5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 24px;
    padding: 40px 32px;
    border: 1px solid #F0EDE8;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    text-align: center;
  }

  .login-logo {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px;
    margin: 0 auto 24px;
    box-shadow: 0 6px 20px rgba(240,93,94,0.3);
  }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px; font-weight: 800;
    color: #1a1a1a; margin: 0 0 8px;
  }

  .login-sub {
    font-size: 14px; color: #999;
    margin: 0 0 32px; line-height: 1.6;
  }

  .login-sub span { color: #FF8C61; font-weight: 500; }

  .btn-google {
    width: 100%; padding: 14px;
    background: white;
    border: 1.5px solid #E8E2DA;
    border-radius: 14px;
    font-size: 15px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a1a; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .btn-google:hover {
    border-color: #FF8C61;
    box-shadow: 0 4px 16px rgba(255,140,97,0.2);
    transform: translateY(-1px);
  }
  .btn-google:active { transform: translateY(0); }
  .btn-google:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .google-icon {
    width: 20px; height: 20px; flex-shrink: 0;
  }

  .login-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0; color: #C0B8AE; font-size: 12px;
  }
  .login-divider::before, .login-divider::after {
    content: ''; flex: 1; height: 1px; background: #F0EDE8;
  }

  .login-error {
    background: #FFF1F1; border: 1px solid #FDD;
    border-radius: 10px; padding: 10px 14px;
    font-size: 13px; color: #D44;
    margin-bottom: 16px;
  }

  .login-footer {
    margin-top: 28px; font-size: 12px; color: #C0B8AE; line-height: 1.6;
  }

  .btn-back-login {
    background: none; border: none;
    font-size: 13px; color: #999;
    cursor: pointer; margin-top: 16px;
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 6px;
    margin: 16px auto 0;
  }
  .btn-back-login:hover { color: #FF8C61; }

  .login-features {
    display: flex; flex-direction: column; gap: 10px;
    margin-bottom: 28px; text-align: left;
  }
  .login-feature-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: #666;
  }
  .feature-dot {
    width: 24px; height: 24px; border-radius: 8px;
    background: #FFF5EF; display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }
`

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate('/')
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Login gagal. Coba lagi ya!')
      }
    }
    setLoading(false)
  }

  return (
    <>
      <style>{style}</style>
      <div className="login-root">
        <div className="login-card">

          <div className="login-logo">☕</div>

          <h1 className="login-title">WiFi Cafe Finder</h1>
          <p className="login-sub">
            Login untuk <span>tambah cafe</span> dan <span>tulis review</span>
          </p>

          <div className="login-features">
            <div className="login-feature-item">
              <span className="feature-dot">📍</span>
              Tambah cafe baru di kotamu
            </div>
            <div className="login-feature-item">
              <span className="feature-dot">⭐</span>
              Kasih rating WiFi, vibe & kondusivitas
            </div>
            <div className="login-feature-item">
              <span className="feature-dot">📷</span>
              Upload foto cafe & review
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            className="btn-google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {/* Google SVG icon */}
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
          </button>

          <button className="btn-back-login" onClick={() => navigate('/')}>
            ← Lihat cafe tanpa login
          </button>

          <p className="login-footer">
            Dengan login, kamu setuju untuk berbagi info cafe<br/>demi sesama remote worker & pelajar ☕
          </p>

        </div>
      </div>
    </>
  )
}
