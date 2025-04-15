<script setup lang="ts"></script>

<template>
  <h1 class="text-2xl font-bold text-center mt-5">Todo List APP</h1>
  <div class="container">
    <main class="todo-list">
      <div class="todo-item">
        <div class="todo-content">Belajar Vue3</div>
        <div class="todo-action">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Done</button>
        </div>
      </div>
      <div class="todo-item">
        <div class="todo-content">Belajar Laravel 12 dan PostgreSQL</div>
        <div class="todo-action">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Done</button>
        </div>
      </div>
      <div class="todo-item">
        <div class="todo-content">Belajar InertiaJS</div>
        <div class="todo-action">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Done</button>
        </div>
      </div>
    </main>
    <div class="todo-form"></div>
  </div>
</template>

<style>
@reference "tailwindcss";

.container {
  @apply bg-zinc-300;
}
</style>
