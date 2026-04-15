import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCafeStore } from '../store/cafeStore'
import { useState } from 'react'
import PhotoUploader from '../components/PhotoUploader'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .add-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #FAF8F5;
  }

  /* Top bar */
  .add-topbar {
    display: flex; align-items: center; gap: 12px;
    padding: 20px 24px 0;
    max-width: 600px; margin: 0 auto;
  }

  .btn-back {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    background: white; border: 1px solid #EDE9E3;
    border-radius: 50%; cursor: pointer;
    font-size: 16px; color: #555;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .btn-back:hover { background: #F5F2ED; transform: translateX(-2px); }

  .add-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0;
  }

  /* Hero banner */
  .add-hero-banner {
    max-width: 600px; margin: 20px auto 0;
    padding: 0 24px;
  }
  .add-hero-inner {
    background: linear-gradient(135deg, #FDEBD0, #FDDCBE, #FCC9A8);
    border-radius: 20px;
    padding: 24px;
    position: relative; overflow: hidden;
  }
  .add-hero-inner::after {
    content: '☕';
    position: absolute; right: -8px; top: -8px;
    font-size: 90px; opacity: 0.15;
    transform: rotate(15deg);
  }
  .add-hero-eyebrow {
    font-size: 11px; font-weight: 700;
    color: #D4622A; letter-spacing: 1px;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .add-hero-text {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 800;
    color: #1a1a1a; line-height: 1.3; margin: 0;
  }
  .add-hero-sub {
    font-size: 13px; color: #8B6B50; margin: 6px 0 0;
  }

  /* Form */
  .add-form-wrap {
    max-width: 600px; margin: 24px auto;
    padding: 0 24px 40px;
  }

  .form-section {
    background: white;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 14px;
    border: 1px solid #F0EDE8;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }

  .form-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    color: #999; letter-spacing: 0.8px;
    text-transform: uppercase; margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #F5F2ED;
  }

  .field { margin-bottom: 16px; }
  .field:last-child { margin-bottom: 0; }

  .field-label {
    font-size: 12px; font-weight: 600;
    color: #555; margin-bottom: 7px;
    display: flex; align-items: center; gap: 4px;
  }
  .field-label .required { color: #F05D5E; }

  .field-input {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid #EDE9E3;
    border-radius: 12px; font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    background: #FAFAF8; color: #1a1a1a;
    outline: none; box-sizing: border-box;
    transition: all 0.2s;
  }
  .field-input::placeholder { color: #C5BFB6; }
  .field-input:focus {
    border-color: #FF8C61;
    background: white;
    box-shadow: 0 0 0 3px rgba(255,140,97,0.12);
  }
  .field-input.error { border-color: #F05D5E; background: #FFF8F8; }

  .field-error {
    font-size: 12px; color: #F05D5E;
    margin-top: 5px; display: flex; align-items: center; gap: 4px;
  }

  .coords-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .field-hint {
    font-size: 11px; color: #B8B0A6; margin-top: 4px;
  }

  /* Error banner */
  .error-banner {
    background: #FFF1F1; border: 1px solid #FDD;
    border-radius: 12px; padding: 12px 16px;
    font-size: 13px; color: #D44;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }

  /* Submit */
  .btn-submit {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, #FF8C61, #F05D5E);
    border: none; border-radius: 14px;
    color: white; font-size: 15px;
    font-family: 'Syne', sans-serif;
    font-weight: 700; cursor: pointer;
    box-shadow: 0 6px 24px rgba(240,93,94,0.3);
    transition: all 0.2s; letter-spacing: 0.3px;
  }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(240,93,94,0.42);
  }
  .btn-submit:active:not(:disabled) { transform: translateY(0); }
  .btn-submit:disabled {
    background: #D5CFCA; box-shadow: none; cursor: not-allowed;
  }

  .login-notice {
    text-align: center; font-size: 13px; color: #AAA;
    margin-top: 14px;
  }
  .login-notice strong { color: #FF8C61; cursor: pointer; }
  .login-notice strong:hover { text-decoration: underline; }
`

export default function AddCafe() {
  const navigate = useNavigate()
  const { addCafe, user } = useCafeStore()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null)

  const onSubmit = async (data) => {
    if (!user) { setError('Kamu harus login dulu untuk menambah cafe!'); return }
    setSubmitting(true)
    setError('')
    try {
      const cafe = await addCafe({ ...data, cover_photo_url: coverPhotoUrl })
      navigate(`/review/${cafe.id}`)
    } catch (e) {
      setError(e.message)
    }
    setSubmitting(false)
  }

  return (
    <>
      <style>{style}</style>
      <div className="add-root">

        {/* Top bar */}
        <div className="add-topbar">
          <button className="btn-back" onClick={() => navigate('/')}>←</button>
          <h1 className="add-title">Tambah Cafe Baru</h1>
        </div>

        {/* Hero banner */}
        <div className="add-hero-banner">
          <div className="add-hero-inner">
            <p className="add-hero-eyebrow">Bantu komunitas</p>
            <h2 className="add-hero-text">Tau cafe WiFi kenceng<br/>yang belum terdaftar?</h2>
            <p className="add-hero-sub">Tambahkan sekarang dan bantu sesama remote worker! 🙌</p>
          </div>
        </div>

        {/* Form */}
        <div className="add-form-wrap">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Info dasar */}
            <div className="form-section">
              <p className="form-section-title">Info Cafe</p>

              <div className="field">
                <label className="field-label">
                  Nama cafe <span className="required">*</span>
                </label>
                <input
                  className={`field-input ${errors.name ? 'error' : ''}`}
                  {...register('name', { required: true })}
                  placeholder="Contoh: Kopi Kenangan Sudirman"
                />
                {errors.name && <p className="field-error">⚠ Nama cafe wajib diisi</p>}
              </div>

              <div className="field">
                <label className="field-label">
                  Alamat lengkap <span className="required">*</span>
                </label>
                <input
                  className={`field-input ${errors.address ? 'error' : ''}`}
                  {...register('address', { required: true })}
                  placeholder="Jl. Sudirman No. 12, Jakarta Pusat"
                />
                {errors.address && <p className="field-error">⚠ Alamat wajib diisi</p>}
              </div>
            </div>

            {/* Koordinat */}
            <div className="form-section">
              <p className="form-section-title">Lokasi (opsional)</p>
              <div className="coords-row">
                <div className="field">
                  <label className="field-label">Latitude</label>
                  <input
                    className="field-input"
                    {...register('lat')}
                    placeholder="-6.2088"
                    type="number" step="any"
                  />
                </div>
                <div className="field">
                  <label className="field-label">Longitude</label>
                  <input
                    className="field-input"
                    {...register('lng')}
                    placeholder="106.8456"
                    type="number" step="any"
                  />
                </div>
              </div>
              <p className="field-hint">💡 Bisa diisi nanti dari Google Maps → bagikan lokasi → salin koordinat</p>
            </div>

            {/* Foto cover */}
            <div className="form-section">
              <p className="form-section-title">Foto Cover (opsional)</p>
              <PhotoUploader
                folder="cafes"
                maxPhotos={1}
                onUploaded={(updater) => {
                  const urls = updater([])
                  setCoverPhotoUrl(urls[0] ?? null)
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="error-banner">
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan & Tulis Review →'}
            </button>

            {!user && (
              <p className="login-notice">
                Belum login? <strong onClick={() => navigate('/login')}>Login dulu</strong> untuk menambah cafe
              </p>
            )}

          </form>
        </div>

      </div>
    </>
  )
}
