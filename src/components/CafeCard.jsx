import { useNavigate } from 'react-router-dom'

export default function CafeCard({ cafe, color = '#FF6B6B' }) {
  const navigate = useNavigate()

  const lighten = (hex) => hex + '22'

  return (
    <>
      <style>{`
        .cafe-card {
          background: white;
          border-radius: 20px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          border: 2.5px solid #F5F0FF;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          position: relative;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        .cafe-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.09);
          border-color: #E0D0FF;
        }

        .cafe-card-accent {
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 0 20px 0 80px;
          opacity: 0.12;
        }

        .cafe-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .cafe-name {
          font-family: 'Fredoka', sans-serif;
          font-size: 17px;
          font-weight: 600;
          color: #2D2D2D;
          line-height: 1.2;
          flex: 1;
          padding-right: 8px;
        }

        .cafe-address {
          font-size: 12px;
          color: #AAA;
          font-weight: 600;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cafe-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 3px;
          font-family: 'Nunito', sans-serif;
        }
      `}</style>
      <div className="cafe-card" onClick={() => navigate(`/cafe/${cafe.id}`)}>
        <div className="cafe-card-accent" style={{ background: color }} />

        <div className="cafe-card-top">
          <span className="cafe-name">{cafe.name}</span>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20,
            background: lighten(color), color: color, fontFamily: 'Fredoka, sans-serif',
            letterSpacing: '0.5px', whiteSpace: 'nowrap',
          }}>BUKA</span>
        </div>

        <div className="cafe-address">
          📍 {cafe.address || 'Alamat belum diisi'}
        </div>

        <div className="cafe-tags">
          <span className="tag" style={{ background: '#FFF3CD', color: '#B8860B' }}>
            📶 WiFi {cafe.avg_wifi ?? '–'}★
          </span>
          <span className="tag" style={{ background: '#F3E8FF', color: '#7C3AED' }}>
            ☕ Vibe {cafe.avg_vibe ?? '–'}★
          </span>
          <span className="tag" style={{ background: '#F0FFF4', color: '#15803D' }}>
            💬 {cafe.review_count ?? 0} review
          </span>
        </div>
      </div>
    </>
  )
}
