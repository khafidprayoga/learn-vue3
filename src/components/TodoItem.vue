<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  id: number
  title: string
  isDone: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'done', id: number): void
}>()

const handleEdit = () => {
  emit('edit', props.id)
}

const handleDone = () => {
  emit('done', props.id)
}
</script>

<template>
  <div class="todo-item">
    <div class="todo-content">{{ props.title }}</div>
    <div class="todo-action">
      <button class="btn-edit" @click="handleEdit">Edit</button>
      <button class="btn-delete" @click="handleDone">Done</button>
    </div>
  </div>
</template>
