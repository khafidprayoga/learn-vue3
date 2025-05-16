<script setup lang="ts">
import { onMounted } from 'vue'
import { store as globalStore, AuthProvider } from '@/store/store'
import { store as authStore } from '@/composables/usePocketbaseClient'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useAuth0 } from '@auth0/auth0-vue'
import router from '@/routes'

onMounted(() => {
  globalStore.isAuthenticated = authStore.isValid
  const name = authStore.record?.collectionName
  if (name) {
    switch (name) {
      case 'github':
        globalStore.authProvider = AuthProvider.Auth0
        break
      default:
        globalStore.authProvider = AuthProvider.Pocketbase
    }
  }
})

const { logout: auth0Logout } = useAuth0()
const logout = () => {
  // remove auth0 token on db
  if (globalStore.authProvider === AuthProvider.Auth0) {
    auth0Logout({
      openUrl: false,
    }).then(() => {
      authStore.clear()
      globalStore.isAuthenticated = false
      router.push({ name: 'auth' })
    })
    return
  }

  authStore.clear()
  globalStore.isAuthenticated = false
  router.push({ name: 'auth' })
}
</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5 cursor-pointer">
    <span v-if="globalStore.isAuthenticated" @dblclick="logout">
      Hello, {{ authStore.record?.name }}!
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
