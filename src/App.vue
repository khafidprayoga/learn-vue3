<script setup>
import { ref } from 'vue'

const age = ref()
const message = ref('')
const gender = ref('')
const checkedNames = ref([])

const grade = ref([])
const selected = ref('A')
const options = ref([
  {
    text: 'One',
    value: 'A',
  },
  {
    text: 'Two',
    value: 'B',
  },
  {
    text: 'Three',
    value: 'C',
  },
])
</script>

<template>
  <form @submit.prevent="">
    <div>
      <span>Age : {{ age }}</span>
      <br />
      <p>Message : {{ message }}</p>
      <br />
      <span
        >Checked Names :
        <span v-for="(name, index) in checkedNames" :key="index">{{ name }}-</span></span
      >
      <br />
      <span>Gender: {{ gender || 'Not selected' }}</span>
      <br />
      <span>Grade : {{ grade }}</span>
      <br />
      <span>Selected : {{ selected }}</span>
      <br />
    </div>
    <input type="number" id="age" v-model.number="age" />
    <textarea v-model="message"></textarea>
    <div class="checkbox-container">
      <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
      <label for="jack">Jack</label>
    </div>

    <div class="checkbox-container">
      <input type="checkbox" id="john" value="John" v-model="checkedNames" />
      <label for="john">John</label>
    </div>

    <div class="checkbox-container">
      <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
      <label for="mike">Mike</label>
    </div>
    <div class="checkbox-container">
      <input type="radio" id="male" value="Male" v-model="gender" />
      <label for="male">Male</label>
      <input type="radio" id="female" value="Female" v-model="gender" />
      <label for="female">Female</label>
    </div>
    <div class="checkbox-container">
      <select v-model="grade" multiple>
        <option value="" disabled>Select one</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    </div>
    <div class="checkbox-container">
      <select v-model="selected">
        <option v-for="option in options" v-bind:key="option.value" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
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
</style>
