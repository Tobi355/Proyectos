<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md space-y-6">
      <div class="space-y-4">
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          Regístrate
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-300">
          Únete a Canvas y comienza a compartir tu arte
        </p>
      </div>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            required
            maxlength="30"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            v-model="username"
          />
          <p v-if="username.length > 0" class="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
            {{ username.length }}/30
          </p>
        </div>
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
            {{ loading ? 'Registrando...' : 'Regístrate' }}
          </button>
        </div>
        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
          Ya tienes una cuenta?
          <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Inicia sesión
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

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleRegister = async () => {
  // Validar formularios
  if (!username.value.trim()) {
    toast.error('El nombre de usuario es requerido')
    return
  }

  if (username.value.length < 3) {
    toast.error('El nombre de usuario debe tener al menos 3 caracteres')
    return
  }

  loading.value = true
  try {
    await authStore.register(email.value, password.value, username.value.trim())
    toast.success('Registro exitoso. Por favor verifica tu correo electrónico.')
    router.push('/login')
  } catch (error) {
    toast.error(error.message || 'Error al registrar')
  } finally {
    loading.value = false
  }
}
</script>