<script setup lang="ts">
import type { Todo } from '@/types/todo'

const props = defineProps<{
  todos: Todo[]
  isLoading: boolean
  activeCount: number
  error: string | null
}>()
</script>

<template>
  <ul class="todo-list font-mono">
    <template v-if="props.isLoading && props.todos.length === 0">
      <span class="text-lg font-mono text-center">Loading...</span>
    </template>
    <template v-else-if="props.error">
      <span class="text-lg font-mono text-center text-red-500">Error: {{ props.error }}</span>
    </template>
    <template v-else-if="activeCount === 0">
      <span class="text-lg font-mono text-center">All task done 👍</span>
    </template>
    <template v-else>
      <slot />
    </template>
  </ul>
</template>

<style scoped>
@reference 'tailwindcss';

.todo-list {
  @apply flex flex-col gap-1 py-3 min-h-[300px];
}
</style>
