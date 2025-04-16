<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{
  count: number
}>()
</script>

<template>
  <div>
    <span>Completed: {{ props.count }}</span>
  </div>
</template>