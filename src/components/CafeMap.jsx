import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const style = `
 .cafe-map-wrap {
  border-radius: 16px;
  border: 1px solid #F0EDE8;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}
.cafe-map-wrap .leaflet-container {
  height: 220px;
  width: 100%;
  border-radius: 16px;    /* ← pindah ke sini */
  overflow: hidden;       /* ← pindah ke sini */
  font-family: 'DM Sans', sans-serif;
}
  .cafe-map-popup .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    border: none;
    padding: 0;
  }
  .map-popup-inner {
    padding: 10px 14px;
    min-width: 140px;
  }
  .map-popup-name {
    font-weight: 700; font-size: 13px; color: #1a1a1a;
    margin-bottom: 4px;
  }
  .map-popup-rating {
    font-size: 11px; color: #888;
    margin-bottom: 8px;
  }
  .map-popup-btn {
    width: 100%; padding: 6px;
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    border: none; border-radius: 8px;
    color: white; font-size: 11px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
`

export default function CafeMap({ cafes }) {
  const navigate = useNavigate()

  // Filter cafe yang punya koordinat
  const cafesWithCoords = cafes.filter(
    (c) => c.lat && c.lng && !isNaN(parseFloat(c.lat)) && !isNaN(parseFloat(c.lng))
  )

  // Center peta: rata-rata koordinat cafe, atau default Pekanbaru
  const center = cafesWithCoords.length > 0
    ? [
        cafesWithCoords.reduce((a, c) => a + parseFloat(c.lat), 0) / cafesWithCoords.length,
        cafesWithCoords.reduce((a, c) => a + parseFloat(c.lng), 0) / cafesWithCoords.length,
      ]
    : [0.5071, 101.4478] // Pekanbaru default

  if (cafesWithCoords.length === 0) {
    return (
      <>
        <style>{style}</style>
        <div className="cafe-map-wrap" style={{
          height: 220, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 8,
          background: '#F5F2ED', color: '#BBB',
        }}>
          <span style={{ fontSize: 32 }}>🗺️</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Belum ada cafe dengan koordinat</span>
          <span style={{ fontSize: 11 }}>Isi latitude & longitude saat tambah cafe</span>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{style}</style>
      <div className="cafe-map-wrap">
        <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {cafesWithCoords.map((cafe) => (
            <Marker
              key={cafe.id}
              position={[parseFloat(cafe.lat), parseFloat(cafe.lng)]}
            >
              <Popup className="cafe-map-popup">
                <div className="map-popup-inner">
                  <div className="map-popup-name">{cafe.name}</div>
                  <div className="map-popup-rating">
                    📶 WiFi {cafe.avg_wifi ?? '–'} · ☕ Vibe {cafe.avg_vibe ?? '–'}
                  </div>
                  <button
                    className="map-popup-btn"
                    onClick={() => navigate(`/cafe/${cafe.id}`)}
                  >
                    Lihat detail →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  )
}
