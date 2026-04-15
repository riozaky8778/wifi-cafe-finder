import { useState, useRef } from 'react'
import { uploadPhoto, compressPhoto } from '../lib/storage'

export default function PhotoUploader({ onUploaded, maxPhotos = 4, folder = 'reviews' }) {
  const [previews, setPreviews] = useState([]) // { url, status: 'uploading'|'done'|'error', publicUrl? }
  const inputRef = useRef()

  const handleFiles = async (files) => {
    const remaining = maxPhotos - previews.length
    const toProcess = Array.from(files).slice(0, remaining)
    if (!toProcess.length) return

    // Buat previews lokal dulu biar responsif
    const newPreviews = toProcess.map((file) => ({
      localUrl: URL.createObjectURL(file),
      status: 'uploading',
      file,
    }))
    setPreviews((prev) => [...prev, ...newPreviews])

    // Upload satu per satu
    for (let i = 0; i < toProcess.length; i++) {
      const file = toProcess[i]
      try {
        const compressed = await compressPhoto(file)
        const compressedFile = new File([compressed], file.name, { type: 'image/jpeg' })
        const publicUrl = await uploadPhoto(compressedFile, folder)

        setPreviews((prev) =>
          prev.map((p) =>
            p.file === file ? { ...p, status: 'done', publicUrl } : p
          )
        )
        onUploaded?.((urls) => [...(urls || []), publicUrl])
      } catch {
        setPreviews((prev) =>
          prev.map((p) => (p.file === file ? { ...p, status: 'error' } : p))
        )
      }
    }
  }

  const removePhoto = (index) => {
    setPreviews((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].localUrl)
      updated.splice(index, 1)
      return updated
    })
  }

  const [dragging, setDragging] = useState(false)

  return (
    <div>
      {/* Upload zone */}
      {previews.length < maxPhotos && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          style={{
            border: `1.5px dashed ${dragging ? '#1D9E75' : '#ccc'}`,
            borderRadius: 10,
            padding: '20px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? '#E1F5EE' : 'transparent',
            transition: 'all 0.15s',
            marginBottom: previews.length ? 12 : 0,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            Tap atau drag foto ke sini
          </p>
          <p style={{ fontSize: 11, color: '#bbb', marginTop: 3 }}>
            Maks {maxPhotos} foto · JPG, PNG · otomatis dikompress
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Photo previews */}
      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {previews.map((p, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1' }}>
              <img
                src={p.localUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Uploading overlay */}
              {p.status === 'uploading' && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 24, height: 24, border: '2px solid white',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                </div>
              )}

              {/* Error overlay */}
              {p.status === 'error' && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(226,75,74,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'white', fontWeight: 500,
                }}>
                  Gagal upload
                </div>
              )}

              {/* Done checkmark */}
              {p.status === 'done' && (
                <div style={{
                  position: 'absolute', top: 5, left: 5,
                  background: '#1D9E75', borderRadius: '50%',
                  width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'white',
                }}>✓</div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: 'rgba(0,0,0,0.5)', border: 'none',
                  borderRadius: '50%', width: 20, height: 20,
                  color: 'white', fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}
              >×</button>
            </div>
          ))}

          {/* Add more slot */}
          {previews.length < maxPhotos && (
            <div
              onClick={() => inputRef.current?.click()}
              style={{
                border: '1.5px dashed #ddd', borderRadius: 8, aspectRatio: '1',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#aaa', fontSize: 22,
              }}
            >
              +
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
