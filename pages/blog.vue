<template>
  <div id="blog-page">
    <h1>Blog Posts</h1>
    <div class="posts-grid">
      <div v-for="post in posts" :key="post.id" class="post-card" :id="'post-' + post.id">
        <h2>{{ post.title }}</h2>
        <p>{{ post.excerpt }}</p>
        <NuxtLink :to="'/posts/' + post.id">Baca selengkapnya</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const posts = ref([
  {
    id: 1,
    title: 'Post Pertama',
    excerpt: 'Ini adalah excerpt dari post pertama'
  },
  {
    id: 2,
    title: 'Post Kedua',
    excerpt: 'Ini adalah excerpt dari post kedua'
  }
])
</script>

<style scoped>
#blog-page {
  padding: 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.post-card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.post-card h2 {
  margin-bottom: 1rem;
}
</style>