import './assets/main.css'

import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import router from './routes'
import App from './App.vue'
import { useAuthStore } from './store/authStore'
import { store as pbAuthStore } from '@/composables/usePocketbaseClient'
import { AuthProvider } from './store/store'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Inisialisasi authStore
const authStore = useAuthStore()

// Periksa localStorage untuk token
const storedAuth = localStorage.getItem('auth')
if (storedAuth) {
  try {
    const authData = JSON.parse(storedAuth)
    pbAuthStore.save(authData.token, authData.record)
    authStore.isAuthenticated = true
    authStore.authProvider =
      authData.record.collectionName === 'github' ? AuthProvider.Auth0 : AuthProvider.Pocketbase
    router.push({ name: 'todos' })
  } catch (error) {
    console.error('Error parsing stored auth:', error)
    localStorage.removeItem('auth')
  }
}

const auth0client = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
})
app.use(auth0client)

app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
