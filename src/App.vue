<script setup>
import { onMounted, useTemplateRef, ref, watch } from 'vue'
import BlogPost from './components/BlogPost.vue'

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

const inputQuestion = useTemplateRef('input-question')

const focusInput = () => {
  inputQuestion.value.focus()
}

onMounted(() => {
  focusInput()
})

const posts = ref([
  {
    id: 1,
    title: 'My first blog post',
  },
  {
    id: 2,
    title: 'Learning Laravel 12.x',
  },
  {
    id: 3,
    title: 'Learning VueJS',
  },
])

const postFontSize = ref(1)
</script>

<template>
  <div
    class="blog-posts"
    :style="{
      fontSize: postFontSize + 'em',
    }"
  >
    <BlogPost
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
      @enlarge-text="postFontSize += 0.3"
    >
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    </BlogPost>
  </div>
  <form @submit.prevent="">
    <div>
      <label for="question">Ask a question with yes/no</label>
      <input type="text" v-model="question" id="question" ref="input-question" />
      <p :class="{ thinking: answer === 'Thinking...' }">
        {{ answer }}
      </p>
    </div>
  </form>
</template>

<style scoped>
.blog-posts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  margin: 0 auto;
  margin-top: 100px;
}
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
