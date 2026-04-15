import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCafeStore } from '../store/cafeStore'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .top-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #FAF8F5;
    padding-bottom: 60px;
  }

  /* Hero */
  .top-hero {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    padding: 48px 24px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .top-hero::before {
    content: '🏆';
    position: absolute;
    font-size: 200px;
    opacity: 0.05;
    top: -20px; right: -20px;
    transform: rotate(15deg);
  }
  .top-hero-eyebrow {
    font-size: 11px; font-weight: 700;
    color: #FF8C61; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 10px;
  }
  .top-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px; font-weight: 800;
    color: white; margin: 0 0 10px;
    line-height: 1.2;
  }
  .top-hero-title span {
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .top-hero-sub {
    font-size: 14px; color: rgba(255,255,255,0.5);
    margin: 0;
  }

  /* Body */
  .top-body {
    max-width: 640px; margin: 0 auto;
    padding: 0 20px;
  }

  /* Podium top 3 */
  .podium-wrap {
    margin-bottom: 32px;
  }

  .podium {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    position: relative; z-index: 10;
    align-items: end;
  }

  .podium-card {
    background: white; border-radius: 20px;
    padding: 16px 12px; text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    border: 1px solid #F0EDE8;
    cursor: pointer; transition: transform 0.2s;
    position: relative;
  }
  .podium-card:hover { transform: translateY(-4px); }

  .podium-card.rank-1 {
    padding: 24px 12px;
    box-shadow: 0 12px 40px rgba(255,140,97,0.25);
    border-color: #FDDCBE;
    background: linear-gradient(180deg, #FFFAF5, white);
  }
  .podium-card.rank-2 { background: linear-gradient(180deg, #F8F8F8, white); }
  .podium-card.rank-3 { background: linear-gradient(180deg, #FFF8F0, white); }

  .podium-medal { font-size: 28px; margin-bottom: 8px; }
  .podium-rank-1 .podium-medal { font-size: 36px; }

  .podium-name {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    color: #1a1a1a; margin-bottom: 6px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .podium-card.rank-1 .podium-name { font-size: 15px; }

  .podium-score {
    font-family: 'Syne', sans-serif;
    font-size: 24px; font-weight: 800;
    color: #FF8C61;
  }
  .podium-card.rank-1 .podium-score { font-size: 30px; }
  .podium-score-label { font-size: 10px; color: #BBB; font-weight: 600; letter-spacing: 0.5px; }

  .podium-reviews {
    font-size: 11px; color: #CCC; margin-top: 4px;
  }

  /* Crown for #1 */
  .crown {
    position: absolute; top: -14px; left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
  }

  /* Section title */
  .top-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700; color: #1a1a1a;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }

  /* List items */
  .top-list-item {
    background: white; border-radius: 16px;
    padding: 16px; margin-bottom: 10px;
    border: 1px solid #F0EDE8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    display: flex; align-items: center; gap: 14px;
    cursor: pointer; transition: all 0.2s;
  }
  .top-list-item:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.09);
    transform: translateX(4px);
  }

  .top-list-rank {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 800;
    color: #DDD; min-width: 32px; text-align: center;
  }

  .top-list-info { flex: 1; min-width: 0; }
  .top-list-name {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700; color: #1a1a1a;
    margin-bottom: 3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .top-list-address {
    font-size: 11px; color: #BBB; font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .top-list-scores {
    display: flex; gap: 8px; align-items: center; flex-shrink: 0;
  }
  .score-pill {
    font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
  }
  .score-pill.wifi { background: #E6F1FB; color: #185FA5; }
  .score-pill.vibe { background: #E1F5EE; color: #0F6E56; }

  /* Empty state */
  .top-empty {
    text-align: center; padding: 48px 20px; color: #CCC;
  }
  .top-empty-icon { font-size: 48px; margin-bottom: 12px; }
  .top-empty-text { font-size: 14px; font-weight: 500; }

  /* Loading */
  .top-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 48px; color: #CCC; gap: 12px; flex-direction: column;
  }
  .top-spinner {
    width: 32px; height: 32px;
    border: 3px solid #F0EDE8;
    border-top-color: #FF8C61;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Back button */
  .top-back {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50px; padding: 8px 16px;
    color: rgba(255,255,255,0.8); font-size: 13px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    margin-bottom: 20px; transition: all 0.2s;
  }
  .top-back:hover { background: rgba(255,255,255,0.2); color: white; }

  /* Divider */
  .top-divider {
    height: 1px; background: #F0EDE8; margin: 24px 0;
  }

  /* Stats bar */
  .stats-bar {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 12px; margin-bottom: 28px;
  }
  .stat-card {
    background: white; border-radius: 14px;
    padding: 14px; text-align: center;
    border: 1px solid #F0EDE8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .stat-card-val {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 800; color: #1a1a1a;
  }
  .stat-card-label { font-size: 10px; color: #BBB; font-weight: 600; letter-spacing: 0.5px; margin-top: 2px; }
`

const MEDALS = ['🥇', '🥈', '🥉']

export default function TopCafe() {
  const navigate = useNavigate()
  const { cafes, fetchCafes, loading } = useCafeStore()

  useEffect(() => { fetchCafes() }, [])

  // Sort by avg_wifi descending, filter yang ada rating
  const ranked = [...cafes]
    .filter((c) => c.avg_wifi !== null && c.avg_wifi !== undefined)
    .sort((a, b) => (b.avg_wifi ?? 0) - (a.avg_wifi ?? 0))

  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  const avgWifi = cafes.length
    ? (cafes.reduce((a, c) => a + (parseFloat(c.avg_wifi) || 0), 0) / cafes.filter(c => c.avg_wifi).length).toFixed(1)
    : '–'
  const totalReviews = cafes.reduce((a, c) => a + (c.review_count || 0), 0)

  return (
    <>
      <style>{style}</style>
      <div className="top-root">

        {/* Hero */}
        <div className="top-hero">
          <button className="top-back" onClick={() => navigate('/')}>← Kembali</button>
          <p className="top-hero-eyebrow">Pekanbaru · WiFi Cafe Finder</p>
          <h1 className="top-hero-title">
            Cafe WiFi<br /><span>Terbaik</span> di Kotamu
          </h1>
          <p className="top-hero-sub">Diurutkan berdasarkan rating WiFi dari komunitas</p>
        </div>

        <div className="top-body">

          {loading && (
            <div className="top-loading">
              <div className="top-spinner" />
              <span style={{ fontSize: 13 }}>Memuat ranking...</span>
            </div>
          )}

          {!loading && ranked.length === 0 && (
            <div className="top-empty" style={{ marginTop: 32 }}>
              <div className="top-empty-icon">🏆</div>
              <p className="top-empty-text">Belum ada cafe dengan rating WiFi</p>
            </div>
          )}

          {!loading && ranked.length > 0 && (
            <>
              {/* Stats */}
              <div className="stats-bar" style={{ marginTop: 28 }}>
                <div className="stat-card">
                  <div className="stat-card-val">{cafes.length}</div>
                  <div className="stat-card-label">TOTAL CAFE</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-val">{totalReviews}</div>
                  <div className="stat-card-label">TOTAL REVIEW</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-val">⭐ {avgWifi}</div>
                  <div className="stat-card-label">AVG WIFI</div>
                </div>
              </div>

              {/* Podium top 3 */}
              {top3.length > 0 && (
                <div className="podium-wrap">
                  <p className="top-section-title">🏆 Podium Teratas</p>
                  <div className="podium">
                    {[1, 0, 2].map((idx) => {
                      const cafe = top3[idx]
                      if (!cafe) return <div key={idx} />
                      const rank = idx + 1
                      return (
                        <div
                          key={cafe.id}
                          className={`podium-card rank-${rank}`}
                          onClick={() => navigate(`/cafe/${cafe.id}`)}
                        >
                          {rank === 1 && <div className="crown">👑</div>}
                          <div className="podium-medal">{MEDALS[idx]}</div>
                          <div className="podium-name">{cafe.name}</div>
                          <div className="podium-score">{cafe.avg_wifi}</div>
                          <div className="podium-score-label">WiFi SCORE</div>
                          <div className="podium-reviews">{cafe.review_count ?? 0} review</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Rest of rankings */}
              {rest.length > 0 && (
                <>
                  <div className="top-divider" />
                  <p className="top-section-title">📋 Ranking Lengkap</p>
                  {ranked.map((cafe, i) => (
                    <div
                      key={cafe.id}
                      className="top-list-item"
                      onClick={() => navigate(`/cafe/${cafe.id}`)}
                    >
                      <div className="top-list-rank">
                        {i < 3 ? MEDALS[i] : `#${i + 1}`}
                      </div>
                      <div className="top-list-info">
                        <div className="top-list-name">{cafe.name}</div>
                        <div className="top-list-address">
                          📍 {cafe.address || 'Alamat belum diisi'}
                        </div>
                      </div>
                      <div className="top-list-scores">
                        <span className="score-pill wifi">📶 {cafe.avg_wifi}</span>
                        <span className="score-pill vibe">☕ {cafe.avg_vibe ?? '–'}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}
