<script setup lang="ts">
import { defineProps } from 'vue'
import Button from '@/components/ui/button/Button.vue'

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
      <Button variant="outline" @click="handleEdit" class="btn">Edit</Button>
      <Button variant="outline" @click="handleDone" class="btn">Done</Button>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.btn:hover {
  cursor: pointer;
}
</style>
