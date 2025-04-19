<script setup lang="ts">
import { ref } from 'vue'
import { usePocketbaseClient } from '@/composables/usePocketbaseClient'

import Auth from '@/components/Auth/AuthIndex.vue'
import Todo from '@/components/Todo/TodoIndex.vue'
const { resetData } = usePocketbaseClient('todos')

const isAuthenticated = ref(false)
</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5 cursor-pointer" @dblclick="resetData">Todo List APP</h1>
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
