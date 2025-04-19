<script setup lang="ts">
import { usePocketbaseClient } from '@/composables/usePocketbaseClient'

import Todo from '@/components/Todo/TodoIndex.vue'
const { resetData } = usePocketbaseClient('todos')

</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5 cursor-pointer" @dblclick="resetData">Todo List APP</h1>
  <div class="container">
    <Todo />
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.container {
  @apply mx-auto mt-15 lg:min-h-[700px];
}
</style>
