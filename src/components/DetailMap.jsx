import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const style = `
  .detail-map-wrap {
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #F0EDE8;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    margin-bottom: 20px;
  }
  .detail-map-footer {
    background: white;
    padding: 12px 16px;
    border-top: 1px solid #F0EDE8;
    display: flex; justify-content: space-between; align-items: center;
  }
  .detail-map-address {
    font-size: 12px; color: #888; font-weight: 500;
    display: flex; align-items: center; gap: 5px;
  }
  .btn-gmaps {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    background: #E8F5E9; color: #2E7D32;
    border: none; border-radius: 8px;
    font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    text-decoration: none; transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-gmaps:hover { background: #C8E6C9; }
`

export default function DetailMap({ cafe }) {
  if (!cafe.lat || !cafe.lng || isNaN(parseFloat(cafe.lat))) {
    return null
  }

  const lat = parseFloat(cafe.lat)
  const lng = parseFloat(cafe.lng)
  const gmapsUrl = `https://www.google.com/maps?q=${lat},${lng}`

  return (
    <>
      <style>{style}</style>
      <div className="detail-map-wrap">
        <MapContainer
          center={[lat, lng]}
          zoom={16}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ height: '200px', width: '100%' }}  // ← fix: inline style, bukan CSS class
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>{cafe.name}</Popup>
          </Marker>
        </MapContainer>
        <div className="detail-map-footer">
          <span className="detail-map-address">
            📍 {cafe.address || 'Alamat belum diisi'}
          </span>
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gmaps"
          >
            🗺️ Buka di Maps
          </a>
        </div>
      </div>
    </>
  )
}
