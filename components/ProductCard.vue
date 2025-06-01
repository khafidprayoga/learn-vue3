<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="price">Rp {{ product.price.toLocaleString() }}</p>
      <p class="description">{{ product.description }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  margin-top: 12px;
}

.price {
  color: #2563eb;
  font-weight: bold;
  font-size: 1.2rem;
}

.description {
  color: #666;
  margin-top: 8px;
}
</style> 