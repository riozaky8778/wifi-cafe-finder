import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCafeStore } from '../store/cafeStore'
import StarRating from '../components/StarRating'
import PhotoUploader from '../components/PhotoUploader'

const SPEEDS = ['< 5 Mbps', '5-20 Mbps', '20-50 Mbps', '> 50 Mbps']
const FACILITIES = ['Colokan banyak', 'AC', 'Smoking area', 'Outdoor', 'Toilet bersih', 'Parkir luas']
const SUITABLE = ['Kerja solo', 'Meeting', 'Ngerjain tugas', 'Nongkrong', 'Video call']

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .rf-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #FAF8F5;
    padding-bottom: 48px;
  }

  .rf-topbar {
    display: flex; align-items: center; gap: 12px;
    padding: 20px 24px 0;
    max-width: 560px; margin: 0 auto;
  }

  .rf-btn-back {
    width: 36px; height: 36px;
    background: white; border: 1px solid #EDE9E3;
    border-radius: 50%; cursor: pointer;
    font-size: 16px; color: #555; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .rf-btn-back:hover { background: #F5F2ED; transform: translateX(-2px); }

  .rf-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0;
  }

  .rf-wrap {
    max-width: 560px; margin: 20px auto 0;
    padding: 0 24px;
    display: flex; flex-direction: column; gap: 14px;
  }

  .rf-section {
    background: white;
    border-radius: 20px;
    padding: 20px;
    border: 1px solid #F0EDE8;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }

  .rf-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #BBB; letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #F5F2ED;
  }

  .rating-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #F5F2ED;
  }
  .rating-row:last-child { border-bottom: none; padding-bottom: 0; }
  .rating-row-label {
    font-size: 14px; color: #444; font-weight: 500;
    display: flex; align-items: center; gap: 8px;
  }

  .speed-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .speed-btn {
    padding: 9px 4px; font-size: 11px; font-weight: 600;
    cursor: pointer; border-radius: 10px;
    border: 1.5px solid #EDE9E3;
    background: white; color: #AAA;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s; text-align: center;
  }
  .speed-btn.active { border-color: #FF8C61; background: #FFF5EF; color: #D4622A; }
  .speed-btn:hover:not(.active) { border-color: #D5CFCA; }

  .tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag-btn {
    font-size: 12px; font-weight: 600;
    padding: 6px 14px; border-radius: 20px; cursor: pointer;
    border: 1.5px solid #EDE9E3;
    background: white; color: #AAA;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .tag-btn.active { border-color: #1D9E75; background: #E1F5EE; color: #0F6E56; }
  .tag-btn:hover:not(.active) { border-color: #D5CFCA; }

  .rf-textarea {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid #EDE9E3;
    border-radius: 12px; font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    background: #FAFAF8; color: #1a1a1a;
    outline: none; box-sizing: border-box;
    resize: none; height: 90px; line-height: 1.6;
    transition: all 0.2s;
  }
  .rf-textarea::placeholder { color: #C5BFB6; }
  .rf-textarea:focus { border-color: #FF8C61; background: white; box-shadow: 0 0 0 3px rgba(255,140,97,0.12); }

  .rf-error {
    background: #FFF1F1; border: 1px solid #FDD;
    border-radius: 12px; padding: 12px 16px;
    font-size: 13px; color: #D44;
  }

  .rf-submit {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    border: none; border-radius: 14px;
    color: white; font-size: 15px;
    font-family: 'Syne', sans-serif;
    font-weight: 700; cursor: pointer;
    box-shadow: 0 6px 24px rgba(240,93,94,0.3);
    transition: all 0.2s;
  }
  .rf-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(240,93,94,0.42); }
  .rf-submit:disabled { background: #D5CFCA; box-shadow: none; cursor: not-allowed; }

  .rf-success {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; background: #FAF8F5;
  }
  .rf-success-card {
    text-align: center; padding: 48px 32px;
    background: white; border-radius: 24px;
    border: 1px solid #F0EDE8;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    max-width: 360px; width: 100%; margin: 24px;
  }
  .rf-success-icon { font-size: 56px; margin-bottom: 16px; }
  .rf-success-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #1a1a1a; margin: 0 0 8px; }
  .rf-success-sub { font-size: 14px; color: #999; margin: 0 0 28px; line-height: 1.6; }
  .rf-success-btn {
    padding: 13px 28px;
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    border: none; border-radius: 12px; color: white;
    font-size: 14px; font-family: 'Syne', sans-serif;
    font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 16px rgba(240,93,94,0.3);
    transition: all 0.2s;
  }
  .rf-success-btn:hover { transform: translateY(-2px); }
`

export default function ReviewForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { submitReview } = useCafeStore()
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
    <>
      <style>{style}</style>
      <div className="rf-success">
        <div className="rf-success-card">
          <div className="rf-success-icon">🎉</div>
          <h2 className="rf-success-title">Review terkirim!</h2>
          <p className="rf-success-sub">Makasih udah bantu sesama remote worker & pelajar! ☕</p>
          <button className="rf-success-btn" onClick={() => navigate(`/cafe/${id}`)}>
            Lihat halaman cafe →
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{style}</style>
      <div className="rf-root">

        <div className="rf-topbar">
          <button className="rf-btn-back" onClick={() => navigate(-1)}>←</button>
          <h1 className="rf-title">Tulis Review</h1>
        </div>

        <div className="rf-wrap">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'contents' }}>

            <div className="rf-section">
              <p className="rf-section-title">Rating</p>
              {[
                { label: '📶 Kecepatan WiFi', val: wifi, set: setWifi },
                { label: '🔇 Tingkat kebisingan', val: noise, set: setNoise },
                { label: '☕ Kenyamanan tempat', val: vibe, set: setVibe },
              ].map(({ label, val, set }) => (
                <div className="rating-row" key={label}>
                  <span className="rating-row-label">{label}</span>
                  <StarRating value={val} onChange={set} size={24} />
                </div>
              ))}
            </div>

            <div className="rf-section">
              <p className="rf-section-title">Estimasi Kecepatan WiFi</p>
              <div className="speed-grid">
                {SPEEDS.map((s) => (
                  <button type="button" key={s}
                    className={`speed-btn ${speed === s ? 'active' : ''}`}
                    onClick={() => setSpeed(s)}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="rf-section">
              <p className="rf-section-title">Fasilitas Tersedia</p>
              <div className="tag-wrap">
                {FACILITIES.map((f) => (
                  <button type="button" key={f}
                    className={`tag-btn ${facilities.includes(f) ? 'active' : ''}`}
                    onClick={() => toggle(facilities, setFacilities, f)}
                  >{f}</button>
                ))}
              </div>
            </div>

            <div className="rf-section">
              <p className="rf-section-title">Cocok Untuk</p>
              <div className="tag-wrap">
                {SUITABLE.map((s) => (
                  <button type="button" key={s}
                    className={`tag-btn ${suitable.includes(s) ? 'active' : ''}`}
                    onClick={() => toggle(suitable, setSuitable, s)}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="rf-section">
              <p className="rf-section-title">Ulasan Singkat</p>
              <textarea
                className="rf-textarea"
                {...register('comment')}
                placeholder="Ceritain pengalamanmu di sini..."
              />
            </div>

            <div className="rf-section">
              <p className="rf-section-title">Foto Cafe (Opsional · maks 4)</p>
              <PhotoUploader
                folder="reviews"
                maxPhotos={4}
                onUploaded={(updater) => setPhotoUrls(updater)}
              />
            </div>

            {error && <div className="rf-error">⚠ {error}</div>}

            <button type="submit" className="rf-submit" disabled={submitting}>
              {submitting ? 'Mengirim...' : 'Kirim Review →'}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}
