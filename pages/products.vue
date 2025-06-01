<template>
  <div class="products-container">
    <h1>Daftar Produk</h1>
    <div class="products-grid">
      <Suspense v-for="product in products" :key="product.id">
        <template #default>
          <ProductCard :product="product" />
        </template>
        <template #fallback>
          <ProductCardSkeleton />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
const products = ref([
  {
    id: 1,
    name: 'Smartphone X',
    price: 5000000,
    description: 'Smartphone terbaru dengan kamera 108MP',
    image: 'https://picsum.photos/400/300'
  },
  {
    id: 2,
    name: 'Laptop Pro',
    price: 15000000,
    description: 'Laptop performa tinggi untuk profesional',
    image: 'https://picsum.photos/400/301'
  },
  {
    id: 3,
    name: 'Smart Watch',
    price: 2000000,
    description: 'Jam tangan pintar dengan fitur kesehatan',
    image: 'https://picsum.photos/400/302'
  }
])
</script>

<style scoped>
.products-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 24px;
}
</style> 