<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md space-y-6">
      <div class="space-y-4">
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          Iniciar sesión
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-300">
          Accede a tu cuenta de Canvas
        </p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            v-model="email"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            v-model="password"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </div>
        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
          ¿No tienes una cuenta?
          <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  // Timeout de 10 segundos
  const timeoutId = setTimeout(() => {
    if (loading.value) {
      loading.value = false
      toast.error('Tiempo de espera agotado. Revisa tu conexión.')
    }
  }, 10000)

  try {
    await authStore.login(email.value, password.value)
    clearTimeout(timeoutId)
    toast.success('Inicio de sesión exitoso')
    router.push('/')
  } catch (error) {
    clearTimeout(timeoutId)
    toast.error(error.message || 'Error al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>