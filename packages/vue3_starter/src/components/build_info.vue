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
      <p>Build Time: {{ buildTime }}</p>
      <p>Build Hash: {{ buildHash }}</p>
    </div>
  </div>
</template>

<script setup>
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
    default: 'green',
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
  const savedPosition = localStorage.getItem('buildInfoPosition')
  if (savedPosition) {
    return JSON.parse(savedPosition)
  }
  return { left: 'auto', top: 'auto', right: '10px', bottom: '10px' }
}

function savePosition() {
  localStorage.setItem('buildInfoPosition', JSON.stringify(position.value))
}

const updatePosition = () => {
  if (!buildInfoRef.value) return

  const rect = buildInfoRef.value.getBoundingClientRect()
  const maxX = window.innerWidth - rect.width
  const maxY = window.innerHeight - rect.height

  if (position.value.left !== 'auto') {
    const currentLeft = parseInt(position.value.left)
    if (currentLeft > maxX) {
      position.value.left = `${maxX}px`
      savePosition()
    }
  }

  if (position.value.top !== 'auto') {
    const currentTop = parseInt(position.value.top)
    if (currentTop > maxY) {
      position.value.top = `${maxY}px`
      savePosition()
    }
  }
}

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

  window.addEventListener('resize', updatePosition)
})

watch(() => [window.innerWidth, window.innerHeight], updatePosition)
</script>

<style scoped>
.build-info {
  position: fixed;
  z-index: 1000;
  cursor: move;
  width: auto;
  height: auto;
  min-width: 200px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  user-select: none;
  touch-action: none;
  /* transition:
    all 0.3s ease-in-out,
    transform 0.2s ease; */
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
  }

  .build-info-content {
    font-size: 12px;
  }
}
</style>
