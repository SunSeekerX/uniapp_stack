<script setup>
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },

  color: String,
  size: [String, Number],
  width: [String, Number],
  height: [String, Number],
  image: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'widthFix',
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const svgStyle = computed(() => {
  const style = {}
  if (props.size) {
    style.fontSize = props.size
  }
  if (props.color) {
    style.color = props.color
  }
  if (props.width) {
    style.width = props.width
  }
  if (props.height) {
    style.height = props.height
  }
  return style
})
</script>

<template>
  <template v-if="props.image">
    <image :src="`/static/images/${props.name}.svg`" :style="svgStyle" :mode="props.mode" alt="icon image" />
  </template>

  <template v-else>
    <svg class="svg-icon" aria-hidden="true" :style="svgStyle">
      <use :xlink:href="symbolId" />
    </svg>
  </template>
</template>

<style scoped>
.svg-icon {
  overflow: hidden;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentcolor;
}
</style>
