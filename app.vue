<template>
  <Suspense>
    <template #default>
      <NuxtPage
        :transition="{
          name: 'bounce',
          mode: 'out-in',
        }"
      />
    </template>
    <template #fallback>
      <div class="loading">
        Loading...
      </div>
    </template>
  </Suspense>
</template>

<style>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
}
</style>