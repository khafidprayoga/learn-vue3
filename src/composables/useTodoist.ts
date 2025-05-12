import { computed, ref, reactive } from 'vue'
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import { store } from '@/composables/usePocketbaseClient'
import { store as globalStore, AuthProvider } from '@/store/store'
import type { Todo } from '../types/todo'

const API_URL = 'https://api.todoist.com/rest/v2/tasks'

export const useTodoist = () => {
  const todos = reactive<Todo[]>([])
  const count = reactive({
    all: 0,
    done: 0,
    active: 0,
  })

  const queryClient = useQueryClient()

  const apiKey = store.record?.todoist.apiKey
  const projectId = store.record?.todoist.projectId
  const endpoint = new URL(API_URL)

  endpoint.searchParams.set('project_id', projectId)

  const addTask = async () => {}

  const updateTask = async () => {}

  const deleteTask = async () => {}

  const getTasks = async (tabId: string) => {
    let url = endpoint.toString()

    if (tabId === 'completed') {
      const reqUrl = new URL('https://api.todoist.com/sync/v9/completed/get_all')
      reqUrl.searchParams.set('project_id', projectId)
      url = reqUrl.toString()
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    return response.json()
  }

  return {
    todos,
    count,

    getTasks,
  }
}
