<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar perfil</h1>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Error state -->
    <ErrorBoundary v-else-if="error && !profile.username" :errorMessage="error" :retry="fetchProfile" />

    <!-- Success state -->
    <div v-else>
      <form @submit.prevent="handleUpdateProfile" class="space-y-6 max-w-lg">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            required
            maxlength="30"
            minlength="3"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.username"
          />
          <p v-if="profile.username.length > 0" class="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
            {{ profile.username.length }}/30
          </p>
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Biografía
          </label>
          <textarea
            id="bio"
            rows="4"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.bio"
            maxlength="160"
            placeholder="Contá algo sobre vos..."
          ></textarea>
          <p v-if="profile.bio && profile.bio.length > 0" class="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
            {{ profile.bio.length }}/160
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avatar
          </label>
          <div class="flex items-center space-x-4">
            <img
              :src="avatarPreview || profile.avatar_url || 'https://via.placeholder.com/80'"
              :alt="profile.username"
              class="h-16 w-16 rounded-full object-cover"
            >
            <div>
              <label for="avatar" class="cursor-pointer px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                Cambiar foto
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                class="hidden"
              >
              <p v-if="selectedAvatar" class="mt-2 text-sm text-green-600 dark:text-green-400">
                ✓ {{ selectedAvatar.name }}
              </p>
              <p v-if="avatarError" class="mt-1 text-sm text-red-500 dark:text-red-400">
                {{ avatarError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Cambiar contraseña (toggle) -->
        <div>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            {{ showPassword ? '▲ Ocultar' : '▼ Cambiar' }} contraseña
          </button>
        </div>

        <div v-if="showPassword" class="space-y-4 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              minlength="6"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              v-model="newPassword"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button
            type="button"
            @click="handleChangePassword"
            :disabled="loadingSubmit || newPassword.length < 6"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
          >
            {{ loadingSubmit ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-4 py-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loadingSubmit"
            class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            {{ loadingSubmit ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { profileService } from '../services/profileService'
import { storageService } from '../services/storageService'
import { supabase } from '../supabase'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorBoundary from '../components/ErrorBoundary.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const profile = ref({ username: '', bio: '', avatar_url: null })
const selectedAvatar = ref(null)
const avatarPreview = ref(null)
const avatarError = ref(null)
const showPassword = ref(false)
const newPassword = ref('')

const loading = ref(false)
const error = ref(null)
const loadingSubmit = ref(false)

const fetchProfile = async () => {
  if (!authStore.user) {
    router.push('/login')
    return
  }
  loading.value = true
  error.value = null
  try {
    const data = await profileService.getProfileById(authStore.user.id)
    profile.value = {
      username: data.username ?? '',
      bio: data.bio ?? '',
      avatar_url: data.avatar_url ?? null
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar el perfil'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarError.value = null

  if (!file.type.startsWith('image/')) {
    avatarError.value = 'Solo se permiten imágenes'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = 'El archivo es demasiado grande (máximo 5MB)'
    return
  }

  selectedAvatar.value = file
  // Preview local inmediato
  avatarPreview.value = URL.createObjectURL(file)
}

const handleUpdateProfile = async () => {
  // Validar username con profile.value (no profile directamente)
  if (!profile.value.username.trim()) {
    toast.error('El nombre de usuario es requerido')
    return
  }
  if (profile.value.username.trim().length < 3) {
    toast.error('El nombre de usuario debe tener al menos 3 caracteres')
    return
  }
  if (profile.value.bio && profile.value.bio.length > 160) {
    toast.error('La biografía no puede exceder 160 caracteres')
    return
  }

  loadingSubmit.value = true
  error.value = null

  try {
    let avatarUrl = profile.value.avatar_url

    if (selectedAvatar.value) {
      avatarUrl = await storageService.uploadAvatar(selectedAvatar.value)
    }

    // Usar authStore.user.id en lugar de supabase.auth.user() (v1)
    await profileService.updateProfile(authStore.user.id, {
      username: profile.value.username.trim(),
      bio: profile.value.bio?.trim() || null,
      avatar_url: avatarUrl
    })

    // Actualizar el store de auth
    authStore.user = {
      ...authStore.user,
      username: profile.value.username.trim(),
      avatar_url: avatarUrl,
      bio: profile.value.bio?.trim() || null
    }

    selectedAvatar.value = null
    avatarPreview.value = null
    toast.success('Perfil actualizado correctamente')
  } catch (err) {
    error.value = err.message || 'Error al actualizar el perfil'
    toast.error(error.value)
  } finally {
    loadingSubmit.value = false
  }
}

const handleChangePassword = async () => {
  if (newPassword.value.length < 6) {
    toast.error('La contraseña debe tener al menos 6 caracteres')
    return
  }

  loadingSubmit.value = true
  try {
    const { error: pwError } = await supabase.auth.updateUser({
      password: newPassword.value
    })
    if (pwError) throw pwError

    toast.success('Contraseña actualizada correctamente')
    showPassword.value = false
    newPassword.value = ''
  } catch (err) {
    toast.error(err.message || 'Error al actualizar la contraseña')
  } finally {
    loadingSubmit.value = false
  }
}

const resetForm = () => {
  fetchProfile()
  selectedAvatar.value = null
  avatarPreview.value = null
  avatarError.value = null
  showPassword.value = false
  newPassword.value = ''
}

onMounted(() => {
  fetchProfile()
})
</script>
