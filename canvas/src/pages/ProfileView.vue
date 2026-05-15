<template>
  <div>

    <div class="p-6">
      <!-- Loading perfil -->
      <div v-if="loadingProfile" class="text-center py-12">
        <LoadingSpinner />
      </div>
      
      <!-- Error perfil -->
      <ErrorBoundary v-else-if="errorProfile" :errorMessage="errorProfile" :retry="fetchProfile" />
      
      <!-- Perfil cargado -->
      <div v-else-if="profile">
        <div class="mb-6">
          <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <img
            :src="profile.avatar_url || 'https://via.placeholder.com/80'"
            :alt="profile.username"
            class="h-20 w-20 rounded-full object-cover"
            >
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ profile.username }}</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">{{ profile.bio || 'Sin biografía' }}</p>
            </div>
          </div>
          <!-- Botón editar si es el propio perfil -->
          <router-link
          v-if="authStore.user && authStore.user.username === profile.username"
          to="/edit-profile"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          >
          Editar perfil
        </router-link>
      </div>
    </div>
    
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Publicaciones</h2>
      
      <!-- Loading posts -->
      <div v-if="loadingPosts" class="text-center py-12">
        <LoadingSpinner />
      </div>
      
      <!-- Error posts -->
      <ErrorBoundary v-else-if="errorPosts" :errorMessage="errorPosts" :retry="fetchUserPosts" />
      
      <!-- Empty posts -->
      <EmptyState
      v-else-if="userPosts.length === 0"
      title="Aún no hay publicaciones"
      description="Este usuario no ha publicado nada todavía."
      :icon="null"
      variant="secondary"
      />
      
      <!-- Posts list -->
      <div v-else class="space-y-4">
        <PostCard
            v-for="post in userPosts"
            :key="post.id"
            :post="post"
            @update:post="updatePost"
            @open-comments="openComments"
            />
          </div>
        </div>
      </div>
      
      <!-- Usuario no encontrado -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400 text-lg">Usuario no encontrado</p>
        <router-link to="/feed" class="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
          Volver al feed
        </router-link>
      </div>
    </div>
    
    <!-- Comments modal -->
    <div v-if="showComments" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Comentarios</h2>
            <p v-if="activePost" class="text-sm text-gray-500 dark:text-gray-400">
              Publicación de {{ activePost.user.username }}
            </p>
        </div>
        <button @click="closeComments" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl">
          ✕
        </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="loadingComments" class="text-center py-4">
            <LoadingSpinner />
          </div>
          <ErrorBoundary v-else-if="errorComments" :errorMessage="errorComments" :retry="fetchPostComments" />
          <EmptyState
          v-else-if="postComments.length === 0"
          title="Aún no hay comentarios"
          description="Sé el primero en comentar."
          :icon="null"
          variant="secondary"
          />
          <div v-else class="space-y-4">
            <CommentItem
            v-for="comment in postComments"
            :key="comment.id"
            :comment="comment"
            :postId="activePost.id"
            @update:comment="updateComment"
            @delete:comment="deleteComment"
            />
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="handleCreateComment" class="space-y-2">
            <textarea
            rows="2"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            v-model="commentContent"
            maxlength="300"
            placeholder="Añadí un comentario..."
            ></textarea>
            <div class="flex justify-between items-center">
              <span v-if="commentContent.length > 0" class="text-sm text-gray-500 dark:text-gray-400">
                {{ commentContent.length }}/300
              </span>
              <span v-else></span>
              <button
              type="submit"
              :disabled="loadingComment || !commentContent.trim()"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
              >
              {{ loadingComment ? 'Comentando...' : 'Comentar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { profileService } from '../services/profileService'
import { postService } from '../services/postService'
import { useRealtime } from '../composables/useRealtime'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorBoundary from '../components/ErrorBoundary.vue'
import EmptyState from '../components/EmptyState.vue'
import PostCard from '../components/PostCard.vue'
import CommentItem from '../components/CommentItem.vue'

const authStore = useAuthStore()
const route = useRoute()
const toast = useToast()

const profile = ref(null)
const userPosts = ref([])
const showComments = ref(false)
const activePost = ref(null)
const postComments = ref([])
const commentContent = ref('')

const loadingProfile = ref(false)
const errorProfile = ref(null)
const loadingPosts = ref(false)
const errorPosts = ref(null)
const loadingComments = ref(false)
const errorComments = ref(null)
const loadingComment = ref(false)

const fetchProfile = async () => {
  const username = route.params.username
  if (!username) return

  loadingProfile.value = true
  errorProfile.value = null
  profile.value = null

  try {
    const data = await profileService.getProfileByUsername(username)
    profile.value = data
    // Cargar posts una vez que tenemos el perfil
    await fetchUserPosts()
  } catch (err) {
    errorProfile.value = err.message || 'Error al cargar el perfil'
    toast.error(errorProfile.value)
  } finally {
    loadingProfile.value = false
  }
}

const fetchUserPosts = async () => {
  if (!profile.value) return

  loadingPosts.value = true
  errorPosts.value = null
  try {
    // Usar postService en lugar de llamar supabase directamente
    const data = await postService.getPostsByUserId(profile.value.id)
    userPosts.value = data
  } catch (err) {
    errorPosts.value = err.message || 'Error al cargar las publicaciones'
    toast.error(errorPosts.value)
  } finally {
    loadingPosts.value = false
  }
}

const openComments = (post) => {
  activePost.value = post
  showComments.value = true
  fetchPostComments()
}

const closeComments = () => {
  showComments.value = false
  activePost.value = null
  postComments.value = []
  commentContent.value = ''
}

const fetchPostComments = async () => {
  if (!activePost.value) return

  loadingComments.value = true
  errorComments.value = null
  try {
    const data = await postService.getComments(activePost.value.id)
    postComments.value = data
  } catch (err) {
    errorComments.value = err.message || 'Error al cargar los comentarios'
    toast.error(errorComments.value)
  } finally {
    loadingComments.value = false
  }
}

const handleCreateComment = async () => {
  if (!commentContent.value.trim() || !activePost.value) return

  loadingComment.value = true
  try {
    const newComment = await postService.createComment(activePost.value.id, commentContent.value.trim())
    postComments.value.push(newComment)
    // Actualizar contador en el post
    const postIndex = userPosts.value.findIndex(p => p.id === activePost.value.id)
    if (postIndex !== -1) {
      userPosts.value[postIndex].comments_count++
    }
    commentContent.value = ''
    toast.success('Comentario agregado')
  } catch (err) {
    toast.error(err.message || 'Error al agregar el comentario')
  } finally {
    loadingComment.value = false
  }
}

const updatePost = (updatedPost) => {
  const index = userPosts.value.findIndex(p => p.id === updatedPost.id)
  if (index !== -1) {
    userPosts.value[index] = updatedPost
  }
}

const updateComment = (updatedComment) => {
  const index = postComments.value.findIndex(c => c.id === updatedComment.id)
  if (index !== -1) {
    postComments.value[index] = updatedComment
  }
}

const deleteComment = (commentId) => {
  postComments.value = postComments.value.filter(c => c.id !== commentId)
  const postIndex = userPosts.value.findIndex(p => p.id === activePost.value?.id)
  if (postIndex !== -1 && userPosts.value[postIndex].comments_count > 0) {
    userPosts.value[postIndex].comments_count--
  }
}

// Recargar si cambia el username en la URL (ej: navegación a otro perfil)
watch(() => route.params.username, () => {
  fetchProfile()
})

// Suscripciones en tiempo real
const { init: initPostsRealtime, destroy: destroyPostsRealtime } = useRealtime('posts', () => {
  if (profile.value) fetchUserPosts()
})
const { init: initLikesRealtime, destroy: destroyLikesRealtime } = useRealtime('likes', () => {
  if (profile.value) fetchUserPosts()
})
const { init: initCommentsRealtime, destroy: destroyCommentsRealtime } = useRealtime('comments', () => {
  if (activePost.value) fetchPostComments()
})

onMounted(() => {
  fetchProfile()
  initPostsRealtime()
  initLikesRealtime()
  initCommentsRealtime()
})

onBeforeUnmount(() => {
  destroyPostsRealtime()
  destroyLikesRealtime()
  destroyCommentsRealtime()
})
</script>
