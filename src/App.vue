<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import TodoItem from './components/TodoItem.vue'
import TodoList from './components/TodoList.vue'
import { type Todo } from './types/todo'
import AddTodo from './components/AddTodo.vue'

const todos = reactive<Todo[]>([])

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

const handleNewTodo = (title: string) => {
  const id = Number(sessionStorage.getItem('lastId')) || 0
  const newTodo: Todo = {
    id: id + 1,
    title: title,
    isDone: false
  }

  todos.push(newTodo)

  sessionStorage.setItem('lastId', (id + 1).toString())
}
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
    <AddTodo @add-todo="handleNewTodo" />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.container {
  @apply p-5 rounded-lg;
}
</style>
