<template>
  <div class="flex items-center justify-center min-h-[70vh]">
    <div class="text-center px-4">
      <h2 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
        Bienvenido a Canvas
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
        La red social para diseñadores y artistas digitales. Compartí tu arte con la comunidad.
      </p>
      <div class="flex justify-center space-x-4">
        <router-link
          to="/register"
          class="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-lg transition-colors"
        >
          Empezar ahora
        </router-link>
        <router-link
          to="/login"
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-lg transition-colors"
        >
          Iniciar sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // Si ya está autenticado, ir al feed
  if (authStore.user) {
    router.push('/feed')
  }
})
</script>
