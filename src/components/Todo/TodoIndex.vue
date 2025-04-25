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
  count,
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
  }, 500)
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
  <!--
  todo load default all completed todos and count
  todo add current tab
  todo adjust count based on current tab condition
  -->

  <TodoList :todos="todos" :is-loading="isLoading" :active-count="count.active" :error="error">
    <TodoItem v-for="todo in todos" :key="todo.id" v-bind="todo" @done="handleDone" @edit="handleEdit" />
  </TodoList>
  <TodoCount :count="count.all" :completedCount="count.done" :activeCount="count.active" />
</template>
