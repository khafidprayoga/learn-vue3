import { reactive } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { store } from '@/composables/usePocketbaseClient'
import { v4 as uuidv4 } from 'uuid'
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

  const addTask = async (task: Todo) => {
    await fetch(endpoint.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        content: task.title,
        project_id: projectId,
      }),
    })

    queryClient.invalidateQueries({ queryKey: ['tasks', 'active'] })
  }

  const updateTask = async (task: Todo) => {
    const url = new URL(`${endpoint}/${task.id}`)

    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        content: task.title,
      }),
    })

    queryClient.invalidateQueries({ queryKey: ['tasks', 'active'] })
  }

  const completeTask = async (task: Todo) => {
    const url = new URL(`${endpoint}/${task.id}/close`)

    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'X-Request-Id': uuidv4(),
      },
    })

    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  const deleteTask = async () => {}

  const getTasks = async (tabId: string) => {
    const baseUrl = new URL(endpoint)
    baseUrl.searchParams.set('project_id', projectId)
    let url = baseUrl.toString()

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
    addTask,
    updateTask,
    completeTask,
  }
}
