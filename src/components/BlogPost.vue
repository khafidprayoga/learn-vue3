<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  author: String,
  isRead: Boolean,
})
defineEmits(['enlarge-text'])
</script>

<template>
  <h4>{{ title }}</h4>
  <p>By {{ author ?? 'Anonymous' }}</p>
  <p>{{ isRead ? 'I have read it' : 'I have not read it' }}</p>
  <slot />
  <button v-on:click="$emit('enlarge-text')">Enlarge Text</button>
</template>
