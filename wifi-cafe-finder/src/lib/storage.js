import { supabase } from './supabase'

/**
 * Upload satu foto ke Supabase Storage
 * @param {File} file - File object dari input
 * @param {string} folder - subfolder: 'reviews' atau 'cafes'
 * @returns {string} public URL foto
 */
export async function uploadPhoto(file, folder = 'reviews') {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('cafe-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('cafe-photos')
    .getPublicUrl(fileName)

  return data.publicUrl
}

/**
 * Upload banyak foto sekaligus
 * @param {File[]} files - Array of File objects
 * @param {string} folder
 * @returns {string[]} array of public URLs
 */
export async function uploadPhotos(files, folder = 'reviews') {
  const uploads = Array.from(files).map((file) => uploadPhoto(file, folder))
  return Promise.all(uploads)
}

/**
 * Hapus foto dari Storage
 * @param {string} publicUrl - URL foto yang mau dihapus
 */
export async function deletePhoto(publicUrl) {
  // extract path from URL
  const path = publicUrl.split('/cafe-photos/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('cafe-photos')
    .remove([path])

  if (error) throw error
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
