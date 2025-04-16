<script setup lang="ts">
import type { Todo } from '@/types/todo'

const props = defineProps<{
  todos: Todo[]
}>()
</script>

<template>
  <ul class="todo-list">
    <template v-if="props.todos.length === 0">
      <span class="text-lg font-mono text-center">All task done 👍</span>
    </template>
    <template v-else>
      <slot />
    </template>
  </ul>
</template>
