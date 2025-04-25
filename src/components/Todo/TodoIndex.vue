<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { pb, store, UpdateType, usePocketbaseClient } from '@/composables/usePocketbaseClient'

import { Button } from '@/components/ui/button'
import TodoItem from './TodoItem.vue'
import TodoList from './TodoList.vue'
import AddTodo from './AddTodo.vue'
import TodoCount from './TodoCount.vue'
import { object } from 'zod'

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
  // setTimeout(async () => {
  isLoading.value = true
  try {
    const activeTab = tabs.find(tab => tab.id === currentTab.value)
    await getCount({
      filter: activeTab?.filter,
    })

    if (activeTab?.filter) {
      await fetchAll({
        filter: activeTab.filter,
      })
    } else {
      await fetchAll({
        filter: null,
      })
    }

  } finally {
    isLoading.value = false
  }
  // }, 500)
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
  update(id.toString(), { is_done: true }, UpdateType.Done).then(() => {
    count.active--
    count.done++
  })

}

const tabs = [
  {
    id: 'all',
    label: 'All Task',
    filter: undefined,
  },
  {
    id: 'active',
    label: 'Active Task',
    filter: pb.filter('is_done = false'),
  },
  {
    id: 'completed',
    label: 'Completed Task',
    filter: pb.filter('is_done = true'),
  },
]

const currentTab = ref('all')
const changeTab = (tabId: string) => {
  currentTab.value = tabId
}

</script>

<template>
  <!-- <AddTodo @add-todo="handleNewTodo" /> -->
  <!--
  todo load default all completed todos and count
  todo add current tab
  todo adjust count based on current tab condition
  -->

  <div class="tabs-wrapper">
    <ol class="tabs">
      <Button v-for="tab in tabs" :key="tab.label" :class="{ active: currentTab === tab.id }"
        @click="changeTab(tab.id)">
        {{ tab.label }}</Button>
    </ol>
  </div>
  <div class="tab-content">
    <TodoList :todos="todos" :is-loading="isLoading" :active-count="count.active" :error="error">
      <TodoItem
      v-for="todo in todos" :key="todo.id" v-bind="todo"
      @done="handleDone"
      @edit="handleEdit"
      :show-action="currentTab === 'active'"
      :strike-through="currentTab === 'all' && todo.is_done"
      />
    </TodoList>
    <TodoCount :count="count.all" :completedCount="count.done" :activeCount="count.active" />
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.tabs {
  @apply flex flex-row gap-3 font-semibold;
}

.tabs button {
  @apply rounded-none;
}

.tabs button:hover {
  @apply cursor-pointer;
}

.tabs> :not(.active) {
  @apply bg-zinc-300 px-5 py-1 text-black;
}

.tab-content {
  @apply mt-3;
}
</style>
