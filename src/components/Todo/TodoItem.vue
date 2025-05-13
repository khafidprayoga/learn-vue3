<script setup lang="ts">
import { defineProps, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import type { Todo } from '@/types/todo'
import { formatDistanceToNow } from 'date-fns'

interface TodoItemProps extends Todo {
  showAction: boolean
  strikeThrough: boolean
  isProcessing: boolean
  updatedAt: string
  isDone: boolean
}

const props = defineProps<TodoItemProps>()

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
    <Input v-if="isEdit" v-model="newTitle" @keyup.enter="handleSave" @keyup.esc="isEdit = false" class="edit-input" />
    <span v-else class="todo-content" :class="{ 'line-through': strikeThrough }">{{ props.title }}</span>
    <span v-if="strikeThrough">
      finished {{ formatDistanceToNow(new Date(props.updatedAt), { addSuffix: true }) }}
    </span>

    <div class="todo-action" v-if="props.showAction">
      <Button variant="outline" @click="handleEdit" class="btn" v-if="!isEdit">Edit</Button>
      <Button variant="outline" @click="handleDone" class="btn" v-if="!isEdit">Done</Button>
    </div>

    <div v-if="isProcessing">
      <span>Processing...</span>
    </div>
  </li>
</template>

<style scoped>
@reference "tailwindcss";

.todo-item {
  @apply flex flex-row justify-between;
}

.todo-content {
  @apply text-xl font-bold my-1;
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
