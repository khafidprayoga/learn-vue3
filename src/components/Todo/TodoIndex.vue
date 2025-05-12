<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { pb, store, UpdateType, usePocketbaseClient } from '@/composables/usePocketbaseClient'
import { store as globalStore, AuthProvider } from '@/store/store'

import { Button } from '@/components/ui/button'
import TodoItem from './TodoItem.vue'
import TodoList from './TodoList.vue'
import AddTodo from './AddTodo.vue'
import type { Todo } from '@/types/todo'

import { useTodoist } from '@/composables/useTodoist'

const {
  update,
  create,
  resetData,
} = usePocketbaseClient('todos')

const {
  count,
  todos,
  getTasks,
} = useTodoist()


interface Tab {
  id: string
  label: string
}

const currentTab = ref('active')

const { isLoading, error, data, refetch } = useQuery({
  queryKey: ['tasks', currentTab],
  queryFn: ({ queryKey }) => getTasks(queryKey[1])
})

watch(data, (newData) => {
  let parsedData = []

  switch (currentTab.value) {
    case 'active':
      parsedData = newData.map((item: any) => ({
        id: item.id,
        title: item.content,
        is_done: item.is_completed,
        created_at: item.created_at,
        updated_at: item.created_at,
      }))
      break

    case 'completed':
      parsedData = newData?.items.map((item: any) => ({
        id: item.id,
        title: item.content,
        is_done: true,
        updated_at: item.completed_at,
      })) || []

      break
  }



  switch (currentTab.value) {
    case 'active':
      count.active = parsedData.length
      break
    case 'completed':
      count.done = parsedData.length
      break
  }

  todos.splice(0, todos.length, ...parsedData)
})




const handleKeyDown = (event: KeyboardEvent) => {
  if ((event.altKey && event.key === 'k') && currentTab.value === "active") {
    showAddTodo.value = !showAddTodo.value
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(async () => {
  window.removeEventListener('keydown', handleKeyDown)

})

const handleNewTodo = async (title: string) => {
  if (title === 'reset') {
    await resetData()
    return
  }

  const req: Todo = {
    title: title,
    is_done: false,
  }

  console.log(globalStore.authProvider)

  switch (globalStore.authProvider) {
    case AuthProvider.Auth0:
      req.social_id = store.record?.id
      break
    case AuthProvider.Pocketbase:
      req.user_id = store.record?.id
      break
  }

  await create(req)
}

const showAddTodo = ref(false)
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
    id: 'active',
    label: 'Active Task',
  },
  {
    id: 'completed',
    label: 'Completed Task',
  },
]

const changeTab = async (tabId: string) => {

  const tab = tabs.find(tab => tab.id === tabId)
  if (!tab) return

  currentTab.value = tabId

  refetch()

}


const getTabCount = (tab: Tab) => {
  switch (tab.id) {
    case 'active':
      return count.active
    case 'completed':
      return count.done
    default:
      return 0
  }
}

const getTodoCount = computed(() => {
  const tab = tabs.find(tab => tab.id === currentTab.value)
  if (!tab) return 0
  return getTabCount(tab)
})

const isFirstLogin = computed(() => {
  return count.all === 0
})

</script>

<template>
  <AddTodo @add-todo="handleNewTodo" v-if="showAddTodo" />

  <div class="tabs-wrapper">
    <ol class="tabs">
      <Button v-for="tab in tabs" :key="tab.label" :class="{ active: currentTab === tab.id }"
        @click="changeTab(tab.id)">
        {{ tab.label }}
        <span>({{ getTabCount(tab) }})</span>
      </Button>
    </ol>
  </div>
  <div class="tab-content">
    <TodoList :todos="todos" :is-loading="isLoading" :count="getTodoCount" :error="error" :active-tab="currentTab"
      :is-first-login="isFirstLogin">
      <TodoItem v-for="todo in todos" :key="todo.id" v-bind="todo" @done="handleDone" @edit="handleEdit"
        :show-action="currentTab === 'active'" :strike-through="currentTab === 'all' && todo.is_done" />
    </TodoList>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.tabs-wrapper {
  @apply mt-10;
}

.tabs {
  @apply flex flex-row font-semibold overflow-x-auto;
}

.tabs button {
  @apply rounded-none border-b-5 border-gray-500;
}

.tabs button:hover {
  @apply cursor-pointer;
}

.tabs> :not(.active) {
  @apply bg-zinc-300 px-5 py-1 text-black border-transparent;
}

.tab-content {
  @apply mt-3;
}
</style>
