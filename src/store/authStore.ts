import { defineStore } from 'pinia'
import { AuthProvider } from './store'
import { store as pbAuthStore, usePocketbaseClient } from '@/composables/usePocketbaseClient'

const { login: pbLogin } = usePocketbaseClient('users')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    authProvider: AuthProvider.UNKNOWN,
  }),
  actions: {
    async authenticate(method: AuthProvider, username?: string, password?: string) {
      if (method === AuthProvider.Auth0) {
        this.isAuthenticated = true
        this.authProvider = AuthProvider.Auth0

        return
      }

      const isValid = await pbLogin(username!, password!)
      this.isAuthenticated = isValid
      this.authProvider = AuthProvider.Pocketbase
    },
    async logout() {
      pbAuthStore.clear()
      this.isAuthenticated = false
      this.authProvider = AuthProvider.UNKNOWN
    },
  },
  getters: {},
})
