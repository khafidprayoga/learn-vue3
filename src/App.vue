<script setup lang="ts">
import { onMounted } from 'vue'
import { store as globalStore } from '@/store/store'
import { store as authStore } from '@/composables/usePocketbaseClient'

import Auth from '@/components/Auth/AuthIndex.vue'
import Todo from '@/components/Todo/TodoIndex.vue'

onMounted(() => {
  globalStore.isAuthenticated = authStore.isValid
})

const logout = () => {
  authStore.clear()
  globalStore.isAuthenticated = false
}

</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5 cursor-pointer">
    <span v-if="globalStore.isAuthenticated" @dblclick="logout">
      Hello, {{ authStore.record?.name }}!
    </span>
    <span v-else>
      Todo List App
    </span>
  </h1>

  <div class="container">
    <Auth v-if="!globalStore.isAuthenticated" />
    <Todo v-else />
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.container {
  @apply mx-auto mt-15;
}
</style>
