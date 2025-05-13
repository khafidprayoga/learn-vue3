<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { store } from '@/composables/usePocketbaseClient'
import { store as globalStore, AuthProvider } from '@/store/store'

import { Button } from '@/components/ui/button'
import TodoItem from './TodoItem.vue'
import TodoList from './TodoList.vue'
import AddTodo from './AddTodo.vue'
import type { Todo } from '@/types/todo'

import { useTodoist } from '@/composables/useTodoist'

const {
  count,
  todos,

  getTasks,
  addTask,
  updateTask,
  completeTask,
} = useTodoist()


interface Tab {
  id: string
  label: string
}

const currentTab = ref('active')
const isFirstLogin = ref(false)

const { isLoading, error, data, refetch } = useQuery({
  queryKey: ['tasks', currentTab],
  queryFn: ({ queryKey }) => getTasks(queryKey[1]),
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
})

watch(data, (newData) => {
  let parsedData = []

  switch (currentTab.value) {
    case 'active':
      parsedData = newData.map((item: any) =>  ({
        id: item.id,
        title: item.content,
        isDone: item.is_completed,
        createdAt: item.created_at,
        updatedAt: item.created_at,
      }))

      break

    case 'completed':
      parsedData = newData?.items.map((item: any) => ({
        id: item.id,
        title: item.content,
        isDone: true,
        updatedAt: item.completed_at,
      })) || []

      break
  }



  switch (currentTab.value) {
    case 'active':
      count.active = parsedData.length
      if (parsedData.length === 0) {
        isFirstLogin.value = true
      }
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
  const req: Todo = {
    title: title,
    isDone: false,
  }


  switch (globalStore.authProvider) {
    case AuthProvider.Auth0:
      req.socialId = store.record?.id
      break
    case AuthProvider.Pocketbase:
      req.userId = store.record?.id
      break
  }

  await addTask(req)
}

const showAddTodo = ref(false)
const taskActionId = ref('')

const { mutate: markAsDone } = useMutation({
  mutationFn: (id: string) => {
    const todo = todos.find((t: Todo) => t.id === id)
    if (!todo) throw new Error('Todo not found')

    return completeTask(todo)
  },
  onSuccess: (_, id) => {
    taskActionId.value = ''
    todos.splice(todos.findIndex(todo => todo.id === id), 1)
  }
})

const { mutate: updateTodo } = useMutation({
  mutationFn: (todo: Todo) => {
    const todoData = todos.find((t: Todo) => t.id === todo.id)
    if (!todoData) throw new Error('Todo not found')

    return updateTask({
      ...todoData,
      title: todo.title,
    })
  },
  onSuccess: () => {
    taskActionId.value = ''
  }
})

const handleEdit = async (id: string, newTitle: string) => {
  const todo: Todo = {
    id,
    title: newTitle,
    isDone: false,
  }

  taskActionId.value = id
  updateTodo(todo)
}

const handleDone = async (id: string) => {
  taskActionId.value = id
  markAsDone(id)
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
  showAddTodo.value = false
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
      <TodoItem v-for="todo in todos" :key="todo.id"
        :id="todo.id"
        :title="todo.title"
        :is-done="todo.isDone"
        :updated-at="todo.updatedAt || ''"
        :show-action="currentTab === 'active' && taskActionId !== todo.id"
        :is-processing="taskActionId === todo.id"
        :strike-through="currentTab === 'completed' && todo.isDone"
        @done="handleDone"
        @edit="handleEdit" />
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
  @apply bg-zinc-300 text-black border-transparent px-5 py-3;
}

.tab-content {
  @apply mt-3;
}
</style>
