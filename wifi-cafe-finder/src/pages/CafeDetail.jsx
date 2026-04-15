import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCafeStore } from '../store/cafeStore'
import StarRating from '../components/StarRating'

export default function CafeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { selectedCafe, selectCafe, loading } = useCafeStore()

  useEffect(() => { selectCafe(id) }, [id])

  if (loading || !selectedCafe) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>Loading...</div>
  }

  const cafe = selectedCafe

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', fontFamily: 'sans-serif', paddingBottom: 32 }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #E1F5EE, #E6F1FB)',
        height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0 0 12px 12px', position: 'relative', fontSize: 52, overflow: 'hidden',
      }}>
        {cafe.cover_photo_url
          ? <img src={cafe.cover_photo_url} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '☕'
        }
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 12, left: 12,
            background: 'white', border: '0.5px solid #e5e5e5',
            borderRadius: 20, padding: '4px 12px', fontSize: 13, cursor: 'pointer', color: '#888',
          }}
        >
          ← Kembali
        </button>
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: '#E1F5EE', color: '#0F6E56',
          fontSize: 11, padding: '4px 10px', borderRadius: 20,
        }}>Buka sekarang</span>
      </div>

      <div style={{ padding: '14px 16px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 3 }}>{cafe.name}</h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>📍 {cafe.address || 'Alamat belum diisi'}</p>

        {/* Score cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { icon: '📶', label: 'WiFi', val: cafe.avg_wifi, color: '#185FA5' },
            { icon: '🔇', label: 'Kondusif', val: cafe.avg_noise, color: '#534AB7' },
            { icon: '☕', label: 'Vibe', val: cafe.avg_vibe, color: '#0F6E56' },
          ].map(({ icon, label, val, color }) => (
            <div key={label} style={{ background: '#f8f8f6', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>{icon}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color }}>{val ?? '–'}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '0.5px solid #eee', margin: '14px 0' }} />

        {/* Reviews */}
        <p style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 10 }}>
          Ulasan pengunjung ({cafe.reviews?.length ?? 0})
        </p>

        {cafe.reviews?.length === 0 && (
          <p style={{ fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 16 }}>
            Belum ada review. Jadilah yang pertama! 🎉
          </p>
        )}

        {cafe.reviews?.map((r) => (
          <div key={r.id} style={{
            border: '0.5px solid #eee', borderRadius: 12, padding: '12px 14px', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#E6F1FB', color: '#185FA5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 500,
              }}>
                {r.user_id?.slice(0, 2).toUpperCase() ?? 'AN'}
              </div>
              <span style={{ fontSize: 11, color: '#aaa' }}>
                {new Date(r.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>
            <StarRating value={r.wifi_score} readOnly size={16} />
            {r.comment && <p style={{ fontSize: 13, color: '#555', marginTop: 6, lineHeight: 1.6 }}>{r.comment}</p>}

            {/* Foto review */}
            {r.photo_urls?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
                {r.photo_urls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Foto ${idx + 1}`}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8 }}
                  />
                ))}
              </div>
            )}
            {r.suitable_for?.length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 7 }}>
                {r.suitable_for.map((tag) => (
                  <span key={tag} style={{ fontSize: 10, background: '#f0f0f0', padding: '2px 8px', borderRadius: 20, color: '#666' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        <hr style={{ border: 'none', borderTop: '0.5px solid #eee', margin: '14px 0' }} />

        <button
          onClick={() => navigate(`/review/${cafe.id}`)}
          style={{
            width: '100%', padding: 11, background: '#1D9E75',
            border: 'none', borderRadius: 8, color: 'white',
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
          }}
        >
          + Tulis review kamu
        </button>
      </div>
    </div>
  )
}
