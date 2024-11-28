<template>
  <div
    ref="buildInfoRef"
    class="build-info"
    :class="themeClass"
    :style="position"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="build-info-content">
      <p class="info-line">Build Time: {{ buildTime }}</p>
      <p class="info-line">Build Hash: {{ buildHash }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

// 主题配置
const themes = {
  blue: {
    name: 'theme-blue',
    gradient: {
      from: '#2C3E50',
      to: '#3498DB',
      hoverFrom: '#34495E',
      hoverTo: '#5DADE2',
    },
    shadow: {
      primary: 'rgba(52, 152, 219, 0.3)',
      secondary: 'rgba(44, 62, 80, 0.2)',
    },
  },
  purple: {
    name: 'theme-purple',
    gradient: {
      from: '#614385',
      to: '#516395',
      hoverFrom: '#734B9D',
      hoverTo: '#6276AC',
    },
    shadow: {
      primary: 'rgba(97, 67, 133, 0.3)',
      secondary: 'rgba(81, 99, 149, 0.2)',
    },
  },
  green: {
    name: 'theme-green',
    gradient: {
      from: '#136a8a',
      to: '#267871',
      hoverFrom: '#1A8BA8',
      hoverTo: '#2E8F88',
    },
    shadow: {
      primary: 'rgba(19, 106, 138, 0.3)',
      secondary: 'rgba(38, 120, 113, 0.2)',
    },
  },
}

// 配置项
const props = defineProps({
  theme: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'purple', 'green'].includes(value),
  },
})

const themeClass = computed(() => themes[props.theme].name)

const buildTime = ref('')
const buildHash = ref('')
const isDragging = ref(false)
const position = ref(getInitialPosition())
const buildInfoRef = ref(null)

let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0

function getInitialPosition() {
  try {
    const savedPosition = localStorage.getItem('buildInfoPosition')
    if (savedPosition) {
      return JSON.parse(savedPosition)
    }
  } catch (e) {
    console.error('Error reading position from localStorage:', e)
  }
  return { left: 'auto', top: 'auto', right: '10px', bottom: '10px' }
}

function savePosition() {
  try {
    localStorage.setItem('buildInfoPosition', JSON.stringify(position.value))
  } catch (e) {
    console.error('Error saving position to localStorage:', e)
  }
}

const updatePosition = () => {
  if (!buildInfoRef.value) return

  const rect = buildInfoRef.value.getBoundingClientRect()
  const maxX = window.innerWidth - rect.width
  const maxY = window.innerHeight - rect.height

  // 如果当前使用的是 right/bottom 定位
  if (position.value.right !== 'auto') {
    const right = parseInt(position.value.right)
    // 计算实际的左侧位置
    const leftPos = window.innerWidth - right - rect.width
    // 如果左侧位置小于0或者右侧超出屏幕
    if (leftPos < 0 || leftPos > maxX) {
      position.value = {
        left: `${Math.min(maxX, Math.max(0, leftPos))}px`,
        top: position.value.top !== 'auto' ? position.value.top : `${maxY}px`,
        right: 'auto',
        bottom: 'auto',
      }
      savePosition()
      return
    }
  }

  // 如果使用的是 left/top 定位
  if (position.value.left !== 'auto') {
    const currentLeft = parseInt(position.value.left)
    if (currentLeft > maxX) {
      position.value.left = `${maxX}px`
      savePosition()
    }
    // 确保不会从左侧溢出
    if (currentLeft < 0) {
      position.value.left = '0px'
      savePosition()
    }
  }

  if (position.value.top !== 'auto') {
    const currentTop = parseInt(position.value.top)
    if (currentTop > maxY) {
      position.value.top = `${maxY}px`
      savePosition()
    }
    // 确保不会从顶部溢出
    if (currentTop < 0) {
      position.value.top = '0px'
      savePosition()
    }
  }
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedUpdatePosition = debounce(updatePosition, 100)

const startDrag = (event) => {
  event.preventDefault()
  isDragging.value = true

  const e = event.type === 'mousedown' ? event : event.touches[0]
  startX = e.clientX
  startY = e.clientY

  const rect = buildInfoRef.value.getBoundingClientRect()
  startLeft = rect.left
  startTop = rect.top

  position.value = {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    right: 'auto',
    bottom: 'auto',
  }

  document.addEventListener(event.type === 'mousedown' ? 'mousemove' : 'touchmove', onDrag, { passive: false })
  document.addEventListener(event.type === 'mousedown' ? 'mouseup' : 'touchend', stopDrag)
}

const onDrag = (event) => {
  event.preventDefault()
  if (!isDragging.value) return

  const e = event.type === 'mousemove' ? event : event.touches[0]
  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY

  const newLeft = startLeft + deltaX
  const newTop = startTop + deltaY

  const rect = buildInfoRef.value.getBoundingClientRect()
  const maxX = window.innerWidth - rect.width
  const maxY = window.innerHeight - rect.height

  position.value = {
    left: `${Math.min(Math.max(0, newLeft), maxX)}px`,
    top: `${Math.min(Math.max(0, newTop), maxY)}px`,
    right: 'auto',
    bottom: 'auto',
  }
}

const stopDrag = () => {
  isDragging.value = false
  savePosition()
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

onMounted(() => {
  fetch('/build-info.txt')
    .then((response) => response.text())
    .then((text) => {
      const lines = text.split('\n')
      buildTime.value = lines[0].replace('Build Time: ', '')
      buildHash.value = lines[1].replace('Build Hash: ', '')
    })
    .catch((error) => {
      console.error('Error loading build info:', error)
      buildTime.value = 'Failed to load'
      buildHash.value = 'Failed to load'
    })

  updatePosition()
  window.addEventListener('resize', debouncedUpdatePosition)
})

watch(() => [window.innerWidth, window.innerHeight], debouncedUpdatePosition)
</script>

<style scoped>
.build-info {
  position: fixed;
  z-index: 1000;
  cursor: move;
  width: fit-content;
  height: auto;
  min-width: 200px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  user-select: none;
  touch-action: none;
  transition: all 0.3s ease-in-out;
  max-width: calc(100vw - 20px);
  box-sizing: border-box;
}

.build-info:hover {
  transform: translateY(-2px);
}

.build-info:active {
  transform: translateY(1px);
}

.build-info-content {
  font-size: 14px;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-line {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 蓝色主题 */
.theme-blue {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  box-shadow:
    0 4px 15px rgba(52, 152, 219, 0.3),
    0 8px 25px rgba(44, 62, 80, 0.2);
}
.theme-blue:hover {
  background: linear-gradient(135deg, #34495e 0%, #5dade2 100%);
}

/* 紫色主题 */
.theme-purple {
  background: linear-gradient(135deg, #614385 0%, #516395 100%);
  box-shadow:
    0 4px 15px rgba(97, 67, 133, 0.3),
    0 8px 25px rgba(81, 99, 149, 0.2);
}
.theme-purple:hover {
  background: linear-gradient(135deg, #734b9d 0%, #6276ac 100%);
}

/* 绿色主题 */
.theme-green {
  background: linear-gradient(135deg, #136a8a 0%, #267871 100%);
  box-shadow:
    0 4px 15px rgba(19, 106, 138, 0.3),
    0 8px 25px rgba(38, 120, 113, 0.2);
}
.theme-green:hover {
  background: linear-gradient(135deg, #1a8ba8 0%, #2e8f88 100%);
}

@media screen and (max-width: 768px) {
  .build-info {
    min-width: 150px;
    padding: 8px;
    width: auto;
  }

  .build-info-content {
    font-size: 12px;
  }

  .info-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
