<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import router from '@/routes'
import { useAuthStore } from '@/store/authStore'
import { store as pbAuthStore } from '@/composables/usePocketbaseClient'
import { AuthProvider } from '@/store/store'
import { useAuth0 } from '@auth0/auth0-vue'

const authStore = useAuthStore()
const { logout: auth0Logout } = useAuth0()
const logout = async () => {
  if (authStore.authProvider === AuthProvider.Auth0) {
    await auth0Logout({
      openUrl: false,
    })
  }

  authStore.logout()
  router.push({ name: 'auth' })
}
</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5 cursor-pointer">
    <span v-if="authStore.isAuthenticated" @dblclick="logout">
      Hello, {{ pbAuthStore.record?.name }}!
    </span>
    <span v-else> Todo List App </span>
  </h1>

  <div class="container">
    <router-view></router-view>
  </div>
  <VueQueryDevtools />
</template>

<style scoped>
@reference 'tailwindcss';

.container {
  @apply mx-auto mt-15 px-5 bg-zinc-100 border-t-5 border-zinc-200 rounded-lg;
}
</style>
