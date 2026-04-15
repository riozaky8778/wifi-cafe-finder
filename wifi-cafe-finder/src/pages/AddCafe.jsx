import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCafeStore } from '../store/cafeStore'
import { useState } from 'react'
import PhotoUploader from '../components/PhotoUploader'

export default function AddCafe() {
  const navigate = useNavigate()
  const { addCafe, user } = useCafeStore()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null)

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '0.5px solid #e5e5e5',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none',
    marginBottom: 4,
  }

  const onSubmit = async (data) => {
    if (!user) { setError('Kamu harus login dulu!'); return }
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
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '1rem 1rem 2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 500 }}>Tambah cafe baru</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Nama cafe *</div>
          <input
            {...register('name', { required: true })}
            placeholder="Contoh: Kopi Kenangan Sudirman"
            style={{ ...inputStyle, borderColor: errors.name ? '#E24B4A' : '#e5e5e5' }}
          />
          {errors.name && <p style={{ color: '#E24B4A', fontSize: 12 }}>Nama cafe wajib diisi</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Alamat lengkap *</div>
          <input
            {...register('address', { required: true })}
            placeholder="Jl. Sudirman No. 12, Jakarta"
            style={{ ...inputStyle, borderColor: errors.address ? '#E24B4A' : '#e5e5e5' }}
          />
          {errors.address && <p style={{ color: '#E24B4A', fontSize: 12 }}>Alamat wajib diisi</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Latitude (opsional)</div>
            <input {...register('lat')} placeholder="-6.2088" style={inputStyle} type="number" step="any" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Longitude (opsional)</div>
            <input {...register('lng')} placeholder="106.8456" style={inputStyle} type="number" step="any" />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Foto cover cafe (opsional)</div>
          <PhotoUploader
            folder="cafes"
            maxPhotos={1}
            onUploaded={(updater) => {
              const urls = updater([])
              setCoverPhotoUrl(urls[0] ?? null)
            }}
          />
        </div>

        {error && <p style={{ color: '#E24B4A', fontSize: 13, marginBottom: 10 }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%', padding: 11,
            background: submitting ? '#aaa' : '#1D9E75',
            border: 'none', borderRadius: 8, color: 'white',
            fontSize: 15, fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Menyimpan...' : 'Simpan & tulis review →'}
        </button>
      </form>
    </div>
  )
}
