import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCafeStore } from '../store/cafeStore'
import StarRating from '../components/StarRating'
import PhotoUploader from '../components/PhotoUploader'

const SPEEDS = ['< 5 Mbps', '5-20 Mbps', '20-50 Mbps', '> 50 Mbps']
const FACILITIES = ['Colokan banyak', 'AC', 'Smoking area', 'Outdoor', 'Toilet bersih', 'Parkir luas']
const SUITABLE = ['Kerja solo', 'Meeting', 'Ngerjain tugas', 'Nongkrong', 'Video call']

export default function ReviewForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { submitReview, user } = useCafeStore()
  const { register, handleSubmit } = useForm()

  const [wifi, setWifi] = useState(0)
  const [vibe, setVibe] = useState(0)
  const [noise, setNoise] = useState(0)
  const [speed, setSpeed] = useState('')
  const [facilities, setFacilities] = useState([])
  const [suitable, setSuitable] = useState([])
  const [photoUrls, setPhotoUrls] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])

  const onSubmit = async (data) => {
    if (!wifi || !vibe || !noise) { setError('Isi semua rating bintang dulu ya!'); return }
    if (!user) { setError('Kamu harus login dulu!'); return }
    setSubmitting(true)
    setError('')
    try {
      await submitReview(id, {
        wifi_score: wifi, vibe_score: vibe, noise_score: noise,
        wifi_speed: speed, facilities, suitable_for: suitable,
        comment: data.comment,
        photo_urls: photoUrls,
      })
      setSuccess(true)
    } catch (e) {
      setError(e.message)
    }
    setSubmitting(false)
  }

  if (success) return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 32, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontWeight: 500, marginBottom: 8 }}>Review berhasil dikirim!</h2>
      <p style={{ color: '#888', marginBottom: 24 }}>Makasih udah bantu komunitas!</p>
      <button
        onClick={() => navigate(`/cafe/${id}`)}
        style={{ padding: '10px 24px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
      >
        Lihat halaman cafe →
      </button>
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '0.5px solid #e5e5e5',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: 'white',
  }

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '1rem 1rem 2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 500 }}>Review cafe baru</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Ratings */}
        <div style={{ background: '#f8f8f6', borderRadius: 12, padding: '12px 14px', marginBottom: '1.25rem' }}>
          {[
            { label: '📶 Kecepatan WiFi', val: wifi, set: setWifi },
            { label: '🔇 Tingkat kebisingan', val: noise, set: setNoise },
            { label: '☕ Kenyamanan tempat', val: vibe, set: setVibe },
          ].map(({ label, val, set }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13 }}>{label}</span>
              <StarRating value={val} onChange={set} size={22} />
            </div>
          ))}
        </div>

        {/* Speed */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Estimasi kecepatan WiFi</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {SPEEDS.map((s) => (
              <button type="button" key={s} onClick={() => setSpeed(s)} style={{
                flex: 1, padding: '7px 0', fontSize: 11, cursor: 'pointer', borderRadius: 8,
                border: '0.5px solid',
                borderColor: speed === s ? '#85B7EB' : '#e5e5e5',
                background: speed === s ? '#E6F1FB' : 'white',
                color: speed === s ? '#185FA5' : '#888',
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Fasilitas tersedia</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FACILITIES.map((f) => (
              <button type="button" key={f} onClick={() => toggle(facilities, setFacilities, f)} style={{
                fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                border: '0.5px solid',
                borderColor: facilities.includes(f) ? '#5DCAA5' : '#e5e5e5',
                background: facilities.includes(f) ? '#E1F5EE' : 'white',
                color: facilities.includes(f) ? '#0F6E56' : '#888',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Suitable for */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Cocok untuk</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SUITABLE.map((s) => (
              <button type="button" key={s} onClick={() => toggle(suitable, setSuitable, s)} style={{
                fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                border: '0.5px solid',
                borderColor: suitable.includes(s) ? '#5DCAA5' : '#e5e5e5',
                background: suitable.includes(s) ? '#E1F5EE' : 'white',
                color: suitable.includes(s) ? '#0F6E56' : '#888',
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Ulasan singkat</div>
          <textarea
            {...register('comment')}
            placeholder="Ceritain pengalamanmu di sini..."
            style={{ ...inputStyle, resize: 'none', height: 80, lineHeight: 1.5 }}
          />
        </div>

        {/* Photos */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Foto cafe (opsional, maks 4)</div>
          <PhotoUploader
            folder="reviews"
            maxPhotos={4}
            onUploaded={(updater) => setPhotoUrls(updater)}
          />
        </div>

        {error && <p style={{ color: '#E24B4A', fontSize: 13, marginBottom: 10 }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%', padding: 11, background: submitting ? '#aaa' : '#1D9E75',
            border: 'none', borderRadius: 8, color: 'white',
            fontSize: 15, fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Mengirim...' : 'Kirim review →'}
        </button>
      </form>
    </div>
  )
}
