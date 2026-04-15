import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCafeStore } from '../store/cafeStore'
import StarRating from '../components/StarRating'
import DetailMap from '../components/DetailMap'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  * { box-sizing: border-box; }

  .detail-root {
    font-family: 'DM Sans', sans-serif;
    background: #FAF8F5;
    min-height: 100vh;
    padding-bottom: 60px;
    width: 100%;
    overflow-x: hidden;
  }
  .btn-maps {
  width: 100%;
  margin-top: 12px;
  margin-bottom: 20px;
  padding: 14px;
  border: 1px solid #E8E2DA;
  border-radius: 14px;
  background: white;
  color: #333;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
}

.btn-maps:hover {
  transform: translateY(-1px);
}

  /* ── HERO ── */
  .detail-hero {
    position: relative;
    height: 260px;
    padding-bottom: 20px;
    overflow: hidden;
    background: linear-gradient(135deg, #FDEBD0 0%, #FDD9B5 40%, #F9C49A 100%);
  }

  @media (min-width: 480px) {
    .detail-hero { height: 280px; }
  }

  .detail-hero img {
    width: 100%; height: 100%; object-fit: cover;
  }

  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%);
  }

  .hero-emoji {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 64px;
    filter: drop-shadow(0 8px 24px rgba(0,0,0,0.12));
  }

  .hero-top-bar {
    position: absolute; top: 0; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 14px 16px;
    z-index: 10;
  }

  .btn-back {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border: none; border-radius: 50px;
    padding: 8px 14px; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500; color: #333;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-back:hover { background: white; transform: translateX(-2px); }

  .badge-open {
    background: #1D9E75; color: white;
    font-size: 11px; font-weight: 600;
    padding: 6px 12px; border-radius: 50px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(29,158,117,0.35);
    white-space: nowrap;
  }

  .hero-bottom-info {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 0 16px 18px;
    z-index: 10;
  }

  .hero-cafe-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(20px, 5vw, 28px);
    font-weight: 800;
    color: white;
    margin: 0 0 4px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.3);
    line-height: 1.2;
    word-break: break-word;
  }

  .hero-address {
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    margin: 0;
    display: flex;
    align-items: flex-start;
    gap: 4px;
    line-height: 1.4;
  }

  /* ── BODY ── */
  .detail-body {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 14px;
  }

  /* ── SCORE CARDS ── */
