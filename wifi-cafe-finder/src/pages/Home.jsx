import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCafeStore } from '../store/cafeStore'
import CafeCard from '../components/CafeCard'

const FILTERS = ['Semua', 'WiFi Kenceng', 'Sepi', 'Ada Colokan']

export default function Home() {
  const { cafes, fetchCafes, loading } = useCafeStore()
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchCafes() }, [])

  const filtered = cafes.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    if (activeFilter === 'WiFi Kenceng') return matchSearch && c.avg_wifi >= 4
    if (activeFilter === 'Sepi') return matchSearch && c.avg_noise >= 4
    if (activeFilter === 'Ada Colokan') return matchSearch
    return matchSearch
  })

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: 20, fontWeight: 500 }}>☕ WiFi Cafe Finder</h1>
        <span style={{ fontSize: 11, background: '#E1F5EE', color: '#0F6E56', padding: '3px 8px', borderRadius: 20 }}>Beta</span>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari cafe di sekitar kamu..."
        style={{
          width: '100%', padding: '9px 12px', border: '0.5px solid #e5e5e5',
          borderRadius: 8, fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              fontSize: 12, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer',
              border: '0.5px solid',
              borderColor: activeFilter === f ? '#5DCAA5' : '#e5e5e5',
              background: activeFilter === f ? '#E1F5EE' : 'white',
              color: activeFilter === f ? '#0F6E56' : '#888',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{
        background: '#f0f8f4', borderRadius: 12, border: '0.5px solid #e5e5e5',
        height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14, fontSize: 13, color: '#888',
      }}>
        🗺️ Peta akan muncul di sini (butuh Google Maps API key)
      </div>

      <p style={{ fontSize: 13, color: '#888', marginBottom: 8, fontWeight: 500 }}>
        {loading ? 'Loading...' : `${filtered.length} cafe ditemukan`}
      </p>

      {filtered.length === 0 && !loading && (
        <p style={{ fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 32 }}>
          Belum ada cafe. Yuk tambahkan yang pertama! 👇
        </p>
      )}

      {filtered.map((cafe) => (
        <CafeCard key={cafe.id} cafe={cafe} />
      ))}

      <button
        onClick={() => navigate('/tambah')}
        style={{
          width: '100%', marginTop: 12, padding: 11,
          border: '0.5px solid #ccc', borderRadius: 8,
          background: 'white', fontSize: 14, cursor: 'pointer',
        }}
      >
        + Tambah cafe baru
      </button>
    </div>
  )
}
