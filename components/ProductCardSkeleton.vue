<template>
  <div class="product-card skeleton">
    <div class="product-image skeleton-image"></div>
    <div class="product-info">
      <div class="skeleton-title"></div>
      <div class="skeleton-price"></div>
      <div class="skeleton-description"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-title {
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 12px;
  width: 70%;
  animation: pulse 1.5s infinite;
}

.skeleton-price {
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 8px;
  width: 40%;
  animation: pulse 1.5s infinite;
}

.skeleton-description {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 8px;
  width: 90%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style> 