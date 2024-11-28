<!-- components/Toast.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'success',
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const emit = defineEmits(['update:show'])

const isVisible = ref(false)
let timeoutId = null

// 监听show的变化
watch(
  () => props.show,
  newVal => {
    if (newVal) {
      showToast()
    }
  },
)

const showToast = () => {
  // 清除之前的定时器
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  isVisible.value = true

  timeoutId = setTimeout(() => {
    isVisible.value = false
    emit('update:show', false)
  }, props.duration)
}

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div v-if="isVisible" class="fixed top-4 right-4 z-50 max-w-sm">
      <div
        class="flex items-center p-4 rounded-lg shadow-lg"
        :class="[type === 'success' ? 'bg-green-500' : 'bg-red-500', 'animate-slide-in']"
      >
        <!-- Success Icon -->
        <svg
          v-if="type === 'success'"
          class="w-6 h-6 mr-2 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <!-- Error Icon -->
        <svg v-else class="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="text-white">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
