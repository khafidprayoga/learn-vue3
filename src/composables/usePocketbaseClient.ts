import PocketBase, { ClientResponseError } from 'pocketbase'
import { ref, reactive } from 'vue'

const pb = new PocketBase('http://127.0.0.1:8090')

export enum UpdateType {
  Done,
  Edit,
}

export function usePocketbaseClient(collection: string) {
  const isLoading = ref(false)
  const error = ref<any>(null)
  const items = reactive<any[]>([])
  const item = ref<any>(null)
  const totalItemsCount = ref(0)
  const totalItemsDone = ref(0)
  const totalItemsActive = ref(0)

  const getCount = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const res = await pb.collection(collection).getFullList({
        ...params,
      })

      totalItemsCount.value = res.length
      totalItemsDone.value = res.filter((item) => item.is_done).length
      totalItemsActive.value = res.filter((item) => !item.is_done).length
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const fetchAll = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const res = await pb.collection(collection).getFullList({
        ...params,
      })

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

      // for the edit
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

  return {
    isLoading,
    error,
    items,
    item,
    fetchAll,
    fetchOne,
    create,
    update,
    resetData,
    getCount,
    totalItemsCount,
    totalItemsDone,
    totalItemsActive,
  }
}
