<script setup lang="ts">
import { reactive } from 'vue'
import TodoItem from './components/TodoItem.vue'
import TodoList from './components/TodoList.vue'
import { type Todo } from './types/todo'

const todos = reactive<Todo[]>([
  {
    id: 1,
    title: 'Belajar Vue3',
    isDone: false,
  },
  {
    id: 2,
    title: 'Belajar Laravel 12 dan PostgreSQL',
    isDone: false,
  },
  {
    id: 3,
    title: 'Belajar React Native',
    isDone: true,
  },
])
</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5">Todo List APP</h1>
  <div class="container">
    <TodoList :todos="todos">
      <TodoItem v-for="todo in todos" :key="todo.id" v-bind="todo" />
    </TodoList>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.container {
  @apply bg-zinc-300 p-5 rounded-lg;
}
</style>
