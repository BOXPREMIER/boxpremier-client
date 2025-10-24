import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser:  (user)  => set({ user }),
      logout:   () => set({ token: null, user: null }),
    }),
    {
      name: 'auth', // clave en storage
      partialize: (s) => ({ token: s.token, user: s.user }), // solo guarda esto
      storage: createJSONStorage(() => localStorage),         // puedes usar sessionStorage
      
    }
  )
)

export default useAuthStore;
