<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{
  completedCount: number
  activeCount: number
  count: number
}>()
</script>

<template>
  <div class="px-5 text-md flex flex-row space-x-3">
    <span class="font-bold">Total: {{ props.count || 0 }}</span>
    <span class="font-bold">Active: {{ props.activeCount || 0 }}</span>
    <span class="font-bold">Completed: {{ props.completedCount || 0 }}</span>
  </div>
</template>
