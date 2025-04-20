<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { store, UpdateType, usePocketbaseClient } from '@/composables/usePocketbaseClient'

import TodoItem from './TodoItem.vue'
import TodoList from './TodoList.vue'
import AddTodo from './AddTodo.vue'
import TodoCount from './TodoCount.vue'

const {
  items: todos,
  error,
  totalItemsCount,
  totalItemsDone,
  totalItemsActive,
  fetchAll,
  getCount,
  update,
  create,
  resetData,
} = usePocketbaseClient('todos')
const isLoading = ref(true)

onMounted(async () => {
  setTimeout(async () => {
    isLoading.value = true
    try {
      await getCount()

      await fetchAll({
        filter: 'is_done = false',
      })
    } finally {
      isLoading.value = false
    }
  }, 2000)
})

const handleNewTodo = async (title: string) => {
  if (title === 'reset') {
    await resetData()
    return
  }

  await create({ title, is_done: false, user_id: store.record?.id })
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
  <AddTodo @add-todo="handleNewTodo" />
  <TodoList :todos="todos" :is-loading="isLoading" :active-count="totalItemsActive" :error="error">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      v-bind="todo"
      @done="handleDone"
      @edit="handleEdit"
    />
  </TodoList>
  <TodoCount
    :count="totalItemsCount"
    :completedCount="totalItemsDone"
    :activeCount="totalItemsActive"
  />
</template>
