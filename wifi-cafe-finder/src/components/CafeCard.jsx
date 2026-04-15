import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'

export default function CafeCard({ cafe }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/cafe/${cafe.id}`)}
      style={{
        background: 'white',
        border: '0.5px solid #e5e5e5',
        borderRadius: 12,
        padding: '12px 14px',
        marginBottom: 10,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#aaa')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontWeight: 500, fontSize: 15 }}>{cafe.name}</span>
        <span style={{
          fontSize: 11,
          background: '#E1F5EE',
          color: '#0F6E56',
          padding: '2px 8px',
          borderRadius: 20,
        }}>Buka</span>
      </div>

      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
        📍 {cafe.address || 'Alamat belum diisi'}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, background: '#E6F1FB', color: '#185FA5', padding: '3px 10px', borderRadius: 20 }}>
          📶 WiFi {cafe.avg_wifi ?? '–'}★
        </span>
        <span style={{ fontSize: 11, background: '#EEEDFE', color: '#534AB7', padding: '3px 10px', borderRadius: 20 }}>
          ☕ Vibe {cafe.avg_vibe ?? '–'}★
        </span>
        <span style={{ fontSize: 11, background: '#F1EFE8', color: '#5F5E5A', padding: '3px 10px', borderRadius: 20 }}>
          💬 {cafe.review_count ?? 0} review
        </span>
      </div>
    </div>
  )
}
