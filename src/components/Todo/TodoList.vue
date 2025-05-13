<script setup lang="ts">
import type { Todo } from '@/types/todo'

const props = defineProps<{
  todos: Todo[]
  isLoading: boolean
  count: number
  error: Error | null
  activeTab: string
  isFirstLogin: boolean
}>()
</script>

<template>
  <ul class="todo-list font-mono">
    <template v-if="props.isLoading && props.todos.length === 0">
      <span class="text-lg font-mono text-center">Loading...</span>
    </template>
    <template v-else-if="props.error">
      <span class="text-lg font-mono text-center text-red-500">Error: {{ props.error.message }}</span>
    </template>
    <template v-else-if="props.todos.length > 0">
      <slot />
    </template>
    <template v-else-if="props.isFirstLogin">
      <span class="text-lg font-mono text-center">Create your first task! with ALT+K on windows or CMD+K on mac</span>
    </template>
    <template v-else-if="props.count === 0 && props.activeTab !== 'completed'">
      <span class="text-lg font-mono text-center">All task done 👍</span>
    </template>
    <template v-else>
      <span class="text-lg font-mono text-center">Mark as done at least one activity task</span>
    </template>
  </ul>
</template>

<style scoped>
@reference 'tailwindcss';

.todo-list {
  @apply flex flex-col gap-1 py-3 min-h-[300px];
}
</style>
