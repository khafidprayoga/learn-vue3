<script setup lang="ts">
import { reactive, watch, onMounted, computed } from 'vue'
import TodoItem from './components/TodoItem.vue'
import TodoList from './components/TodoList.vue'
import { type Todo } from './types/todo'
import AddTodo from './components/AddTodo.vue'
import TodoCount from './components/TodoCount.vue'


const todos = reactive<Todo[]>([])
const completedTodosCount = computed(() => {
  return todos.filter((todo) => todo.isDone).length
})

const activeTodosCount = computed(() => {
  return todos.length - completedTodosCount.value
})

onMounted(() => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    const parsed = JSON.parse(savedTodos)
    todos.push(...parsed)
  }
})

watch(completedTodosCount, (newCount) => {
  localStorage.setItem('completedTodosCount', newCount.toString())
})

watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos))
})

const handleNewTodo = (title: string) => {
  const id = Number(localStorage.getItem('lastId')) || 0
  const newTodo: Todo = {
    id: id + 1,
    title: title,
    isDone: false
  }

  todos.push(newTodo)

  localStorage.setItem('lastId', (id + 1).toString())
}

const handleEdit = (id: number, newTitle: string) => {
  const todoIndex = todos.findIndex((todo) => todo.id === id)
  if (todoIndex !== -1) {
    todos[todoIndex].title = newTitle
  }
}

const handleDone = (id: number) => {
  const todoIndex = todos.findIndex((todo) => todo.id === id)
  if (todoIndex !== -1) {
    todos[todoIndex].isDone = true
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5">Todo List APP</h1>
  <div class="container">
    <AddTodo @add-todo="handleNewTodo" />
    <TodoList :todos="todos">
      <TodoItem v-for="todo in todos" :key="todo.id" v-bind="todo" @done="handleDone" @edit="handleEdit" />
    </TodoList>
    <TodoCount :count="todos.length" :completedCount="completedTodosCount" :activeCount="activeTodosCount" />
  </div>
</template>

<style scoped></style>
