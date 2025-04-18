<script setup lang="ts">
import { onMounted, watch, } from 'vue'
import { UpdateType, usePocketbaseClient } from './composables/usePocketbaseClient'

import TodoItem from './components/TodoItem.vue'
import TodoList from './components/TodoList.vue'
import AddTodo from './components/AddTodo.vue'
import TodoCount from './components/TodoCount.vue'

const {
  items: todos,
  isLoading,
  error,
  totalItemsCount,
  totalItemsDone,
  totalItemsActive,
  fetchAll, getCount, update, create, resetData } = usePocketbaseClient('todos')


watch(error, () => {
  // todo show error message
})

watch(isLoading, () => {
  // todo show loading spinner on list
})


// const todosApis = reactive({})
onMounted(async () => {
  getCount().then(async () => {
    await fetchAll({
      filter: 'is_done = false'
    })
  })
})


const handleNewTodo = async (title: string) => {
  await create({ title, is_done: false })
}

const handleEdit = async (id: string, newTitle: string) => {
  await update(id.toString(), { title: newTitle })
}

const handleDone = async (id: string) => {
  await update(id.toString(), { is_done: true }, UpdateType.Done).then(() => {
    getCount()
  })
}

</script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5 cursor-pointer" @dblclick="resetData">Todo List APP</h1>
  <div class="container">
    <AddTodo @add-todo="handleNewTodo" />
    <TodoList :todos="todos">
      <TodoItem v-for="todo in todos" :key="todo.id" v-bind="todo" @done="handleDone" @edit="handleEdit" />
    </TodoList>
    <TodoCount :count="totalItemsCount" :completedCount="totalItemsDone" :activeCount="totalItemsActive" />
  </div>
</template>

<style scoped></style>
