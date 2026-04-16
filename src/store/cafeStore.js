import { create } from 'zustand'
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, orderBy, where, serverTimestamp, deleteDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const ADMIN_EMAIL = 'rio.zaky111@gmail.com'

function calcAvg(reviews, key) {
  const vals = reviews.map((r) => r[key]).filter(Boolean)
  if (!vals.length) return null
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

export const useCafeStore = create((set, get) => ({
  cafes: [],
  pendingCafes: [],
  selectedCafe: null,
  loading: false,
  error: null,
  user: null,

  setUser: (user) => set({ user }),

  isAdmin: () => get().user?.email === ADMIN_EMAIL,

  // Fetch hanya cafe yang sudah published (untuk halaman utama)
  fetchCafes: async () => {
    set({ loading: true, error: null })
    try {
      const cafesSnap = await getDocs(
        query(
          collection(db, 'cafes'),
          where('status', '==', 'published'),
          orderBy('created_at', 'desc')
        )
      )
      const reviewsSnap = await getDocs(collection(db, 'reviews'))
      const allReviews = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      const cafes = cafesSnap.docs.map((d) => {
        const cafe = { id: d.id, ...d.data() }
        const reviews = allReviews.filter((r) => r.cafe_id === cafe.id)
        return {
          ...cafe,
          avg_wifi: calcAvg(reviews, 'wifi_score'),
          avg_vibe: calcAvg(reviews, 'vibe_score'),
          avg_noise: calcAvg(reviews, 'noise_score'),
          review_count: reviews.length,
        }
      })
      set({ cafes, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  // Fetch semua cafe pending (untuk admin)
  fetchPendingCafes: async () => {
    set({ loading: true })
    try {
      const snap = await getDocs(
        query(
          collection(db, 'cafes'),
          where('status', '==', 'pending'),
          orderBy('created_at', 'desc')
        )
      )
      const pendingCafes = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      set({ pendingCafes, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  // Approve cafe
  approveCafe: async (cafeId) => {
    await updateDoc(doc(db, 'cafes', cafeId), { status: 'published' })
    await get().fetchPendingCafes()
  },

  // Reject & hapus cafe
  rejectCafe: async (cafeId) => {
    await deleteDoc(doc(db, 'cafes', cafeId))
    await get().fetchPendingCafes()
  },

  // Hapus cafe (dari halaman admin, untuk cafe yang sudah published)
  deleteCafe: async (cafeId) => {
    await deleteDoc(doc(db, 'cafes', cafeId))
    await get().fetchCafes()
  },

  selectCafe: async (id) => {
    set({ loading: true })
    try {
      const cafeDoc = await getDoc(doc(db, 'cafes', id))
      if (!cafeDoc.exists()) throw new Error('Cafe tidak ditemukan')
      const cafe = { id: cafeDoc.id, ...cafeDoc.data() }
      const reviewsSnap = await getDocs(
        query(collection(db, 'reviews'), where('cafe_id', '==', id))
      )
      const reviews = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      set({
        selectedCafe: {
          ...cafe,
          reviews,
          avg_wifi: calcAvg(reviews, 'wifi_score'),
          avg_vibe: calcAvg(reviews, 'vibe_score'),
          avg_noise: calcAvg(reviews, 'noise_score'),
          review_count: reviews.length,
        },
        loading: false,
      })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  submitReview: async (cafeId, reviewData) => {
    const user = get().user
    await addDoc(collection(db, 'reviews'), {
      cafe_id: cafeId,
      user_id: user?.uid ?? null,
      user_name: user?.displayName ?? null,
      user_photo: user?.photoURL ?? null,
      ...reviewData,
      created_at: serverTimestamp(),
    })
    await get().selectCafe(cafeId)
  },

  // Tambah cafe baru → status pending + kirim notif email ke admin
  addCafe: async (cafeData) => {
    const user = get().user
    const docRef = await addDoc(collection(db, 'cafes'), {
      ...cafeData,
      status: 'pending',
      submitted_by: user?.email ?? 'anonymous',
      submitted_by_name: user?.displayName ?? 'Pengunjung',
      created_at: serverTimestamp(),
    })

    // Kirim notifikasi email ke admin via EmailJS
    try {
      await sendAdminNotification({
        cafe_name: cafeData.name,
        cafe_address: cafeData.address ?? '-',
        submitted_by: user?.displayName ?? 'Pengunjung',
        submitted_email: user?.email ?? 'anonymous',
        cafe_id: docRef.id,
      })
    } catch (err) {
      console.warn('Gagal kirim notif email:', err)
    }

    return { id: docRef.id, ...cafeData }
  },
}))

// ── EmailJS notification ──────────────────────────────────────────────────────
async function sendAdminNotification(params) {
  // Ganti nilai berikut dengan milikmu dari emailjs.com
  const SERVICE_ID  = 'service_1nr6g2h'
  const TEMPLATE_ID = 'template_sjdyel9'
  const PUBLIC_KEY  = 'EFXHU7Gev8eS-In4P'

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      to_email: ADMIN_EMAIL,
      cafe_name: params.cafe_name,
      cafe_address: params.cafe_address,
      submitted_by: params.submitted_by,
      submitted_email: params.submitted_email,
      admin_url: `https://wifi-cafe-finder.vercel.app/admin`,
    },
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('EmailJS error: ' + res.status)
}
