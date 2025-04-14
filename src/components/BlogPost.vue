<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>

<template>
  <h4>{{ title }}</h4>
  <slot />
  <button v-on:click="$emit('enlarge-text')">Enlarge Text</button>
</template>
