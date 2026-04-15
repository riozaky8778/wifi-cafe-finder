import { create } from 'zustand'
import {
  collection, doc, addDoc, getDoc, getDocs,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

function calcAvg(reviews, key) {
  const vals = reviews.map((r) => r[key]).filter(Boolean)
  if (!vals.length) return null
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

export const useCafeStore = create((set, get) => ({
  cafes: [],
  selectedCafe: null,
  loading: false,
  error: null,
  user: null,

  setUser: (user) => set({ user }),

  fetchCafes: async () => {
    set({ loading: true, error: null })
    try {
      const cafesSnap = await getDocs(query(collection(db, 'cafes'), orderBy('created_at', 'desc')))
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

  addCafe: async (cafeData) => {
    const docRef = await addDoc(collection(db, 'cafes'), {
      ...cafeData,
      created_at: serverTimestamp(),
    })
    await get().fetchCafes()
    return { id: docRef.id, ...cafeData }
  },
}))
