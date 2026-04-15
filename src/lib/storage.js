const CLOUD_NAME = 'dloueziwc'
const UPLOAD_PRESET = 'wifi-cafe-uploads'

/**
 * Upload satu foto ke Cloudinary
 * @param {File} file - File object dari input
 * @param {string} folder - subfolder: 'reviews' atau 'cafes'
 * @returns {string} public URL foto
 */
export async function uploadPhoto(file, folder = 'reviews') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `wifi-cafe/${folder}`)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Upload foto gagal')

  const data = await res.json()
  return data.secure_url
}

/**
 * Compress foto sebelum upload (client-side, tanpa library tambahan)
 * @param {File} file
 * @param {number} maxWidth - default 1200px
 * @param {number} quality - 0-1, default 0.8
 * @returns {Blob}
 */
export function compressPhoto(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    img.src = url
  })
}
