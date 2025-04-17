<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormItem, FormLabel, FormMessage, FormField } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  form.resetForm()
  emit('addTodo', values.title)
})

const emit = defineEmits<{
  (e: 'addTodo', title: string): void
}>()
</script>

<template>
  <div class="mt-10 todo-form">
    <p class="text-xl font-bold my-3">Add New Todo</p>
    <form class="" @submit="onSubmit">
      <FormField v-slot="{ field }" name="title">
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Belajar VueJS" v-bind="field" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" class="mt-3"> Submit </Button>
    </form>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.todo-form {
  @apply max-w-sm mx-auto;
}

[type='submit'] {
  @apply cursor-pointer;
}
</style>
