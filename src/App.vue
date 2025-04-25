<script setup lang="ts">
import { onMounted } from 'vue'
import { store as globalStore, AuthProvider } from '@/store/store'
import { store as authStore } from '@/composables/usePocketbaseClient'

import Auth from '@/components/Auth/AuthIndex.vue'
import Todo from '@/components/Todo/TodoIndex.vue'
import { useAuth0 } from '@auth0/auth0-vue'

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
    }).then(()=>{
      authStore.clear()
      globalStore.isAuthenticated = false
    })
    return
  }

  authStore.clear()
  globalStore.isAuthenticated = false

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
    <Auth v-if="!globalStore.isAuthenticated" />
    <Todo v-else />
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.container {
  @apply mx-auto mt-15 px-5;
}
</style>
