import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useCafeStore = create((set, get) => ({
  cafes: [],
  selectedCafe: null,
  loading: false,
  error: null,
  user: null,

  setUser: (user) => set({ user }),

  fetchCafes: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('cafes_with_ratings')
      .select('*')
      .order('avg_wifi', { ascending: false })

    if (error) set({ error: error.message })
    else set({ cafes: data })
    set({ loading: false })
  },

  selectCafe: async (id) => {
    set({ loading: true })
    const { data: cafe } = await supabase
      .from('cafes_with_ratings')
      .select('*')
      .eq('id', id)
      .single()

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('cafe_id', id)
      .order('created_at', { ascending: false })

    set({ selectedCafe: { ...cafe, reviews }, loading: false })
  },

  submitReview: async (cafeId, reviewData) => {
    const user = get().user
    if (!user) throw new Error('Harus login dulu!')

    const { error } = await supabase.from('reviews').insert({
      cafe_id: cafeId,
      user_id: user.id,
      ...reviewData,
    })
    if (error) throw error

    // refresh selected cafe data
    await get().selectCafe(cafeId)
  },

  addCafe: async (cafeData) => {
    const user = get().user
    if (!user) throw new Error('Harus login dulu!')

    const { data, error } = await supabase
      .from('cafes')
      .insert({ ...cafeData, created_by: user.id })
      .select()
      .single()

    if (error) throw error
    await get().fetchCafes()
    return data
  },
}))
