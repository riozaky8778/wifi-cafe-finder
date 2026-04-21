import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCafeStore } from '../store/cafeStore'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .mc-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #FAF8F5;
  }

  .mc-topbar {
    display: flex; align-items: center; gap: 12px;
    padding: 20px 24px 0;
    max-width: 600px; margin: 0 auto;
  }

  .btn-back {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    background: white; border: 1px solid #EDE9E3;
    border-radius: 50%; cursor: pointer;
    font-size: 16px; color: #555;
    transition: all 0.2s; flex-shrink: 0;
    text-decoration: none;
  }
  .btn-back:hover { background: #F5F2ED; transform: translateX(-2px); }

  .mc-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0;
  }

  .mc-body {
    max-width: 600px; margin: 24px auto;
    padding: 0 24px 40px;
  }

  /* Banner pending */
  .banner-pending {
    background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
    border: 1px solid #FDE68A;
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .banner-pending-icon { font-size: 24px; flex-shrink: 0; }
  .banner-pending-text { font-size: 14px; color: #92400E; line-height: 1.4; }
  .banner-pending-text strong { font-weight: 700; }

  /* Section header */
  .section-header {
    font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #AAA; letter-spacing: 1px;
    text-transform: uppercase;
    margin: 24px 0 10px;
  }

  /* Cafe card */
  .cafe-card {
    background: white;
    border: 1px solid #F0EDE8;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    display: flex; align-items: center; gap: 14px;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .cafe-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

  .cafe-card-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .cafe-card-icon.pending  { background: #FEF3C7; }
  .cafe-card-icon.published { background: #D1FAE5; }
  .cafe-card-icon.rejected { background: #FEE2E2; }

  .cafe-card-info { flex: 1; min-width: 0; }
  .cafe-card-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 15px;
    color: #1a1a1a; margin: 0 0 3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cafe-card-address {
    font-size: 12px; color: #AAA;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .status-badge {
    flex-shrink: 0;
    font-size: 11px; font-weight: 700;
    padding: 5px 10px; border-radius: 20px;
    letter-spacing: 0.3px;
  }
  .status-badge.pending  { background: #FEF3C7; color: #B45309; }
  .status-badge.published { background: #D1FAE5; color: #065F46; }
  .status-badge.rejected { background: #FEE2E2; color: #991B1B; }

  /* Empty state */
  .empty-state {
    text-align: center; padding: 48px 24px;
  }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 800; color: #1a1a1a;
    margin: 0 0 6px;
  }
  .empty-sub { font-size: 14px; color: #AAA; margin: 0 0 20px; }
  .btn-add {
    display: inline-block;
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    color: white; font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 14px;
    padding: 12px 24px; border-radius: 12px;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(240,93,94,0.3);
    transition: all 0.2s;
  }
  .btn-add:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(240,93,94,0.4); }

  /* Login gate */
  .login-gate {
    text-align: center; padding: 64px 24px;
  }
  .login-gate-icon { font-size: 48px; margin-bottom: 16px; }
  .login-gate-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0 0 8px;
  }
  .login-gate-sub { font-size: 14px; color: #AAA; margin: 0 0 24px; }
  .btn-login {
    display: inline-block;
    background: #1a1a1a; color: white;
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 14px;
    padding: 12px 28px; border-radius: 12px;
    text-decoration: none; transition: all 0.2s;
  }
  .btn-login:hover { background: #333; transform: translateY(-1px); }

  /* Loading */
  .loading-wrap {
    text-align: center; padding: 64px 24px;
    color: #AAA; font-size: 14px;
  }
  .loading-spinner {
    width: 32px; height: 32px;
    border: 3px solid #EDE9E3;
    border-top-color: #FF8C61;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`

const STATUS_CONFIG = {
  pending:   { icon: '⏳', label: 'Menunggu',  cls: 'pending'  },
  published: { icon: '✅', label: 'Disetujui', cls: 'published' },
  rejected:  { icon: '❌', label: 'Ditolak',   cls: 'rejected'  },
}

export default function MyCafes() {
  const navigate = useNavigate()
  const { user, myCafes, fetchMyCafes } = useCafeStore()

  useEffect(() => {
    if (user) fetchMyCafes()
  }, [user])

  // Belum login
  if (!user) {
    return (
      <>
        <style>{style}</style>
        <div className="mc-root">
          <div className="mc-topbar">
            <Link to="/" className="btn-back">←</Link>
            <h1 className="mc-title">Cafe Saya</h1>
          </div>
          <div className="mc-body">
            <div className="login-gate">
              <div className="login-gate-icon">🔒</div>
              <h2 className="login-gate-title">Kamu belum login</h2>
              <p className="login-gate-sub">Login dulu untuk lihat cafe yang kamu tambahkan</p>
              <Link to="/login" className="btn-login">Login Sekarang</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  const pending   = myCafes.filter(c => c.status === 'pending')
  const published = myCafes.filter(c => c.status === 'published')
  const rejected  = myCafes.filter(c => c.status === 'rejected')

  const CafeCard = ({ cafe }) => {
    const cfg = STATUS_CONFIG[cafe.status] ?? STATUS_CONFIG.pending
    return (
      <div
        className="cafe-card"
        onClick={() => cafe.status === 'published' ? navigate(`/cafe/${cafe.id}`) : null}
        style={{ cursor: cafe.status === 'published' ? 'pointer' : 'default' }}
      >
        <div className={`cafe-card-icon ${cfg.cls}`}>{cfg.icon}</div>
        <div className="cafe-card-info">
          <p className="cafe-card-name">{cafe.name}</p>
          <p className="cafe-card-address">{cafe.address ?? '-'}</p>
        </div>
        <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
      </div>
    )
  }

  return (
    <>
      <style>{style}</style>
      <div className="mc-root">
        <div className="mc-topbar">
          <Link to="/" className="btn-back">←</Link>
          <h1 className="mc-title">Cafe Saya</h1>
        </div>

        <div className="mc-body">
          {/* Banner jika ada yang pending */}
          {pending.length > 0 && (
            <div className="banner-pending">
              <span className="banner-pending-icon">⏳</span>
              <p className="banner-pending-text">
                <strong>{pending.length} cafe</strong> kamu sedang menunggu persetujuan admin.
                Biasanya diproses dalam 1×24 jam.
              </p>
            </div>
          )}

          {/* Empty state */}
          {myCafes.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">☕</div>
              <h2 className="empty-title">Belum ada cafe</h2>
              <p className="empty-sub">Kamu belum pernah menambahkan cafe.</p>
              <Link to="/tambah" className="btn-add">+ Tambah Cafe Sekarang</Link>
            </div>
          )}

          {/* Pending */}
          {pending.length > 0 && (
            <>
              <p className="section-header">⏳ Menunggu Approval ({pending.length})</p>
              {pending.map(c => <CafeCard key={c.id} cafe={c} />)}
            </>
          )}

          {/* Published */}
          {published.length > 0 && (
            <>
              <p className="section-header">✅ Sudah Disetujui ({published.length})</p>
              {published.map(c => <CafeCard key={c.id} cafe={c} />)}
            </>
          )}

          {/* Rejected */}
          {rejected.length > 0 && (
            <>
              <p className="section-header">❌ Ditolak ({rejected.length})</p>
              {rejected.map(c => <CafeCard key={c.id} cafe={c} />)}
            </>
          )}

          {/* Tombol tambah lagi */}
          {myCafes.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/tambah" className="btn-add">+ Tambah Cafe Baru</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
