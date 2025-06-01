<script setup>
const route = useRoute()
</script>
<template>
  <div id="post-detail">
    <h1>Post Detail</h1>
    <div class="post-content">
      <p>Post ID: {{ $route.params.id }}</p>
    </div>
  </div>
</template>



<style scoped>
#post-detail {
  padding: 2rem;
}

.post-content {
  margin-top: 1rem;
}
</style>
