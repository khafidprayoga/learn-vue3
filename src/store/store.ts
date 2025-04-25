import { reactive } from 'vue'

export enum AuthProvider {
  Auth0 = 'auth0',
  Pocketbase = 'pocketbase',
}

export const store = reactive({
  isAuthenticated: false,
  authProvider: '',
})
