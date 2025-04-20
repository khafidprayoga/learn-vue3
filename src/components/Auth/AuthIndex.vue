<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useAuth0 } from '@auth0/auth0-vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
  store,
  usePocketbaseClient
} from '@/composables/usePocketbaseClient'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Loader2, Github } from 'lucide-vue-next'
const { isLoading, login } = usePocketbaseClient('users')

const formSchema = toTypedSchema(z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
}))
const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  try {
    await login(values.email, values.password)

  } finally {
    form.resetForm()
    isLoading.value = false
  }
})

const { loginWithPopup,
  user: auth0User,
  idTokenClaims: claims,
} = useAuth0()

const handleSocial = async () => {
  isLoading.value = true
  try {
    await loginWithPopup()


    console.log(auth0User.value)
    store.save(claims.value!.__raw, {
      avatar: claims.value!.picture,
      collectionId: 'auth0',
      collectionName: 'github',
      created: claims.value!.created_at,
      email: claims.value!.email,
      id: new String(claims.value!.sub).split('1')[1],
      name: claims.value!.name,
      updated: claims.value!.updated_at,
      verified: claims.value!.email_verified,
    })

  } finally {
    form.resetForm()
    isLoading.value = false
  }
}

</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')" class="auth-container">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <FormField v-slot="{ field }" name="email" class="grid gap-1 ">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="acme@example.com" v-bind="field" auto-capitalize="none"
                auto-complete="email" auto-correct="off" :disabled="isLoading" class="email-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ field }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="field" placeholder="supersecret" auto-capitalize="none"
                auto-complete="password" auto-correct="off" :disabled="isLoading" class="password-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Sign In
        </Button>
      </div>
    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
    <Button variant="outline" type="button" :disabled="isLoading" @click="handleSocial">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      <Github v-else class="mr-2 h-4 w-4" />
      GitHub
    </Button>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.auth-container {
  @apply max-w-sm mx-auto mt-10 bg-gray-50 p-5 rounded-md;
}

button:hover {
  @apply cursor-pointer;
}

.password-input,
.email-input {
  @apply font-mono;
}
</style>