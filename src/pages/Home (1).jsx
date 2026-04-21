import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useCafeStore } from '../store/cafeStore'
import CafeCard from '../components/CafeCard'
import CafeMap from '../components/CafeMap'

const FILTERS = [
  { label: 'Semua', emoji: '✨' },
  { label: 'WiFi Kenceng', emoji: '⚡' },
  { label: 'Sepi', emoji: '🤫' },
  { label: 'Ada Colokan', emoji: '🔌' },
]

const COLORS = ['#FF6B6B', '#FF9A3C', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF']

export default function Home() {
  const { cafes, myCafes = [], fetchCafes, fetchMyCafes, loading, user } = useCafeStore()
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchCafes() }, [])
  useEffect(() => { if (user) fetchMyCafes() }, [user])

  // ✅ FIX: hanya tampilkan yang masih pending
  const pendingMyCafes = myCafes.filter(c => c.status === 'pending')

  const filtered = cafes.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    if (activeFilter === 'WiFi Kenceng') return matchSearch && c.avg_wifi >= 4
    if (activeFilter === 'Sepi') return matchSearch && c.avg_noise >= 4
    if (activeFilter === 'Ada Colokan') return matchSearch
    return matchSearch
  })

  const handleLogout = async () => {
    await signOut(auth)
    setShowLogoutModal(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #FAFAFA; min-height: 100vh; }

        /* LOGOUT MODAL */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-card { background: white; border-radius: 24px; padding: 32px 28px 24px; max-width: 340px; width: 100%; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: slideUp 0.25s cubic-bezier(0.16,1,0.3,1); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-icon { font-size: 44px; margin-bottom: 14px; display: block; }
        .modal-title { font-family: 'Fredoka', sans-serif; font-size: 22px; font-weight: 700; color: #2D2D2D; margin-bottom: 8px; }
        .modal-sub { font-size: 14px; color: #999; font-weight: 600; line-height: 1.5; margin-bottom: 24px; }
        .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .btn-cancel { padding: 12px; border-radius: 14px; border: 2px solid #EEE; background: #FAFAFA; font-size: 14px; font-weight: 700; font-family: 'Nunito', sans-serif; color: #888; cursor: pointer; transition: all 0.15s; }
        .btn-cancel:hover { background: #F0F0F0; border-color: #DDD; }
        .btn-logout-confirm { padding: 12px; border-radius: 14px; border: none; background: linear-gradient(135deg, #FF6B6B, #F05D5E); font-size: 14px; font-weight: 700; font-family: 'Nunito', sans-serif; color: white; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 14px rgba(240,93,94,0.35); }
        .btn-logout-confirm:hover { transform: translateY(-1px); }

        /* NAVBAR */
        .navbar { background: white; border-bottom: 2px solid #F0EBF8; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 16px rgba(0,0,0,0.05); }
        .nav-brand { display: flex; align-items: center; gap: 10px; font-family: 'Fredoka', sans-serif; font-size: 22px; font-weight: 700; color: #2D2D2D; text-decoration: none; }
        .nav-logo { background: linear-gradient(135deg, #FF6B6B, #FF9A3C); border-radius: 12px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 12px rgba(255,107,107,0.3); }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link { font-size: 13px; font-weight: 700; color: #888; padding: 7px 14px; border-radius: 10px; cursor: pointer; border: none; background: none; font-family: 'Nunito', sans-serif; transition: all 0.15s; }
        .nav-link:hover { background: #F5F0FF; color: #7C3AED; }
        .nav-cta { background: linear-gradient(135deg, #FF6B6B, #FF9A3C); color: white !important; border-radius: 12px !important; padding: 8px 18px !important; box-shadow: 0 4px 12px rgba(255,107,107,0.3); font-size: 13px; font-weight: 700; cursor: pointer; border: none; font-family: 'Nunito', sans-serif; transition: all 0.15s; }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,107,107,0.4); }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
        .hamburger span { display: block; width: 24px; height: 2.5px; background: #555; border-radius: 4px; }

        /* HERO */
        .hero { background: linear-gradient(135deg, #FFF5F5 0%, #FFF8EC 40%, #F0F8FF 100%); padding: 3.5rem 2rem 3rem; text-align: center; position: relative; overflow: hidden; border-bottom: 2px solid #F0EBF8; }
        .hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 220px; height: 220px; background: radial-gradient(circle, #FFD93D33, transparent 70%); border-radius: 50%; }
        .hero::after { content: ''; position: absolute; bottom: -40px; left: -40px; width: 180px; height: 180px; background: radial-gradient(circle, #C77DFF22, transparent 70%); border-radius: 50%; }
        .hero-title { font-family: 'Fredoka', sans-serif; font-size: clamp(28px, 5vw, 48px); font-weight: 700; color: #2D2D2D; line-height: 1.15; margin-bottom: 12px; position: relative; z-index: 1; }
        .hero-title .highlight { background: linear-gradient(135deg, #FF6B6B, #FF9A3C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: clamp(13px, 2vw, 16px); color: #888; font-weight: 600; margin-bottom: 2rem; position: relative; z-index: 1; }
        .hero-search-wrap { max-width: 520px; margin: 0 auto; position: relative; z-index: 1; }
        .hero-search { width: 100%; padding: 14px 20px 14px 50px; border: 2.5px solid #EEE; border-radius: 20px; font-size: 15px; font-family: 'Nunito', sans-serif; font-weight: 600; outline: none; background: white; transition: border-color 0.2s, box-shadow 0.2s; color: #2D2D2D; box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
        .hero-search:focus { border-color: #FF9A3C; box-shadow: 0 4px 20px rgba(255,154,60,0.2); }
        .hero-search::placeholder { color: #CCC; }
        .search-icon-abs { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); font-size: 18px; pointer-events: none; }
        .hero-stats { display: flex; justify-content: center; gap: 2rem; margin-top: 1.5rem; position: relative; z-index: 1; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Fredoka', sans-serif; font-size: 24px; font-weight: 700; color: #2D2D2D; }
        .stat-label { font-size: 11px; color: #AAA; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

        /* MAIN */
        .main { max-width: 1200px; margin: 0 auto; padding: 2rem 2rem 4rem; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 12px; }
        .section-title { font-family: 'Fredoka', sans-serif; font-size: 20px; font-weight: 700; color: #2D2D2D; }
        .filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: 20px; white-space: nowrap; cursor: pointer; border: 2.5px solid #EEE; background: white; color: #888; font-family: 'Nunito', sans-serif; transition: all 0.18s; }
        .filter-btn:hover { border-color: #CCC; transform: translateY(-1px); }
        .filter-btn.active { border-color: transparent; color: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .filter-btn.f0.active { background: linear-gradient(135deg, #FF6B6B, #FF9A3C); }
        .filter-btn.f1.active { background: linear-gradient(135deg, #FFD93D, #FF9A3C); color: #2D2D2D; }
        .filter-btn.f2.active { background: linear-gradient(135deg, #6BCB77, #4D96FF); }
        .filter-btn.f3.active { background: linear-gradient(135deg, #4D96FF, #C77DFF); }

        /* PENDING SECTION */
        .pending-banner { background: linear-gradient(135deg, #FFFBEA, #FFF3CC); border: 2px solid #FFE066; border-radius: 16px; padding: 14px 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
        .pending-banner-icon { font-size: 22px; flex-shrink: 0; }
        .pending-banner-text { font-size: 13px; font-weight: 700; color: #7A5C00; line-height: 1.5; }
        .pending-banner-text span { color: #B07800; }

        .pending-section-title { font-family: 'Fredoka', sans-serif; font-size: 16px; font-weight: 700; color: #B07800; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }

        /* PENDING CARD */
        .cafe-card-pending { background: #F5F5F5; border-radius: 20px; padding: 20px; border: 2px dashed #DDD; position: relative; overflow: hidden; cursor: default; }
        .pending-stripe { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: repeating-linear-gradient(90deg, #FFD93D 0px, #FFD93D 12px, transparent 12px, transparent 20px); }
        .card-blob { position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; opacity: 0.08; }
        .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
        .card-name-muted { font-family: 'Fredoka', sans-serif; font-size: 17px; font-weight: 700; color: #AAA; }
        .pending-chip { font-size: 10px; font-weight: 800; background: #FFF3CC; color: #B07800; border: 1.5px solid #FFE066; padding: 4px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .card-address { font-size: 12px; color: #CCC; font-weight: 600; margin-bottom: 14px; }
        .card-ratings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
        .rating-box { background: #F8F8F8; border-radius: 12px; padding: 10px 8px; text-align: center; }
        .rating-box-muted { background: #F0F0F0; border-radius: 12px; padding: 10px 8px; text-align: center; }
        .rating-emoji { font-size: 18px; margin-bottom: 4px; }
        .rating-val { font-family: 'Fredoka', sans-serif; font-size: 18px; font-weight: 700; }
        .rating-label { font-size: 10px; color: #AAA; font-weight: 700; text-transform: uppercase; }
        .card-footer { display: flex; align-items: center; justify-content: space-between; }
        .review-count { font-size: 12px; color: #AAA; font-weight: 700; }

        /* CAFE GRID */
        .cafe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .cafe-card { background: white; border-radius: 20px; padding: 20px; border: 2px solid #F0EDE8; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .cafe-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .card-name { font-family: 'Fredoka', sans-serif; font-size: 17px; font-weight: 700; color: #2D2D2D; }
        .card-badge { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .card-arrow { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; }

        /* LOADING / EMPTY */
        .loading-wrap { grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px 0; }
        .dots { display: flex; gap: 8px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: #FFD93D; animation: bounce 1s infinite; }
        .dot:nth-child(2) { animation-delay: 0.15s; background: #FF9A3C; }
        .dot:nth-child(3) { animation-delay: 0.3s; background: #FF6B6B; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 48px 0; }
        .empty-emoji { font-size: 48px; margin-bottom: 12px; }
        .empty-text { font-size: 15px; color: #AAA; font-weight: 600; line-height: 1.6; }

        /* MOBILE */
        @media (max-width: 600px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .nav-links.open { display: flex; flex-direction: column; position: absolute; top: 64px; left: 0; right: 0; background: white; padding: 16px; border-bottom: 2px solid #F0EBF8; box-shadow: 0 8px 24px rgba(0,0,0,0.08); z-index: 999; }
          .hero { padding: 2rem 1rem 2rem; }
          .main { padding: 1.5rem 1rem 3rem; }
        }
      `}</style>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="modal-icon">👋</span>
            <h2 className="modal-title">Keluar dulu nih?</h2>
            <p className="modal-sub">Kamu bakal keluar dari akun.<br />Sampai jumpa lagi!</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Batal</button>
              <button className="btn-logout-confirm" onClick={handleLogout}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <a className="nav-brand" href="/">
          <div className="nav-logo">☕</div>
          WiFi Finder
        </a>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button className="nav-link" onClick={() => navigate('/tentang')}>Tentang</button>
          <button className="nav-link" onClick={() => navigate('/top')}>Top Cafe</button>
          {user && (
            <button className="nav-link" onClick={() => navigate('/my-cafes')}>Cafe Saya</button>
          )}
          {user ? (
            <>
              <button className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {user.photoURL
                  ? <img src={user.photoURL} style={{ width: 24, height: 24, borderRadius: '50%' }} alt="" />
                  : <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#FF6B6B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>{user.displayName?.[0] ?? '?'}</span>
                }
                {user.displayName?.split(' ')[0]}
              </button>
              <button className="nav-link" onClick={() => setShowLogoutModal(true)}>Keluar</button>
            </>
          ) : (
            <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
          )}
          <button className="nav-cta" onClick={() => navigate('/tambah')}>+ Tambah Cafe</button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">Cari Cafe WiFi <span className="highlight">Kenceng</span><br />buat Ngerjain Tugas ☕</h1>
        <p className="hero-sub">Rating jujur dari sesama remote worker & pelajar ☕</p>
        <div className="hero-search-wrap">
          <span className="search-icon-abs">🔍</span>
          <input className="hero-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama cafe atau alamat..." />
        </div>
        <div className="hero-stats">
          <div className="stat"><div className="stat-num">{cafes.length}</div><div className="stat-label">Cafe Terdaftar</div></div>
          <div className="stat"><div className="stat-num">{cafes.reduce((a, c) => a + (c.review_count || 0), 0)}</div><div className="stat-label">Total Review</div></div>
          <div className="stat"><div className="stat-num">⭐ {cafes.length ? (cafes.reduce((a, c) => a + (parseFloat(c.avg_wifi) || 0), 0) / cafes.length).toFixed(1) : '–'}</div><div className="stat-label">Avg WiFi Score</div></div>
        </div>
      </section>

      {/* MAIN */}
      <main className="main">

        {/* PENDING CAFE MILIK USER — ✅ pakai pendingMyCafes bukan myCafes */}
        {user && pendingMyCafes.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div className="pending-banner">
              <span className="pending-banner-icon">⏳</span>
              <div className="pending-banner-text">
                Kamu punya <span>{pendingMyCafes.length} cafe</span> yang sedang menunggu review admin.
                Cafe akan tampil di daftar utama setelah disetujui.
              </div>
            </div>
            <p className="pending-section-title">⏳ Menunggu Persetujuan Admin</p>
            <div className="cafe-grid">
              {pendingMyCafes.map((cafe) => (
                <div key={cafe.id} className="cafe-card-pending">
                  <div className="pending-stripe" />
                  <div className="card-blob" style={{ background: '#CCCCCC' }} />
                  <div className="card-top">
                    <span className="card-name-muted">{cafe.name}</span>
                    <span className="pending-chip">⏳ Menunggu Approval</span>
                  </div>
                  <div className="card-address">📍 {cafe.address || 'Alamat belum diisi'}</div>
                  <div className="card-ratings">
                    {[{ emoji: '📶', label: 'WiFi' }, { emoji: '☕', label: 'Vibe' }, { emoji: '🔇', label: 'Sunyi' }].map(({ emoji, label }) => (
                      <div className="rating-box-muted" key={label}>
                        <div className="rating-emoji" style={{ filter: 'grayscale(1)', opacity: 0.4 }}>{emoji}</div>
                        <div className="rating-val" style={{ color: '#CCC' }}>–</div>
                        <div className="rating-label">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card-footer">
                    <span className="review-count" style={{ color: '#CCC' }}>💬 Belum ada review</span>
                    <span style={{ fontSize: 11, color: '#CCC', fontWeight: 700 }}>Dikirim oleh kamu</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: '#F0EDE8', margin: '28px 0' }} />
          </div>
        )}

        <div className="section-header">
          <div className="section-title">{loading ? 'Nyeduh data...' : `${filtered.length} Cafe Ditemukan`}</div>
          <div className="filters">
            {FILTERS.map((f, i) => (
              <button key={f.label} className={`filter-btn f${i} ${activeFilter === f.label ? 'active' : ''}`} onClick={() => setActiveFilter(f.label)}>
                {f.emoji} {f.label}
              </button>
            ))}
          </div>
        </div>

        <CafeMap cafes={cafes} />

        <div className="cafe-grid">
          {loading && (
            <div className="loading-wrap">
              <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
              <span style={{ fontSize: 14, color: '#CCC', fontWeight: 700 }}>Nyeduh data dulu...</span>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-emoji">🏙️</div>
              <p className="empty-text">Belum ada cafe nih.<br />Yuk tambahkan yang pertama!</p>
            </div>
          )}
          {!loading && filtered.map((cafe, i) => {
            const color = COLORS[i % COLORS.length]
            return (
              <div key={cafe.id} className="cafe-card" onClick={() => navigate(`/cafe/${cafe.id}`)}>
                <div className="card-blob" style={{ background: color }} />
                <div className="card-top">
                  <span className="card-name">{cafe.name}</span>
                  <span className="card-badge" style={{ background: color + '22', color }}>BUKA</span>
                </div>
                <div className="card-address">📍 {cafe.address || 'Alamat belum diisi'}</div>
                <div className="card-ratings">
                  {[{ emoji: '📶', val: cafe.avg_wifi, label: 'WiFi' }, { emoji: '☕', val: cafe.avg_vibe, label: 'Vibe' }, { emoji: '🔇', val: cafe.avg_noise, label: 'Sunyi' }].map(({ emoji, val, label }) => (
                    <div className="rating-box" key={label}>
                      <div className="rating-emoji">{emoji}</div>
                      <div className="rating-val" style={{ color }}>{val ?? '–'}</div>
                      <div className="rating-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="card-footer">
                  <span className="review-count">💬 {cafe.review_count ?? 0} review</span>
                  <div className="card-arrow" style={{ background: color + '22', color }}>→</div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
