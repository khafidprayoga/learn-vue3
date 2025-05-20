import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import TodoIndex from './components/Todo/TodoIndex.vue'
import AuthIndex from './components/Auth/AuthIndex.vue'
import { useAuthStore } from './store/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/todos',
  },
  {
    path: '/todos',
    component: TodoIndex,
    name: 'todos',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    component: AuthIndex,
    name: 'auth',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/todos',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.name === 'auth' && isAuthenticated) {
    next({ name: 'todos' })
    return
  }

  // Jika route membutuhkan autentikasi dan user belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'auth' })
    return
  }

  next()
})

export default router
