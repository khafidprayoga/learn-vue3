<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePocketbaseClient, store } from '@/composables/usePocketbaseClient'

import Auth from '@/components/Auth/AuthIndex.vue'
import Todo from '@/components/Todo/TodoIndex.vue'
const { resetData } = usePocketbaseClient('todos')
const isAuthenticated = ref(false)

onMounted(() => {
  console.log(store.isValid)
  isAuthenticated.value = store.isValid
})

const logout = () => {
  store.clear()
  isAuthenticated.value = false
}
</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5 cursor-pointer">
    <span v-if="isAuthenticated" @dblclick="logout">
      Hello, {{ store.record?.name }}!
    </span>
    <span v-else @dblclick="resetData">
      Todo List App
    </span>
  </h1>

  <div class="container">
    <Auth v-if="!isAuthenticated" />
    <Todo v-else />
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.container {
  @apply mx-auto mt-15;
}
</style>
