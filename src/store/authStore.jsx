// store/authStore.js
import { create } from 'zustand'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: () => Boolean(get().token),
      setToken: (token) => set({ token }),
      setUser:  (user)  => set({ user }),
      logout:   () => set({ token: null, user: null })
    }),
    { name: 'auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
)

export default useAuthStore
