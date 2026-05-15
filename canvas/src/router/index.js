import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../pages/LoginView.vue'
import RegisterView from '../pages/RegisterView.vue'
import FeedView from '../pages/FeedView.vue'
import ProfileView from '../pages/ProfileView.vue'
import EditProfileView from '../pages/EditProfileView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/feed',
    name: 'feed',
    component: FeedView
  },
  {
    path: '/profile/:username',
    name: 'profile',
    component: ProfileView
  },
  {
    path: '/edit-profile',
    name: 'edit-profile',
    component: EditProfileView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // Auth ya fue inicializado en main.js antes del mount, por lo que
  // authStore.user refleja el estado real del usuario.
  const requiresAuth = ['feed', 'profile', 'edit-profile']

  if (requiresAuth.includes(to.name) && !authStore.user) {
    next({ name: 'login' })
  } else if (['login', 'register'].includes(to.name) && authStore.user) {
    // Ya autenticado → redirigir al feed
    next({ name: 'feed' })
  } else {
    next()
  }
})

export default router
