<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Ask a question')
const isLoading = ref(false)

watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    isLoading.value = true
    answer.value = 'Thinking...'

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const res = await fetch('https://yesno.wtf/api')

      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Could reach the API'
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <form @submit.prevent="">
    <div>
      <label for="question">Ask a question with yes/no</label>
      <input type="text" v-model="question" id="question" />
      <p :class="{ thinking: answer === 'Thinking...' }">
        {{ answer }}
      </p>
    </div>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  margin: 0 auto;
  margin-top: 100px;
}
p.thinking {
  color: #ff6600;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}
</style>
