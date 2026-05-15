<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4">
      <div class="flex items-start space-x-3">
        <img
          :src="post.user.avatar_url || 'https://via.placeholder.com/40'"
          :alt="post.user.username"
          class="h-10 w-10 rounded-full"
        >
        <div class="flex-1">
          <router-link
            :to="{ name: 'profile', params: { username: post.user.username } }"
            class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {{ post.user.username }}
          </router-link>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(post.created_at) }}
          </p>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-gray-800 dark:text-gray-200" {{ post.content }}></p>
      </div>
      <div v-if="post.image_url" class="mt-4">
        <img :src="post.image_url" alt="Post image" class="w-full h-64 object-cover rounded">
      </div>
      <div class="mt-4 flex items-center space-x-4 text-sm">
        <button
          @click="toggleLike"
          :class="{ 'text-indigo-600 dark:text-indigo-400': post.liked, 'text-gray-500 dark:text-gray-400': !post.liked }"
        >
          <span class="mr-2">❤️</span>
          {{ post.likes_count }} Me gusta
        </button>
        <button @click="openComments" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <span class="mr-2">💬</span>
          {{ post.comments_count }} Comentarios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { postService } from '../services/postService'
import { formatDate } from '../utils/dateUtils'
import { useToast } from 'vue-toastification'

const props = defineProps({
  post: { type: Object, required: true }
})
const emit = defineEmits(['update:post', 'open-comments'])
const toast = useToast()

async function toggleLike() {
  try {
    await postService.toggleLike(props.post.id)
    props.post.likes_count = props.post.liked
      ? props.post.likes_count - 1
      : props.post.likes_count + 1
    props.post.liked = !props.post.liked
    emit('update:post', props.post)
  } catch (error) {
    toast.error('Error al dar like')
  }
}

function openComments() {
  emit('open-comments', props.post)
}
</script>