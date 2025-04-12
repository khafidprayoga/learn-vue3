<script setup>
import { reactive, computed, ref } from 'vue'

const isDarkMode = ref(false)
const state = reactive({
  authorName: 'Jane Doe',
  books: [
    {
      id: 1,
      title: 'Book World',
      description: 'Description 1',
    },
    {
      id: 2,
      title: 'Book Heaven',
      description: 'Description 2',
    },
    {
      id: 3,
      title: 'Book at the Park',
      description: 'Description 3',
    },
  ],
})

const hasBooks = computed(() => {
  return state.books.length > 0
})

const deleteBook = (bookId) => {
  state.books = state.books.filter((book) => book.id !== bookId)
}
const currentTheme = computed(() => {
  return isDarkMode.value ? 'dark' : 'light'
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <div class="container" :class="currentTheme">
    <div>
      <button @click="toggleTheme" class="theme-toggle">
        {{ isDarkMode ? '🌙 Dark Mode' : '🌞 Light Mode' }}
      </button>
    </div>
    <header>
      <p>Author Name: {{ state.authorName }}</p>
    </header>
    <div class="content">
      <template v-if="hasBooks">
        <p>Book List:</p>
        <ul>
          <li v-for="book in state.books" :key="book.id">
            {{ book.title }}
            <button class="delete-button" @click="deleteBook(book.id)">-</button>
          </li>
        </ul>
      </template>
      <template v-else>
        <p>No books available</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 720px;
  height: 25vh;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid #000;
  margin: 0 auto;
  padding: 20px;
}
.container.dark {
  background-color: #000;
  color: #fff;
}

.container.dark .theme-toggle {
  background-color: #333;
  color: #fff;
}

.container.light .theme-toggle {
  background-color: #f0f0f0;
  color: #000;
}

.container.light {
  background-color: #fff;
  color: #000;
}

.delete-button {
  margin-left: 10px;
  padding: 1px 8px;
  background-color: #ff4444;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.theme-toggle {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.theme-toggle:hover {
  transform: scale(1.05);
}
</style>
