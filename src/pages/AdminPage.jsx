import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCafeStore } from '../store/cafeStore'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; }

  .admin-root {
    font-family: 'DM Sans', sans-serif;
    background: #FAF8F5;
    min-height: 100vh;
    padding: 24px 16px 60px;
  }

  .admin-header {
    max-width: 720px;
    margin: 0 auto 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .admin-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0;
  }

  .admin-subtitle { font-size: 13px; color: #999; margin: 2px 0 0; }

  .btn-back-admin {
    display: flex; align-items: center; gap: 6px;
    background: white;
    border: 1px solid #E8E5E0;
    border-radius: 50px;
    padding: 8px 16px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500; color: #333;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-back-admin:hover { background: #F5F2ED; }

  .admin-body { max-width: 720px; margin: 0 auto; }

  .tab-bar {
    display: flex; gap: 4px;
    background: white; border-radius: 12px;
    padding: 4px; border: 1px solid #F0EDE8;
    margin-bottom: 20px;
  }
  .tab-btn {
    flex: 1; padding: 9px;
    border: none; border-radius: 9px;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer; background: transparent;
    color: #999; transition: all 0.2s;
  }
  .tab-btn.active { background: #1a1a1a; color: white; }

  .badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 5px;
    border-radius: 9px; font-size: 10px; font-weight: 700; margin-left: 6px;
  }
  .badge-pending { background: #FEF3C7; color: #854F0B; }
  .badge-published { background: #D1FAE5; color: #0F6E56; }

  .cafe-card {
    background: white; border-radius: 14px;
    padding: 18px; margin-bottom: 12px;
    border: 1px solid #F0EDE8;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }

  .cafe-card-top {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 12px; margin-bottom: 10px;
  }

  .cafe-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0 0 3px;
  }
  .cafe-address { font-size: 12px; color: #999; margin: 0; }
  .cafe-meta {
    font-size: 11px; color: #bbb; margin-top: 8px;
    display: flex; gap: 12px; flex-wrap: wrap;
  }

  .action-row { display: flex; gap: 8px; margin-top: 14px; }

  .btn-approve {
    flex: 1; padding: 10px;
    background: #1D9E75; color: white;
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-approve:hover { background: #0F6E56; }
  .btn-approve:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-reject {
    flex: 1; padding: 10px;
    background: #FEF2F2; color: #A32D2D;
    border: 1px solid #FECACA; border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-reject:hover { background: #FEE2E2; }

  .btn-delete {
    padding: 10px 16px;
    background: #FEF2F2; color: #A32D2D;
    border: 1px solid #FECACA; border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-delete:hover { background: #FEE2E2; }

  .status-pill {
    font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px; white-space: nowrap;
  }
  .status-pending { background: #FEF3C7; color: #854F0B; }
  .status-published { background: #D1FAE5; color: #0F6E56; }

  .empty-state { text-align: center; padding: 48px 20px; color: #ccc; }
  .empty-icon { font-size: 36px; margin-bottom: 10px; }
  .empty-text { font-size: 14px; }

  .loading-spinner {
    width: 28px; height: 28px;
    border: 3px solid #F0EDE8;
    border-top-color: #FF8C61;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .forbidden {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; flex-direction: column; gap: 12px;
    font-family: 'DM Sans', sans-serif; background: #FAF8F5;
    text-align: center; padding: 40px;
  }
  .forbidden-icon { font-size: 48px; }
  .forbidden-title {
    font-family: 'Syne', sans-serif; font-size: 20px;
    font-weight: 800; color: #1a1a1a; margin: 8px 0 4px;
  }
  .forbidden-text { font-size: 13px; color: #999; }

  @media (max-width: 480px) {
    .admin-root { padding: 16px 12px 60px; }
    .action-row { flex-direction: column; }
  }
`

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')

  const {
    user, isAdmin,
    pendingCafes, cafes,
    loading,
    fetchPendingCafes, fetchCafes,
    approveCafe, rejectCafe, deleteCafe,
  } = useCafeStore()

  useEffect(() => {
    if (!user || !isAdmin()) return
    fetchPendingCafes()
    fetchCafes()
  }, [user])

  const formatDate = (ts) => {
    if (!ts) return '—'
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const handleApprove = async (id) => {
    if (!confirm('Approve cafe ini?')) return
    await approveCafe(id)
  }

  const handleReject = async (id, name) => {
    if (!confirm(`Tolak dan hapus "${name}"?`)) return
    await rejectCafe(id)
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus "${name}" dari daftar?`)) return
    await deleteCafe(id)
  }

  if (!user || !isAdmin()) {
    return <Navigate to="/admin-login" replace />
  }

  return (
    <>
      <style>{style}</style>
      <div className="admin-root">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Panel Admin</h1>
            <p className="admin-subtitle">WiFi Cafe Finder — {user.email}</p>
          </div>
          <button className="btn-back-admin" onClick={() => navigate('/')}>← Beranda</button>
        </div>

        <div className="admin-body">
          {/* Tab bar */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Menunggu
              <span className="badge badge-pending">{pendingCafes.length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
              onClick={() => setActiveTab('published')}
            >
              Published
              <span className="badge badge-published">{cafes.length}</span>
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#bbb' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 12px' }} />
              Memuat data...
            </div>
          )}

          {/* Tab Pending */}
          {!loading && activeTab === 'pending' && (
            pendingCafes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <p className="empty-text">Tidak ada cafe yang menunggu persetujuan.</p>
              </div>
            ) : (
              pendingCafes.map((cafe) => (
                <div className="cafe-card" key={cafe.id}>
                  <div className="cafe-card-top">
                    <div>
                      <p className="cafe-name">{cafe.name}</p>
                      <p className="cafe-address">📍 {cafe.address || '—'}</p>
                    </div>
                    <span className="status-pill status-pending">Pending</span>
                  </div>
                  <div className="cafe-meta">
                    <span>📅 {formatDate(cafe.created_at)}</span>
                    {cafe.submitted_by_name && <span>👤 {cafe.submitted_by_name}</span>}
                    {cafe.submitted_by && <span>✉️ {cafe.submitted_by}</span>}
                  </div>
                  <div className="action-row">
                    <button className="btn-approve" onClick={() => handleApprove(cafe.id)}>
                      ✓ Approve
                    </button>
                    <button className="btn-reject" onClick={() => handleReject(cafe.id, cafe.name)}>
                      ✕ Reject & Hapus
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* Tab Published */}
          {!loading && activeTab === 'published' && (
            cafes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">☕</div>
                <p className="empty-text">Belum ada cafe yang published.</p>
              </div>
            ) : (
              cafes.map((cafe) => (
                <div className="cafe-card" key={cafe.id}>
                  <div className="cafe-card-top">
                    <div>
                      <p className="cafe-name">{cafe.name}</p>
                      <p className="cafe-address">📍 {cafe.address || '—'}</p>
                    </div>
                    <span className="status-pill status-published">Published</span>
                  </div>
                  <div className="cafe-meta">
                    <span>📅 {formatDate(cafe.created_at)}</span>
                    <span>⭐ {cafe.review_count} review</span>
                  </div>
                  <div className="action-row">
                    <button className="btn-delete" onClick={() => handleDelete(cafe.id, cafe.name)}>
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </>
  )
}
