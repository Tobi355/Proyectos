<template>
  <div class="text-center py-12">
    <div class="mb-6">
      <svg v-if="icon" class="mx-auto h-12 w-12 text-gray-400" :class="{ 'text-indigo-500': variant === 'primary' }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="icon === 'feed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        <path v-else-if="icon === 'profile'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.5 10L12 14.5l4.5-3" />
      </svg>

      <div v-else class="relative h-12 w-12 mx-auto">
        <div class="absolute inset-0">
          <div class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20 rounded-full"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-6 h-6 bg-indigo-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
    <p class="mb-6 text-gray-600 dark:text-gray-300 max-w-xl">{{ description }}</p>

    <div v-if="action">
      <button
        @click="action.handler"
        class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      default: 'Sin contenido'
    },

    description: {
      type: String,
      default: ''
    },

    icon: {
      type: String,
      default: ''
    },

    buttonText: {
      type: String,
      default: ''
    },

    action: {
      type: Function,
      default: null
    }
  })
</script>