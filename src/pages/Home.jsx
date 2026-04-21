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
        .pending-stripe { position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px); pointer-events: none; border-radius: 18px; }
        .pending-chip { display: inline-flex; align-items: center; gap: 5px; background: #FFF3CC; color: #B07800; border: 1.5px solid #FFD966; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; font-family: 'Nunito', sans-serif; white-space: nowrap; animation: blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

        /* NORMAL CARD */
        .cafe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .cafe-card { background: white; border-radius: 20px; padding: 20px; cursor: pointer; border: 2px solid #F5F0FF; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s; position: relative; overflow: hidden; }
        .cafe-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); border-color: #DDD; }
        .card-blob { position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; border-radius: 50%; opacity: 0.15; }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .card-name { font-family: 'Fredoka', sans-serif; font-size: 19px; font-weight: 600; color: #2D2D2D; flex: 1; padding-right: 8px; line-height: 1.2; }
        .card-name-muted { font-family: 'Fredoka', sans-serif; font-size: 19px; font-weight: 600; color: #AAAAAA; flex: 1; padding-right: 8px; line-height: 1.2; }
        .card-badge { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; font-family: 'Fredoka', sans-serif; letter-spacing: 0.5px; white-space: nowrap; }
        .card-address { font-size: 12px; color: #AAA; font-weight: 600; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 4px; line-height: 1.4; }
        .card-ratings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
        .rating-box { background: #FAFAFA; border-radius: 12px; padding: 8px 6px; text-align: center; border: 1.5px solid #F0F0F0; }
        .rating-box-muted { background: #F0F0F0; border-radius: 12px; padding: 8px 6px; text-align: center; border: 1.5px solid #E8E8E8; }
        .rating-emoji { font-size: 14px; margin-bottom: 2px; }
        .rating-val { font-family: 'Fredoka', sans-serif; font-size: 18px; font-weight: 700; line-height: 1; }
        .rating-label { font-size: 9px; color: #BBB; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 2px; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; }
        .review-count { font-size: 12px; color: #AAA; font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .card-arrow { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: transform 0.15s; }
        .cafe-card:hover .card-arrow { transform: translateX(3px); }

        /* LOADING / EMPTY */
        .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; }
        .empty-emoji { font-size: 56px; margin-bottom: 16px; }
        .empty-text { font-size: 16px; font-weight: 700; color: #CCC; }
        .loading-wrap { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 4rem 0; }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; animation: boing 0.7s ease-in-out infinite; }
        .dot:nth-child(1) { background: #FF6B6B; animation-delay: 0s; }
        .dot:nth-child(2) { background: #FFD93D; animation-delay: 0.12s; }
        .dot:nth-child(3) { background: #6BCB77; animation-delay: 0.24s; }
        @keyframes boing { 0%,100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-10px) scale(1.1); } }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .navbar { padding: 0 1rem; }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .hero { padding: 2.5rem 1rem 2rem; }
          .hero-stats { gap: 1.5rem; }
          .main { padding: 1.5rem 1rem 4rem; }
          .section-header { flex-direction: column; align-items: flex-start; }
          .cafe-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 26px; }
          .hero-stats { gap: 1rem; }
          .stat-num { font-size: 20px; }
        }
      `}</style>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="modal-icon">👋</span>
            <div className="modal-title">Mau keluar dulu?</div>
            <p className="modal-sub">Kamu akan logout dari akun<br /><strong>{user?.displayName ?? user?.email}</strong></p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Batal</button>
              <button className="btn-logout-confirm" onClick={handleLogout}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-logo">☕</div>
          WiFi Finder
        </div>
        <div className="nav-links">
          <button className="nav-link">Tentang</button>
          <button className="nav-link" onClick={() => navigate('/top')}>Top Cafe</button>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #FF9A3C' }} />
                  : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #FF9A3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>
                      {user.displayName?.charAt(0) ?? user.email?.charAt(0) ?? 'U'}
                    </div>
                }
                <span style={{ fontSize: 13, fontWeight: 700, color: '#555', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName?.split(' ')[0] ?? 'User'}
                </span>
              </div>
              <button className="nav-cta" onClick={() => navigate('/tambah')}>+ Tambah Cafe</button>
              <button className="nav-link" onClick={() => setShowLogoutModal(true)} style={{ color: '#E24B4A' }}>Keluar</button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
              <button className="nav-cta" onClick={() => navigate('/tambah')}>+ Tambah Cafe</button>
            </>
          )}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div style={{ background: 'white', borderBottom: '2px solid #F0EBF8', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="nav-link" style={{ textAlign: 'left' }}>Tentang</button>
          <button className="nav-link" style={{ textAlign: 'left' }}>Top Cafe</button>
          <button className="nav-cta" onClick={() => { navigate('/tambah'); setMenuOpen(false) }}>+ Tambah Cafe</button>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">
          Temukan Cafe dengan<br />
          <span className="highlight">WiFi Terbaik</span> di Kotamu
        </h1>
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

        {/* PENDING CAFE MILIK USER */}
        {user && myCafes.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div className="pending-banner">
              <span className="pending-banner-icon">⏳</span>
              <div className="pending-banner-text">
                Kamu punya <span>{myCafes.length} cafe</span> yang sedang menunggu review admin.
                Cafe akan tampil di daftar utama setelah disetujui.
              </div>
            </div>
            <p className="pending-section-title">⏳ Menunggu Persetujuan Admin</p>
            <div className="cafe-grid">
              {myCafes.map((cafe) => (
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