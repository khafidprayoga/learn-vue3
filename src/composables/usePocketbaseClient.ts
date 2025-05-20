import PocketBase, { ClientResponseError, LocalAuthStore } from 'pocketbase'
import { ref, reactive } from 'vue'
import { AuthStoreKey } from '@/types/auth'
import { AuthProvider } from '@/store/store'
import type { Credentials } from '../types/credentials'

export const store = new LocalAuthStore(AuthStoreKey)
export const pb = new PocketBase('http://127.0.0.1:8090', store)

export enum UpdateType {
  Done,
  Edit,
}

interface Params {
  filter: string
}

export function usePocketbaseClient(collection: string) {
  const isLoading = ref(false)
  const error = ref<any>(null)
  const items = reactive<any[]>([])
  const item = ref<any>(null)

  const count = reactive({
    all: 0,
    done: 0,
    active: 0,
  })

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const authData = await pb.collection('users').authWithPassword(email, password)
      pb.authStore.save(authData.token, authData.record)
      return pb.authStore.isValid
    } catch (err) {
      error.value = err
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    pb.authStore.clear()
  }

  const getCount = async (params: Params = { filter: '' }, authProvider: AuthProvider) => {
    isLoading.value = true
    error.value = null

    const reqParam = {
      ...params,
    }

    switch (authProvider) {
      case AuthProvider.Pocketbase:
        reqParam.filter = reqParam.filter
          ? pb.filter(`${reqParam.filter} && user_id = {:user_id}`, { user_id: store.record?.id })
          : pb.filter(`user_id = {:user_id}`, { user_id: store.record?.id })
        break
      case AuthProvider.Auth0:
        reqParam.filter = reqParam.filter
          ? pb.filter(`${reqParam.filter} && social_id = {:social_id}`, {
              social_id: store.record?.id,
            })
          : pb.filter(`social_id = {:social_id}`, { social_id: store.record?.id })
        break
    }

    try {
      const res = await pb.collection(collection).getFullList(reqParam)

      count.all = res.length
      count.done = res.filter((item) => item.is_done).length
      count.active = res.filter((item) => !item.is_done).length
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const fetchAll = async (params: Params = { filter: '' }, authProvider: AuthProvider) => {
    isLoading.value = true
    error.value = null

    const reqParam = {
      ...params,
    }

    switch (authProvider) {
      case AuthProvider.Pocketbase:
        reqParam.filter = reqParam.filter
          ? pb.filter(`${reqParam.filter} && user_id = {:user_id}`, { user_id: store.record?.id })
          : pb.filter(`user_id = {:user_id}`, { user_id: store.record?.id })
        break
      case AuthProvider.Auth0:
        reqParam.filter = reqParam.filter
          ? pb.filter(`${reqParam.filter} && social_id = {:social_id}`, {
              social_id: store.record?.id,
            })
          : pb.filter(`social_id = {:social_id}`, { social_id: store.record?.id })
        break
    }

    try {
      const res = await pb.collection(collection).getFullList(reqParam)
      items.splice(0, items.length, ...res)
    } catch (err: unknown) {
      if (err instanceof ClientResponseError) {
        if (err.status === 0) {
          error.value = 'Start pocketbase server: `pocketbase serve`'
          return
        }

        if (err.status === 403) {
          error.value =
            'Allow all public access to the collection rule set at `Collection > todos > API Rules`'
          return
        }
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchOne = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const res = await pb.collection(collection).getOne(id)
      item.value = res
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const create = async (data: any) => {
    isLoading.value = true
    error.value = null

    try {
      const newItem = await pb.collection(collection).create(data)
      items.push(newItem)
      return newItem
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const update = async (id: string, data: any, updateType: UpdateType = UpdateType.Edit) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedItems = await pb.collection(collection).update(id, data)
      const index = items.findIndex((item) => item.id === id)

      if (updateType === UpdateType.Done) {
        items.splice(index, 1)
        return
      }

      if (index !== -1) {
        items[index] = updatedItems
      }

      return updatedItems
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  const resetData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const allItems = await pb.collection(collection).getFullList()
      const updatedItems = allItems.map((item) => {
        pb.collection(collection).update(item.id, {
          is_done: false,
        })
      })

      await Promise.all(updatedItems)
      items.splice(0, items.length, ...allItems)
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  const getCredentials = async (): Promise<Credentials | null> => {
    try {
      const filter = pb.filter('services = {:services_name}', { services_name: 'todoist' })
      const credentials = await pb.collection('credentials').getFirstListItem(filter)
      if (!credentials) return null

      return {
        projectId: credentials.projectId ?? null,
        apiKey: credentials.apiKey ?? null,
      }
    } catch (e) {
      return null
      error.value = e
    }
  }

  return {
    getCredentials,
    isLoading,
    error,
    items,
    count,
    item,
    fetchAll,
    fetchOne,
    create,
    update,
    resetData,
    getCount,
    login,
    logout,
  }
}