.score-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 18px;
  position: relative;
  z-index: 20;
  margin-bottom: 24px;
}

  .score-card {
  background: white;
  border-radius: 18px;
  padding: 16px 10px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.9);
}
  .score-card:hover { transform: translateY(-2px); }

  .score-icon {
    font-size: 20px;
    margin-bottom: 5px;
    display: block;
  }

  .score-value {
    font-family: 'Syne', sans-serif;
    font-size: clamp(22px, 6vw, 32px);
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
    display: block;
  }

  .score-label {
    font-size: clamp(9px, 2.5vw, 11px);
    color: #999;
    font-weight: 500;
    letter-spacing: 0.3px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── SECTION ── */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 14px;
}
  .section-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.5;
  padding-top: 2px;
}
  .section-count {
    font-size: 11px; color: #999; font-weight: 500;
    background: #F0EDE8; padding: 3px 10px; border-radius: 20px;
    white-space: nowrap;
  }

  /* ── REVIEW CARD ── */
  .review-card {
    background: white;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    border: 1px solid #F0EDE8;
    transition: box-shadow 0.2s;
  }
  .review-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); }

  .review-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
  }

  .reviewer-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }

  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    color: white; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; font-family: 'Syne', sans-serif;
    flex-shrink: 0;
  }

  .reviewer-name {
    font-size: 13px; font-weight: 600; color: #333;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .review-date { font-size: 11px; color: #bbb; margin-top: 1px; }

  .review-comment {
    font-size: 13px; color: #555;
    line-height: 1.65; margin: 8px 0 0;
  }

  .review-photos {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 6px; margin-top: 12px;
  }
  .review-photo {
    aspect-ratio: 1; border-radius: 10px;
    object-fit: cover; width: 100%;
  }

  .tag-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .tag {
    font-size: 10px; font-weight: 600;
    background: #F5F2ED; color: #777;
    padding: 3px 10px; border-radius: 20px;
    letter-spacing: 0.3px;
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center; padding: 36px 20px;
    color: #bbb;
  }
  .empty-icon { font-size: 36px; margin-bottom: 10px; }
  .empty-text { font-size: 13px; }

  /* ── CTA ── */
  .cta-section {
  position: sticky;
  bottom: 12px;
  margin-top: 24px;
  padding-top: 12px;
  background: linear-gradient(to top, #FAF8F5 70%, transparent);
}

  .btn-review {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #FF8C61, #F05D5E);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(240,93,94,0.25);
}
  .btn-review:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(240,93,94,0.45);
  }
  .btn-review:active { transform: translateY(0); }

  /* ── MISC ── */
  .divider {
    height: 1px; background: #F0EDE8; margin: 20px 0;
  }

  .image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.image-modal img {
  max-width: 90%;
  max-height: 85vh;
  border-radius: 16px;
}	
  .loading-screen {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; color: #aaa; font-size: 14px;
    background: #FAF8F5; flex-direction: column; gap: 12px;
  }
  .loading-spinner {
    width: 32px; height: 32px;
    border: 3px solid #F0EDE8;
    border-top-color: #FF8C61;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`


export default function CafeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState(null)

  const { selectedCafe, selectCafe, loading } = useCafeStore()

  useEffect(() => { selectCafe(id) }, [id])

  if (loading || !selectedCafe) {
    return (
      <>
        <style>{style}</style>
        <div className="loading-screen">
          <div className="loading-spinner" />
          <span>Memuat detail cafe...</span>
        </div>
      </>
    )
  }

  const cafe = selectedCafe
  const scores = [
    { icon: '📶', label: 'WiFi', val: cafe.avg_wifi, color: '#185FA5' },
    { icon: '🔇', label: 'Kondusif', val: cafe.avg_noise, color: '#7B5EA7' },
    { icon: '☕', label: 'Vibe', val: cafe.avg_vibe, color: '#1D9E75' },
  ]
  const openMaps = () => {
  const query = encodeURIComponent(`${cafe.name} ${cafe.address || ''}`)
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
}

  return (
    <>
      <style>{style}</style>
      <div className="detail-root">

        {/* Hero */}
        <div className="detail-hero">
          {cafe.cover_photo_url
            ? <img src={cafe.cover_photo_url} alt={cafe.name} />
            : null
          }
          <div className="hero-overlay" />
          {!cafe.cover_photo_url && <div className="hero-emoji">☕</div>}

          <div className="hero-top-bar">
            <button className="btn-back" onClick={() => navigate('/')}>
              ← Kembali
            </button>
            <span className="badge-open">● Buka sekarang</span>
          </div>

          <div className="hero-bottom-info">
            <h1 className="hero-cafe-name">{cafe.name}</h1>
            <p className="hero-address">
              📍 {cafe.address || 'Alamat belum diisi'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">

          {/* Score Cards */}
          <div className="score-row">
            {scores.map(({ icon, label, val, color }) => (
              <div className="score-card" key={label}>
                <span className="score-icon">{icon}</span>
                <span className="score-value" style={{ color }}>{val ?? '–'}</span>
                <span className="score-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Map */}
          <div style={{ marginBottom: 28 }}>
			  <DetailMap cafe={cafe} />
			</div>

          {/* Reviews */}
          <div className="section-header">
            <span className="section-title">Ulasan Pengunjung</span>
            <span className="section-count">{cafe.reviews?.length ?? 0} ulasan</span>
          </div>

          {(!cafe.reviews || cafe.reviews.length === 0) && (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <p className="empty-text">Belum ada review. Jadilah yang pertama!</p>
            </div>
          )}

          {cafe.reviews?.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-top">
                <div className="reviewer-info">
                  {r.user_photo
                    ? <img src={r.user_photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    : <div className="avatar">
                        {(r.user_name ?? r.user_id ?? 'AN').slice(0, 2).toUpperCase()}
                      </div>
                  }
                  <div style={{ minWidth: 0 }}>
                    <div className="reviewer-name">{r.user_name ?? 'Pengunjung'}</div>
                    <div className="review-date">
                      {r.created_at?.toDate
                        ? r.created_at.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                        : r.created_at
                          ? new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                          : '—'}
                    </div>
                  </div>
                </div>
                <StarRating value={r.wifi_score} readOnly size={14} />
              </div>

              {r.comment && <p className="review-comment">{r.comment}</p>}

              {r.photo_urls?.length > 0 && (
                <div className="review-photos">
                  {r.photo_urls.map((url, idx) => (
                    <img
  key={idx}
  src={url}
  alt={`Foto ${idx + 1}`}
  className="review-photo"
  onClick={() => setPreviewImage(url)}
  style={{ cursor: 'pointer' }}
/>
                  ))}
                </div>
              )}

              {r.suitable_for?.length > 0 && (
                <div className="tag-row">
                  {r.suitable_for.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="cta-section">
            <button className="btn-review" onClick={() => navigate(`/review/${cafe.id}`)}>
              + Tulis review kamu
            </button>
          </div>
        </div>
	        {previewImage && (
          <div
            className="image-modal"
            onClick={() => setPreviewImage(null)}
          >
            <img src={previewImage} alt="Preview" />
          </div>
        )}
      </div>
    </>
  )
}
