<template>
  <div class="inline-flex items-center align-middle leading-none">
    <i
      v-if="!error"
      class="inline-block"
      v-html="processedSvg"
      :style="iconStyle"
      :class="{ '[&_path]:!fill-current': props.color !== 'currentColor' }"
    ></i>
    <!-- 错误状态 -->
    <span v-else class="inline-block text-red-500 dark:text-red-400" :style="iconStyle">
      <svg viewBox="0 0 1024 1024">
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
        />
        <path
          d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const svgCache = new Map()

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  spin: {
    type: Boolean,
    default: false,
  },
})

const svgContent = ref('')
const error = ref(false)

const processedSvg = computed(() => {
  if (!svgContent.value) return '<svg style="opacity: 0"></svg>'

  let processed = svgContent.value

  processed = processed.replace(/<svg([^>]*)>/, (match, attributes) => {
    const cleanedAttributes = attributes.replace(/\s*width="[^"]*"/g, '').replace(/\s*height="[^"]*"/g, '')

    if (!cleanedAttributes.includes('viewBox')) {
      return `<svg${cleanedAttributes} viewBox="0 0 1024 1024">`
    }

    return `<svg${cleanedAttributes}>`
  })

  if (props.color !== 'currentColor') {
    processed = processed.replace(/fill="[^"]*"/g, 'fill="currentColor"')
  }

  return processed
})

const iconStyle = computed(() => {
  const style = {
    width: `${props.size}px`,
    height: `${props.size}px`,
    animation: props.spin ? 'spin 1s linear infinite' : 'none',
    display: 'inline-block',
  }

  if (props.color !== 'currentColor') {
    style.color = props.color
  }

  return style
})

const loadSvg = async name => {
  if (!name) return

  error.value = false

  if (svgCache.has(name)) {
    svgContent.value = svgCache.get(name)
    return
  }

  try {
    const { default: svg } = await import(`@/components/svg_icon/icons/${name}.svg?raw`)
    svgCache.set(name, svg)
    svgContent.value = svg
  } catch (e) {
    console.error(`Failed to load SVG icon: ${name}`, e)
    error.value = true
  }
}

watch(
  () => props.name,
  newName => {
    loadSvg(newName)
  },
)

onMounted(() => {
  loadSvg(props.name)
})
</script>
