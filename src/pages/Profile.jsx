import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useCafeStore } from '../store/cafeStore'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .profile-root {
    font-family: 'Nunito', sans-serif;
    min-height: 100vh;
    background: #FAFAFA;
  }

  /* TOPBAR */
  .profile-topbar {
    background: white;
    border-bottom: 2px solid #F0EBF8;
    padding: 0 24px;
    height: 64px;
    display: flex; align-items: center; gap: 12px;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  }
  .btn-back {
    width: 36px; height: 36px;
    background: #F5F5F5; border: none;
    border-radius: 50%; cursor: pointer;
    font-size: 16px; display: flex;
    align-items: center; justify-content: center;
    text-decoration: none; color: #555;
    transition: all 0.15s; flex-shrink: 0;
  }
  .btn-back:hover { background: #EFEFEF; transform: translateX(-2px); }
  .topbar-title {
    font-family: 'Fredoka', sans-serif;
    font-size: 20px; font-weight: 700; color: #2D2D2D;
  }

  /* BODY */
  .profile-body {
    max-width: 680px; margin: 0 auto;
    padding: 28px 24px 60px;
  }

  /* HERO CARD */
  .profile-hero {
    background: linear-gradient(135deg, #FFF5F5, #FFF8EC, #F0F8FF);
    border: 2px solid #F0EBF8;
    border-radius: 24px;
    padding: 28px 24px;
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 24px;
    position: relative; overflow: hidden;
  }
  .profile-hero::after {
    content: '☕';
    position: absolute; right: -8px; top: -8px;
    font-size: 80px; opacity: 0.07;
    transform: rotate(15deg);
    pointer-events: none;
  }
  .profile-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    object-fit: cover; flex-shrink: 0;
    border: 3px solid white;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
  .profile-avatar-placeholder {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #FF6B6B, #FF9A3C);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Fredoka', sans-serif;
    font-size: 28px; font-weight: 700; color: white;
    flex-shrink: 0;
    border: 3px solid white;
    box-shadow: 0 4px 16px rgba(255,107,107,0.3);
  }
  .profile-info { flex: 1; min-width: 0; }
  .profile-name {
    font-family: 'Fredoka', sans-serif;
    font-size: 22px; font-weight: 700; color: #2D2D2D;
    margin-bottom: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .profile-email {
    font-size: 13px; color: #AAA; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .profile-stats {
    display: flex; gap: 16px; margin-top: 14px;
  }
  .profile-stat {
    text-align: center;
    background: white; border-radius: 12px;
    padding: 8px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .profile-stat-num {
    font-family: 'Fredoka', sans-serif;
    font-size: 20px; font-weight: 700; color: #2D2D2D;
  }
  .profile-stat-label {
    font-size: 10px; color: #AAA;
    font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* TABS */
  .tabs {
    display: flex; gap: 8px; margin-bottom: 20px;
  }
  .tab-btn {
    flex: 1; padding: 10px;
    border: 2px solid #EEE; background: white;
    border-radius: 14px; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700; color: #AAA;
    transition: all 0.15s; text-align: center;
  }
  .tab-btn.active {
    border-color: transparent;
    background: linear-gradient(135deg, #FF6B6B, #FF9A3C);
    color: white;
    box-shadow: 0 4px 12px rgba(255,107,107,0.3);
  }
  .tab-btn:hover:not(.active) { border-color: #CCC; color: #555; }

  /* SECTION */
  .section-empty {
    text-align: center; padding: 48px 24px;
  }
  .section-empty-icon { font-size: 40px; margin-bottom: 10px; }
  .section-empty-text { font-size: 14px; color: #AAA; font-weight: 600; line-height: 1.6; }

  /* REVIEW CARD */
  .review-card {
    background: white; border-radius: 18px;
    border: 2px solid #F0EDE8;
    padding: 16px 18px; margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    cursor: pointer; transition: all 0.15s;
  }
  .review-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
  .review-card-top {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 10px;
  }
  .review-cafe-name {
    font-family: 'Fredoka', sans-serif;
    font-size: 16px; font-weight: 700; color: #2D2D2D;
  }
  .review-date {
    font-size: 11px; color: #CCC; font-weight: 700;
  }
  .review-scores {
    display: flex; gap: 8px; margin-bottom: 10px;
  }
  .score-chip {
    font-size: 12px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
    background: #F5F5F5; color: #555;
  }
  .review-comment {
    font-size: 13px; color: #777; line-height: 1.5;
    font-style: italic;
  }

  /* CAFE CARD */
  .cafe-card {
    background: white; border-radius: 18px;
    border: 2px solid #F0EDE8;
    padding: 16px 18px; margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    display: flex; align-items: center; gap: 14px;
    transition: all 0.15s;
  }
  .cafe-card.clickable { cursor: pointer; }
  .cafe-card.clickable:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
  .cafe-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .cafe-icon.pending  { background: #FEF3C7; }
  .cafe-icon.published { background: #D1FAE5; }
  .cafe-icon.rejected { background: #FEE2E2; }
  .cafe-card-info { flex: 1; min-width: 0; }
  .cafe-card-name {
    font-family: 'Fredoka', sans-serif;
    font-size: 15px; font-weight: 700; color: #2D2D2D;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .cafe-card-address {
    font-size: 12px; color: #AAA; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .status-badge {
    font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px; flex-shrink: 0;
  }
  .status-badge.pending  { background: #FEF3C7; color: #B45309; }
  .status-badge.published { background: #D1FAE5; color: #065F46; }
  .status-badge.rejected { background: #FEE2E2; color: #991B1B; }

  /* LOADING */
  .loading-wrap {
    text-align: center; padding: 48px;
  }
  .spinner {
    width: 32px; height: 32px;
    border: 3px solid #EEE; border-top-color: #FF6B6B;
    border-radius: 50%; animation: spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`

const STATUS_CONFIG = {
  pending:   { icon: '⏳', cls: 'pending',   label: 'Menunggu' },
  published: { icon: '✅', cls: 'published', label: 'Disetujui' },
  rejected:  { icon: '❌', cls: 'rejected',  label: 'Ditolak' },
}

function formatDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, myCafes, fetchMyCafes } = useCafeStore()
  const [activeTab, setActiveTab] = useState('reviews')
  const [reviews, setReviews] = useState([])
  const [cafeMap, setCafeMap] = useState({})
  const [loadingReviews, setLoadingReviews] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchMyCafes()
    fetchMyReviews()
  }, [user])

  const fetchMyReviews = async () => {
    if (!user?.uid) return
    setLoadingReviews(true)
    try {
      const snap = await getDocs(
        query(collection(db, 'reviews'), where('user_id', '==', user.uid), orderBy('created_at', 'desc'))
      )
      const myReviews = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setReviews(myReviews)

      // Fetch nama cafe untuk tiap review
      const uniqueCafeIds = [...new Set(myReviews.map(r => r.cafe_id))]
      const map = {}
      await Promise.all(uniqueCafeIds.map(async (cafeId) => {
        try {
          const { getDoc, doc } = await import('firebase/firestore')
          const cafeDoc = await getDoc(doc(db, 'cafes', cafeId))
          if (cafeDoc.exists()) map[cafeId] = cafeDoc.data().name
        } catch {}
      }))
      setCafeMap(map)
    } catch (e) {
      console.warn('fetchMyReviews:', e.message)
    }
    setLoadingReviews(false)
  }

  if (!user) return null

  return (
    <>
      <style>{style}</style>
      <div className="profile-root">

        {/* TOPBAR */}
        <div className="profile-topbar">
          <Link to="/" className="btn-back">←</Link>
          <span className="topbar-title">Profil Saya</span>
        </div>

        <div className="profile-body">

          {/* HERO */}
          <div className="profile-hero">
            {user.photoURL
              ? <img src={user.photoURL} className="profile-avatar" alt="avatar" />
              : <div className="profile-avatar-placeholder">{user.displayName?.[0] ?? '?'}</div>
            }
            <div className="profile-info">
              <div className="profile-name">{user.displayName ?? 'Pengguna'}</div>
              <div className="profile-email">{user.email}</div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="profile-stat-num">{reviews.length}</div>
                  <div className="profile-stat-label">Review</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-num">{myCafes.length}</div>
                  <div className="profile-stat-label">Cafe</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-num">{myCafes.filter(c => c.status === 'published').length}</div>
                  <div className="profile-stat-label">Approved</div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              💬 Review ({reviews.length})
            </button>
            <button className={`tab-btn ${activeTab === 'cafes' ? 'active' : ''}`} onClick={() => setActiveTab('cafes')}>
              ☕ Cafe ({myCafes.length})
            </button>
          </div>

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <>
              {loadingReviews ? (
                <div className="loading-wrap">
                  <div className="spinner" />
                  <div style={{ fontSize: 13, color: '#CCC', fontWeight: 700 }}>Memuat review...</div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="section-empty">
                  <div className="section-empty-icon">💬</div>
                  <div className="section-empty-text">Kamu belum pernah menulis review.<br />Yuk kunjungi cafe dan kasih rating!</div>
                </div>
              ) : (
                reviews.map(review => (
                  <div
                    key={review.id}
                    className="review-card"
                    onClick={() => review.cafe_id && navigate(`/cafe/${review.cafe_id}`)}
                  >
                    <div className="review-card-top">
                      <div className="review-cafe-name">
                        ☕ {cafeMap[review.cafe_id] ?? 'Cafe'}
                      </div>
                      <div className="review-date">{formatDate(review.created_at)}</div>
                    </div>
                    <div className="review-scores">
                      {review.wifi_score  && <span className="score-chip">📶 WiFi {review.wifi_score}</span>}
                      {review.vibe_score  && <span className="score-chip">☕ Vibe {review.vibe_score}</span>}
                      {review.noise_score && <span className="score-chip">🔇 Sunyi {review.noise_score}</span>}
                    </div>
                    {review.comment && (
                      <div className="review-comment">"{review.comment}"</div>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {/* TAB: CAFES */}
          {activeTab === 'cafes' && (
            <>
              {myCafes.length === 0 ? (
                <div className="section-empty">
                  <div className="section-empty-icon">🏙️</div>
                  <div className="section-empty-text">Kamu belum menambahkan cafe.<br />
                    <span
                      style={{ color: '#FF6B6B', cursor: 'pointer', fontWeight: 700 }}
                      onClick={() => navigate('/tambah')}
                    >Tambah sekarang →</span>
                  </div>
                </div>
              ) : (
                myCafes.map(cafe => {
                  const cfg = STATUS_CONFIG[cafe.status] ?? STATUS_CONFIG.pending
                  return (
                    <div
                      key={cafe.id}
                      className={`cafe-card ${cafe.status === 'published' ? 'clickable' : ''}`}
                      onClick={() => cafe.status === 'published' && navigate(`/cafe/${cafe.id}`)}
                    >
                      <div className={`cafe-icon ${cfg.cls}`}>{cfg.icon}</div>
                      <div className="cafe-card-info">
                        <div className="cafe-card-name">{cafe.name}</div>
                        <div className="cafe-card-address">{cafe.address ?? '-'}</div>
                      </div>
                      <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
                    </div>
                  )
                })
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}
