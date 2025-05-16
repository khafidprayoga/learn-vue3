import './assets/main.css'

import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './routes'
import App from './App.vue'

const app = createApp(App)

const auth0client = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
})

app.use(auth0client)
app.use(VueQueryPlugin, {
  // queryClient: tanstackQueryClient,
})

app.use(router)
app.mount('#app')
