import { useState, useRef } from 'react'
import { uploadPhoto, compressPhoto } from '../lib/storage'

const style = `
  .uploader-zone {
    border: 2px dashed #E8E2DA;
    border-radius: 14px;
    padding: 24px 16px;
    text-align: center;
    cursor: pointer;
    background: #FAFAF8;
    transition: all 0.2s;
    margin-bottom: 12px;
  }
  .uploader-zone:hover, .uploader-zone.dragging {
    border-color: #FF8C61;
    background: #FFF5EF;
  }
  .uploader-zone-icon { font-size: 32px; margin-bottom: 8px; }
  .uploader-zone-text { font-size: 13px; color: #888; margin: 0; }
  .uploader-zone-hint { font-size: 11px; color: #C0B8AE; margin: 4px 0 0; }

  .uploader-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .uploader-thumb {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 1;
    background: #F0EDE8;
  }
  .uploader-thumb img {
    width: 100%; height: 100%; object-fit: cover;
    display: block;
  }

  .uploader-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .uploader-overlay.loading { background: rgba(0,0,0,0.42); }
  .uploader-overlay.error { background: rgba(226,75,74,0.7); }

  .uploader-spinner {
    width: 26px; height: 26px;
    border: 2.5px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: uploaderSpin 0.7s linear infinite;
  }
  @keyframes uploaderSpin { to { transform: rotate(360deg); } }

  .uploader-error-text {
    font-size: 11px; color: white; font-weight: 600; text-align: center;
    padding: 0 6px; line-height: 1.4;
  }

  .uploader-done-badge {
    position: absolute; top: 6px; left: 6px;
    background: #1D9E75; border-radius: 50%;
    width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: white;
    box-shadow: 0 2px 6px rgba(29,158,117,0.4);
  }

  .uploader-remove {
    position: absolute; top: 5px; right: 5px;
    background: rgba(0,0,0,0.5); border: none;
    border-radius: 50%; width: 22px; height: 22px;
    color: white; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; line-height: 1;
  }
  .uploader-remove:hover { background: rgba(226,75,74,0.85); }

  .uploader-add-slot {
    border: 2px dashed #E0DAD2;
    border-radius: 12px; aspect-ratio: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    cursor: pointer; color: #C0B8AE;
    font-size: 24px; transition: all 0.15s;
  }
  .uploader-add-slot:hover { border-color: #FF8C61; color: #FF8C61; background: #FFF5EF; }
  .uploader-add-slot span { font-size: 11px; margin-top: 4px; }
`

export default function PhotoUploader({ onUploaded, maxPhotos = 4, folder = 'reviews' }) {
  const [previews, setPreviews] = useState([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFiles = async (files) => {
    const remaining = maxPhotos - previews.length
    const toProcess = Array.from(files).slice(0, remaining)
    if (!toProcess.length) return

    const newPreviews = toProcess.map((file) => ({
      localUrl: URL.createObjectURL(file),
      status: 'uploading',
      file,
    }))
    setPreviews((prev) => [...prev, ...newPreviews])

    for (const file of toProcess) {
      try {
        const compressed = await compressPhoto(file)
        const compressedFile = new File([compressed], file.name, { type: 'image/jpeg' })
        const publicUrl = await uploadPhoto(compressedFile, folder)

        setPreviews((prev) =>
          prev.map((p) => p.file === file ? { ...p, status: 'done', publicUrl } : p)
        )
        onUploaded?.((urls) => [...(urls || []), publicUrl])
      } catch {
        setPreviews((prev) =>
          prev.map((p) => p.file === file ? { ...p, status: 'error' } : p)
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

  return (
    <div>
      <style>{style}</style>

      {/* Drop zone — tampil kalau belum ada foto sama sekali */}
      {previews.length === 0 && (
        <div
          className={`uploader-zone ${dragging ? 'dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        >
          <div className="uploader-zone-icon">📷</div>
          <p className="uploader-zone-text">Tap atau drag foto ke sini</p>
          <p className="uploader-zone-hint">Maks {maxPhotos} foto · JPG, PNG · otomatis dikompress</p>
        </div>
      )}

      {/* Grid preview */}
      {previews.length > 0 && (
        <div className="uploader-grid">
          {previews.map((p, i) => (
            <div key={i} className="uploader-thumb">
              <img src={p.localUrl} alt="" />

              {p.status === 'uploading' && (
                <div className="uploader-overlay loading">
                  <div className="uploader-spinner" />
                </div>
              )}

              {p.status === 'error' && (
                <div className="uploader-overlay error">
                  <span className="uploader-error-text">Gagal<br/>upload</span>
                </div>
              )}

              {p.status === 'done' && (
                <div className="uploader-done-badge">✓</div>
              )}

              <button
                type="button"
                className="uploader-remove"
                onClick={() => removePhoto(i)}
              >×</button>
            </div>
          ))}

          {/* Slot tambah foto lagi */}
          {previews.length < maxPhotos && (
            <div
              className="uploader-add-slot"
              onClick={() => inputRef.current?.click()}
            >
              +
              <span>Tambah</span>
            </div>
          )}
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
    </div>
  )
}
