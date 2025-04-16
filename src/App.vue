<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
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
    isDone: false,
  },
  {
    id: 4,
    title: 'Merge main branch dan deploy ke staging',
    isDone: false,
  },

])

const handleEdit = (id: number, newTitle: string) => {
  const todoIndex = todos.findIndex((todo) => todo.id === id)
  if (todoIndex !== -1) {
    todos[todoIndex].title = newTitle
  }
}

const handleDone = (id: number) => {
  const todoIndex = todos.findIndex((todo) => todo.id === id)
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1)
    completedTodosCount.value++
  }
}

const completedTodosCount = ref(
  Number(sessionStorage.getItem('completedTodosCount')) || 0
)

watch(completedTodosCount, (newCount) => {
  sessionStorage.setItem('completedTodosCount', newCount.toString())
})
</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5">Todo List APP</h1>
  <div class="container">
    <TodoList :todos="todos">
      <TodoItem v-for="todo in todos" :key="todo.id" v-bind="todo" @done="handleDone" @edit="handleEdit" />
    </TodoList>
    <div>
      <span>Completed: {{ completedTodosCount }}</span>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.container {
  @apply bg-zinc-300 p-5 rounded-lg;
}
</style>
