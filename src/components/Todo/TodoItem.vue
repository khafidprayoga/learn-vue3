<script setup lang="ts">
import { defineProps, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'

const props = defineProps<{
  id: string
  title: string
}>()

const emit = defineEmits<{
  (e: 'done', id: string): void
  (e: 'edit', id: string, title: string): void
}>()

const handleEdit = () => {
  isEdit.value = true
}

const handleDone = () => {
  emit('done', props.id)
}

const handleSave = () => {
  isEdit.value = false
  emit('edit', props.id, newTitle.value)
}

const isEdit = ref(false)
const newTitle = ref(props.title)
</script>

<template>
  <li class="todo-item">
    <Input v-if="isEdit" v-model="newTitle" @keyup.enter="handleSave" class="edit-input" />
    <span v-else class="todo-content">{{ props.title }}</span>
    <div class="todo-action">
      <Button variant="outline" @click="handleEdit" class="btn" v-if="!isEdit">Edit</Button>
      <Button variant="outline" @click="handleDone" class="btn">Done</Button>
    </div>
  </li>
</template>

<style scoped>
@reference "tailwindcss";

.todo-item {
  @apply flex flex-row justify-between px-5;
}

.todo-content {
  @apply text-xl font-bold;
}

.todo-action {
  @apply flex flex-row gap-5;
}

.btn:hover {
  cursor: pointer;
}

.edit-input {
  @apply border border-gray-300 bg-white rounded px-2 py-1;
  width: 75%;
}
</style>
